import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  DollarSign,
  Zap,
  ShieldCheck,
  Star,
  Crown,
  Gift,
  Sparkles,
  X,
  ShieldAlert,
  Users,
  ChevronRight,
  PlusCircle,
  Tag,
  Download,
} from 'lucide-react';
import { VipTierItem, CustomerItem } from '../types';
import { statusBadge } from '../uiTheme';

interface VipRightsViewProps {
  vipTiers: VipTierItem[];
  setVipTiers: React.Dispatch<React.SetStateAction<VipTierItem[]>>;
  customers: CustomerItem[];
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VipRightsView: React.FC<VipRightsViewProps> = ({
  vipTiers,
  setVipTiers,
  customers,
  showToast,
}) => {
  // Search & Filter
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Drawers & Modals
  const [detailTier, setDetailTier] = useState<VipTierItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<VipTierItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<VipTierItem>>({
    code: '',
    tierName: '',
    level: 1,
    minSpent: 0,
    discountRate: 95,
    pointsRate: 1.5,
    rightsList: [],
    memberCount: 0,
    status: 'active',
    badgeColor: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    description: '',
  });
  const [rightInput, setRightInput] = useState('');

  // Banner Metrics
  const stats = useMemo(() => {
    const totalTiers = vipTiers.length;
    const activeTiers = vipTiers.filter((t) => t.status === 'active').length;
    const totalVipMembers = vipTiers.reduce((sum, t) => sum + t.memberCount, 0);

    // Minimum discount rate (highest benefit)
    let minDiscount = 100;
    vipTiers.forEach((t) => {
      if (t.discountRate < minDiscount) {
        minDiscount = t.discountRate;
      }
    });

    const totalUniqueRightsCount = new Set(vipTiers.flatMap((t) => t.rightsList)).size;

    return {
      totalTiers,
      activeTiers,
      totalVipMembers,
      bestDiscountText: minDiscount < 100 ? `${minDiscount / 10}折` : '无折扣',
      totalUniqueRightsCount,
    };
  }, [vipTiers]);

  // Filtered List sorted by level
  const filteredTiers = useMemo(() => {
    return vipTiers
      .filter((t) => {
        if (keyword.trim()) {
          const kw = keyword.toLowerCase().trim();
          const matchesKw =
            t.tierName.toLowerCase().includes(kw) ||
            t.code.toLowerCase().includes(kw) ||
            t.rightsList.some((r) => r.toLowerCase().includes(kw)) ||
            (t.description && t.description.toLowerCase().includes(kw));
          if (!matchesKw) return false;
        }

        if (selectedStatus !== 'all' && t.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => a.level - b.level);
  }, [vipTiers, keyword, selectedStatus]);

  // Refresh VIP Tier System engine
  const handleRefreshMatrix = () => {
    showToast('已同步底层交易引擎，重新校验全量会员的累计消费与VIP等级资格！', 'success');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingTier(null);
    const nextLevel = vipTiers.length + 1;
    setFormData({
      code: `TIER-V${nextLevel}`,
      tierName: `V${nextLevel} 尊享会员`,
      level: nextLevel,
      minSpent: nextLevel * 5000,
      discountRate: Math.max(80, 100 - nextLevel * 3),
      pointsRate: 1 + nextLevel * 0.2,
      rightsList: ['专属会员标识', '生日礼包', '优先客服'],
      memberCount: 50,
      status: 'active',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      description: '自定义构建的阶梯式VIP会员等级特权规则。',
    });
    setRightInput('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (tier: VipTierItem) => {
    setEditingTier(tier);
    setFormData({ ...tier });
    setRightInput('');
    setIsModalOpen(true);
  };

  // Add Right Tag
  const handleAddRight = () => {
    if (!rightInput.trim()) return;
    const currentRights = formData.rightsList || [];
    if (!currentRights.includes(rightInput.trim())) {
      setFormData({ ...formData, rightsList: [...currentRights, rightInput.trim()] });
    }
    setRightInput('');
  };

  // Remove Right Tag
  const handleRemoveRight = (rToRemove: string) => {
    setFormData({
      ...formData,
      rightsList: (formData.rightsList || []).filter((r) => r !== rToRemove),
    });
  };

  // Save Tier
  const handleSaveTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tierName?.trim()) {
      showToast('请填写 VIP 等级名称！', 'error');
      return;
    }

    if (editingTier) {
      setVipTiers((prev) =>
        prev.map((t) => (t.id === editingTier.id ? { ...t, ...formData } as VipTierItem : t))
      );
      showToast(`VIP 等级 "${formData.tierName}" 配置已更新`, 'success');
    } else {
      const newTier: VipTierItem = {
        id: `tier-${Date.now()}`,
        code: formData.code || `TIER-V${Date.now()}`,
        tierName: formData.tierName || '新VIP等级',
        level: formData.level || 1,
        minSpent: formData.minSpent || 0,
        discountRate: formData.discountRate || 100,
        pointsRate: formData.pointsRate || 1.0,
        rightsList: formData.rightsList?.length ? formData.rightsList : ['基础购物权益'],
        memberCount: formData.memberCount || 0,
        status: (formData.status as 'active' | 'disabled') || 'active',
        badgeColor:
          formData.badgeColor ||
          'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300',
        description: formData.description || '自定义VIP等级',
      };
      setVipTiers((prev) => [...prev, newTier]);
      showToast(`新 VIP 会员等级 "${newTier.tierName}" 已成功创建`, 'success');
    }

    setIsModalOpen(false);
  };

  // Delete Tier
  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    const target = vipTiers.find((t) => t.id === deleteConfirmId);
    setVipTiers((prev) => prev.filter((t) => t.id !== deleteConfirmId));
    showToast(`VIP 等级 "${target?.tierName || ''}" 已注销删除`, 'info');
    setDeleteConfirmId(null);
  };

  // Toggle Tier Status
  const handleToggleStatus = (tier: VipTierItem) => {
    const nextStatus: VipTierItem['status'] =
      tier.status === 'active' ? 'disabled' : 'active';
    setVipTiers((prev) =>
      prev.map((t) => (t.id === tier.id ? { ...t, status: nextStatus } : t))
    );
    showToast(
      `VIP 等级 "${tier.tierName}" 运行状态已切换为：${nextStatus === 'active' ? '启用生效' : '暂停服务'}`,
      nextStatus === 'active' ? 'success' : 'info'
    );
  };

  // Matched customers for drawer
  const matchedCustomersForTier = useMemo(() => {
    if (!detailTier) return [];
    return customers.filter((c) => c.tier.includes(detailTier.tierName));
  }, [detailTier, customers]);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100 backdrop-blur-md border border-white/20">
              <Crown className="h-3.5 w-3.5 text-indigo-200" />
              <span>VIP 阶梯权益与尊享特权矩阵</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              会员等级阶梯、价格折扣与专属特权体系
            </h2>
            <p className="text-sm text-indigo-100/80">
              灵活配置等级消费门槛、折上折优惠率、积分加倍倍率与专属履约管家权益矩阵
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefreshMatrix}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            >
              <RefreshCw className="h-4 w-4 text-indigo-100" />
              <span>校验升级资格</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-800 shadow-lg transition hover:bg-indigo-50 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>新增会员等级</span>
            </button>
          </div>
        </div>

        {/* Banner Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs text-indigo-100/70">会员等级阶梯数</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{stats.totalTiers}</span>
              <span className="text-xs text-indigo-100/60">阶级 (V1~V5)</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs text-indigo-100/70">顶奢尊享折扣</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{stats.bestDiscountText}</span>
              <span className="text-xs text-emerald-400">天花板</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs text-indigo-100/70">已被覆盖 VIP 会员</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {stats.totalVipMembers.toLocaleString()}
              </span>
              <span className="text-xs text-indigo-100/70">位</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs text-indigo-100/70">已上线特权总类</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-300">
                {stats.totalUniqueRightsCount}
              </span>
              <span className="text-xs text-indigo-100/60">项独家权益</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: '全部等级', count: stats.totalTiers },
              { id: 'active', label: '启用中', count: stats.activeTiers },
              { id: 'disabled', label: '已暂停', count: vipTiers.filter((t) => t.status === 'disabled').length },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-all ${
                  selectedStatus === st.id
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`rounded-full px-1.5 text-xs font-bold ${
                    selectedStatus === st.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {st.count}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => showToast('已导出当前 VIP 权益体系配置 CSV', 'success')}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Download className="h-3.5 w-3.5" />
            <span>导出配置</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索等级名称、编码、包含的专属特权或说明..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50/80 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:bg-gray-800"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex w-full flex-wrap items-center justify-start gap-3 sm:w-auto sm:justify-end">
            {(keyword || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setKeyword('');
                  setSelectedStatus('all');
                }}
                className="inline-flex w-[150px] items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>重置条件</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tier Cards Layout */}
      <div className="space-y-4">
        {filteredTiers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-800">
            <p className="text-base font-medium text-gray-500 dark:text-gray-400">
              未搜寻到符合条件的 VIP 等级
            </p>
          </div>
        ) : (
          filteredTiers.map((tier) => (
            <div
              key={tier.id}
              className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Left: Tier Name & Threshold */}
                <div className="flex items-start gap-4 space-y-1 sm:space-y-0">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border font-black text-xl shadow-xs ${tier.badgeColor}`}
                  >
                    V{tier.level}
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {tier.tierName}
                      </h3>
                      <span className="font-mono text-xs text-gray-400">{tier.code}</span>
                      <button
                        onClick={() => handleToggleStatus(tier)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                          tier.status === 'active'
                            ? statusBadge.success
                            : statusBadge.neutral
                        }`}
                      >
                        {tier.status === 'active' ? '启用中' : '已禁用'}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                      {tier.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">门槛消费:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          ￥{tier.minSpent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">商品折扣:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {tier.discountRate < 100 ? `${tier.discountRate / 10}折` : '无折扣'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">积分倍率:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {tier.pointsRate}x
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">覆盖会员:</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          {tier.memberCount} 人
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Privileges Tags & Actions */}
                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="flex flex-wrap gap-1.5 max-w-md lg:justify-end">
                    {tier.rightsList.map((right, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-1 text-xs font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                      >
                        {right}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 lg:pt-0">
                    <button
                      onClick={() => setDetailTier(tier)}
                      className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>查看明细</span>
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(tier)}
                      className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>配置特权</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(tier.id)}
                      className="rounded-xl border border-gray-200 p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:border-gray-800 dark:hover:bg-rose-950/50 dark:hover:text-rose-300"
                      title="注销等级"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tier Detail Drawer */}
      {detailTier && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl h-full overflow-y-auto p-6 space-y-6 flex flex-col border-l border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl font-black text-lg border ${detailTier.badgeColor}`}
                >
                  V{detailTier.level}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {detailTier.tierName} 特权详情
                  </h3>
                  <span className="text-xs font-mono text-gray-400">{detailTier.code}</span>
                </div>
              </div>
              <button
                onClick={() => setDetailTier(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/30">
                <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">晋升门槛</span>
                <p className="mt-1 text-xl font-bold text-amber-950 dark:text-amber-100">
                  ￥{detailTier.minSpent.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                <span className="text-xs text-indigo-700 dark:text-indigo-400 font-medium">折上折特权</span>
                <p className="mt-1 text-xl font-bold text-indigo-950 dark:text-indigo-100">
                  {detailTier.discountRate < 100 ? `${detailTier.discountRate / 10}折` : '标准原价'}
                </p>
              </div>
            </div>

            {/* Privileges Checklist */}
            <div className="space-y-3">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <Crown className="h-4 w-4 text-amber-500" />
                <span>该等级专享特权清单 ({detailTier.rightsList.length}项)</span>
              </span>

              <div className="space-y-2">
                {detailTier.rightsList.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-gray-50/50 p-3 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="font-medium">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligible Customers Sample */}
            <div className="space-y-2">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                <span>该等级会员代表 (示例)</span>
                <span className="text-gray-400 font-normal">共 {detailTier.memberCount} 人</span>
              </span>

              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-gray-50/50 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-800/40">
                {matchedCustomersForTier.length === 0 ? (
                  <p className="p-4 text-center text-xs text-gray-400">
                    暂无精确匹配的会员档案记录
                  </p>
                ) : (
                  matchedCustomersForTier.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 text-sm">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="h-8 w-8 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {c.name}
                          </p>
                          <p className="text-xs text-gray-400">{c.company || c.phone}</p>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                        ￥{c.totalSpent?.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <button
                onClick={() => {
                  handleOpenEditModal(detailTier);
                  setDetailTier(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>配置特权规则</span>
              </button>
              <button
                onClick={() => setDetailTier(null)}
                className="rounded-xl bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <span>{editingTier ? '配置 VIP 会员等级与权益' : '新增 VIP 会员等级'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTier} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    等级编码 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    等级名称 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例如: V6 皇冠VIP"
                    value={formData.tierName || ''}
                    onChange={(e) => setFormData({ ...formData, tierName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    阶梯层级 (1~9)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.level || 1}
                    onChange={(e) =>
                      setFormData({ ...formData, level: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    升级门槛 (￥)
                  </label>
                  <input
                    type="number"
                    value={formData.minSpent || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, minSpent: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    折扣率 (e.g. 90=9折)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={formData.discountRate || 100}
                    onChange={(e) =>
                      setFormData({ ...formData, discountRate: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    积分加倍倍率
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.pointsRate || 1.0}
                    onChange={(e) =>
                      setFormData({ ...formData, pointsRate: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    等级状态
                  </label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'disabled',
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="active">启用生效</option>
                    <option value="disabled">暂停使用</option>
                  </select>
                </div>
              </div>

              {/* Rights Tag Input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  包含的独家权益列表
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="例如: 顺丰特快全程包邮 (回车添加)"
                    value={rightInput}
                    onChange={(e) => setRightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRight();
                      }
                    }}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-2 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddRight}
                    className="rounded-xl bg-amber-100 px-3 py-2 font-semibold text-amber-800 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300"
                  >
                    添加权益
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(formData.rightsList || []).map((r, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                    >
                      <span>{r}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRight(r)}
                        className="hover:text-rose-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  等级权责说明
                </label>
                <textarea
                  rows={2}
                  placeholder="简述该等级的晋升机制与权益权益覆盖范围..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-stone-950 shadow-md hover:bg-amber-400"
                >
                  保存 VIP 等级
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                确定要删除此 VIP 会员等级吗？
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                注销后该阶梯对应的专享折上折与特权将不再向前端展示与结算。
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-500"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

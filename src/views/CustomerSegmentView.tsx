import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Zap,
  Tag as TagIcon,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowUpRight,
  Layers,
  Sparkles,
  Send,
  Sliders,
  Download,
} from 'lucide-react';
import { CustomerSegmentItem, CustomerItem } from '../types';
import { actionButton } from '../uiTheme';

interface CustomerSegmentViewProps {
  segments: CustomerSegmentItem[];
  setSegments: React.Dispatch<React.SetStateAction<CustomerSegmentItem[]>>;
  customers: CustomerItem[];
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CustomerSegmentView: React.FC<CustomerSegmentViewProps> = ({
  segments,
  setSegments,
  customers,
  showToast,
}) => {
  // Search & Filter
  const [keyword, setKeyword] = useState('');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Drawer & Modal States
  const [detailSegment, setDetailSegment] = useState<CustomerSegmentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<CustomerSegmentItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Data
  const [formData, setFormData] = useState<Partial<CustomerSegmentItem>>({
    code: '',
    name: '',
    description: '',
    criteria: '',
    memberCount: 100,
    avgSpent: 10000,
    repurchaseRate: 50,
    growthTrend: 'up',
    status: 'active',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  // Banner Metrics
  const stats = useMemo(() => {
    const totalCount = segments.length;
    const activeCount = segments.filter((s) => s.status === 'active').length;
    const totalMembersCovered = segments.reduce((sum, s) => sum + s.memberCount, 0);

    // Find segment with highest repurchase rate
    let topRepurchaseSeg = segments[0];
    segments.forEach((s) => {
      if (!topRepurchaseSeg || s.repurchaseRate > topRepurchaseSeg.repurchaseRate) {
        topRepurchaseSeg = s;
      }
    });

    return {
      totalCount,
      activeCount,
      totalMembersCovered,
      topRepurchaseSegName: topRepurchaseSeg ? topRepurchaseSeg.name : '暂无',
      topRepurchaseRate: topRepurchaseSeg ? topRepurchaseSeg.repurchaseRate : 0,
    };
  }, [segments]);

  // Filtered List
  const filteredSegments = useMemo(() => {
    return segments.filter((s) => {
      if (keyword.trim()) {
        const kw = keyword.toLowerCase().trim();
        const matchesKw =
          s.name.toLowerCase().includes(kw) ||
          s.code.toLowerCase().includes(kw) ||
          s.description.toLowerCase().includes(kw) ||
          s.criteria.toLowerCase().includes(kw) ||
          s.tags.some((t) => t.toLowerCase().includes(kw));
        if (!matchesKw) return false;
      }

      if (selectedTrend !== 'all' && s.growthTrend !== selectedTrend) {
        return false;
      }

      if (selectedStatus !== 'all' && s.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [segments, keyword, selectedTrend, selectedStatus]);

  // Handle Recalculate / Refresh Segment Engine
  const handleRecalculateSegments = () => {
    setSegments((prev) =>
      prev.map((s) => ({
        ...s,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        // Slight fluctuation simulation
        memberCount: Math.max(10, s.memberCount + Math.floor(Math.random() * 9 - 4)),
      }))
    );
    showToast('分群算法引擎完成全量重算，各特征客群画像指标已更新！', 'success');
  };

  // Open Create Modal
  const handleOpenAddModal = () => {
    setEditingSegment(null);
    setFormData({
      code: `SEG-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      description: '',
      criteria: '',
      memberCount: 150,
      avgSpent: 12800,
      repurchaseRate: 45.5,
      growthTrend: 'up',
      status: 'active',
      tags: ['精细化运营', '自动化规则'],
    });
    setTagInput('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (seg: CustomerSegmentItem) => {
    setEditingSegment(seg);
    setFormData({ ...seg });
    setTagInput('');
    setIsModalOpen(true);
  };

  // Add Tag to Form
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = formData.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...currentTags, tagInput.trim()] });
    }
    setTagInput('');
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((t) => t !== tagToRemove),
    });
  };

  // Save Segment
  const handleSaveSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.criteria?.trim()) {
      showToast('请填写分群名称与精准筛选条件规则！', 'error');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (editingSegment) {
      setSegments((prev) =>
        prev.map((s) =>
          s.id === editingSegment.id
            ? {
                ...s,
                ...formData,
                name: formData.name || s.name,
                criteria: formData.criteria || s.criteria,
                updatedAt: nowStr,
              }
            : s
        )
      );
      showToast(`分群规则 "${formData.name}" 已成功更新`, 'success');
    } else {
      const newSeg: CustomerSegmentItem = {
        id: `seg-${Date.now()}`,
        code: formData.code || `SEG-${Date.now()}`,
        name: formData.name || '新构建画像客群',
        description: formData.description || '自定义构建多维度交叉画像客群',
        criteria: formData.criteria || '消费与行为属性组合',
        memberCount: formData.memberCount || 100,
        avgSpent: formData.avgSpent || 8800,
        repurchaseRate: formData.repurchaseRate || 35,
        growthTrend: (formData.growthTrend as 'up' | 'down' | 'stable') || 'up',
        status: (formData.status as 'active' | 'paused') || 'active',
        tags: formData.tags?.length ? formData.tags : ['新构建'],
        updatedAt: nowStr,
      };
      setSegments((prev) => [newSeg, ...prev]);
      showToast(`分群画像 "${newSeg.name}" 已创建生效`, 'success');
    }

    setIsModalOpen(false);
  };

  // Delete Segment
  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    const target = segments.find((s) => s.id === deleteConfirmId);
    setSegments((prev) => prev.filter((s) => s.id !== deleteConfirmId));
    showToast(`分群规则 "${target?.name || ''}" 已成功注销`, 'info');
    setDeleteConfirmId(null);
  };

  // Toggle Segment Status
  const handleToggleStatus = (seg: CustomerSegmentItem) => {
    const nextStatus: CustomerSegmentItem['status'] =
      seg.status === 'active' ? 'paused' : 'active';
    setSegments((prev) =>
      prev.map((s) => (s.id === seg.id ? { ...s, status: nextStatus } : s))
    );
    showToast(
      `分群规则 "${seg.name}" 运行状态已更新为：${nextStatus === 'active' ? '生效运行中' : '暂停服务'}`,
      nextStatus === 'active' ? 'success' : 'info'
    );
  };

  // Filter matched customers preview for detail drawer
  const matchedCustomersPreview = useMemo(() => {
    if (!detailSegment) return [];
    // Match customers by segment name or return top subset
    const directMatches = customers.filter((c) => c.segment === detailSegment.name);
    return directMatches.length ? directMatches : customers.slice(0, 4);
  }, [detailSegment, customers]);

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-gray-100">
                分群画像
              </h2>
            </div>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-gray-500 dark:text-gray-400">
              通过 RFM 规则、高低频消费逻辑与流失风险特征，实现客群标签化分层与差异化自动化触达。
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleRecalculateSegments}
              className={actionButton.secondary}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>重算分群画像</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className={actionButton.primary}
            >
              <Plus className="h-4 w-4" />
              <span>创建画像分群</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: '运行分群规则总数',
              value: stats.totalCount,
              unit: '个逻辑组',
              helper: '全域客群规则',
              icon: Layers,
              iconClassName: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-indigo-600 dark:text-indigo-400',
            },
            {
              label: '覆盖画像客户总量',
              value: stats.totalMembersCovered.toLocaleString(),
              unit: '人次',
              helper: '标签覆盖规模',
              icon: Users,
              iconClassName: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-sky-600 dark:text-sky-400',
            },
            {
              label: '最高复购率分群',
              value: stats.topRepurchaseSegName,
              unit: `${stats.topRepurchaseRate}%`,
              helper: '复购表现最佳',
              icon: TrendingUp,
              iconClassName: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
              valueClassName: 'text-amber-700 dark:text-amber-300',
              helperClassName: 'text-amber-600 dark:text-amber-400',
            },
            {
              label: '生效中规则',
              value: stats.activeCount,
              unit: `/${stats.totalCount}`,
              helper: '自动触达运行中',
              icon: CheckCircle2,
              iconClassName: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
              valueClassName: 'text-emerald-600 dark:text-emerald-400',
              helperClassName: 'text-emerald-600 dark:text-emerald-400',
            },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="flex min-h-[88px] items-center justify-between rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <h3 className={`mt-1 truncate text-2xl font-extrabold tracking-tight ${metric.valueClassName}`}>
                    {metric.value}
                    {'unit' in metric && metric.unit && (
                      <span className="ml-1 text-xs font-semibold text-gray-400">{metric.unit}</span>
                    )}
                  </h3>
                  <p className={`mt-0.5 truncate text-xs font-medium ${metric.helperClassName}`}>{metric.helper}</p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${metric.iconClassName}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: '全部分群', count: stats.totalCount },
              { id: 'active', label: '生效中', count: stats.activeCount },
              { id: 'paused', label: '已暂停', count: segments.filter((s) => s.status === 'paused').length },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-all ${
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
            onClick={() => showToast('已导出当前筛选条件下的分群画像清单 CSV', 'success')}
            className={actionButton.secondary}
          >
            <Download className="h-3.5 w-3.5" />
            <span>导出清单</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索分群编码、名称、判断条件逻辑或标签..."
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
            <select
              value={selectedTrend}
              onChange={(e) => setSelectedTrend(e.target.value)}
              className="w-[150px] rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">全部趋势</option>
              <option value="up">上升 ↗</option>
              <option value="stable">平稳 →</option>
              <option value="down">下降 ↘</option>
            </select>

            {(keyword || selectedTrend !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setKeyword('');
                  setSelectedTrend('all');
                  setSelectedStatus('all');
                }}
                className={`${actionButton.secondary} w-[150px]`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>重置条件</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Cards for Segments */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredSegments.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-800">
            <PieChart className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-base font-medium text-gray-500 dark:text-gray-400">
              未搜寻到匹配的分群画像规则
            </p>
          </div>
        ) : (
          filteredSegments.map((seg) => (
            <div
              key={seg.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-100 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {seg.code}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{seg.name}</h3>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                      {seg.description}
                    </p>
                  </div>

                  {/* Growth Trend Badge */}
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                      seg.growthTrend === 'up'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : seg.growthTrend === 'down'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {seg.growthTrend === 'up' ? '上升' : seg.growthTrend === 'down' ? '下降' : '平稳'}
                  </span>
                </div>

                {/* Criteria Box */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    逻辑判断规则
                  </span>
                  <p className="mt-0.5 text-xs font-mono font-medium text-gray-800 dark:text-gray-200">
                    {seg.criteria}
                  </p>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 text-center rounded-xl border border-gray-100 bg-gray-50/50 p-2.5 dark:border-gray-800 dark:bg-gray-800/30">
                  <div>
                    <span className="text-xs text-gray-400">覆盖人数</span>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {seg.memberCount} 人
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">人均消费</span>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      ￥{seg.avgSpent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">复购率</span>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {seg.repurchaseRate}%
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {seg.tags.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
                <button
                  onClick={() => handleToggleStatus(seg)}
                  className={seg.status === 'active' ? actionButton.successSoft : actionButton.warningSoft}
                >
                  {seg.status === 'active' ? '生效中' : '已暂停'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDetailSegment(seg)}
                    className={actionButton.icon}
                    title="看画像详情"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(seg)}
                    className={actionButton.iconInfo}
                    title="编辑规则"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(seg.id)}
                    className={actionButton.iconDanger}
                    title="删除分群"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Segment Detail Drawer */}
      {detailSegment && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl h-full overflow-y-auto p-6 space-y-6 flex flex-col border-l border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {detailSegment.code}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {detailSegment.name}
                </h3>
              </div>
              <button
                onClick={() => setDetailSegment(null)}
                className={actionButton.icon}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Core Info */}
            <div className="space-y-4 text-sm">
              <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                  判断筛选条件
                </span>
                <p className="font-mono text-sm text-indigo-950 dark:text-indigo-100 leading-relaxed">
                  {detailSegment.criteria}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                  <span className="text-xs text-gray-400">目前精准覆盖人群</span>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {detailSegment.memberCount} 人
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                  <span className="text-xs text-gray-400">复购率分析</span>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {detailSegment.repurchaseRate}%
                  </p>
                </div>
              </div>

              {/* Sample Customer List */}
              <div className="space-y-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                  <span>命中的代表性客户 (示例)</span>
                  <span className="text-gray-400 font-normal">动态计算命中</span>
                </span>

                <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-gray-50/50 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-800/40">
                  {matchedCustomersPreview.map((cust) => (
                    <div key={cust.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="h-8 w-8 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {cust.name}
                          </p>
                          <p className="text-xs text-gray-400">{cust.company || cust.phone}</p>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                        ￥{cust.totalSpent?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Trigger Action */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/40 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span>智能精准营销触达建议</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  该客群目前平均消费 ￥{detailSegment.avgSpent}，建议推派 {detailSegment.tags[0] || '专属'} 满减优惠券以提升复购转化率。
                </p>
                <button
                  onClick={() => {
                    showToast(`已向分群 "${detailSegment.name}" (共${detailSegment.memberCount}人) 一键下发专属定向优惠券及关怀短信！`, 'success');
                  }}
                  className={`${actionButton.primary} w-full`}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>一键下发精准营销礼包 ({detailSegment.memberCount}人)</span>
                </button>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setDetailSegment(null)}
                className={actionButton.secondary}
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
                <Sliders className="h-5 w-5 text-indigo-500" />
                <span>{editingSegment ? '编辑画像分群规则' : '创建画像分群规则'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className={actionButton.icon}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSegment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    分群编码 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    分群名称 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例如: 华东大额高频客群"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  描述说明
                </label>
                <input
                  type="text"
                  placeholder="简述该分群的商业价值与特征..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  逻辑过滤判定条件 *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="例如: 近90天消费 ≥ ￥20,000 且 订单笔数 ≥ 3 且 无退款记录"
                  value={formData.criteria || ''}
                  onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    初始估算人数
                  </label>
                  <input
                    type="number"
                    value={formData.memberCount || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, memberCount: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    人均消费 (￥)
                  </label>
                  <input
                    type="number"
                    value={formData.avgSpent || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, avgSpent: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    预期复购率 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.repurchaseRate || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, repurchaseRate: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  分群画像标签
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="输入标签名按回车添加"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-2 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className={actionButton.infoSoft}
                  >
                    添加
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(formData.tags || []).map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={actionButton.secondary}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className={actionButton.primary}
                >
                  保存分群
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                确定注销该分群画像规则？
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                该分群规则将被注销删除，不会影响已有的底层客户交易数据。
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className={`${actionButton.secondary} w-full`}
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className={`${actionButton.danger} w-full`}
              >
                确定注销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

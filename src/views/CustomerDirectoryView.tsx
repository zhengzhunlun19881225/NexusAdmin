import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Building2,
  Phone,
  Mail,
  Award,
  DollarSign,
  ShoppingBag,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Calendar,
  Tag,
  UserX,
  UserCheck2,
  Download,
} from 'lucide-react';
import { CustomerItem } from '../types';
import { statusBadge } from '../uiTheme';

interface CustomerDirectoryViewProps {
  customers: CustomerItem[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerItem[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CustomerDirectoryView: React.FC<CustomerDirectoryViewProps> = ({
  customers,
  setCustomers,
  showToast,
}) => {
  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals & Drawers
  const [detailCustomer, setDetailCustomer] = useState<CustomerItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CustomerItem>>({
    customerNo: '',
    name: '',
    avatar: '',
    phone: '',
    email: '',
    company: '',
    tier: 'V1 普通会员',
    segment: '潜力新客',
    status: 'active',
    notes: '',
  });

  // Calculate Banner Metrics
  const stats = useMemo(() => {
    const totalCount = customers.length;
    const activeCount = customers.filter((c) => c.status === 'active').length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const highValueCount = customers.filter(
      (c) => c.segment === '高价值客户' || c.tier.includes('V4') || c.tier.includes('V5')
    ).length;

    return {
      totalCount,
      activeCount,
      totalRevenue,
      highValueCount,
      highValueRatio: totalCount ? Math.round((highValueCount / totalCount) * 100) : 0,
    };
  }, [customers]);

  // Filtered list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Keyword
      if (keyword.trim()) {
        const kw = keyword.toLowerCase().trim();
        const matchesKw =
          c.name.toLowerCase().includes(kw) ||
          c.customerNo.toLowerCase().includes(kw) ||
          c.phone.includes(kw) ||
          c.email.toLowerCase().includes(kw) ||
          (c.company && c.company.toLowerCase().includes(kw));
        if (!matchesKw) return false;
      }

      // Tier
      if (selectedTier !== 'all' && !c.tier.includes(selectedTier)) {
        return false;
      }

      // Segment
      if (selectedSegment !== 'all' && c.segment !== selectedSegment) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && c.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [customers, keyword, selectedTier, selectedSegment, selectedStatus]);

  // Open Create Modal
  const handleOpenAddModal = () => {
    const autoNo = `CUST-${Math.floor(8800 + Math.random() * 1000)}`;
    setEditingCustomer(null);
    setFormData({
      customerNo: autoNo,
      name: '',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=100&auto=format&fit=crop&q=80`,
      phone: '',
      email: '',
      company: '',
      tier: 'V1 普通会员',
      segment: '潜力新客',
      status: 'active',
      totalSpent: 0,
      orderCount: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (customer: CustomerItem) => {
    setEditingCustomer(customer);
    setFormData({ ...customer });
    setIsModalOpen(true);
  };

  // Save Customer (Create / Edit)
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.phone?.trim()) {
      showToast('请填写真实客户姓名与手机号！', 'error');
      return;
    }

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                ...formData,
                name: formData.name || c.name,
                phone: formData.phone || c.phone,
              }
            : c
        )
      );
      showToast(`客户档案 "${formData.name}" 已更新`, 'success');
    } else {
      const newCustomer: CustomerItem = {
        id: `cust-${Date.now()}`,
        customerNo: formData.customerNo || `CUST-${Date.now()}`,
        name: formData.name || '新客户',
        avatar:
          formData.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        phone: formData.phone || '',
        email: formData.email || '',
        company: formData.company || '',
        tier: formData.tier || 'V1 普通会员',
        totalSpent: formData.totalSpent || 0,
        orderCount: formData.orderCount || 0,
        lastOrderDate: formData.lastOrderDate || new Date().toISOString().split('T')[0],
        segment: formData.segment || '潜力新客',
        status: (formData.status as 'active' | 'suspended') || 'active',
        notes: formData.notes || '',
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      showToast(`客户 "${newCustomer.name}" 已建档成功`, 'success');
    }

    setIsModalOpen(false);
  };

  // Delete Customer
  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    const target = customers.find((c) => c.id === deleteConfirmId);
    setCustomers((prev) => prev.filter((c) => c.id !== deleteConfirmId));
    showToast(`客户档案 "${target?.name || ''}" 已成功删除`, 'info');
    setDeleteConfirmId(null);
  };

  // Toggle Status
  const handleToggleStatus = (customer: CustomerItem) => {
    const nextStatus: CustomerItem['status'] =
      customer.status === 'active' ? 'suspended' : 'active';
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, status: nextStatus } : c))
    );
    showToast(
      `客户 "${customer.name}" 账号状态已切换为：${nextStatus === 'active' ? '正常解冻' : '已冻结'}`,
      nextStatus === 'active' ? 'success' : 'info'
    );
  };

  // Reset Filters
  const handleResetFilters = () => {
    setKeyword('');
    setSelectedTier('all');
    setSelectedSegment('all');
    setSelectedStatus('all');
    showToast('已重置所有筛选条件', 'info');
  };

  // Helper badge styles
  const getTierBadge = (tier: string) => {
    if (tier.includes('V5') || tier.includes('黑金')) {
      return 'bg-indigo-950 text-indigo-100 border-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-700';
    }
    if (tier.includes('V4') || tier.includes('钻石')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800';
    }
    if (tier.includes('V3') || tier.includes('黄金')) {
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    }
    if (tier.includes('V2') || tier.includes('白银')) {
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
    }
    return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
  };

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case '高价值客户':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case '潜力新客':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800';
      case '沉睡客户':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case '流失预警':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-gray-100">
                客户名录
              </h2>
            </div>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-gray-500 dark:text-gray-400">
              集中式全员客户资产数据库，支持快速检索、标签划分、VIP 等级维系与实时账号状态管控。
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => showToast('已刷新客户名录、画像与会员等级数据', 'success')}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>刷新数据</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              <span>录入新客户</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: '总名录客户数',
              value: stats.totalCount,
              unit: '位',
              helper: '全员客户资产',
              icon: UserCheck2,
              iconClassName: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-indigo-600 dark:text-indigo-400',
            },
            {
              label: '正常活跃客户',
              value: stats.activeCount,
              unit: `/${stats.totalCount}`,
              helper: '账号状态稳定',
              icon: CheckCircle2,
              iconClassName: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
              valueClassName: 'text-emerald-600 dark:text-emerald-400',
              helperClassName: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              label: '客户贡献流水总额',
              value: `￥${stats.totalRevenue.toLocaleString()}`,
              helper: '历史消费累计',
              icon: DollarSign,
              iconClassName: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-rose-600 dark:text-rose-400',
            },
            {
              label: '核心高价值客户占比',
              value: `${stats.highValueRatio}%`,
              unit: `(${stats.highValueCount}位)`,
              helper: 'VIP 与高价值画像',
              icon: Award,
              iconClassName: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
              valueClassName: 'text-amber-700 dark:text-amber-300',
              helperClassName: 'text-amber-600 dark:text-amber-400',
            },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="flex min-h-[88px] items-center justify-between rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <h3 className={`mt-1 text-2xl font-extrabold tracking-tight ${metric.valueClassName}`}>
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

      {/* Filter & Action Controls */}
      <div className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800/80">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: '全部客户', count: stats.totalCount },
              { id: 'active', label: '正常活跃', count: stats.activeCount },
              { id: 'suspended', label: '已冻结', count: customers.filter((c) => c.status === 'suspended').length },
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
            onClick={() => showToast('已导出当前筛选条件下的客户名录 CSV', 'success')}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Download className="h-3.5 w-3.5" />
            <span>导出名录</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索客户姓名、编号、手机号、邮箱或所属公司..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50/80 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:bg-gray-800"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex w-full flex-wrap items-center justify-start gap-3 sm:w-auto sm:justify-end">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-[150px] rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">全部会员等级</option>
              <option value="V1">V1 普通会员</option>
              <option value="V2">V2 白银会员</option>
              <option value="V3">V3 黄金会员</option>
              <option value="V4">V4 钻石会员</option>
              <option value="V5">V5 黑金VIP</option>
            </select>

            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-[150px] rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">全部画像分群</option>
              <option value="高价值客户">高价值客户</option>
              <option value="潜力新客">潜力新客</option>
              <option value="沉睡客户">沉睡客户</option>
              <option value="流失预警">流失预警</option>
            </select>

            {(keyword || selectedTier !== 'all' || selectedSegment !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex w-[150px] items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>重置条件</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/80 bg-gray-50/80 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                <th className="px-5 py-4">客户信息</th>
                <th className="px-4 py-4">联系方式</th>
                <th className="px-4 py-4">所属企业/机构</th>
                <th className="px-4 py-4">VIP 等级</th>
                <th className="px-4 py-4">分群画像</th>
                <th className="px-4 py-4 text-right">消费总额 / 订单</th>
                <th className="px-4 py-4">账号状态</th>
                <th className="px-4 py-4">近期下单</th>
                <th className="px-5 py-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60 dark:divide-gray-800 text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    <p className="text-base font-medium">未搜寻到符合条件的客户档案</p>
                    <p className="text-xs text-gray-400 mt-1">尝试更换或重置关键词与筛选类型</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="group transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                  >
                    {/* Customer info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="h-10 w-10 rounded-full border border-gray-200 object-cover shadow-xs dark:border-gray-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {customer.name}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-gray-400 dark:text-gray-500">
                            {customer.customerNo}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone & Email */}
                    <td className="px-4 py-4">
                      <div className="space-y-0.5 text-xs text-gray-600 dark:text-gray-300">
                        <div>
                          <span>{customer.phone}</span>
                        </div>
                        <div>
                          <span className="truncate max-w-[150px]">{customer.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-4 py-4">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        <span>{customer.company || '个人散客'}</span>
                      </div>
                    </td>

                    {/* VIP Tier */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getTierBadge(
                          customer.tier
                        )}`}
                      >
                        {customer.tier}
                      </span>
                    </td>

                    {/* Segment */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getSegmentBadge(
                          customer.segment
                        )}`}
                      >
                        {customer.segment}
                      </span>
                    </td>

                    {/* Total Spent / Orders */}
                    <td className="px-4 py-4 text-right">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        ￥{customer.totalSpent?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">{customer.orderCount} 笔订单</div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(customer)}
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition ${
                          customer.status === 'active'
                            ? `${statusBadge.success} hover:bg-emerald-100`
                            : `${statusBadge.danger} hover:bg-rose-100`
                        }`}
                        title="点击切换账号冻结/解冻状态"
                      >
                        {customer.status === 'active' ? (
                          <>
                            <span>正常</span>
                          </>
                        ) : (
                          <>
                            <span>已冻结</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Last order date */}
                    <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400">
                      <div>
                        <span>{customer.lastOrderDate}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setDetailCustomer(customer)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
                          title="查看全景档案"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(customer)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
                          title="编辑档案信息"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(customer.id)}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-rose-50 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-300"
                          title="删除客户记录"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Sliding Drawer */}
      {detailCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl h-full overflow-y-auto p-6 space-y-6 flex flex-col border-l border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  src={detailCustomer.avatar}
                  alt={detailCustomer.name}
                  className="h-12 w-12 rounded-full border-2 border-indigo-500 object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {detailCustomer.name}
                  </h3>
                  <span className="text-xs font-mono text-gray-400">
                    {detailCustomer.customerNo}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDetailCustomer(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  累计消费金额
                </span>
                <p className="mt-1 text-xl font-bold text-indigo-900 dark:text-indigo-200">
                  ￥{detailCustomer.totalSpent?.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  成交订单笔数
                </span>
                <p className="mt-1 text-xl font-bold text-emerald-900 dark:text-emerald-200">
                  {detailCustomer.orderCount} 笔
                </p>
              </div>
            </div>

            {/* Profile Detail List */}
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">VIP 等级:</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${getTierBadge(
                      detailCustomer.tier
                    )}`}
                  >
                    <Award className="h-3 w-3" />
                    {detailCustomer.tier}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">画像分群:</span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getSegmentBadge(
                      detailCustomer.segment
                    )}`}
                  >
                    {detailCustomer.segment}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">账号状态:</span>
                  <span
                    className={`text-xs font-semibold ${
                      detailCustomer.status === 'active'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {detailCustomer.status === 'active' ? '正常活跃' : '已冻结'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">联系电话:</span>
                  <span className="font-mono text-sm font-medium">{detailCustomer.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">电子邮箱:</span>
                  <span className="font-mono text-sm font-medium">{detailCustomer.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">所属公司:</span>
                  <span className="font-medium text-sm">
                    {detailCustomer.company || '个人散客'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">最近下单时间:</span>
                  <span className="text-sm font-medium">{detailCustomer.lastOrderDate}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  客户备注说明:
                </span>
                <p className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  {detailCustomer.notes || '暂无专属客服录入的特征备注与跟进批注。'}
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <button
                onClick={() => {
                  handleOpenEditModal(detailCustomer);
                  setDetailCustomer(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>编辑档案</span>
              </button>
              <button
                onClick={() => setDetailCustomer(null)}
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
                <UserCheck className="h-5 w-5 text-indigo-500" />
                <span>{editingCustomer ? '编辑客户档案' : '录入新客户档案'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    客户编号 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerNo || ''}
                    onChange={(e) => setFormData({ ...formData, customerNo: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    客户姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例如: 张立民"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    手机号码 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="138xxxxxxxx"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    电子邮箱
                  </label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  所属公司 / 企业组织
                </label>
                <input
                  type="text"
                  placeholder="例如: 腾讯科技有限公司 (留空为个人散客)"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    VIP 会员等级
                  </label>
                  <select
                    value={formData.tier || 'V1 普通会员'}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="V1 普通会员">V1 普通会员</option>
                    <option value="V2 白银会员">V2 白银会员</option>
                    <option value="V3 黄金会员">V3 黄金会员</option>
                    <option value="V4 钻石会员">V4 钻石会员</option>
                    <option value="V5 黑金VIP">V5 黑金VIP</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    画像分群归类
                  </label>
                  <select
                    value={formData.segment || '潜力新客'}
                    onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="高价值客户">高价值客户</option>
                    <option value="潜力新客">潜力新客</option>
                    <option value="沉睡客户">沉睡客户</option>
                    <option value="流失预警">流失预警</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    账号状态
                  </label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'suspended',
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  >
                    <option value="active">正常活跃</option>
                    <option value="suspended">已冻结停用</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  客服备注信息
                </label>
                <textarea
                  rows={3}
                  placeholder="录入客户特定偏好、对公对账习惯或沟通记录..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500"
                >
                  保存档案
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                确定要删除此客户档案吗？
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                此操作将永久清理该客户的名录数据，删除后将无法恢复。
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
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

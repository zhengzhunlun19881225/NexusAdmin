import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  Plus,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  FileText,
  Truck,
  ShieldAlert,
  ArrowUpDown,
  Download,
  X,
  User,
  Phone,
  Calendar,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { AbnormalRefundItem, RefundType, RefundStatus } from '../types';
import { compactBadge, statusBadge } from '../uiTheme';

interface AbnormalRefundsViewProps {
  refunds: AbnormalRefundItem[];
  setRefunds: React.Dispatch<React.SetStateAction<AbnormalRefundItem[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AbnormalRefundsView: React.FC<AbnormalRefundsViewProps> = ({
  refunds,
  setRefunds,
  showToast,
}) => {
  // Filter & Search states
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'applyTime' | 'refundAmount'>('applyTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals & Drawers
  const [detailItem, setDetailItem] = useState<AbnormalRefundItem | null>(null);
  const [editModalItem, setEditModalItem] = useState<Partial<AbnormalRefundItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [auditModalItem, setAuditModalItem] = useState<AbnormalRefundItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states for Create/Edit
  const [formData, setFormData] = useState<Partial<AbnormalRefundItem>>({
    refundNo: '',
    orderNo: '',
    customerName: '',
    customerPhone: '',
    type: '仅退款',
    reason: '',
    refundAmount: 0,
    status: 'pending',
    description: '',
    logisticsCode: '',
  });

  // Audit form states
  const [auditDecision, setAuditDecision] = useState<RefundStatus>('approved');
  const [auditRemarkInput, setAuditRemarkInput] = useState('');

  // Stats calculation
  const stats = useMemo(() => {
    const totalCount = refunds.length;
    const pendingCount = refunds.filter((r) => r.status === 'pending').length;
    const processingCount = refunds.filter((r) => r.status === 'processing' || r.status === 'approved').length;
    const totalAmount = refunds.reduce((sum, r) => sum + r.refundAmount, 0);
    const completedAmount = refunds
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + r.refundAmount, 0);

    return { totalCount, pendingCount, processingCount, totalAmount, completedAmount };
  }, [refunds]);

  // Filtered and Sorted list
  const filteredList = useMemo(() => {
    return refunds
      .filter((item) => {
        // Keyword
        if (keyword.trim()) {
          const kw = keyword.toLowerCase().trim();
          const matchesKw =
            item.refundNo.toLowerCase().includes(kw) ||
            item.orderNo.toLowerCase().includes(kw) ||
            item.customerName.toLowerCase().includes(kw) ||
            item.customerPhone.includes(kw) ||
            item.reason.toLowerCase().includes(kw);
          if (!matchesKw) return false;
        }
        // Status filter
        if (selectedStatus !== 'all' && item.status !== selectedStatus) {
          return false;
        }
        // Type filter
        if (selectedType !== 'all' && item.type !== selectedType) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA = sortBy === 'applyTime' ? new Date(a.applyTime).getTime() : a.refundAmount;
        let valB = sortBy === 'applyTime' ? new Date(b.applyTime).getTime() : b.refundAmount;
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [refunds, keyword, selectedStatus, selectedType, sortBy, sortOrder]);

  // Handlers for Create / Edit
  const handleOpenCreateModal = () => {
    const nextSeq = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      refundNo: `RF-202607-${nextSeq}`,
      orderNo: `ORD-202607-${Math.floor(8000 + Math.random() * 1000)}`,
      customerName: '',
      customerPhone: '',
      type: '仅退款',
      reason: '商品质量问题',
      refundAmount: 100,
      status: 'pending',
      description: '',
      logisticsCode: '',
    });
    setIsCreating(true);
    setEditModalItem(null);
  };

  const handleOpenEditModal = (item: AbnormalRefundItem) => {
    setFormData({ ...item });
    setEditModalItem(item);
    setIsCreating(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName?.trim()) {
      showToast('请输入客户姓名', 'error');
      return;
    }
    if (!formData.orderNo?.trim()) {
      showToast('请输入关联订单号', 'error');
      return;
    }
    if (!formData.refundAmount || formData.refundAmount <= 0) {
      showToast('退款金额必须大于 0', 'error');
      return;
    }

    if (isCreating) {
      // Create new
      const newItem: AbnormalRefundItem = {
        id: `ref-${Date.now()}`,
        refundNo: formData.refundNo || `RF-${Date.now()}`,
        orderNo: formData.orderNo!,
        customerName: formData.customerName!,
        customerPhone: formData.customerPhone || '13800000000',
        type: (formData.type as RefundType) || '仅退款',
        reason: formData.reason || '其他原因',
        refundAmount: Number(formData.refundAmount),
        status: (formData.status as RefundStatus) || 'pending',
        applyTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        handler: '张伟 (大客户组)',
        description: formData.description || '无详细备注',
        logisticsCode: formData.logisticsCode || '',
      };
      setRefunds((prev) => [newItem, ...prev]);
      showToast(`成功新增售后退款单 ${newItem.refundNo}`, 'success');
    } else if (editModalItem) {
      // Update existing
      setRefunds((prev) =>
        prev.map((item) =>
          item.id === editModalItem.id
            ? {
                ...item,
                ...formData,
                refundAmount: Number(formData.refundAmount),
              }
            : item
        )
      );
      showToast(`退款单 ${formData.refundNo} 信息修改成功`, 'success');
    }

    setIsCreating(false);
    setEditModalItem(null);
  };

  // Handler for Audit
  const handleOpenAuditModal = (item: AbnormalRefundItem) => {
    setAuditModalItem(item);
    setAuditDecision('approved');
    setAuditRemarkInput('');
  };

  const handleConfirmAudit = () => {
    if (!auditModalItem) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setRefunds((prev) =>
      prev.map((item) => {
        if (item.id === auditModalItem.id) {
          return {
            ...item,
            status: auditDecision,
            auditTime: nowStr,
            handler: '张伟 (大客户组)',
            auditRemark: auditRemarkInput.trim() || (auditDecision === 'approved' ? '审核通过，允许退款流程' : '驳回售后申请'),
          };
        }
        return item;
      })
    );

    const statusMapText: Record<RefundStatus, string> = {
      pending: '重置为待审核',
      processing: '标记为退款处理中',
      approved: '已同意退款/售后',
      rejected: '已拒绝/驳回退款',
      completed: '已确认完成原路退款',
      closed: '已关闭异常单',
    };

    showToast(`工单 ${auditModalItem.refundNo} 审核更新为：${statusMapText[auditDecision]}`, 'success');
    setAuditModalItem(null);
  };

  // Handler for Delete
  const handleDeleteItem = (id: string) => {
    const target = refunds.find((r) => r.id === id);
    setRefunds((prev) => prev.filter((r) => r.id !== id));
    showToast(`已删除售后工单 ${target?.refundNo || id}`, 'info');
    setDeleteConfirmId(null);
    if (detailItem?.id === id) {
      setDetailItem(null);
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className={statusBadge.warning}>
            待审核
          </span>
        );
      case 'processing':
        return (
          <span className={statusBadge.info}>
            处理中
          </span>
        );
      case 'approved':
        return (
          <span className={statusBadge.primary}>
            已同意
          </span>
        );
      case 'completed':
        return (
          <span className={statusBadge.success}>
            已退款
          </span>
        );
      case 'rejected':
        return (
          <span className={statusBadge.danger}>
            已驳回
          </span>
        );
      case 'closed':
        return (
          <span className={statusBadge.neutral}>
            已关闭
          </span>
        );
      default:
        return null;
    }
  };

  // Render Type Badge
  const renderTypeBadge = (type: RefundType) => {
    switch (type) {
      case '仅退款':
        return <span className={compactBadge.primary}>仅退款</span>;
      case '退货退款':
        return <span className={compactBadge.primary}>退货退款</span>;
      case '换货':
        return <span className={compactBadge.info}>换货处理</span>;
      case '异常申报':
        return <span className={compactBadge.danger}>异常风控申报</span>;
      default:
        return <span className={compactBadge.neutral}>{type}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Metrics */}
      <div className="rounded-2xl border border-gray-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/70 p-5 shadow-sm dark:border-gray-800 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              After-sales Risk Center
            </div>
            <div className="mt-2 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-gray-100">
                异常与退款
              </h2>
            </div>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-gray-500 dark:text-gray-400">
              实时处理售后争议、退货退款审核、物流异常与高风险交易拦截工单，支持全流程增删改查及一键审核流。
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => {
                showToast('已完成全盘异常与退款数据同步刷新', 'success');
              }}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>刷新数据</span>
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
              id="create-refund-ticket-btn"
            >
              <Plus className="h-4 w-4" />
              <span>发起售后异常单</span>
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              label: '售后异常工单',
              value: stats.totalCount,
              unit: '单',
              helper: `处理中 ${stats.processingCount} 单`,
              icon: FileText,
              iconClassName: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-indigo-600 dark:text-indigo-400',
            },
            {
              label: '待审核退款',
              value: stats.pendingCount,
              unit: '单待办',
              helper: '需人工核销',
              icon: Clock,
              iconClassName: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
              valueClassName: 'text-amber-700 dark:text-amber-300',
              helperClassName: 'text-amber-600 dark:text-amber-400',
            },
            {
              label: '流程处理中',
              value: stats.processingCount,
              unit: '单',
              helper: '物流与客服协同',
              icon: Truck,
              iconClassName: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-sky-600 dark:text-sky-400',
            },
            {
              label: '申请退款金额',
              value: `￥${stats.totalAmount.toLocaleString()}`,
              helper: '涉及售后索赔',
              icon: DollarSign,
              iconClassName: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-rose-600 dark:text-rose-400',
            },
            {
              label: '已完成退款',
              value: `￥${stats.completedAmount.toLocaleString()}`,
              helper: '原路退回账户',
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

      {/* Filter Tabs & Search Options */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm space-y-4">
        {/* Quick Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: '全部工单', count: refunds.length },
              { id: 'pending', label: '待审核', count: refunds.filter((r) => r.status === 'pending').length },
              { id: 'processing', label: '处理中', count: refunds.filter((r) => r.status === 'processing').length },
              { id: 'approved', label: '已同意', count: refunds.filter((r) => r.status === 'approved').length },
              { id: 'completed', label: '已退款', count: refunds.filter((r) => r.status === 'completed').length },
              { id: 'rejected', label: '已驳回', count: refunds.filter((r) => r.status === 'rejected').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedStatus === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-xs ${
                    selectedStatus === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const jsonStr = JSON.stringify(filteredList, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `refunds_export_${Date.now()}.json`;
                a.click();
                showToast('已导出当前筛选的异常退款记录 JSON', 'success');
              }}
              className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
              <span>导出列表</span>
            </button>
          </div>
        </div>

        {/* Search Input and Type Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索退款单号 / 原订单 / 客户名 / 手机号..."
              className="w-full rounded-xl border border-gray-200/80 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2 pl-9 pr-3 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
              <Filter className="h-3.5 w-3.5" />
              <span>类型:</span>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-gray-200/80 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-1.5 px-3 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">全部类型</option>
              <option value="仅退款">仅退款</option>
              <option value="退货退款">退货退款</option>
              <option value="换货">换货处理</option>
              <option value="异常申报">异常风控申报</option>
            </select>

            <button
              onClick={() => {
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
              }}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-1.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
              <span>
                {sortBy === 'applyTime' ? '申请时间' : '退款金额'} ({sortOrder === 'desc' ? '降序' : '升序'})
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Table (Read - 查) */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">售后退款单号</th>
                <th className="py-3 px-4">关联原订单号</th>
                <th className="py-3 px-4">买家客户</th>
                <th className="py-3 px-4">售后类型</th>
                <th className="py-3 px-4">申请退款原因</th>
                <th className="py-3 px-4 text-right">退款金额</th>
                <th className="py-3 px-4">当前状态</th>
                <th className="py-3 px-4">申请时间</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p>未查找到符合条件的异常/退款工单记录</p>
                      <button
                        onClick={() => {
                          setKeyword('');
                          setSelectedStatus('all');
                          setSelectedType('all');
                        }}
                        className="mt-2 text-xs text-indigo-600 hover:underline font-medium"
                      >
                        重置所有搜索和过滤条件
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors group"
                  >
                    {/* Refund No */}
                    <td className="py-3 px-4 font-mono font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-indigo-600 dark:text-indigo-400">{item.refundNo}</span>
                        {item.evidenceImages && item.evidenceImages.length > 0 && (
                          <span className="text-xs text-gray-400" title="包含图片凭证">
                            凭证
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Linked Order No */}
                    <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {item.orderNo}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      <div className="font-medium">{item.customerName}</div>
                      <div className="text-xs text-gray-400">{item.customerPhone}</div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 whitespace-nowrap">{renderTypeBadge(item.type)}</td>

                    {/* Reason & Description */}
                    <td className="py-3 px-4 max-w-xs text-gray-700 dark:text-gray-300 truncate">
                      <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.reason}</div>
                      {item.description && (
                        <div className="text-xs text-gray-400 truncate">{item.description}</div>
                      )}
                    </td>

                    {/* Refund Amount */}
                    <td className="py-3 px-4 text-right font-semibold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                      ￥{item.refundAmount.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">{renderStatusBadge(item.status)}</td>

                    {/* Apply Time */}
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                      {item.applyTime}
                    </td>

                    {/* Action Column */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Audit action button for pending */}
                        {item.status === 'pending' ? (
                          <button
                            onClick={() => handleOpenAuditModal(item)}
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 text-xs font-bold shadow-xs transition-colors"
                            title="人工审核判定"
                          >
                            <ShieldAlert className="h-3 w-3" />
                            <span>审核</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenAuditModal(item)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 text-xs font-medium transition-colors"
                            title="改动状态/二次裁决"
                          >
                            <span>改状态</span>
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => setDetailItem(item)}
                          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 transition-colors"
                          title="查看完整单据与凭证"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors"
                          title="编辑工单"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1 rounded-md text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 transition-colors"
                          title="删除撤销工单"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* CREATE / EDIT MODAL (增 / 改) */}
      {(isCreating || editModalItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-indigo-600" />
                <span>{isCreating ? '发起售后/异常申报单' : `编辑售后退款单 ${formData.refundNo}`}</span>
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditModalItem(null);
                }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    售后退款单号 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.refundNo || ''}
                    onChange={(e) => setFormData({ ...formData, refundNo: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    关联原订单号 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.orderNo || ''}
                    onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                    placeholder="e.g. ORD-202607-8891"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    买家客户姓名 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName || ''}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="请输入客户姓名或公司名"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    联系电话
                  </label>
                  <input
                    type="text"
                    value={formData.customerPhone || ''}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="e.g. 13812345678"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    售后类型
                  </label>
                  <select
                    value={formData.type || '仅退款'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as RefundType })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="仅退款">仅退款 (不退货)</option>
                    <option value="退货退款">退货退款</option>
                    <option value="换货">换货处理</option>
                    <option value="异常申报">异常风控申报</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    申请退款金额 (￥) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.refundAmount || ''}
                    onChange={(e) => setFormData({ ...formData, refundAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  退款/异常原因
                </label>
                <input
                  type="text"
                  value={formData.reason || ''}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g. 外包装破损、尺寸选错、七天无理由等"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  退货物流单号 (选填)
                </label>
                <input
                  type="text"
                  value={formData.logisticsCode || ''}
                  onChange={(e) => setFormData({ ...formData, logisticsCode: e.target.value })}
                  placeholder="e.g. SF14289901238"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  详细说明与沟通备注
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="记录买家反馈的具体情况及售后处理要点..."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditModalItem(null);
                  }}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-xs font-bold shadow-md transition-all"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT / PROCESS MODAL (审核与状态裁决) */}
      {auditModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-amber-50/50 dark:bg-amber-950/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                <span>售后审核裁决 - {auditModalItem.refundNo}</span>
              </h3>
              <button
                onClick={() => setAuditModalItem(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3.5 text-xs space-y-2 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex justify-between">
                  <span className="text-gray-500">买家客户:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{auditModalItem.customerName} ({auditModalItem.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">原订单号:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">{auditModalItem.orderNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">申请退款类型/原因:</span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">{auditModalItem.type} - {auditModalItem.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">申请退款金额:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">￥{auditModalItem.refundAmount.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  选择审核判定结果
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'approved', label: '同意申请 (已同意)', color: 'border-indigo-500 text-indigo-600 bg-indigo-50/50' },
                    { id: 'processing', label: '开启流程 (退款处理中)', color: 'border-blue-500 text-blue-600 bg-blue-50/50' },
                    { id: 'completed', label: '核销完成 (原路退款成功)', color: 'border-emerald-500 text-emerald-600 bg-emerald-50/50' },
                    { id: 'rejected', label: '拒绝驳回 (不符合条件)', color: 'border-rose-500 text-rose-600 bg-rose-50/50' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAuditDecision(option.id as RefundStatus)}
                      className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                        auditDecision === option.id
                          ? `${option.color} ring-2 ring-indigo-500`
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>{option.label}</span>
                      {auditDecision === option.id && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  审核批注 / 驳回依据说明
                </label>
                <textarea
                  rows={3}
                  value={auditRemarkInput}
                  onChange={(e) => setAuditRemarkInput(e.target.value)}
                  placeholder="填写审核通过或驳回理由，如：已核对快递重量符合质检要求、不排除调包恶意索赔等..."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setAuditModalItem(null)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmAudit}
                  className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 text-xs font-bold shadow-md transition-all"
                >
                  确认裁决更新
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER (查看详情 - 查) */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>售后单详情</span>
                  {renderTypeBadge(detailItem.type)}
                </h3>
                <p className="text-xs font-mono text-gray-400">{detailItem.refundNo}</p>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
              {/* Status Box */}
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-200/60 dark:border-gray-700/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">当前工单状态:</span>
                  {renderStatusBadge(detailItem.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">处理负责人:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{detailItem.handler || '未指定'}</span>
                </div>
                {detailItem.auditTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">最近审核时间:</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300">{detailItem.auditTime}</span>
                  </div>
                )}
              </div>

              {/* Amount & Order Info */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-1.5">
                  基本与金额信息
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-rose-50/50 dark:bg-rose-950/20 p-3 border border-rose-100 dark:border-rose-900/30">
                    <span className="text-gray-500 block text-xs">申请退款金额</span>
                    <span className="text-lg font-bold text-rose-600 dark:text-rose-400">￥{detailItem.refundAmount.toFixed(2)}</span>
                  </div>
                  <div className="rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 p-3 border border-indigo-100 dark:border-indigo-900/30">
                    <span className="text-gray-500 block text-xs">关联原订单</span>
                    <span className="text-sm font-mono font-bold text-indigo-700 dark:text-indigo-300">{detailItem.orderNo}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-1.5">
                  买家客户档案
                </h4>
                <div className="space-y-1.5 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-gray-400" />
                    <span>姓名/主体: {detailItem.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span>联系电话: {detailItem.customerPhone}</span>
                  </div>
                  {detailItem.logisticsCode && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-gray-400" />
                      <span>退货物流单号: <strong className="font-mono text-indigo-600">{detailItem.logisticsCode}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reason & Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-1.5">
                  售后原因与买家说明
                </h4>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-gray-800 dark:text-gray-200 leading-relaxed">
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">{detailItem.reason}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{detailItem.description || '无补充说明'}</p>
                </div>
              </div>

              {/* Evidence Images */}
              {detailItem.evidenceImages && detailItem.evidenceImages.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-1.5">
                    买家举证图片照片 ({detailItem.evidenceImages.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {detailItem.evidenceImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`举证照片 ${idx + 1}`}
                        className="h-28 w-full object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Audit History / Remark */}
              {detailItem.auditRemark && (
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-1.5">
                    客服/审核批注记录
                  </h4>
                  <div className="rounded-xl bg-amber-50/60 dark:bg-amber-950/30 p-3 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
                    <p>{detailItem.auditRemark}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setDeleteConfirmId(detailItem.id);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 px-3 py-2 text-xs font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>撤销删除</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(detailItem)}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>编辑单据</span>
                </button>
                <button
                  onClick={() => {
                    handleOpenAuditModal(detailItem);
                    setDetailItem(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-xs font-bold"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>裁决审核</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG (删) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">确认删除/撤销此售后工单？</h3>
              <p className="mt-1 text-xs text-gray-500">
                此操作将从系统中永久删除该异常退款记录，不可恢复。
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100"
              >
                取消
              </button>
              <button
                onClick={() => handleDeleteItem(deleteConfirmId)}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-xs font-bold shadow-md"
              >
                确认彻底删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

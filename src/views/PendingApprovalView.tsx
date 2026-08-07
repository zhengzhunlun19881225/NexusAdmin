import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Edit2,
  Eye,
  FileCheck2,
  Search,
  ShieldAlert,
  ShoppingBag,
  X,
  XCircle,
} from 'lucide-react';
import { OrderItem, PriorityLevel, RiskLevel } from '../types';
import { compactBadge, statusBadge } from '../uiTheme';

type ApprovalQueue = 'all' | 'highRisk' | 'highPriority' | 'largeAmount' | 'invoice';

interface PendingApprovalViewProps {
  orders: OrderItem[];
  onOpenDetail: (order: OrderItem) => void;
  onOpenEdit: (order: OrderItem) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderItem['status']) => void;
  showToast: (msg: string) => void;
}

const priorityText: Record<PriorityLevel, string> = {
  high: '高优先',
  medium: '中优先',
  normal: '常规',
  low: '低优先',
};

const riskText: Record<RiskLevel, string> = {
  high: '高风险',
  moderate: '中风险',
  low: '低风险',
};

const paymentText: Record<OrderItem['paymentMethod'], string> = {
  wechat: '微信支付',
  alipay: '支付宝',
  credit_card: '信用卡',
  bank_transfer: '银行转账',
};

const channelText: Record<OrderItem['channel'], string> = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  mini_app: '小程序',
  offline: '线下',
};

export const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({
  orders,
  onOpenDetail,
  onOpenEdit,
  onUpdateStatus,
  showToast,
}) => {
  const [keyword, setKeyword] = useState('');
  const [selectedQueue, setSelectedQueue] = useState<ApprovalQueue>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | PriorityLevel>('all');
  const [selectedRisk, setSelectedRisk] = useState<'all' | RiskLevel>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const pendingOrders = useMemo(() => orders.filter((order) => order.status === 'pending'), [orders]);

  const stats = useMemo(() => {
    const totalAmount = pendingOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const highRiskCount = pendingOrders.filter((order) => order.riskLevel === 'high').length;
    const highPriorityCount = pendingOrders.filter((order) => order.priority === 'high').length;
    const largeAmountCount = pendingOrders.filter((order) => order.totalAmount >= 10000).length;
    const invoiceReviewCount = pendingOrders.filter(
      (order) => order.invoiceStatus === 'processing' || order.invoiceStatus === 'uninvoiced'
    ).length;

    return {
      totalCount: pendingOrders.length,
      highRiskCount,
      highPriorityCount,
      largeAmountCount,
      invoiceReviewCount,
      avgAmount: pendingOrders.length ? Math.round(totalAmount / pendingOrders.length) : 0,
    };
  }, [pendingOrders]);

  const filteredOrders = useMemo(() => {
    return pendingOrders
      .filter((order) => {
        if (keyword.trim()) {
          const kw = keyword.toLowerCase().trim();
          const matches =
            order.orderNo.toLowerCase().includes(kw) ||
            order.customerName.toLowerCase().includes(kw) ||
            order.customerPhone.includes(kw) ||
            order.products.some((product) => product.name.toLowerCase().includes(kw));
          if (!matches) return false;
        }

        if (selectedQueue === 'highRisk' && order.riskLevel !== 'high') return false;
        if (selectedQueue === 'highPriority' && order.priority !== 'high') return false;
        if (selectedQueue === 'largeAmount' && order.totalAmount < 10000) return false;
        if (
          selectedQueue === 'invoice' &&
          order.invoiceStatus !== 'processing' &&
          order.invoiceStatus !== 'uninvoiced'
        ) {
          return false;
        }

        if (selectedPriority !== 'all' && order.priority !== selectedPriority) return false;
        if (selectedRisk !== 'all' && order.riskLevel !== selectedRisk) return false;

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [pendingOrders, keyword, selectedQueue, selectedPriority, selectedRisk, sortOrder]);

  const renderPriorityBadge = (priority: PriorityLevel) => {
    if (priority === 'high') return <span className={compactBadge.danger}>{priorityText[priority]}</span>;
    if (priority === 'medium') return <span className={compactBadge.warning}>{priorityText[priority]}</span>;
    if (priority === 'normal') return <span className={compactBadge.primary}>{priorityText[priority]}</span>;
    return <span className={compactBadge.neutral}>{priorityText[priority]}</span>;
  };

  const renderRiskBadge = (risk: RiskLevel) => {
    if (risk === 'high') return <span className={compactBadge.danger}>{riskText[risk]}</span>;
    if (risk === 'moderate') return <span className={compactBadge.warning}>{riskText[risk]}</span>;
    return <span className={compactBadge.success}>{riskText[risk]}</span>;
  };

  const handleApprove = (order: OrderItem) => {
    onUpdateStatus(order.id, 'processing');
  };

  const handleReject = (order: OrderItem) => {
    onUpdateStatus(order.id, 'cancelled');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Metrics */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-gray-100">
                待审核订单
              </h2>
            </div>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-gray-500 dark:text-gray-400">
              聚合待人工复核订单，覆盖高风险、大额、高优先级与发票待核场景，支持快速通过、驳回与详情核验。
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => showToast('已刷新待审核订单队列')}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>刷新队列</span>
            </button>
            <button
              onClick={() => {
                filteredOrders.forEach((order) => onUpdateStatus(order.id, 'processing'));
              }}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
              disabled={filteredOrders.length === 0}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>批量通过当前列表</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              label: '待审核订单',
              value: stats.totalCount,
              unit: '笔',
              helper: '等待运营复核',
              icon: FileCheck2,
              iconClassName: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-indigo-600 dark:text-indigo-400',
            },
            {
              label: '高风险复核',
              value: stats.highRiskCount,
              unit: '笔',
              helper: '需风控确认',
              icon: ShieldAlert,
              iconClassName: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
              valueClassName: 'text-rose-600 dark:text-rose-400',
              helperClassName: 'text-rose-600 dark:text-rose-400',
            },
            {
              label: '高优先级订单',
              value: stats.highPriorityCount,
              unit: '笔',
              helper: '需优先审核',
              icon: AlertTriangle,
              iconClassName: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
              valueClassName: 'text-amber-700 dark:text-amber-300',
              helperClassName: 'text-amber-600 dark:text-amber-400',
            },
            {
              label: '大额订单',
              value: stats.largeAmountCount,
              unit: '笔',
              helper: '金额 >= 10000',
              icon: DollarSign,
              iconClassName: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-sky-600 dark:text-sky-400',
            },
            {
              label: '平均待审金额',
              value: `￥${stats.avgAmount.toLocaleString()}`,
              helper: '当前队列均值',
              icon: ShoppingBag,
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: '全部待审', count: stats.totalCount },
              { id: 'highRisk', label: '高风险', count: stats.highRiskCount },
              { id: 'highPriority', label: '高优先级', count: stats.highPriorityCount },
              { id: 'largeAmount', label: '大额订单', count: stats.largeAmountCount },
              { id: 'invoice', label: '发票待核', count: stats.invoiceReviewCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedQueue(tab.id as ApprovalQueue)}
                className={`flex items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-all ${
                  selectedQueue === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 text-xs font-bold ${
                    selectedQueue === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => showToast('已导出当前待审核订单列表 CSV')}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Download className="h-3.5 w-3.5" />
            <span>导出列表</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索订单号 / 客户名 / 手机号 / 商品..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50/80 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex w-full flex-wrap items-center justify-start gap-3 sm:w-auto sm:justify-end">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as 'all' | PriorityLevel)}
              className="w-[150px] rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">全部优先级</option>
              <option value="high">高优先</option>
              <option value="medium">中优先</option>
              <option value="normal">常规</option>
              <option value="low">低优先</option>
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value as 'all' | RiskLevel)}
              className="w-[150px] rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">全部风险</option>
              <option value="high">高风险</option>
              <option value="moderate">中风险</option>
              <option value="low">低风险</option>
            </select>

            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="flex w-[150px] items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>下单时间 ({sortOrder === 'desc' ? '降序' : '升序'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Approval Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200/80 bg-gray-50/80 text-sm font-semibold text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3.5">待审订单号</th>
                <th className="px-4 py-3.5">客户信息</th>
                <th className="px-4 py-3.5">商品明细</th>
                <th className="px-4 py-3.5 text-right">订单金额</th>
                <th className="px-4 py-3.5">审核标签</th>
                <th className="px-4 py-3.5">支付 / 渠道</th>
                <th className="px-4 py-3.5">负责人</th>
                <th className="px-4 py-3.5">下单时间</th>
                <th className="px-4 py-3.5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700 dark:divide-gray-800/60 dark:text-gray-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    <FileCheck2 className="mx-auto mb-2 h-10 w-10 text-gray-300 dark:text-gray-600" />
                    <p className="text-base font-medium">暂无匹配的待审核订单</p>
                    <p className="mt-1 text-xs">可调整审核队列、关键词或风险筛选条件</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          {order.orderNo}
                        </span>
                        <span className={statusBadge.warning}>待审核</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={order.customerAvatar || order.assignee.avatar}
                          alt={order.customerName}
                          className="h-8 w-8 rounded-full border border-gray-200 object-cover dark:border-gray-700"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">{order.customerName}</div>
                          <div className="font-mono text-xs text-gray-400">{order.customerPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="max-w-[260px]">
                        <div className="truncate font-semibold text-gray-900 dark:text-gray-100">
                          {order.products[0]?.name || '订单商品'}
                        </div>
                        <div className="mt-0.5 truncate text-xs text-gray-400">
                          {order.products.length} 个 SKU · {order.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
                        ￥{order.totalAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {renderPriorityBadge(order.priority)}
                        {renderRiskBadge(order.riskLevel)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs">
                        <div className="font-semibold text-gray-700 dark:text-gray-300">{paymentText[order.paymentMethod]}</div>
                        <div className="mt-0.5 text-gray-400">{channelText[order.channel]}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={order.assignee.avatar}
                          alt={order.assignee.name}
                          className="h-7 w-7 rounded-full border border-gray-200 object-cover dark:border-gray-700"
                        />
                        <span className="whitespace-nowrap text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {order.assignee.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{order.createdAt}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(order)}
                          className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>审核</span>
                        </button>
                        <button
                          onClick={() => handleReject(order)}
                          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>驳回</span>
                        </button>
                        <button
                          onClick={() => onOpenDetail(order)}
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                          title="查看详情"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onOpenEdit(order)}
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                          title="编辑订单"
                        >
                          <Edit2 className="h-4 w-4" />
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
    </div>
  );
};

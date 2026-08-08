import React, { useState } from 'react';
import {
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Columns3
} from 'lucide-react';
import { OrderItem, OrderStatus, ColumnConfig, LayoutDensity } from '../types';
import { actionButton, statusBadge, themeColors } from '../uiTheme';

interface DataTableProps {
  orders: OrderItem[];
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  columns: ColumnConfig[];
  onOpenDetail: (order: OrderItem) => void;
  onOpenEdit: (order: OrderItem) => void;
  onOpenColumnCustomizer: () => void;
  onBatchDelete: () => void;
  onBatchApprove: () => void;
  onExportCSV: () => void;
  layoutDensity: LayoutDensity;
  keywordHighlight: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  orders,
  selectedIds,
  setSelectedIds,
  columns,
  onOpenDetail,
  onOpenEdit,
  onOpenColumnCustomizer,
  onBatchDelete,
  onBatchApprove,
  onExportCSV,
  layoutDensity,
  keywordHighlight,
}) => {
  const [sortField, setSortField] = useState<keyof OrderItem | null>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeMenuOrderId, setActiveMenuOrderId] = useState<string | null>(null);

  // Sorting Handler
  const handleSort = (field: keyof OrderItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return 0;
  });

  // Pagination Math
  const totalPages = Math.ceil(sortedOrders.length / pageSize) || 1;
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Selection
  const isAllSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((o) => selectedIds.includes(o.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedOrders.some((o) => o.id === id))
      );
    } else {
      const newIds = new Set([...selectedIds, ...paginatedOrders.map((o) => o.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Density padding classes
  const densityPadding =
    layoutDensity === 'compact'
      ? 'py-2 px-3'
      : layoutDensity === 'comfortable'
      ? 'py-4 px-4'
      : 'py-3 px-3.5';

  // Highlight helper
  const highlightText = (text: string) => {
    if (!keywordHighlight.trim()) return text;
    const parts = text.split(new RegExp(`(${keywordHighlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === keywordHighlight.toLowerCase() ? (
            <mark key={i} className={`${themeColors.highlight} px-0.5 rounded`}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Status Badge Colors
  const renderStatusBadge = (status: OrderStatus) => {
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
      case 'shipped':
        return (
          <span className={statusBadge.primary}>
            已发货
          </span>
        );
      case 'completed':
        return (
          <span className={statusBadge.success}>
            已完成
          </span>
        );
      case 'refunded':
        return (
          <span className={statusBadge.danger}>
            已退款
          </span>
        );
      default:
        return null;
    }
  };

  const visibleCols = columns.filter((c) => c.visible);

  return (
    <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs overflow-hidden transition-colors">
      {/* Table Toolbar Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
        {/* Left: Batch Operations indicator */}
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-200/60 dark:border-indigo-800 text-xs font-semibold animate-in fade-in">
              <span>已选 {selectedIds.length} 项</span>
              <div className="h-3 w-[1px] bg-indigo-300 dark:bg-indigo-700 mx-1"></div>
              <button
                onClick={onBatchApprove}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                批量审核通过
              </button>
              <button
                onClick={onBatchDelete}
                className="ml-2 inline-flex items-center gap-1 text-rose-600 hover:underline dark:text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                批量删除
              </button>
            </div>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              全部条目数据 (按下单时间倒序排列)
            </span>
          )}
        </div>

        {/* Right: Custom Columns & Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenColumnCustomizer}
            className={actionButton.secondary}
            title="隐藏/显示自定义列"
          >
            <Columns3 className="h-3.5 w-3.5 text-gray-400" />
            <span>自定义列</span>
          </button>

          <button
            onClick={onExportCSV}
            className={actionButton.secondary}
            title="导出为 CSV 表格"
          >
            <Download className="h-3.5 w-3.5 text-gray-400" />
            <span>导出数据</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/60 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {/* Checkbox Col */}
              <th className="py-3 px-3.5 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                />
              </th>

              {visibleCols.map((col) => (
                <th
                  key={col.id}
                  style={{ width: col.width }}
                  className="py-3 px-3.5 font-semibold"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.id as keyof OrderItem)}
                      className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <span>{col.label}</span>
                      {sortField === col.id ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-3 w-3 text-indigo-600" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-indigo-600" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                      )}
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-sm text-gray-800 dark:text-gray-200">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleCols.length + 1}
                  className="py-12 text-center text-xs text-gray-400"
                >
                  未找到满足当前筛选条件的订单数据。
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const isSelected = selectedIds.includes(order.id);

                return (
                  <tr
                    key={order.id}
                    className={`group transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/50 ${
                      isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className={`${densityPadding} w-10`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(order.id)}
                        className="rounded border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                      />
                    </td>

                    {/* Dynamic Columns */}
                    {visibleCols.map((col) => {
                      switch (col.id) {
                        case 'orderNo':
                          return (
                            <td key={col.id} className={`${densityPadding} font-mono font-semibold text-indigo-600 dark:text-indigo-400`}>
                              <button
                                onClick={() => onOpenDetail(order)}
                                className="hover:underline text-left"
                              >
                                {highlightText(order.orderNo)}
                              </button>
                            </td>
                          );

                        case 'customerName':
                          return (
                            <td key={col.id} className={densityPadding}>
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={order.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                                  alt={order.customerName}
                                  className="h-7 w-7 rounded-full object-cover shrink-0 ring-1 ring-gray-200 dark:ring-gray-700"
                                />
                                <div className="flex flex-col truncate max-w-[150px]">
                                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {highlightText(order.customerName)}
                                  </span>
                                  <span className="text-xs text-gray-400 font-mono">
                                    {highlightText(order.customerPhone)}
                                  </span>
                                </div>
                              </div>
                            </td>
                          );

                        case 'products':
                          return (
                            <td key={col.id} className={densityPadding}>
                              <div className="flex flex-col max-w-[200px]">
                                <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {order.products[0]?.name}
                                </span>
                                {order.products.length > 1 && (
                                  <span className="text-xs text-indigo-500 font-medium">
                                    等共 {order.products.length} 件商品
                                  </span>
                                )}
                              </div>
                            </td>
                          );

                        case 'totalAmount':
                          return (
                            <td key={col.id} className={`${densityPadding} font-semibold text-gray-900 dark:text-white`}>
                              ￥{order.totalAmount.toLocaleString()}
                            </td>
                          );

                        case 'status':
                          return (
                            <td key={col.id} className={densityPadding}>
                              {renderStatusBadge(order.status)}
                            </td>
                          );

                        case 'assignee':
                          return (
                            <td key={col.id} className={densityPadding}>
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={order.assignee.avatar}
                                  alt={order.assignee.name}
                                  className="h-5 w-5 rounded-full object-cover"
                                />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  {order.assignee.name}
                                </span>
                              </div>
                            </td>
                          );

                        case 'createdAt':
                          return (
                            <td key={col.id} className={`${densityPadding} text-gray-500 font-mono text-xs`}>
                              {order.createdAt}
                            </td>
                          );

                        case 'paymentMethod':
                          return (
                            <td key={col.id} className={`${densityPadding} text-gray-600 dark:text-gray-400`}>
                              {order.paymentMethod === 'alipay' && '支付宝'}
                              {order.paymentMethod === 'wechat' && '微信支付'}
                              {order.paymentMethod === 'credit_card' && '信用卡'}
                              {order.paymentMethod === 'bank_transfer' && '对公转账'}
                            </td>
                          );

                        case 'channel':
                          return (
                            <td key={col.id} className={`${densityPadding} text-gray-500 text-xs`}>
                              {order.channel === 'web' && '官网 Web'}
                              {order.channel === 'mini_app' && '小程序'}
                              {order.channel === 'ios' && 'iOS'}
                              {order.channel === 'android' && 'Android'}
                              {order.channel === 'offline' && '线下'}
                            </td>
                          );

                        case 'priority':
                          return (
                            <td key={col.id} className={densityPadding}>
                              {order.priority === 'high' ? (
                                <span className="text-rose-600 dark:text-rose-400 font-bold text-xs">高等</span>
                              ) : order.priority === 'medium' ? (
                                <span className="text-amber-600 dark:text-amber-400 font-medium text-xs">中等</span>
                              ) : (
                                <span className="text-gray-400 text-xs">普通</span>
                              )}
                            </td>
                          );

                        case 'riskLevel':
                          return (
                            <td key={col.id} className={densityPadding}>
                              {order.riskLevel === 'high' ? (
                                <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold">高风险</span>
                              ) : (
                                <span className="text-emerald-600 text-xs">低风险</span>
                              )}
                            </td>
                          );

                        case 'invoiceStatus':
                          return (
                            <td key={col.id} className={densityPadding}>
                              {order.invoiceStatus === 'invoiced' ? '已开票' : '未开票'}
                            </td>
                          );

                        case 'actions':
                          return (
                            <td key={col.id} className={`${densityPadding} text-right`}>
                              <div className="flex items-center justify-end gap-1.5 relative">
                                <button
                                  onClick={() => onOpenDetail(order)}
                                  className={actionButton.icon}
                                  title="查看详情"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>

                                <button
                                  onClick={() => onOpenEdit(order)}
                                  className={actionButton.icon}
                                  title="编辑条目"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          );

                        default:
                          return null;
                      }
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          <span>
            显示第 {(currentPage - 1) * pageSize + 1} 到 Math.min({currentPage * pageSize}, {sortedOrders.length}) 条，共 {sortedOrders.length} 条
          </span>

          <div className="flex items-center gap-1.5">
            <span>每页:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-800 dark:text-gray-200"
            >
              <option value={10}>10 条/页</option>
              <option value={20}>20 条/页</option>
              <option value={50}>50 条/页</option>
            </select>
          </div>
        </div>

        {/* Page Switch Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={actionButton.secondary}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="px-3 font-semibold text-gray-700 dark:text-gray-200">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={actionButton.secondary}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

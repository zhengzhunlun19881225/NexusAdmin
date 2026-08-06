import React from 'react';
import { OrderItem, OrderStatus } from '../types';
import { Eye, Edit, Clock, Truck, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

interface KanbanViewProps {
  orders: OrderItem[];
  onOpenDetail: (order: OrderItem) => void;
  onOpenEdit: (order: OrderItem) => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const KANBAN_COLUMNS: { id: OrderStatus; title: string; color: string; icon: React.ElementType }[] = [
  { id: 'pending', title: '待审核', color: 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20', icon: Clock },
  { id: 'processing', title: '处理中', color: 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20', icon: Clock },
  { id: 'shipped', title: '已发货', color: 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20', icon: Truck },
  { id: 'completed', title: '已完成', color: 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20', icon: CheckCircle2 },
  { id: 'refunded', title: '已退款', color: 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20', icon: RotateCcw },
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  orders,
  onOpenDetail,
  onOpenEdit,
  onUpdateStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.id);

        return (
          <div
            key={col.id}
            className={`rounded-2xl border-t-4 border-x border-b border-gray-200/80 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 p-3 flex flex-col h-[650px] ${col.color}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60 dark:border-gray-800">
              <span className="font-bold text-xs text-gray-800 dark:text-gray-200">
                {col.title}
              </span>
              <span className="rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs font-bold text-gray-600 dark:text-gray-300">
                {colOrders.length}
              </span>
            </div>

            {/* Kanban Column Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {colOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {order.orderNo}
                    </span>
                    <span className="text-xs text-gray-400">{order.category}</span>
                  </div>

                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {order.customerName}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                    {order.products[0]?.name}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-sm">
                    <span className="font-bold text-gray-900 dark:text-white">
                      ￥{order.totalAmount.toLocaleString()}
                    </span>

                    <button
                      onClick={() => onOpenDetail(order)}
                      className="rounded p-1 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

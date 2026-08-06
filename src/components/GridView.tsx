import React from 'react';
import { Eye, Edit, Clock, Tag, ShoppingCart, UserCheck, ShieldAlert } from 'lucide-react';
import { OrderItem } from '../types';

interface GridViewProps {
  orders: OrderItem[];
  onOpenDetail: (order: OrderItem) => void;
  onOpenEdit: (order: OrderItem) => void;
}

export const GridView: React.FC<GridViewProps> = ({
  orders,
  onOpenDetail,
  onOpenEdit,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            {/* Header: Order No & Status */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-3">
              <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {order.orderNo}
              </span>
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {order.status}
              </span>
            </div>

            {/* Customer & Product */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={order.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={order.customerName}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20 shrink-0"
              />
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {order.customerName}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {order.customerPhone}
                </span>
              </div>
            </div>

            {/* Products summary */}
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-2.5 text-sm text-gray-600 dark:text-gray-300 mb-3">
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {order.products[0]?.name}
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                <span>数量: {order.products[0]?.quantity} 件</span>
                <span>分类: {order.category}</span>
              </div>
            </div>
          </div>

          {/* Footer: Price & Actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">订单总额</span>
              <div className="text-base font-bold text-gray-900 dark:text-white">
                ￥{order.totalAmount.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenDetail(order)}
                className="flex items-center gap-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 text-xs font-medium transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>详情</span>
              </button>
              <button
                onClick={() => onOpenEdit(order)}
                className="rounded-xl border border-gray-200 dark:border-gray-700 p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

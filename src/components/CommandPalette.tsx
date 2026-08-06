import React, { useState } from 'react';
import { Search, X, FileText, ShoppingBag, Settings, User, ArrowRight } from 'lucide-react';
import { MENU_TREE, MOCK_ORDERS } from '../mockData';
import { OrderItem } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (order: OrderItem) => void;
  onNavigateMenu: (path: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectOrder,
  onNavigateMenu,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedOrders = query.trim()
    ? MOCK_ORDERS.filter(
        (o) =>
          o.orderNo.toLowerCase().includes(query.toLowerCase()) ||
          o.customerName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-xs p-4 pt-20 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <Search className="h-5 w-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索订单、客户姓名、全局功能或快捷菜单..."
            className="w-full bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none placeholder-gray-400"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-3 text-xs custom-scrollbar">
          {query.trim() && (
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                匹配的订单列表 ({matchedOrders.length})
              </div>
              {matchedOrders.length === 0 ? (
                <p className="text-gray-400 px-2 py-1">未搜寻到相关匹配订单数据。</p>
              ) : (
                matchedOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      onSelectOrder(o);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag className="h-4 w-4 text-indigo-500" />
                      <div className="text-left">
                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                          {o.orderNo}
                        </span>
                        <p className="text-xs text-gray-500">{o.customerName}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))
              )}
            </div>
          )}

          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
              系统功能快捷入口
            </div>
            {MENU_TREE.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onNavigateMenu(m.path || m.id);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-200">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span>{m.title}</span>
                </div>
                <span className="text-xs text-gray-400">直达菜单</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-xs text-gray-400 flex justify-between px-4">
          <span>按 ESC 退出</span>
          <span>智汇云台 NexusAdmin 交互控制台</span>
        </div>
      </div>
    </div>
  );
};

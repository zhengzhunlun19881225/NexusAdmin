import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Package,
  CreditCard,
  ShieldAlert,
  CheckCircle2,
  Send,
  FileText,
  Printer,
  Copy
} from 'lucide-react';
import { OrderItem } from '../types';
import { actionButton } from '../uiTheme';

interface DetailDrawerProps {
  order: OrderItem | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderItem['status']) => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'timeline' | 'logs'>('info');
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const copyOrderNo = () => {
    navigator.clipboard.writeText(order.orderNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20">
              单
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-gray-900 dark:text-white">
                  {order.orderNo}
                </span>
                <button
                  onClick={copyOrderNo}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25"
                  title="复制订单号"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {copied && <span className="text-xs text-emerald-600 font-bold">已复制!</span>}
              </div>
              <p className="text-xs text-gray-400">下单时间: {order.createdAt}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={actionButton.icon}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Quick Action Header Bar */}
        <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900 px-5 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-indigo-700 dark:text-indigo-300 font-medium">当前状态:</span>
            <span className="font-bold text-indigo-900 dark:text-indigo-100 uppercase">
              {order.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateStatus(order.id, 'processing')}
              className={actionButton.primary}
            >
              通过审核
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, 'refunded')}
              className={actionButton.dangerSoft}
            >
              申请退款
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside Drawer */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 px-5 text-sm font-medium text-gray-500">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-gray-800'
            }`}
          >
            订单概览明细
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-gray-800'
            }`}
          >
            履约物流时序
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent hover:text-gray-800'
            }`}
          >
            审计操作日志
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {activeTab === 'info' && (
            <>
              {/* Customer Info Box */}
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-indigo-500" />
                  订购客户联系信息
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-400">客户姓名:</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">联系电话:</span>
                    <p className="font-mono text-gray-800 dark:text-gray-200 mt-0.5">
                      {order.customerPhone}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">电子邮箱:</span>
                    <p className="font-mono text-gray-800 dark:text-gray-200 mt-0.5 truncate">
                      {order.customerEmail}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">负责人员:</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                      {order.assignee.name}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-gray-400">配送收货地址:</span>
                    <p className="text-gray-800 dark:text-gray-200 mt-0.5">
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Items Table */}
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-indigo-500" />
                  购入商品清单
                </h4>

                <div className="space-y-2">
                  {order.products.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-white dark:bg-gray-900 p-3 border border-gray-100 dark:border-gray-800 text-sm"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">SKU: {p.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          ￥{p.price.toLocaleString()} x {p.quantity}
                        </div>
                        <div className="text-xs text-indigo-600 font-semibold">
                          小计: ￥{(p.price * p.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
                  <span className="font-bold text-gray-700 dark:text-gray-300">订单结算金额</span>
                  <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                    ￥{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Note / Memo */}
              {order.notes && (
                <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 dark:bg-amber-950/30 p-4 text-sm">
                  <h5 className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                    客服人工备注 memo
                  </h5>
                  <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                    {order.notes}
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4 pl-4 border-l-2 border-indigo-200 dark:border-indigo-900 text-sm my-2">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950"></span>
                <p className="font-bold text-gray-900 dark:text-white">订单创建成功</p>
                <p className="text-gray-400 text-xs">{order.createdAt}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">系统已完成安全拦截与风险评分检测。</p>
              </div>

              <div className="relative pt-3">
                <span className="absolute -left-[21px] top-4 h-3 w-3 rounded-full bg-blue-500"></span>
                <p className="font-bold text-gray-900 dark:text-white">对公资金确认入账</p>
                <p className="text-gray-400 text-xs">2026-07-28 09:20:00</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">财务核实无误，状态变更。</p>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2 text-sm font-mono">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-2.5">
                <span className="text-indigo-600 font-bold">[2026-07-28 09:14]</span> 用户提交订单，IP: 183.14.92.11
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-2.5">
                <span className="text-indigo-600 font-bold">[2026-07-28 09:15]</span> 风控引擎通过校验，分配给负责人 {order.assignee.name}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2 bg-gray-50/50 dark:bg-gray-800/40">
          <button
            onClick={() => window.print()}
            className={actionButton.secondary}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>打印发货单</span>
          </button>
          <button
            onClick={onClose}
            className={actionButton.primary}
          >
            关闭详情面板
          </button>
        </div>
      </div>
    </div>
  );
};

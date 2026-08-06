import React, { useState } from 'react';
import { X, Plus, Trash2, Check, ShoppingBag } from 'lucide-react';
import { OrderItem, OrderStatus, PaymentMethod } from '../types';
import { ASSIGNEE_OPTIONS, CATEGORY_OPTIONS } from '../mockData';

interface OrderFormModalProps {
  orderToEdit?: OrderItem | null;
  onClose: () => void;
  onSave: (order: Partial<OrderItem>) => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  orderToEdit,
  onClose,
  onSave,
}) => {
  const [customerName, setCustomerName] = useState(orderToEdit?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(orderToEdit?.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(orderToEdit?.customerEmail || '');
  const [category, setCategory] = useState(orderToEdit?.category || '数码电子');
  const [status, setStatus] = useState<OrderStatus>(orderToEdit?.status || 'pending');
  const [assigneeId, setAssigneeId] = useState(orderToEdit?.assignee?.id || 'usr-1');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(orderToEdit?.paymentMethod || 'wechat');
  const [deliveryAddress, setDeliveryAddress] = useState(orderToEdit?.deliveryAddress || '');
  const [productName, setProductName] = useState(orderToEdit?.products[0]?.name || '');
  const [productPrice, setProductPrice] = useState(orderToEdit?.products[0]?.price || 1999);
  const [productQty, setProductQty] = useState(orderToEdit?.products[0]?.quantity || 1);
  const [notes, setNotes] = useState(orderToEdit?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAssignee = ASSIGNEE_OPTIONS.find((a) => a.id === assigneeId) || ASSIGNEE_OPTIONS[1];

    const payload: Partial<OrderItem> = {
      id: orderToEdit?.id || `ord-${Date.now()}`,
      orderNo: orderToEdit?.orderNo || `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      customerEmail: customerEmail || `${customerName.toLowerCase()}@example.com`,
      category,
      status,
      assignee: {
        id: selectedAssignee.id,
        name: selectedAssignee.name,
        avatar: selectedAssignee.avatar,
      },
      paymentMethod,
      deliveryAddress,
      products: [
        {
          name: productName || '标准数码办公装备',
          quantity: Number(productQty),
          price: Number(productPrice),
          sku: 'SKU-CUSTOM-001',
        },
      ],
      totalAmount: Number(productPrice) * Number(productQty),
      createdAt: orderToEdit?.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
      channel: orderToEdit?.channel || 'web',
      priority: orderToEdit?.priority || 'normal',
      invoiceStatus: orderToEdit?.invoiceStatus || 'processing',
      riskLevel: orderToEdit?.riskLevel || 'low',
      notes,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {orderToEdit ? '编辑订单条目数据' : '创建新订单'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                客户姓名 *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="例如: 张先生 (科技公司)"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                联系手机号 *
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="例如: 13800138000"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                所属商品类目
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-gray-900 dark:text-white"
              >
                {CATEGORY_OPTIONS.filter((c) => c.value !== 'all').map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                订单审核状态
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-gray-900 dark:text-white"
              >
                <option value="pending">待审核 (Pending)</option>
                <option value="processing">处理中 (Processing)</option>
                <option value="shipped">已发货 (Shipped)</option>
                <option value="completed">已完成 (Completed)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                指派负责人员
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-gray-900 dark:text-white"
              >
                {ASSIGNEE_OPTIONS.filter((a) => a.id !== 'all').map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                支付通道
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-gray-900 dark:text-white"
              >
                <option value="wechat">微信支付</option>
                <option value="alipay">支付宝</option>
                <option value="credit_card">信用卡</option>
                <option value="bank_transfer">银行对公转账</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl space-y-2 border border-gray-200/60 dark:border-gray-700">
            <span className="font-bold text-gray-900 dark:text-white">商品明细</span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="商品名称"
                className="col-span-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5"
              />
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                placeholder="单价"
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5"
              />
              <input
                type="number"
                value={productQty}
                onChange={(e) => setProductQty(Number(e.target.value))}
                placeholder="数量"
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              收货详细地址
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="例如: 北京市海淀区中关村南大街1号"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 text-gray-900 dark:text-white"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs"
            >
              保存订单条目
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

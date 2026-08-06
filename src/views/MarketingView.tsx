import React, { useState } from 'react';
import {
  Ticket,
  Tag,
  Zap,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  PauseCircle,
  X,
  Sparkles,
  Calendar,
  Percent,
} from 'lucide-react';
import { CouponItem, MarketingActivity } from '../types';

interface MarketingViewProps {
  coupons: CouponItem[];
  setCoupons: React.Dispatch<React.SetStateAction<CouponItem[]>>;
  activities: MarketingActivity[];
  setActivities: React.Dispatch<React.SetStateAction<MarketingActivity[]>>;
  showToast: (msg: string) => void;
  subPath?: string;
}

export const MarketingView: React.FC<MarketingViewProps> = ({
  coupons,
  setCoupons,
  activities,
  setActivities,
  showToast,
  subPath = 'coupons',
}) => {
  const [activeTab, setActiveTab] = useState<'coupons' | 'activities'>(
    subPath === 'activities' ? 'activities' : 'coupons'
  );

  // Modal State for Coupon
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);

  const [couponForm, setCouponForm] = useState<Partial<CouponItem>>({
    title: '',
    code: '',
    discountType: 'fixed',
    value: 50,
    minSpend: 200,
    totalQuantity: 1000,
    validUntil: '2026-12-31',
    status: 'active',
  });

  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({
      title: '',
      code: `CPN${Math.floor(10000 + Math.random() * 90000)}`,
      discountType: 'fixed',
      value: 100,
      minSpend: 500,
      totalQuantity: 1000,
      validUntil: '2026-12-31',
      status: 'active',
    });
    setIsCouponModalOpen(true);
  };

  const handleOpenEditCoupon = (cpn: CouponItem) => {
    setEditingCoupon(cpn);
    setCouponForm({ ...cpn });
    setIsCouponModalOpen(true);
  };

  const handleDeleteCoupon = (id: string, title: string) => {
    if (window.confirm(`确定要注销优惠券 "${title}" 吗？`)) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      showToast(`优惠券 "${title}" 已成功移除`);
    }
  };

  const handleToggleCouponStatus = (cpn: CouponItem) => {
    const nextStatus: CouponItem['status'] = cpn.status === 'active' ? 'paused' : 'active';
    setCoupons((prev) =>
      prev.map((item) => (item.id === cpn.id ? { ...item, status: nextStatus } : item))
    );
    showToast(`优惠券 "${cpn.title}" 状态已更新`);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.title?.trim() || !couponForm.code?.trim()) {
      alert('请填写优惠券名称和兑换代码！');
      return;
    }

    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id ? ({ ...c, ...couponForm } as CouponItem) : c
        )
      );
      showToast(`优惠券 "${couponForm.title}" 配置已更新`);
    } else {
      const newCoupon: CouponItem = {
        id: `cpn-${Date.now()}`,
        title: couponForm.title || '满减优惠券',
        code: couponForm.code || 'CODE2026',
        discountType: (couponForm.discountType as any) || 'fixed',
        value: Number(couponForm.value) || 50,
        minSpend: Number(couponForm.minSpend) || 100,
        totalQuantity: Number(couponForm.totalQuantity) || 1000,
        issuedCount: 0,
        usedCount: 0,
        validUntil: couponForm.validUntil || '2026-12-31',
        status: 'active',
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      showToast(`创建新优惠券 "${newCoupon.title}" 成功！`);
    }

    setIsCouponModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Ticket className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span>营销与优惠券 (促销转化 & 限时秒杀)</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            优惠券精细化发放、限时秒杀活动排期与促销成效监控
          </p>
        </div>

        {activeTab === 'coupons' && (
          <button
            onClick={handleOpenAddCoupon}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>创建新优惠券</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'coupons'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>优惠券配置 ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'activities'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>限时秒杀与促销活动 ({activities.length})</span>
        </button>
      </div>

      {/* Coupons Tab Content */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block rounded-full bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1.5">
                    {coupon.discountType === 'fixed' ? '立减券' : '折扣券'}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    {coupon.title}
                  </h3>
                  <p className="font-mono text-xs text-gray-400 mt-0.5">
                    优惠码: <span className="font-bold text-gray-700 dark:text-gray-200">{coupon.code}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                    {coupon.discountType === 'fixed' ? `￥${coupon.value}` : `${coupon.value / 10}折`}
                  </span>
                  <p className="text-xs text-gray-400">满 ￥{coupon.minSpend} 可用</p>
                </div>
              </div>

              {/* Usage Progress */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1 font-mono">
                  <span>已核销使用: {coupon.usedCount} 张</span>
                  <span>总发行: {coupon.totalQuantity} 张</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${Math.min(100, (coupon.usedCount / coupon.totalQuantity) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
                <span className="text-xs text-gray-400">有效期至: {coupon.validUntil}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleCouponStatus(coupon)}
                    className="rounded-lg border border-gray-200 dark:border-gray-800 px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300"
                  >
                    {coupon.status === 'active' ? '暂停' : '启用'}
                  </button>

                  <button
                    onClick={() => handleOpenEditCoupon(coupon)}
                    className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteCoupon(coupon.id, coupon.title)}
                    className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Marketing Activities Tab */}
      {activeTab === 'activities' && (
        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-100 dark:bg-amber-900/60 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-200">
                      {act.type}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      {act.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{act.discountInfo}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-gray-400 block text-xs">活动起止时间</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {act.startTime} ~ {act.endTime}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-gray-400 block text-xs">参与商品数</span>
                  <span className="font-bold text-indigo-600">{act.participatingProductsCount} 款商品</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {editingCoupon ? '编辑优惠券规则' : '创建新营销优惠券'}
              </h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-gray-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  优惠券标题名称
                </label>
                <input
                  type="text"
                  required
                  value={couponForm.title || ''}
                  onChange={(e) => setCouponForm({ ...couponForm, title: e.target.value })}
                  placeholder="例如：三季度数码满减券"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-2.5 text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    兑换代码 (Code)
                  </label>
                  <input
                    type="text"
                    required
                    value={couponForm.code || ''}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-2.5 text-gray-900 dark:text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    优惠类型
                  </label>
                  <select
                    value={couponForm.discountType || 'fixed'}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, discountType: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-2.5 text-gray-900 dark:text-white focus:outline-none"
                  >
                    <option value="fixed">固定金额立减</option>
                    <option value="percent">百分比折扣</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    优惠数值 (￥或折)
                  </label>
                  <input
                    type="number"
                    value={couponForm.value || 0}
                    onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-2.5 text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    最低消费门槛 (￥)
                  </label>
                  <input
                    type="number"
                    value={couponForm.minSpend || 0}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, minSpend: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-2.5 text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-2 font-semibold text-gray-600 dark:text-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700"
                >
                  保存发行
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

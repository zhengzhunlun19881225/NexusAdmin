import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Save,
  X,
  Calendar,
  User,
  Tag,
  CreditCard,
  DollarSign,
  Globe,
  AlertTriangle,
  FileCheck,
  Check,
  Bookmark,
  PlusCircle,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterState, OrderStatus, PaymentMethod } from '../types';
import { CATEGORY_OPTIONS, ASSIGNEE_OPTIONS, PRESET_FILTERS } from '../mockData';

interface FilterSectionProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  onSavePreset: (name: string) => void;
  activeFilterCount: number;
  totalResultsCount: number;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filterState,
  setFilterState,
  onReset,
  onSavePreset,
  activeFilterCount,
  totalResultsCount,
}) => {
  // Collapsed / Expanded fold state (Default: folded to show only 5 fixed fields)
  const [isExpanded, setIsExpanded] = useState(false);
  const [savePresetModalOpen, setSavePresetModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Status helper toggles
  const handleStatusToggle = (st: OrderStatus) => {
    setFilterState((prev) => {
      const exists = prev.status.includes(st);
      return {
        ...prev,
        status: exists ? prev.status.filter((s) => s !== st) : [...prev.status, st],
      };
    });
  };

  const handlePaymentToggle = (pm: PaymentMethod) => {
    setFilterState((prev) => {
      const exists = prev.paymentMethods.includes(pm);
      return {
        ...prev,
        paymentMethods: exists
          ? prev.paymentMethods.filter((p) => p !== pm)
          : [...prev.paymentMethods, pm],
      };
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESET_FILTERS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(presetId);
    setFilterState((prev) => ({
      ...prev,
      ...preset.filters,
    }));
  };

  // Count active filters specifically in the folded section (>5 conditions)
  const countFoldedActiveFilters = (): number => {
    let count = 0;
    if (filterState.paymentMethods.length > 0) count++;
    if (filterState.minAmount || filterState.maxAmount) count++;
    if (filterState.channel !== 'all') count++;
    if (filterState.priority !== 'all') count++;
    if (filterState.invoiceStatus !== 'all') count++;
    if (filterState.riskLevel !== 'all') count++;
    return count;
  };

  const foldedActiveCount = countFoldedActiveFilters();

  return (
    <div className="rounded-2xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-xs transition-all duration-200 mb-5">
      {/* Top Filter Bar Header: Title, Preset Quick Views, Save Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-gray-100 dark:border-gray-800/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Filter className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-sm text-gray-900 dark:text-white">
            高级数据筛选过滤
          </span>
          <span className="text-xs text-gray-400 font-normal">
            (支持固定前5项 + 动态多条件展开)
          </span>

          {activeFilterCount > 0 && (
            <span className="ml-1 inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">
              已生效 {activeFilterCount} 项条件
            </span>
          )}
        </div>

        {/* Preset View Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
            <Bookmark className="h-3 w-3" />
            常用方案:
          </span>
          {PRESET_FILTERS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                activePresetId === preset.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {preset.name}
            </button>
          ))}

          <button
            onClick={() => setSavePresetModalOpen(true)}
            className="flex items-center gap-1 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 px-2.5 py-1 text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 transition-colors"
            title="保存当前筛选条件组合"
          >
            <Save className="h-3 w-3" />
            <span>保存当前方案</span>
          </button>
        </div>
      </div>

      {/* FIXED 5 PRIMARY CONDITIONS SECTION (固定5项核心查询条件) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* FIELD 1: 关键词搜索 (Order No / Customer / Phone) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            1. 关键词搜索
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filterState.keyword}
              onChange={(e) => {
                setActivePresetId(null);
                setFilterState((prev) => ({ ...prev, keyword: e.target.value }));
              }}
              placeholder="订单号 / 客户 / 电话"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 py-2 pl-8 pr-7 text-xs text-gray-900 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-gray-400"
            />
            {filterState.keyword && (
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, keyword: '' }))}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* FIELD 2: 订单状态 (Order Status) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            2. 订单状态 ({filterState.status.length > 0 ? filterState.status.length : '全部'})
          </label>
          <div className="relative">
            <select
              value={filterState.status[0] || 'all'}
              onChange={(e) => {
                setActivePresetId(null);
                const val = e.target.value;
                setFilterState((prev) => ({
                  ...prev,
                  status: val === 'all' ? [] : [val as OrderStatus],
                }));
              }}
              className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 py-2 px-3 pr-8 text-xs text-gray-900 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="all">全部状态 (All Status)</option>
              <option value="pending">⏳ 待处理 (Pending)</option>
              <option value="processing">⚙️ 处理中 (Processing)</option>
              <option value="shipped">🚚 已发货 (Shipped)</option>
              <option value="completed">✅ 已完成 (Completed)</option>
              <option value="refunded">↩️ 已退款 (Refunded)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* FIELD 3: 下单时间预设/区间 (Date Range) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            3. 下单时间
          </label>
          <div className="relative">
            <select
              value={filterState.dateRange.preset || 'all'}
              onChange={(e) => {
                setActivePresetId(null);
                setFilterState((prev) => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, preset: e.target.value },
                }));
              }}
              className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 py-2 px-3 pr-8 text-xs text-gray-900 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="all">不限时间 (Anytime)</option>
              <option value="today">📅 今天 (Today)</option>
              <option value="last_7_days">📅 近 7 天 (Last 7 Days)</option>
              <option value="this_month">📅 本月至今 (This Month)</option>
              <option value="custom">⚙️ 自定义时间段 (Custom)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* FIELD 4: 商品分类 (Category) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            4. 商品分类
          </label>
          <div className="relative">
            <select
              value={filterState.category}
              onChange={(e) => {
                setActivePresetId(null);
                setFilterState((prev) => ({ ...prev, category: e.target.value }));
              }}
              className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 py-2 px-3 pr-8 text-xs text-gray-900 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* FIELD 5: 负责人员 (Assignee) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            5. 负责人员
          </label>
          <div className="relative">
            <select
              value={filterState.assigneeId}
              onChange={(e) => {
                setActivePresetId(null);
                setFilterState((prev) => ({ ...prev, assigneeId: e.target.value }));
              }}
              className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 py-2 px-3 pr-8 text-xs text-gray-900 dark:text-white focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              {ASSIGNEE_OPTIONS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* FOLD / EXPAND TRIGGER BAR (>5 Conditions Toggle) */}
      <div className="mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800/60">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 px-3.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-2xs group"
          id="toggle-folded-filters-btn"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-500 group-hover:rotate-90 transition-transform duration-300" />
          <span>
            {isExpanded ? '收起多余筛选条件' : '展开更多高级条件 (包含 6 个附加条件)'}
          </span>

          {foldedActiveCount > 0 && !isExpanded && (
            <span className="rounded-full bg-amber-500 text-white px-1.5 py-0.2 text-xs font-bold">
              {foldedActiveCount} 生效
            </span>
          )}

          {isExpanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          )}
        </button>

        {/* Action Buttons: Query & Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            id="reset-filter-btn"
          >
            <RotateCcw className="h-3.5 w-3.5 text-gray-400" />
            <span>重置条件</span>
          </button>

          <div className="text-xs text-gray-400 px-1 hidden sm:block">
            共 <span className="font-semibold text-gray-700 dark:text-gray-200">{totalResultsCount}</span> 笔数据
          </div>
        </div>
      </div>

      {/* FOLDED EXTENDED CONDITIONS AREA (条件 #6 到 #11) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 bg-gray-50/40 dark:bg-gray-800/20 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/50">
              {/* FIELD 6: 支付方式 (Payment Methods) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <CreditCard className="h-3 w-3 text-indigo-500" />
                  6. 支付方式
                </label>
                <select
                  value={filterState.paymentMethods[0] || 'all'}
                  onChange={(e) => {
                    setActivePresetId(null);
                    const val = e.target.value;
                    setFilterState((prev) => ({
                      ...prev,
                      paymentMethods: val === 'all' ? [] : [val as PaymentMethod],
                    }));
                  }}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1.5 px-2.5 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">不限支付渠道</option>
                  <option value="wechat">💚 微信支付 (WeChat)</option>
                  <option value="alipay">💙 支付宝 (Alipay)</option>
                  <option value="credit_card">💳 信用卡 (Card)</option>
                  <option value="bank_transfer">🏦 银行对公转账 (Bank)</option>
                </select>
              </div>

              {/* FIELD 7: 订单金额区间 (Amount Min ~ Max) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-indigo-500" />
                  7. 订单金额区间 (￥)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={filterState.minAmount}
                    onChange={(e) => {
                      setActivePresetId(null);
                      setFilterState((prev) => ({ ...prev, minAmount: e.target.value }));
                    }}
                    placeholder="最低"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1.5 px-2 text-xs text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <span className="text-gray-400 text-xs">-</span>
                  <input
                    type="number"
                    value={filterState.maxAmount}
                    onChange={(e) => {
                      setActivePresetId(null);
                      setFilterState((prev) => ({ ...prev, maxAmount: e.target.value }));
                    }}
                    placeholder="最高"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1.5 px-2 text-xs text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* FIELD 8: 渠道来源 (Source Channel) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <Globe className="h-3 w-3 text-indigo-500" />
                  8. 渠道来源
                </label>
                <select
                  value={filterState.channel}
                  onChange={(e) => {
                    setActivePresetId(null);
                    setFilterState((prev) => ({ ...prev, channel: e.target.value }));
                  }}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1.5 px-2.5 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">不限渠道</option>
                  <option value="web">🌐 官网 Web 网页</option>
                  <option value="mini_app">📱 微信小程序</option>
                  <option value="ios">🍎 iOS 原生 App</option>
                  <option value="android">🤖 Android 客户端</option>
                  <option value="offline">🏪 线下展会/门店</option>
                </select>
              </div>

              {/* FIELD 9: 履约优先级 (Priority) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <Tag className="h-3 w-3 text-indigo-500" />
                  9. 履约优先级
                </label>
                <select
                  value={filterState.priority}
                  onChange={(e) => {
                    setActivePresetId(null);
                    setFilterState((prev) => ({ ...prev, priority: e.target.value }));
                  }}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1.5 px-2.5 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">不限优先级</option>
                  <option value="high">🔴 特急 / 高优先级</option>
                  <option value="normal">🔵 普通优先</option>
                  <option value="low">⚪ 低优先级</option>
                </select>
              </div>

              {/* FIELD 10: 发票开具状态 (Invoice Status) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <FileCheck className="h-3 w-3 text-indigo-500" />
                  10. 发票状态
                </label>
                <select
                  value={filterState.invoiceStatus}
                  onChange={(e) => {
                    setActivePresetId(null);
                    setFilterState((prev) => ({ ...prev, invoiceStatus: e.target.value }));
                  }}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1.5 px-2.5 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">不限发票状态</option>
                  <option value="invoiced">已开具发票</option>
                  <option value="uninvoiced">未申请发票</option>
                  <option value="processing">开票审核中</option>
                </select>
              </div>

              {/* FIELD 11: 风险等级 (Risk Level) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-indigo-500" />
                  11. 风控风险等级
                </label>
                <select
                  value={filterState.riskLevel}
                  onChange={(e) => {
                    setActivePresetId(null);
                    setFilterState((prev) => ({ ...prev, riskLevel: e.target.value }));
                  }}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1.5 px-2.5 text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">不限风控等级</option>
                  <option value="low">🟢 低风险 (正常)</option>
                  <option value="moderate">🟡 中风险 (需要核验)</option>
                  <option value="high">🔴 高风险预警</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVE FILTER TAG PILLS (已选可移除条件标签条) */}
      {activeFilterCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-400 text-xs">当前已选条件:</span>

          {filterState.keyword && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300">
              关键词: "{filterState.keyword}"
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, keyword: '' }))}
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filterState.status.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300">
              状态: {filterState.status.join(', ')}
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, status: [] }))}
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filterState.category !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300">
              分类: {filterState.category}
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, category: 'all' }))}
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filterState.assigneeId !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300">
              负责人: {ASSIGNEE_OPTIONS.find((a) => a.id === filterState.assigneeId)?.name}
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, assigneeId: 'all' }))}
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filterState.paymentMethods.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300">
              支付: {filterState.paymentMethods.join(', ')}
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, paymentMethods: [] }))}
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {(filterState.minAmount || filterState.maxAmount) && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300">
              金额: {filterState.minAmount || '0'} ~ {filterState.maxAmount || '∞'} ￥
              <button
                onClick={() =>
                  setFilterState((prev) => ({ ...prev, minAmount: '', maxAmount: '' }))
                }
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filterState.riskLevel !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300">
              风控: {filterState.riskLevel}
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, riskLevel: 'all' }))}
                className="hover:text-rose-500 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-rose-600 underline ml-2"
          >
            清空所有条件
          </button>
        </div>
      )}

      {/* Modal: Save Filter Preset */}
      {savePresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              保存当前筛选方案
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              将当前的条件组合保存为快捷方案，方便日后一键快捷应用。
            </p>

            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="请输入方案名称，例如: 华东大额特急单"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSavePresetModalOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (newPresetName.trim()) {
                    onSavePreset(newPresetName.trim());
                    setSavePresetModalOpen(false);
                    setNewPresetName('');
                  }
                }}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                确定保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

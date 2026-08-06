import React from 'react';
import { ShoppingCart, Clock, DollarSign, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { OrderItem } from '../types';

interface StatSummaryCardsProps {
  orders: OrderItem[];
}

export const StatSummaryCards: React.FC<StatSummaryCardsProps> = ({ orders }) => {
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const highRiskCount = orders.filter((o) => o.riskLevel === 'high' || o.status === 'refunded').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
      {/* Total Orders Card */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">全部订单总数</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <ShoppingCart className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {totalCount.toLocaleString()} <span className="text-xs font-normal text-gray-400">笔</span>
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-0.5">
            <TrendingUp className="h-3 w-3" />
            +12.8%
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-400">较上周增长 142 笔</div>
      </div>

      {/* Pending Approval Card */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">待人工审核订单</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
            {pendingCount} <span className="text-xs font-normal text-gray-400">笔</span>
          </span>
          <span className="inline-flex items-center text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-md">
            需加急 3 笔
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-400">平均审核耗时 8.2 分钟</div>
      </div>

      {/* Total Revenue Card */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">当前已选总成交额</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            ￥{totalRevenue.toLocaleString()}
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-0.5">
            <TrendingUp className="h-3 w-3" />
            +8.4%
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-400">包含线上及线下渠道汇总</div>
      </div>

      {/* Abnormal & Risk Card */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">高风险与退款监控</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {highRiskCount} <span className="text-xs font-normal text-gray-400">笔异常</span>
          </span>
          <span className="inline-flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 gap-0.5">
            <TrendingDown className="h-3 w-3" />
            -0.4%
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-400">智能风控防护开启中</div>
      </div>
    </div>
  );
};

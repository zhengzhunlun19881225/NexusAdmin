import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  PieChart as PieIcon,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { OrderItem } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';

interface AnalyticsViewProps {
  orders: OrderItem[];
  showToast: (msg: string) => void;
  subPath?: string;
}

const MONTHLY_FINANCE_DATA = [
  { month: '1月', revenue: 320000, cost: 190000, profit: 130000 },
  { month: '2月', revenue: 280000, cost: 165000, profit: 115000 },
  { month: '3月', revenue: 410000, cost: 240000, profit: 170000 },
  { month: '4月', revenue: 390000, cost: 225000, profit: 165000 },
  { month: '5月', revenue: 520000, cost: 300000, profit: 220000 },
  { month: '6月', revenue: 680000, cost: 390000, profit: 290000 },
  { month: '7月', revenue: 740000, cost: 420000, profit: 320000 },
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  orders,
  showToast,
  subPath = 'sales',
}) => {
  const [activeTab, setActiveTab] = useState<'sales' | 'finance'>(
    subPath === 'finance' ? 'finance' : 'sales'
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleExportStatement = () => {
    const csvContent =
      '月份,总销售额(￥),综合成本(￥),净利润(￥),毛利率(%)\n' +
      MONTHLY_FINANCE_DATA.map(
        (m) =>
          `"${m.month}",${m.revenue},${m.cost},${m.profit},"${((m.profit / m.revenue) * 100).toFixed(1)}%"`
      ).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NexusAdmin_Finance_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('财务月度对账报表已成功导出为 CSV！');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span>数据决策看板 (转化漏斗 & 财务对账)</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            多维度商业智能分析、渠道 ROI 归因与财务账单实时稽核
          </p>
        </div>

        <button
          onClick={handleExportStatement}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          <span>导出月度对账报表</span>
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'sales'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>销售转化与漏斗分析</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'finance'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>财务营收对账明细</span>
        </button>
      </div>

      {/* Main Chart Section */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              {activeTab === 'sales' ? '2026 年销售与利润增长曲线' : '2026 年财务月度成本与利润对账'}
            </h3>
            <p className="text-xs text-gray-400">数据源: 华东云仓与全渠道结算中心</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 block">平台当前总成交额</span>
            <span className="font-mono text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              ￥{totalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY_FINANCE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip formatter={(value: any) => [`￥${Number(value).toLocaleString()}`, '']} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="revenue" name="销售总额" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="cost" name="综合成本" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name="净利润" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Financial Statement Table */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            月度财务对账汇总表
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono">
            <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-sm text-gray-500 font-semibold border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="p-3.5 pl-5">结算月份</th>
                <th className="p-3.5">销售总额 (￥)</th>
                <th className="p-3.5">综合成本 (￥)</th>
                <th className="p-3.5">净利润 (￥)</th>
                <th className="p-3.5">毛利率 (%)</th>
                <th className="p-3.5 pr-5 text-right">对账状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300">
              {MONTHLY_FINANCE_DATA.map((item) => {
                const margin = ((item.profit / item.revenue) * 100).toFixed(1);

                return (
                  <tr key={item.month} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30">
                    <td className="p-3.5 pl-5 font-bold text-gray-900 dark:text-white">
                      2026年{item.month}
                    </td>
                    <td className="p-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                      ￥{item.revenue.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-gray-500">
                      ￥{item.cost.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                      ￥{item.profit.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-indigo-600">{margin}%</td>
                    <td className="p-3.5 pr-5 text-right">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        <span>审计已核销</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

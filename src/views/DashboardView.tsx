import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  Sparkles,
  ChevronRight,
  Tag,
} from 'lucide-react';
import { OrderItem, ProductItem, CustomerItem } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { actionButton } from '../uiTheme';

interface DashboardViewProps {
  orders: OrderItem[];
  products: ProductItem[];
  customers: CustomerItem[];
  onNavigate: (path: string) => void;
  onOpenOrder: (order: OrderItem) => void;
}

const SALES_TREND_DATA = [
  { date: '07-22', sales: 42000, orders: 120, profit: 12600 },
  { date: '07-23', sales: 58000, orders: 165, profit: 17400 },
  { date: '07-24', sales: 51000, orders: 142, profit: 15300 },
  { date: '07-25', sales: 79000, orders: 210, profit: 23700 },
  { date: '07-26', sales: 86000, orders: 245, profit: 25800 },
  { date: '07-27', sales: 94000, orders: 280, profit: 28200 },
  { date: '07-28', sales: 112000, orders: 310, profit: 33600 },
];

const CATEGORY_SHARE = [
  { name: '数码电子', value: 48, color: '#6366f1' },
  { name: '办公设备', value: 22, color: '#3b82f6' },
  { name: '服饰鞋帽', value: 14, color: '#ec4899' },
  { name: '美妆个护', value: 10, color: '#8b5cf6' },
  { name: '家居生活', value: 6, color: '#10b981' },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  products,
  customers,
  onNavigate,
  onOpenOrder,
}) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockWarning);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold backdrop-blur-md">
                智汇云台 NexusAdmin v3.2
              </span>
              <span className="text-xs text-indigo-200">2026-07-28 运营中心</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              早安，张伟！欢迎回到华东数字运营控制台
            </h2>
            <p className="mt-1 text-xs text-indigo-100 max-w-xl">
              今日平台成交额已突破 ￥112,000 元，同比昨日增长 +18.4%。现有 {pendingOrders.length} 笔订单等待人工审核。
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('/orders/approval')}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-indigo-700 shadow-sm transition-all hover:bg-indigo-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>审核待办订单 ({pendingOrders.length})</span>
            </button>
            <button
              onClick={() => onNavigate('/products/stock')}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/25 bg-white/15 px-3 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <AlertTriangle className="h-4 w-4 text-amber-300" />
              <span>库存预警 ({lowStockProducts.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">今日总成交额</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-gray-900 dark:text-white">
              ￥{totalRevenue.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-600 font-semibold gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+18.4% 较昨日</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">今日订单笔数</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-gray-900 dark:text-white">
              {orders.length} 笔
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-600 font-semibold gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+12.1% 较昨日</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">活跃 VIP 客户</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-gray-900 dark:text-white">
              {customers.length} 人
            </div>
            <div className="mt-2 flex items-center text-xs text-emerald-600 font-semibold gap-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+8.5% 新客复购</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">在线在售 SPU</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold font-mono text-gray-900 dark:text-white">
              {products.length} 款
            </div>
            <div className="mt-2 flex items-center text-xs text-amber-600 font-semibold gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{lowStockProducts.length} 款需及时补货</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                近 7 日销售额与净利润走势
              </h3>
              <p className="text-xs text-gray-400">全渠道交易流水实况可视化</p>
            </div>
            <button
              onClick={() => onNavigate('/analytics/sales')}
              className={actionButton.ghost}
            >
              <span>进入深度分析</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} />
                <Tooltip
                  formatter={(value: any) => [`￥${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="sales" name="销售额" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="profit" name="净利润" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              品类销售占比分布
            </h3>
            <p className="text-xs text-gray-400">数码电子占比居于首位</p>
          </div>

          <div className="h-48 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_SHARE} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {CATEGORY_SHARE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value}%`, '占比']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {CATEGORY_SHARE.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-gray-600 dark:text-gray-300 truncate">{cat.name}</span>
                <span className="font-bold text-gray-900 dark:text-white ml-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Orders & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Orders Table */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                待人工审核加急订单
              </h3>
            </div>
            <button
              onClick={() => onNavigate('/orders/approval')}
              className={actionButton.ghost}
            >
              查看全部 ({pendingOrders.length})
            </button>
          </div>

          <div className="space-y-3">
            {pendingOrders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                onClick={() => onOpenOrder(order)}
                className="flex items-center justify-between rounded-xl p-3 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 hover:bg-gray-100/80 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-gray-900 dark:text-white">
                        {order.orderNo}
                      </span>
                      <span className="rounded-full bg-amber-100 dark:bg-amber-950 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                        待审核
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{order.customerName} · {order.products[0]?.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                    ￥{order.totalAmount.toLocaleString()}
                  </span>
                  <p className="text-xs text-gray-400">{order.createdAt.split(' ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operations Quick Entry */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">
              快捷核心功能入口
            </h3>
            <p className="text-xs text-gray-400 mb-4">高频运营动作直达控制</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('/orders/all')}
                className="flex flex-col items-center justify-center rounded-xl p-3 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-100/60 transition-colors text-indigo-900 dark:text-indigo-200"
              >
                <ShoppingBag className="h-5 w-5 mb-1.5 text-indigo-600" />
                <span className="text-xs font-bold">订单列表管理</span>
              </button>

              <button
                onClick={() => onNavigate('/products/list')}
                className="flex flex-col items-center justify-center rounded-xl p-3 bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 hover:bg-emerald-100/60 transition-colors text-emerald-900 dark:text-emerald-200"
              >
                <Package className="h-5 w-5 mb-1.5 text-emerald-600" />
                <span className="text-xs font-bold">商品 SPU 管理</span>
              </button>

              <button
                onClick={() => onNavigate('/customers/list')}
                className="flex flex-col items-center justify-center rounded-xl p-3 bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 hover:bg-blue-100/60 transition-colors text-blue-900 dark:text-blue-200"
              >
                <Users className="h-5 w-5 mb-1.5 text-blue-600" />
                <span className="text-xs font-bold">客户 CRM 名录</span>
              </button>

              <button
                onClick={() => onNavigate('/marketing/coupons')}
                className="flex flex-col items-center justify-center rounded-xl p-3 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-100/60 transition-colors text-indigo-900 dark:text-indigo-200"
              >
                <Tag className="h-5 w-5 mb-1.5 text-indigo-600" />
                <span className="text-xs font-bold">营销优惠券</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex items-center justify-between">
            <span>系统性能指数: 99.9% (优)</span>
            <span className="text-emerald-600 font-semibold">云服务正常</span>
          </div>
        </div>
      </div>
    </div>
  );
};

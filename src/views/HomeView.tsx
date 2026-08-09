import React from 'react';
import {
  Archive,
  BarChart3,
  Bell,
  Box,
  CheckCircle2,
  ChevronRight,
  FileText,
  LineChart as LineChartIcon,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Upload,
  Warehouse,
  Zap,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { actionButton, compactBadge, statusBadge } from '../uiTheme';

interface HomeViewProps {
  onNavigate: (path: string) => void;
}

const quickActions = [
  { label: '新建订单', icon: ShoppingBag, path: '/orders/all', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: '入库登记', icon: Archive, path: '/products/stock', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: '库存查询', icon: Search, path: '/products/list', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: '售后处理', icon: ShieldCheck, path: '/orders/abnormal', color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: '知识上传', icon: Upload, path: '/knowledge-base', color: 'text-sky-600', bg: 'bg-sky-50' },
  { label: '数据看板', icon: BarChart3, path: '/analytics/sales', color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: '客户分群', icon: Sparkles, path: '/customers/segment', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: '系统审计', icon: FileText, path: '/settings/audit', color: 'text-slate-600', bg: 'bg-slate-100' },
];

const insightCards = [
  {
    title: '智能补货建议',
    desc: '根据周转天数与安全水位，生成 6 条补货建议',
    action: '去查看',
    icon: LineChartIcon,
    tone: 'info',
    path: '/products/stock',
  },
  {
    title: 'AI 命中分析',
    desc: '识别退款异常与高频投诉，优先处理风险工单',
    action: '去分析',
    icon: Zap,
    tone: 'primary',
    path: '/orders/abnormal',
  },
  {
    title: '库存健康度',
    desc: '核心仓库存可售率较上周提升 12.6%',
    action: '查看详情',
    icon: PackageCheck,
    tone: 'success',
    path: '/products/list',
  },
];

const systemMessages = [
  { label: '库存预警通知', time: '未读', tone: 'danger' },
  { label: '盘点任务已分配', time: '15分钟前', tone: 'info' },
  { label: '调拨单审核通过', time: '1小时前', tone: 'success' },
  { label: '供应商资料更新', time: '2小时前', tone: 'neutral' },
];

const metrics = [
  { label: '库存总数 (SKU)', value: '12,648', delta: '+8.2%', sub: '高品种类 2,568', tone: 'success' },
  { label: '入库数量 (件)', value: '2,352', delta: '+12.5%', sub: '入库单据 156', tone: 'success' },
  { label: '出库数量 (件)', value: '1,926', delta: '-4.3%', sub: '出库单据 128', tone: 'danger' },
  { label: '库存金额 (元)', value: '8,985,320', delta: '+6.8%', sub: '平均单价 708.95', tone: 'warning' },
  { label: '预警数量 (项)', value: '23', delta: '-17.9%', sub: '严重预警 5', tone: 'danger' },
];

const trendData = [
  { day: '05-10', amount: 620, quantity: 9800 },
  { day: '05-11', amount: 760, quantity: 11800 },
  { day: '05-12', amount: 710, quantity: 10400 },
  { day: '05-13', amount: 560, quantity: 10100 },
  { day: '05-14', amount: 730, quantity: 12000 },
  { day: '05-15', amount: 690, quantity: 11000 },
  { day: '05-16', amount: 805, quantity: 13200 },
];

const warningRows = [
  { rank: 1, spu: 'SPU-31024', name: '低温仓储传感器', stock: 12, status: '库存不足', tone: 'danger' },
  { rank: 2, spu: 'SPU-28610', name: '商用扫码终端', stock: 8, status: '库存不足', tone: 'danger' },
  { rank: 3, spu: 'SPU-18042', name: '轻量数据采集器', stock: 32, status: '短储预警', tone: 'warning' },
  { rank: 4, spu: 'SPU-09812', name: '标签打印耗材', stock: 65, status: '库存不足', tone: 'danger' },
  { rank: 5, spu: 'SPU-42765', name: '工单流转配件包', stock: 120, status: '短储预警', tone: 'warning' },
];

const toneClasses: Record<string, { icon: string; bg: string; badge: string; text: string }> = {
  primary: {
    icon: 'text-indigo-600',
    bg: 'bg-indigo-50',
    badge: compactBadge.primary,
    text: 'text-indigo-600',
  },
  info: {
    icon: 'text-sky-600',
    bg: 'bg-sky-50',
    badge: compactBadge.info,
    text: 'text-sky-600',
  },
  success: {
    icon: 'text-emerald-600',
    bg: 'bg-emerald-50',
    badge: compactBadge.success,
    text: 'text-emerald-600',
  },
  warning: {
    icon: 'text-amber-600',
    bg: 'bg-amber-50',
    badge: compactBadge.warning,
    text: 'text-amber-600',
  },
  danger: {
    icon: 'text-rose-600',
    bg: 'bg-rose-50',
    badge: compactBadge.danger,
    text: 'text-rose-600',
  },
  neutral: {
    icon: 'text-gray-500',
    bg: 'bg-gray-100',
    badge: compactBadge.neutral,
    text: 'text-gray-500',
  },
};

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="grid gap-4 xl:grid-cols-[1.55fr_0.9fr]">
        <section className="relative overflow-hidden rounded-lg border border-gray-200/80 bg-white p-6 shadow-sm">
          <div className="relative z-10 max-w-xl">
            <span className={compactBadge.primary}>智能运营中枢</span>
            <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-gray-900">
              首页工作台 4.0 全新升级
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
              汇聚订单、库存、客户与知识库关键动作，支持预警追踪、智能补货、经营分析与任务协同。
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/products/stock')}
              className={`${actionButton.primary} mt-5`}
            >
              <span>查看运营建议</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute right-7 top-8 hidden h-40 w-56 lg:block">
            <div className="absolute inset-x-4 bottom-2 h-16 rounded-lg bg-indigo-100/80 shadow-inner" />
            <div className="absolute left-12 top-7 h-20 w-20 rounded-lg bg-indigo-500/90 shadow-lg shadow-indigo-200" />
            <div className="absolute left-24 top-3 h-24 w-24 rounded-lg bg-sky-100 shadow-md" />
            <div className="absolute right-4 top-12 flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md">
              <Warehouse className="h-6 w-6 text-indigo-600" />
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 sm:flex">
            <span className="h-1.5 w-5 rounded-full bg-indigo-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          </div>
        </section>

        <section className="rounded-lg border border-gray-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">常用功能</h2>
            <button type="button" className={actionButton.ghost}>编辑</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  className="flex h-[72px] flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 transition-all hover:border-indigo-200 hover:bg-indigo-50/40 hover:text-indigo-700"
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </span>
                  <span className="leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {insightCards.map((item) => {
          const Icon = item.icon;
          const tone = toneClasses[item.tone];
          return (
            <section key={item.title} className="rounded-lg border border-gray-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 min-h-[40px] text-xs leading-5 text-gray-500">{item.desc}</p>
                </div>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone.bg}`}>
                  <Icon className={`h-5 w-5 ${tone.icon}`} />
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold ${tone.text} hover:bg-gray-50`}
              >
                <span>{item.action}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </section>
          );
        })}

        <section className="rounded-lg border border-gray-200/80 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">系统消息</h3>
            <button type="button" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {systemMessages.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${toneClasses[item.tone].bg.replace('50', '500')}`} />
                  <span className="truncate font-medium text-gray-600">{item.label}</span>
                </div>
                <span className={item.tone === 'danger' ? statusBadge.danger : 'shrink-0 text-gray-400'}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-gray-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900">数据看板</h2>
            <span className="text-xs text-gray-400">更新时间：2026-08-09 12:00:00</span>
          </div>
          <button type="button" className={actionButton.icon} aria-label="刷新数据">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50/70 p-4">
              <div className="text-xs font-semibold text-gray-500">{item.label}</div>
              <div className="mt-3 text-xl font-extrabold text-gray-900">{item.value}</div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="text-gray-500">较上月</span>
                <span className={toneClasses[item.tone].text}>{item.delta}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <section className="rounded-lg border border-gray-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900">库存趋势</h2>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  库存金额
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  库存数量
                </span>
              </div>
            </div>
            <select className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10">
              <option>近7天</option>
              <option>近30天</option>
            </select>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 12, right: 16, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
                  labelStyle={{ fontSize: 12, color: '#475569' }}
                />
                <Line type="monotone" dataKey="amount" name="库存金额" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="quantity" name="库存数量" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">库存预警 TOP10</h2>
            <button
              type="button"
              onClick={() => onNavigate('/products/stock')}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
            >
              <span>查看全部</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500">
                <tr>
                  <th className="px-3 py-3">排名</th>
                  <th className="px-3 py-3">商品信息</th>
                  <th className="px-3 py-3">当前库存</th>
                  <th className="px-3 py-3">预警类型</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {warningRows.map((row) => (
                  <tr key={row.spu} className="hover:bg-gray-50/80">
                    <td className="px-3 py-3 text-xs font-bold text-amber-600">{row.rank}</td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-gray-800">{row.spu}</div>
                      <div className="mt-0.5 text-xs text-gray-500">{row.name}</div>
                    </td>
                    <td className="px-3 py-3 font-semibold text-gray-700">{row.stock}</td>
                    <td className="px-3 py-3">
                      <span className={toneClasses[row.tone].badge}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

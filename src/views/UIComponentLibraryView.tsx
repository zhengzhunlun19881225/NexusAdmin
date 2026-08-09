import React from 'react';
import {
  Activity,
  BarChart3,
  Calendar,
  Copy,
  Download,
  LineChart as LineChartIcon,
  Link2,
  MoreHorizontal,
  PieChart as PieChartIcon,
  Play,
  Search,
  Share2,
  Sparkles,
  Table2,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { actionButton, compactBadge } from '../uiTheme';

const brandColors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B'];

const barData = [
  { month: '1月', 方案A: 210, 方案B: 228 },
  { month: '2月', 方案A: 148, 方案B: 182 },
  { month: '3月', 方案A: 196, 方案B: 122 },
  { month: '4月', 方案A: 92, 方案B: 132 },
  { month: '5月', 方案A: 252, 方案B: 218 },
];

const donutData = [
  { name: '订单', value: 25 },
  { name: '商品', value: 25 },
  { name: '客户', value: 25 },
  { name: '库存', value: 25 },
];

const scatterData = [
  { x: 1, y: 80 },
  { x: 2, y: 140 },
  { x: 4, y: 210 },
  { x: 6, y: 120 },
  { x: 8, y: 185 },
  { x: 11, y: 96 },
  { x: 13, y: 228 },
  { x: 15, y: 155 },
  { x: 17, y: 205 },
  { x: 19, y: 110 },
];

const lineData = [
  { month: '1月', 华东: 220, 华南: 210, 华北: 185 },
  { month: '2月', 华东: 168, 华南: 148, 华北: 112 },
  { month: '3月', 华东: 146, 华南: 165, 华北: 98 },
  { month: '4月', 华东: 182, 华南: 172, 华北: 118 },
  { month: '5月', 华东: 238, 华南: 225, 华北: 156 },
];

const radarData = [
  { subject: '扩展性', value: 86 },
  { subject: '准确性', value: 78 },
  { subject: '可控性', value: 82 },
  { subject: '响应', value: 92 },
  { subject: '稳定性', value: 74 },
  { subject: '复用率', value: 88 },
];

const tableRows = [
  ['上海', '630', '42', '+10.2%', '75%', '明细'],
  ['深圳', '512', '38', '+8.6%', '71%', '明细'],
  ['杭州', '486', '31', '+6.9%', '68%', '明细'],
  ['成都', '392', '27', '+5.1%', '64%', '明细'],
  ['北京', '358', '22', '+4.8%', '62%', '明细'],
];

interface AnswerCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ title, icon: Icon, children, action }) => {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold">星穹完成 3.2s</span>
            <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">已验证</span>
          </div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Icon className="h-4 w-4 text-indigo-600" />
            {title}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {action}
          <button className={actionButton.icon} aria-label="复制">
            <Copy className="h-4 w-4" />
          </button>
          <button className={actionButton.icon} aria-label="更多">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mb-4 truncate text-xs text-gray-500">
        已成功解析上传的数据文件，以下是针对华东与华南区域经营数据的结构化回答。
      </p>
      <div className="h-[260px] rounded-lg border border-gray-100 bg-white p-3">{children}</div>
    </section>
  );
};

const ChartToolbar = () => (
  <div className="flex items-center gap-2">
    <button className={actionButton.secondary}>
      <Calendar className="h-4 w-4" />
      2024/01 - 2024/05
    </button>
    <button className={actionButton.icon} aria-label="导出">
      <Download className="h-4 w-4" />
    </button>
  </div>
);

export const UIComponentLibraryView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <header className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between text-sm font-black uppercase tracking-normal text-gray-700">
          <span>UX/UI DESIGN</span>
          <span>2025</span>
        </div>
        <div className="mt-3 h-px bg-gray-200" />
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className={compactBadge.primary}>UI 组件库 / 多模态回答</div>
            <h1 className="mt-4 text-[36px] font-black leading-none tracking-normal text-gray-900">
              多模态回答
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-500">
              用系统统一的字体、颜色、32px 控件高度和 8px 圆角，沉淀图表、表格、空状态与媒体回答组件。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className={actionButton.secondary}>
              <Search className="h-4 w-4" />
              搜索组件
            </button>
            <button className={actionButton.primary}>
              <Share2 className="h-4 w-4" />
              输出规范
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <AnswerCard title="华东与华南对比" icon={BarChart3} action={<ChartToolbar />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#EEF2FF' }} />
              <Bar dataKey="方案A" fill="#4F46E5" radius={[8, 8, 0, 0]} barSize={18} />
              <Bar dataKey="方案B" fill="#F59E0B" radius={[8, 8, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </AnswerCard>

        <AnswerCard title="业务占比环图" icon={PieChartIcon} action={<ChartToolbar />}>
          <div className="grid h-full grid-cols-[1fr_132px] items-center gap-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" innerRadius={58} outerRadius={90} paddingAngle={4}>
                  {donutData.map((entry, index) => (
                    <Cell key={entry.name} fill={brandColors[index % brandColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">功能合规指数</div>
                <div className="mt-1 text-[28px] font-black leading-none text-gray-900">18,888</div>
              </div>
              {donutData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: brandColors[index] }} />
                  <span>{item.name} 25%</span>
                </div>
              ))}
            </div>
          </div>
        </AnswerCard>

        <AnswerCard title="客户触点散点分布" icon={Activity} action={<ChartToolbar />}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="y" type="number" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={scatterData} fill="#4F46E5" />
              <Scatter data={scatterData.map((item) => ({ ...item, y: item.y * 0.72 }))} fill="#F59E0B" />
            </ScatterChart>
          </ResponsiveContainer>
        </AnswerCard>

        <AnswerCard title="趋势折线回答" icon={LineChartIcon} action={<ChartToolbar />}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="华东" stroke="#4F46E5" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="华南" stroke="#0EA5E9" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="华北" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </AnswerCard>

        <AnswerCard title="能力雷达评估" icon={Activity} action={<ChartToolbar />}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius={92}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748B' }} />
              <Radar dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.22} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </AnswerCard>

        <AnswerCard title="结构化数据表" icon={Table2} action={<ChartToolbar />}>
          <div className="h-full overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  {['区域', '销售额', '客户数', '同比增长', '核心产品占比', '操作'].map((head) => (
                    <th key={head} className="px-4 py-3 font-bold">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableRows.map((row) => (
                  <tr key={row[0]} className="text-gray-700">
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${cell}`} className={`px-4 py-3 ${index === 5 ? 'font-semibold text-indigo-600' : ''}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnswerCard>

        <AnswerCard title="加载与空数据状态" icon={Sparkles}>
          <div className="flex h-full items-center justify-center">
            <div className="w-full max-w-md space-y-4">
              <div className="h-4 w-2/3 rounded-lg bg-gray-100" />
              <div className="h-32 rounded-lg bg-gray-50 ring-1 ring-gray-100">
                <div className="grid h-full grid-cols-5 gap-3 p-4">
                  {[40, 68, 52, 76, 44].map((height, index) => (
                    <div key={height} className="flex items-end rounded-lg bg-white p-2">
                      <div
                        className="w-full rounded-lg bg-indigo-100"
                        style={{ height: `${height}%`, opacity: 0.7 + index * 0.04 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-3 w-full rounded-lg bg-gray-100" />
              <div className="h-3 w-4/5 rounded-lg bg-gray-100" />
            </div>
          </div>
        </AnswerCard>

        <AnswerCard title="视频与富媒体回答" icon={Play}>
          <div className="relative h-full overflow-hidden rounded-lg bg-gray-50 ring-1 ring-gray-100">
            <div className="absolute inset-0 grid grid-cols-4 gap-3 p-4 opacity-80">
              <div className="rounded-lg bg-white" />
              <div className="rounded-lg bg-white" />
              <div className="rounded-lg bg-white" />
              <div className="rounded-lg bg-white" />
              <div className="col-span-4 rounded-lg bg-white" />
              <div className="col-span-2 rounded-lg bg-white" />
              <div className="col-span-2 rounded-lg bg-white" />
            </div>
            <button className="absolute left-1/2 top-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg" aria-label="播放">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </button>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className={compactBadge.neutral}>视频回答</span>
              <button className={actionButton.secondary}>
                <Link2 className="h-4 w-4" />
                关联来源
              </button>
            </div>
          </div>
        </AnswerCard>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Activity,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Headphones,
  HelpCircle,
  Image as ImageIcon,
  LineChart as LineChartIcon,
  Link2,
  Megaphone,
  Newspaper,
  MoreHorizontal,
  PieChart as PieChartIcon,
  Pin,
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

const noticeItems = [
  { title: '关于2024年人培养方案建设的通知', date: '2024.08.27', isNew: true },
  { title: 'B端工作台系统维护计划安排', date: '2024.08.25', isNew: true },
  { title: '关于2024年人培养方案建设的通知', date: '2024.08.24' },
  { title: 'HRM系统安全升级公告：加强访问控制，保障员工信息安全', date: '2024.08.21' },
  { title: '全员赋能，精准决策高效管理', date: '2024.08.21' },
];

const helpItems = [
  {
    question: '保证金应缴金额如何组成？',
    answer: '“店铺保证金”包括“基础保证金”、“浮动保证金”，商家需要根据保证金标准完成缴纳。',
  },
  {
    question: '如何开通支付账户？',
    answer: '进入账户中心完成主体认证后，可按流程开通收款账户并绑定结算银行卡。',
  },
  {
    question: '已完成支付方式设置，接下来要做什么来完成开店？',
    answer: '继续完善店铺资料、运费模板和售后策略，提交后等待平台审核。',
  },
  {
    question: '无货源如何实现合规经营？',
    answer: '需要确保商品来源、售后承诺、物流履约和发票能力符合平台规则。',
  },
];

const campaignItems = [
  {
    title: '积分大派兑：你的积分可以兑换这些好礼！',
    desc: '通过多品类积分换购的形式，累计消耗积分200w+，3000+用户参与。',
    action: '去报名',
  },
  {
    title: '评价有奖：分享你的购物体验，赢取精美礼品！',
    desc: '鼓励用户在购买后留下评价，通过评价互动提高商品的信誉度。',
    action: '去报名',
  },
  {
    title: '购物返现季：消费越多，返现越多，优惠不停！',
    desc: '提供不同比例的现金返现，帮助活动周期内提升复购转化。',
    action: '去报名',
  },
];

const newsItems = [
  { title: '无人机全程拍摄！时隔三十多年再探切尔诺贝利核电站', date: '2022-11-12', tone: 'from-indigo-100 to-sky-100' },
  { title: '纽约时报｜没有中国，世界还能造动力电池吗', date: '2022-11-12', tone: 'from-sky-100 to-emerald-100' },
  { title: '停产、裁员，这家老牌合资车企撑不住了？', date: '2022-11-12', tone: 'from-amber-100 to-rose-100' },
];

const bulletinItems = [
  { title: '纽约时报｜没有中国，世界还能造动力电池吗', date: '11-12' },
  { title: '论坛论道｜肖钢：大力发展数字经济', date: '11-12' },
  { title: '银行业危机风波未完：仍有一颗定时炸弹滴滴作响！', date: '11-12' },
  { title: '曾比恒大冲更猛，他比许家印更可惜', date: '11-12' },
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

interface TextMediaCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const TextMediaCard: React.FC<TextMediaCardProps> = ({ title, icon: Icon, children, className = '' }) => (
  <section className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
        <Icon className="h-4 w-4 text-indigo-600" />
        {title}
      </h3>
      <button className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-indigo-600">
        更多
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
    {children}
  </section>
);

const NewTag = () => (
  <span className="inline-flex h-5 shrink-0 items-center rounded-lg bg-indigo-600 px-2 text-xs font-semibold text-white">
    New
  </span>
);

const NoticeList = ({ soft = false }: { soft?: boolean }) => (
  <div className="space-y-2">
    {noticeItems.map((item) => (
      <div
        key={`${item.title}-${item.date}-${soft ? 'soft' : 'plain'}`}
        className={`flex h-8 items-center gap-3 rounded-lg ${soft ? 'border border-white/80 bg-white/80 px-3' : ''}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {item.isNew && <NewTag />}
          <span className="truncate text-sm font-medium text-gray-800">{item.title}</span>
        </div>
        <span className="shrink-0 text-xs text-gray-500">{item.date}</span>
      </div>
    ))}
  </div>
);

const HelpList = () => (
  <div className="space-y-3">
    {helpItems.map((item) => (
      <div key={item.question} className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
            Q
          </span>
          <span className="truncate text-sm font-bold text-gray-900">{item.question}</span>
        </div>
        <p className="line-clamp-1 pl-7 text-xs leading-5 text-gray-500">{item.answer}</p>
      </div>
    ))}
    <button className="mt-2 flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-700">
      <Headphones className="h-4 w-4" />
      联系客服
    </button>
  </div>
);

const FaqList = () => (
  <div className="space-y-3">
    <div className="flex items-start gap-2">
      <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-indigo-600" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-gray-900">保证金应缴金额如何组成？</div>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
          国税总局发布了《支持协调发展税费优惠政策指引》。此次政策提及216项税收优惠
          <span className="font-semibold text-indigo-600"> 查看全部</span>
        </p>
      </div>
    </div>
    {['如何开通支付账户？', '有几种支付方式？', '无货源如何实现在抖音电商合规经营？', '如何发布新产品？'].map((item) => (
      <div key={item} className="flex h-8 items-center gap-2">
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="truncate text-sm font-semibold text-gray-800">{item}</span>
      </div>
    ))}
  </div>
);

const FeaturedNotice = () => (
  <div className="space-y-3">
    <div className="rounded-lg bg-gray-50 p-3">
      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-xs">
          <Megaphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-gray-900">智慧农业风起，中科原动力带机器人走进田间地头</div>
          <p className="mt-1 line-clamp-1 text-xs leading-5 text-gray-500">
            国家电网上海电力将紧急调用、启动应急电源，组织出动应急救援队伍。
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-2">
        <span className="text-xs text-gray-500">2020-12-12 13:33</span>
        <button className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-indigo-600">
          立即查看
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
    <div className="space-y-1">
      {bulletinItems.map((item) => (
        <div key={item.title} className="flex h-8 items-center gap-3 border-b border-gray-100 last:border-b-0">
          <span className="h-2 w-2 shrink-0 rounded-full border-2 border-indigo-600" />
          <span className="min-w-0 flex-1 truncate text-sm text-gray-800">{item.title}</span>
          <span className="text-xs text-gray-500">{item.date}</span>
        </div>
      ))}
    </div>
  </div>
);

const NewsImageList = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-5">
      {['新闻动态', '行领导动态', '总行动态'].map((tab, index) => (
        <span key={tab} className={`pb-1 text-sm font-semibold ${index === 0 ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-700'}`}>
          {tab}
        </span>
      ))}
    </div>
    <div className="space-y-3">
      {newsItems.map((item) => (
        <div key={item.title} className="flex items-center gap-3">
          <div className={`flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.tone} text-indigo-600`}>
            <ImageIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-gray-900">{item.title}</div>
            <div className="mt-1 text-xs text-gray-500">{item.date}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CampaignList = ({ highlighted = false }: { highlighted?: boolean }) => (
  <div className="space-y-3">
    {campaignItems.map((item) => (
      <div
        key={`${item.title}-${highlighted ? 'highlighted' : 'plain'}`}
        className={`flex items-center gap-3 rounded-lg ${highlighted ? 'bg-indigo-50/70 px-3 py-2' : ''}`}
      >
        {highlighted && <Pin className="h-4 w-4 shrink-0 text-indigo-600" />}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-gray-900">{item.title}</div>
          <p className="mt-1 truncate text-xs text-gray-500">{item.desc}</p>
        </div>
        <button className="shrink-0 text-sm font-semibold text-indigo-600">{highlighted ? '08.27截止' : item.action}</button>
      </div>
    ))}
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

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className={compactBadge.primary}>来自 Figma / 图文类组件</div>
            <h2 className="mt-3 text-xl font-black text-gray-900">图文类组件画布</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              从业务组件库 V3.0 的“图文类组件”节点提取结构和内容，统一改成本系统 UI kit 的字体、颜色、8px 圆角和 32px 控件规范。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={compactBadge.neutral}>通知</span>
            <span className={compactBadge.neutral}>问答</span>
            <span className={compactBadge.neutral}>图文列表</span>
            <span className={compactBadge.neutral}>营销活动</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-4">
          <TextMediaCard title="通知公告" icon={Megaphone}>
            <NoticeList />
          </TextMediaCard>

          <TextMediaCard title="浅底通知公告" icon={Megaphone} className="bg-gradient-to-b from-indigo-50 to-white">
            <NoticeList soft />
          </TextMediaCard>

          <TextMediaCard title="帮助中心" icon={HelpCircle}>
            <HelpList />
          </TextMediaCard>

          <TextMediaCard title="常见问题" icon={HelpCircle}>
            <FaqList />
          </TextMediaCard>

          <TextMediaCard title="重点通知" icon={Newspaper}>
            <FeaturedNotice />
          </TextMediaCard>

          <TextMediaCard title="图片新闻列表" icon={ImageIcon}>
            <NewsImageList />
          </TextMediaCard>

          <TextMediaCard title="营销活动" icon={Pin}>
            <CampaignList />
          </TextMediaCard>

          <TextMediaCard title="活动提醒卡" icon={Pin}>
            <CampaignList highlighted />
          </TextMediaCard>
        </div>
      </section>
    </div>
  );
};

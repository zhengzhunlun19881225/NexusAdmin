import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  Info,
  Layers3,
  Palette,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Type,
  XCircle,
} from 'lucide-react';

const colors = [
  { name: 'Primary', token: 'Indigo 600', value: '#4F46E5', className: 'bg-indigo-600' },
  { name: 'Primary Soft', token: 'Indigo 50', value: '#EEF2FF', className: 'bg-indigo-50' },
  { name: 'Info', token: 'Sky 500', value: '#0EA5E9', className: 'bg-sky-500' },
  { name: 'Success', token: 'Emerald 500', value: '#10B981', className: 'bg-emerald-500' },
  { name: 'Warning', token: 'Amber 500', value: '#F59E0B', className: 'bg-amber-500' },
  { name: 'Danger', token: 'Rose 500', value: '#F43F5E', className: 'bg-rose-500' },
  { name: 'Text Strong', token: 'Gray 900', value: '#111827', className: 'bg-gray-900' },
  { name: 'Surface', token: 'White', value: '#FFFFFF', className: 'bg-white' },
];

const typography = [
  { role: 'Page Title', size: '18px', weight: '700', sample: '全渠道订单管理' },
  { role: 'Section Title', size: '14px', weight: '600', sample: '基础组件' },
  { role: 'Control Text', size: '14px', weight: '500', sample: '搜索 / 按钮 / 输入' },
  { role: 'Form Label', size: '12px', weight: '600', sample: '字段标签' },
  { role: 'Badge Label', size: '12px', weight: '600', sample: '状态标签' },
];

const spacing = [
  { token: '4px', usage: '图标与短文本间距' },
  { token: '8px', usage: '按钮内间距、表单垂直间距' },
  { token: '12px', usage: '控件横向 padding、紧凑卡片间距' },
  { token: '16px', usage: '卡片内边距、工具栏间距' },
  { token: '24px', usage: '页面区块间距' },
];

const statuses = [
  {
    label: '已启用',
    icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    label: '待审核',
    icon: Info,
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    label: '预警',
    icon: AlertTriangle,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    label: '已停用',
    icon: XCircle,
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];

const UiSection: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, description, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>
      </div>
    </div>
    {children}
  </section>
);

export const UIKitView: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 text-gray-900">
      <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
        <div className="border-b border-indigo-100 bg-indigo-50/70 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700">
                <Sparkles className="h-3.5 w-3.5" />
                Nexus Admin Light UI Kit
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-950">
                浅色版 UI kit
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                汇总当前系统的浅色主题设计令牌、控件样式、表格密度与状态标签规范，便于页面扩展时保持一致。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ['14px', '控件文字'],
                ['12px', '标签文字'],
                ['8px', '小卡圆角'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xs">
                  <div className="text-lg font-black text-indigo-600">{value}</div>
                  <div className="mt-0.5 text-xs font-medium text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <UiSection icon={Palette} title="Color Tokens" description="浅色主题以白色表面、灰色边界和靛蓝主操作色为核心。">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map((color) => (
              <div key={color.name} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className={`h-14 rounded-lg border border-black/5 ${color.className}`} />
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{color.name}</div>
                    <div className="text-xs text-gray-500">{color.token}</div>
                  </div>
                  <code className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-gray-500">
                    {color.value}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </UiSection>

        <UiSection icon={Type} title="Typography" description="中后台保持 12/14/18 的紧凑字号阶梯，优先保障信息密度。">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2">角色</th>
                  <th className="px-3 py-2">字号</th>
                  <th className="px-3 py-2">字重</th>
                  <th className="px-3 py-2">样例</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {typography.map((item) => (
                  <tr key={item.role}>
                    <td className="px-3 py-2 font-medium text-gray-800">{item.role}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-500">{item.size}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-500">{item.weight}</td>
                    <td className="px-3 py-2 text-gray-700">{item.sample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </UiSection>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <UiSection icon={Settings2} title="Controls" description="输入框、搜索框、选择器和按钮统一使用 14px 文字。">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold text-gray-600">搜索框</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    value="订单号 / 客户 / 手机号"
                    readOnly
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-gray-900 outline-none ring-indigo-500/20 focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-semibold text-gray-600">选择器</label>
                <div className="relative">
                  <select className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 outline-none">
                    <option>全部订单状态</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-indigo-700">
                <Plus className="h-4 w-4" />
                新建记录
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
                <Download className="h-4 w-4" />
                导出数据
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-200">
                <Eye className="h-4 w-4" />
                预览
              </button>
            </div>
          </div>
        </UiSection>

        <UiSection icon={Layers3} title="Badges & Spacing" description="状态标签为 12px，组件间距遵循 4px 基础网格。">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => {
                const Icon = status.icon;
                return (
                  <span
                    key={status.label}
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                  >
                    <Icon className="h-3 w-3" />
                    {status.label}
                  </span>
                );
              })}
            </div>
            <div className="grid gap-2 sm:grid-cols-5">
              {spacing.map((item) => (
                <div key={item.token} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="text-sm font-black text-gray-900">{item.token}</div>
                  <div className="mt-1 text-xs leading-5 text-gray-500">{item.usage}</div>
                </div>
              ))}
            </div>
          </div>
        </UiSection>
      </div>

      <UiSection icon={Layers3} title="Table Pattern" description="表格采用浅灰表头、白色行背景、12px 辅助信息和明确的操作列。">
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
              <tr>
                <th className="px-4 py-3">订单编号</th>
                <th className="px-4 py-3">客户</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">金额</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-sm">
              {[
                ['ORD-202607-9001', '张敏超', '待审核', '¥52,996.00'],
                ['ORD-202607-9002', '李思婷', '处理中', '¥2,899.00'],
              ].map(([order, customer, status, amount]) => (
                <tr key={order}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-600">{order}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{customer}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-gray-900">{amount}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-lg bg-indigo-50 px-3 py-1.5 font-semibold text-indigo-700">
                      查看
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </UiSection>
    </div>
  );
};

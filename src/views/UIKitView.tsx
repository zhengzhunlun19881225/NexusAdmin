import React from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  Inbox,
  Info,
  Layers3,
  MessageSquare,
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

const alerts = [
  {
    title: '信息提示',
    description: '筛选条件已保存，下一次进入页面时会自动恢复。',
    icon: Info,
    className: 'border-sky-200 bg-sky-50 text-sky-800',
    iconClassName: 'bg-sky-100 text-sky-600',
  },
  {
    title: '操作成功',
    description: '订单状态已更新，客户侧将同步收到最新状态。',
    icon: CheckCircle2,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    iconClassName: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: '风险预警',
    description: '该客户存在多次异常退款记录，建议复核后继续处理。',
    icon: AlertTriangle,
    className: 'border-amber-200 bg-amber-50 text-amber-800',
    iconClassName: 'bg-amber-100 text-amber-600',
  },
  {
    title: '处理失败',
    description: '当前库存不足，无法完成发货操作。',
    icon: XCircle,
    className: 'border-rose-200 bg-rose-50 text-rose-800',
    iconClassName: 'bg-rose-100 text-rose-600',
  },
];

const messages = [
  { label: '保存成功', icon: CheckCircle2, className: 'border-emerald-200 text-emerald-700' },
  { label: '已提交审核', icon: Info, className: 'border-indigo-200 text-indigo-700' },
  { label: '库存低于阈值', icon: AlertTriangle, className: 'border-amber-200 text-amber-700' },
  { label: '导入失败', icon: XCircle, className: 'border-rose-200 text-rose-700' },
];

const notifications = [
  { title: '待审核订单', detail: '5 笔订单等待运营审核', time: '2 分钟前', unread: true },
  { title: '库存预警', detail: '3 个 SKU 已低于安全库存', time: '18 分钟前', unread: true },
  { title: '系统同步完成', detail: '商品中心数据已完成同步', time: '今天 09:42', unread: false },
];

const radioOptions = ['全部订单', '仅待审核', '仅异常订单'];
const checkboxOptions = ['显示库存预警', '包含退款订单', '隐藏已归档数据'];

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

      <div className="grid gap-5 xl:grid-cols-2">
        <UiSection icon={AlertTriangle} title="Alert 警告" description="页面内提示使用浅底色、同色系边框和图标，不只依赖颜色表达状态。">
          <div className="grid gap-3">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.title} className={`rounded-xl border p-3 ${alert.className}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${alert.iconClassName}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{alert.title}</div>
                      <div className="mt-0.5 text-xs leading-5 opacity-80">{alert.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </UiSection>

        <UiSection icon={Bell} title="Notification 通知" description="通知适合承载异步系统事件，包含未读标记、时间和轻量操作。">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Bell className="h-4 w-4 text-indigo-600" />
                通知中心
              </div>
              <button className="rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">
                全部已读
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.map((item) => (
                <div key={item.title} className="flex items-start gap-3 px-4 py-3">
                  <span
                    className={`mt-2 h-2 w-2 shrink-0 rounded-full ${item.unread ? 'bg-indigo-500' : 'bg-gray-300'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="truncate text-sm font-semibold text-gray-900">{item.title}</div>
                      <div className="shrink-0 text-xs text-gray-400">{item.time}</div>
                    </div>
                    <div className="mt-1 text-xs leading-5 text-gray-500">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UiSection>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <UiSection icon={MessageSquare} title="Message 消息提示" description="消息提示用于短时反馈，保持 14px 操作文本和清晰的语义图标。">
          <div className="space-y-3">
            {messages.map((message) => {
              const Icon = message.icon;
              return (
                <div
                  key={message.label}
                  className={`flex items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm ${message.className}`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm font-semibold">{message.label}</span>
                  </div>
                  <button className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                    关闭
                  </button>
                </div>
              );
            })}
          </div>
        </UiSection>

        <UiSection icon={CheckCircle2} title="单选 / 复选" description="选择类控件使用原生语义控件，标签统一 12px，控件文字保持紧凑。">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 text-sm font-bold text-gray-900">单选 Radio</div>
              <div className="space-y-3">
                {radioOptions.map((option, index) => (
                  <label key={option} className="flex items-center gap-2 font-semibold text-gray-600">
                    <input
                      type="radio"
                      name="ui-kit-radio"
                      defaultChecked={index === 1}
                      disabled={index === 2}
                      className="h-4 w-4 border-gray-300 text-indigo-600 accent-indigo-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 text-sm font-bold text-gray-900">复选 Checkbox</div>
              <div className="space-y-3">
                {checkboxOptions.map((option, index) => (
                  <label key={option} className="flex items-center gap-2 font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      defaultChecked={index !== 2}
                      disabled={index === 2}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 accent-indigo-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </UiSection>
      </div>

      <UiSection icon={Inbox} title="缺省图 Empty State" description="无数据、无搜索结果和初始化状态统一使用轻量插画、明确标题与下一步操作。">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 px-6 py-8 text-center">
            <div className="relative mb-5 h-28 w-36">
              <div className="absolute left-5 top-8 h-20 w-28 rounded-2xl border border-indigo-200 bg-white shadow-sm" />
              <div className="absolute left-0 top-2 h-12 w-20 rounded-xl border border-gray-200 bg-white shadow-xs" />
              <div className="absolute right-0 top-0 h-14 w-24 rounded-xl border border-gray-200 bg-white shadow-xs" />
              <div className="absolute left-10 top-14 flex h-14 w-16 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Inbox className="h-7 w-7" />
              </div>
              <div className="absolute bottom-2 right-6 h-3 w-3 rounded-full bg-emerald-400" />
              <div className="absolute bottom-0 left-8 h-2 w-16 rounded-full bg-indigo-200" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">暂无数据</h3>
            <p className="mt-2 max-w-sm text-xs leading-5 text-gray-500">
              当前筛选条件下没有可展示内容，可调整筛选条件或新建一条记录。
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-indigo-700">
                <Plus className="h-4 w-4" />
                新建记录
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
                <Search className="h-4 w-4" />
                调整筛选
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['无数据', '首次进入、暂无记录'],
              ['无结果', '搜索或筛选无匹配'],
              ['无权限', '功能受角色权限限制'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm font-bold text-gray-900">{title}</div>
                <div className="mt-1 text-xs leading-5 text-gray-500">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </UiSection>

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

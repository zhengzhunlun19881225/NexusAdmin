import React from 'react';
import {
  AlertTriangle,
  ArrowUp,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Database,
  Download,
  Eye,
  FileImage,
  FileText,
  Filter,
  Grid2X2,
  Image,
  Inbox,
  Info,
  KeyRound,
  LayoutDashboard,
  Layers3,
  List,
  ListTree,
  Loader2,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Palette,
  PanelRightOpen,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Table2,
  Trash2,
  Type,
  Upload,
  User,
  Users,
  XCircle,
} from 'lucide-react';

import emptyCommentIllustration from '../assets/ui-kit-empty/empty-comment.png';
import emptyDataIllustration from '../assets/ui-kit-empty/empty-data.png';
import emptyLocationIllustration from '../assets/ui-kit-empty/empty-location.png';
import emptyMessageIllustration from '../assets/ui-kit-empty/empty-message.png';
import emptyOrderIllustration from '../assets/ui-kit-empty/empty-order.png';
import emptyPostIllustration from '../assets/ui-kit-empty/empty-post.png';
import emptyStateIllustration from '../assets/ui-kit-empty/empty-state.png';
import emptyWorkIllustration from '../assets/ui-kit-empty/empty-work.png';
import failureIllustration from '../assets/ui-kit-empty/failure.png';
import loadingIllustration from '../assets/ui-kit-empty/loading.png';
import maintenanceIllustration from '../assets/ui-kit-empty/maintenance.png';
import networkErrorIllustration from '../assets/ui-kit-empty/network-error.png';
import notificationIllustration from '../assets/ui-kit-empty/notification.png';
import successIllustration from '../assets/ui-kit-empty/success.png';
import { actionButton } from '../uiTheme';

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

const iconSamples = [
  { label: '仪表盘', icon: LayoutDashboard },
  { label: '权限', icon: ShieldCheck },
  { label: '数据', icon: Database },
  { label: '筛选', icon: Filter },
  { label: '文件', icon: FileText },
  { label: '图片', icon: Image },
  { label: '复制', icon: Copy },
  { label: '设置', icon: Settings2 },
];

const avatarUsers = ['林国鑫', '张倩', '王涛', '刘洋'];
const navSteps = ['基础信息', '配置权限', '确认发布'];

const timelineItems = [
  ['09:12', '创建订单', '运营主管提交订单审批'],
  ['10:04', '风控复核', '命中高价值订单规则'],
  ['11:30', '审核通过', '订单进入发货队列'],
];

const fileItems = [
  ['运营日报.xlsx', '2.4 MB', '已上传'],
  ['库存截图.png', '820 KB', '待审核'],
  ['发票明细.pdf', '1.1 MB', '已归档'],
];

const emptyStatePalette = [
  { name: '主蓝', value: '#4A9EFF', className: 'bg-[#4A9EFF]' },
  { name: '深蓝', value: '#2F7EF7', className: 'bg-[#2F7EF7]' },
  { name: '浅蓝', value: '#8CC7FF', className: 'bg-[#8CC7FF]' },
  { name: '高光', value: '#DFF2FF', className: 'bg-[#DFF2FF]' },
  { name: '强调色', value: '#FF7A59', className: 'bg-[#FF7A59]' },
];

const emptyStateIllustrations = [
  { title: '空状态', usage: '通用无内容页面', image: emptyStateIllustration },
  { title: '数据为空', usage: '报表、列表无数据', image: emptyDataIllustration },
  { title: '暂无消息', usage: '消息、通知收件箱', image: emptyMessageIllustration },
  { title: '暂无订单', usage: '订单列表、售后列表', image: emptyOrderIllustration },
  { title: '暂无评论', usage: '评价、备注、反馈', image: emptyCommentIllustration },
  { title: '暂无新帖', usage: '内容、公告、帖子', image: emptyPostIllustration },
  { title: '暂无工作', usage: '待办、任务工作台', image: emptyWorkIllustration },
  { title: '无法定位', usage: '地址、门店、地图', image: emptyLocationIllustration },
  { title: '网络出错', usage: '接口失败、离线状态', image: networkErrorIllustration },
  { title: '加载中', usage: '异步请求等待', image: loadingIllustration },
  { title: '成功', usage: '任务完成反馈', image: successIllustration },
  { title: '失败', usage: '流程失败反馈', image: failureIllustration },
  { title: '系统维护', usage: '停机、权限维护', image: maintenanceIllustration },
  { title: '消息通知', usage: '通知入口、提醒状态', image: notificationIllustration },
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
              <button className={actionButton.primary}>
                <Plus className="h-4 w-4" />
                新建记录
              </button>
              <button className={actionButton.secondary}>
                <Download className="h-4 w-4" />
                导出数据
              </button>
              <button className={actionButton.subtle}>
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

      <UiSection icon={Sparkles} title="基础原子组件" description="覆盖按钮、图标、文字、头像、角标、分割线和彩色状态标签。">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">按钮 Button</div>
            <div className="flex flex-wrap items-center gap-2">
              <button className={actionButton.primary}>
                <Plus className="h-4 w-4" />
                主按钮
              </button>
              <button className={actionButton.secondary}>
                <Download className="h-4 w-4" />
                次按钮
              </button>
              <button className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25">
                文字按钮
              </button>
              <button aria-label="刷新" className={actionButton.icon}>
                <RefreshCw className="h-4 w-4" />
              </button>
              <button className={actionButton.dangerSoft}>
                <Trash2 className="h-4 w-4" />
                危险按钮
              </button>
              <button disabled className={actionButton.secondary}>
                禁用
              </button>
              <button className={actionButton.primary}>
                <Loader2 className="h-4 w-4 animate-spin" />
                加载中
              </button>
            </div>

            <div className="my-4 h-px bg-gray-200" />

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-bold text-gray-900">文字 Text</div>
                <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3">
                  <div className="text-lg font-bold text-gray-950">标题文字 18px</div>
                  <div className="text-sm leading-6 text-gray-700">正文文字 14px，适合详情页、表格主体和表单输入内容。</div>
                  <div className="text-xs leading-5 text-gray-500">辅助文字 12px，用于描述、说明、标签和时间。</div>
                  <a className="text-sm font-semibold text-indigo-600 hover:text-indigo-700" href="#ui-kit-link">
                    链接文字
                  </a>
                </div>
              </div>
              <div>
                <div className="mb-2 text-sm font-bold text-gray-900">头像 Avatar</div>
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <div className="flex items-center gap-3">
                    {avatarUsers.slice(0, 3).map((name, index) => (
                      <div
                        key={name}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-sm ${
                          index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-sky-500' : 'bg-emerald-500'
                        }`}
                      >
                        {name.slice(0, 1)}
                      </div>
                    ))}
                    <div className="flex -space-x-2">
                      {avatarUsers.map((name, index) => (
                        <div
                          key={name}
                          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-bold text-gray-700"
                          style={{ zIndex: avatarUsers.length - index }}
                        >
                          {name.slice(0, 1)}
                        </div>
                      ))}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-50 text-xs font-bold text-indigo-700">
                        +8
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="relative inline-flex">
                      <Bell className="h-8 w-8 rounded-xl border border-gray-200 bg-white p-1.5 text-gray-600" />
                      <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 text-[10px] font-bold leading-4 text-white">9</span>
                    </span>
                    {statuses.map((status) => {
                      const Icon = status.icon;
                      return (
                        <span key={status.label} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
                          <Icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">图标体系 Icon</div>
            <div className="grid grid-cols-4 gap-2">
              {iconSamples.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-2 py-3 text-center">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="mt-2 text-xs font-semibold text-gray-500">{item.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-3">
              <div className="text-sm font-bold text-gray-900">分割线 Divider</div>
              <div className="my-3 h-px bg-gray-200" />
              <div className="text-xs leading-5 text-gray-500">用于表单分组、详情列表和表格工具栏，不增加额外装饰。</div>
            </div>
          </div>
        </div>
      </UiSection>

      <UiSection icon={Settings2} title="表单录入组件" description="覆盖输入、选择、日期时间、上传、开关与表单容器，输入内容统一 14px。">
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-bold text-gray-900">基础输入</div>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">输入框</span>
              <input readOnly value="华东数字运营中心" className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">密码框</span>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input readOnly type="password" value="nexus-admin" className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">搜索框</span>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input readOnly value="搜索订单 / 商品 / 客户" className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">文本域</span>
              <textarea readOnly value="请输入审核说明或备注信息" className="min-h-20 w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm leading-6 text-gray-900 outline-none" />
            </label>
          </div>

          <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-bold text-gray-900">选择控件</div>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">数字输入框</span>
              <input readOnly type="number" value="128" className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-gray-600">下拉选择</span>
              <div className="relative">
                <select className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none">
                  <option>全部结果状态</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </label>
            <div>
              <div className="mb-1 text-xs font-semibold text-gray-600">多选搜索</div>
              <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2 py-1.5">
                {['订单', '商品', 'CRM'].map((tag) => (
                  <span key={tag} className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">{tag}</span>
                ))}
                <span className="text-sm text-gray-400">搜索模块...</span>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700">
                <input type="radio" name="form-demo-radio" defaultChecked className="h-4 w-4 accent-indigo-600" />
                单选框
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-indigo-600" />
                复选框
              </label>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2">
              <span className="text-sm font-semibold text-gray-700">开关 Switch</span>
              <span className="flex h-6 w-11 items-center rounded-full bg-indigo-600 p-0.5">
                <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
              </span>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-bold text-gray-900">日期、上传与表单项</div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">日期选择器</span>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input readOnly value="2026-08-07" className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none" />
                </div>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-gray-600">时间选择器</span>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input readOnly value="14:30" className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none" />
                </div>
              </label>
            </div>
            <div className="rounded-xl border border-dashed border-indigo-200 bg-white p-4 text-center">
              <Upload className="mx-auto h-6 w-6 text-indigo-500" />
              <div className="mt-2 text-sm font-bold text-gray-900">文件 / 图片上传</div>
              <div className="mt-1 text-xs leading-5 text-gray-500">支持拖拽上传，展示进度、失败和禁用状态。</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 text-sm font-bold text-gray-900">表单容器 Form</div>
              <div className="space-y-3">
                <div>
                  <div className="mb-1 text-xs font-semibold text-gray-600">必填字段 <span className="text-rose-500">*</span></div>
                  <input readOnly value="运营主管" className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-900" />
                </div>
                <div className="text-xs leading-5 text-gray-500">辅助说明：权限变更后将写入审计日志。</div>
              </div>
            </div>
          </div>
        </div>
      </UiSection>

      <UiSection icon={LayoutDashboard} title="导航组件" description="覆盖侧边菜单、顶栏、面包屑、分页、标签页、步骤条、更多菜单和返回顶部。">
        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">侧边导航菜单</div>
            <div className="space-y-1">
              {[
                ['订单数据管理', Inbox, true],
                ['商品中心', Layers3, false],
                ['客户关系 CRM', Users, false],
                ['系统与权限配置', ShieldCheck, false],
              ].map(([label, Icon, active]) => {
                const NavIcon = Icon as React.ElementType;
                return (
                  <div key={label as string} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold ${active ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white'}`}>
                    <span className="flex items-center gap-2">
                      <NavIcon className="h-4 w-4" />
                      {label}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <LayoutDashboard className="h-4 w-4 text-indigo-600" />
                顶部导航 Top Nav
              </div>
              <div className="flex items-center gap-2">
                <button className={actionButton.primary}>新建</button>
                <button aria-label="更多" className={actionButton.icon}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-500">
                <span>首页</span>
                <span>/</span>
                <span>系统配置</span>
                <span>/</span>
                <span className="text-gray-900">角色权限</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {['全部', '待审核', '已完成'].map((tab, index) => (
                  <button key={tab} className={`inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-semibold ${index === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{tab}</button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((page) => (
                    <button key={page} className={`h-8 min-w-8 rounded-lg px-2 text-sm font-semibold ${page === 2 ? 'bg-indigo-600 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>{page}</button>
                  ))}
                </div>
                <button className={actionButton.secondary}>
                  <ArrowUp className="h-4 w-4" />
                  返回顶部
                </button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-3 text-sm font-bold text-gray-900">步骤条 Steps</div>
                <div className="flex items-center">
                  {navSteps.map((step, index) => (
                    <React.Fragment key={step}>
                      <div className="flex items-center gap-2">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index < 2 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{index + 1}</span>
                        <span className="text-xs font-semibold text-gray-600">{step}</span>
                      </div>
                      {index !== navSteps.length - 1 && <div className="mx-2 h-px flex-1 bg-gray-200" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-3 text-sm font-bold text-gray-900">下拉更多菜单</div>
                <div className="w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  {['编辑记录', '复制链接', '删除记录'].map((item, index) => (
                    <div key={item} className={`px-3 py-2 text-sm font-semibold ${index === 2 ? 'text-rose-600' : 'text-gray-700'} hover:bg-gray-50`}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </UiSection>

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
              <button className={actionButton.ghost}>
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
                  <button className={actionButton.ghost}>
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

      <UiSection icon={PanelRightOpen} title="反馈交互组件" description="覆盖弹窗、抽屉、二次确认、提示、浮层、加载和警告，保证状态反馈完整。">
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">Modal 弹窗对话框</div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-gray-900">确认提交审核</div>
                  <div className="mt-1 text-xs leading-5 text-gray-500">提交后会同步写入审计日志，是否继续？</div>
                </div>
                <XCircle className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button className={actionButton.secondary}>取消</button>
                <button className={actionButton.primary}>确认</button>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">Drawer 侧边抽屉</div>
            <div className="ml-auto min-h-44 w-56 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-gray-900">订单详情</div>
                <PanelRightOpen className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="mt-4 space-y-2">
                {['客户信息', '发货地址', '操作日志'].map((item) => (
                  <div key={item} className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">{item}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-bold text-gray-900">悬浮与确认</div>
            <div className="rounded-xl border border-amber-200 bg-white p-3 shadow-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                <div>
                  <div className="text-sm font-bold text-gray-900">气泡二次确认</div>
                  <div className="mt-1 text-xs leading-5 text-gray-500">确定归档这条记录吗？</div>
                  <div className="mt-2 flex gap-2">
                    <button className={actionButton.ghost}>取消</button>
                    <button className={actionButton.danger}>删除</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="inline-flex rounded-lg bg-gray-900 px-2 py-1 text-xs font-semibold text-white">Tooltip：查看完整权限说明</div>
              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="text-sm font-bold text-gray-900">Popover 内容卡片</div>
                <div className="mt-1 text-xs leading-5 text-gray-500">可展示字段说明、快捷操作或筛选条件摘要。</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">Loading 加载</div>
            <div className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              正在加载组件数据...
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 xl:col-span-2">
            <div className="mb-3 text-sm font-bold text-gray-900">Alert / Message / Notification 状态覆盖</div>
            <div className="grid gap-3 md:grid-cols-3">
              {['空数据', '异常错误', '禁用不可用'].map((state, index) => (
                <div key={state} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className={`mb-2 h-2 w-10 rounded-full ${index === 0 ? 'bg-gray-300' : index === 1 ? 'bg-rose-400' : 'bg-amber-400'}`} />
                  <div className="text-sm font-bold text-gray-900">{state}</div>
                  <div className="mt-1 text-xs leading-5 text-gray-500">组件需给出图标、文字和恢复路径。</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </UiSection>

      <UiSection icon={Inbox} title="缺省图 Empty State" description="提取小蓝插画体系，用于无数据、无结果、网络错误和流程反馈等轻量状态。">
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 px-6 py-8 text-center">
              <img
                src={emptyStateIllustration}
                alt="空状态小蓝插画"
                className="mb-4 h-44 w-auto max-w-full object-contain"
              />
              <h3 className="text-sm font-bold text-gray-900">暂无数据</h3>
              <p className="mt-2 max-w-sm text-xs leading-5 text-gray-500">
                当前筛选条件下没有可展示内容，可调整筛选条件或新建一条记录。
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button className={actionButton.primary}>
                  <Plus className="h-4 w-4" />
                  新建记录
                </button>
                <button className={actionButton.secondary}>
                  <Search className="h-4 w-4" />
                  调整筛选
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm font-bold text-gray-900">插画规范</div>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                角色统一使用高饱和蓝色、柔和阴影和少量橙色强调，适合放在白色或浅蓝底的缺省容器中。
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-5">
                {emptyStatePalette.map((color) => (
                  <div key={color.name} className="rounded-xl border border-gray-200 bg-white p-2">
                    <div className={`h-10 rounded-lg ${color.className}`} />
                    <div className="mt-2 text-xs font-bold text-gray-900">{color.name}</div>
                    <div className="font-mono text-xs text-gray-500">{color.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ['展示尺寸', '主图 160-220px，小卡 96-128px'],
                  ['推荐容器', '白底、浅蓝底、虚线边框'],
                  ['文案层级', '14px 标题 + 12px 说明'],
                ].map(([title, detail]) => (
                  <div key={title} className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="text-sm font-bold text-gray-900">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-gray-500">{detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm font-bold text-gray-900">常用缺省状态图库</div>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                {emptyStateIllustrations.length} 个状态
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              {emptyStateIllustrations.map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-xs">
                  <div className="flex h-28 items-center justify-center rounded-lg bg-gray-50">
                    <img src={item.image} alt={`${item.title}插画`} className="max-h-24 max-w-full object-contain" />
                  </div>
                  <div className="mt-3 text-sm font-bold text-gray-900">{item.title}</div>
                  <div className="mt-1 text-xs leading-5 text-gray-500">{item.usage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </UiSection>

      <UiSection icon={Table2} title="数据展示组件" description="覆盖表格、列表、详情、树、进度、骨架、结果页和时间线。">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <Table2 className="h-4 w-4 text-indigo-600" />
                数据表格 Table
              </div>
              <div className="flex items-center gap-2">
                <button className={actionButton.secondary}>
                  <Filter className="h-3.5 w-3.5" />
                  筛选
                </button>
                <button className={actionButton.secondary}>
                  排序
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500">
                <tr>
                  <th className="sticky left-0 bg-gray-50 px-4 py-3"><input type="checkbox" className="h-4 w-4 rounded accent-indigo-600" /></th>
                  <th className="px-4 py-3">名称</th>
                  <th className="px-4 py-3">模块</th>
                  <th className="px-4 py-3">状态</th>
                  <th className="px-4 py-3">更新时间</th>
                  <th className="sticky right-0 bg-gray-50 px-4 py-3 text-right">固定操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {[
                  ['高价值订单规则', '订单数据管理', '已启用', '2026-08-07'],
                  ['库存安全阈值', '商品中心', '待审核', '2026-08-06'],
                  ['客户分层标签', '客户关系 CRM', '已启用', '2026-08-05'],
                ].map(([name, module, state, time], index) => (
                  <tr key={name}>
                    <td className="sticky left-0 bg-white px-4 py-3"><input type="checkbox" defaultChecked={index === 0} className="h-4 w-4 rounded accent-indigo-600" /></td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{name}</td>
                    <td className="px-4 py-3 text-gray-600">{module}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${state === '已启用' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>{state}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{time}</td>
                    <td className="sticky right-0 bg-white px-4 py-3 text-right">
                      <button className={actionButton.infoSoft}>查看</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                <ListTree className="h-4 w-4 text-indigo-600" />
                树形表格 / 树控件 / 树选择
              </div>
              <div className="space-y-2 text-sm font-semibold text-gray-700">
                <div>华东运营中心</div>
                <div className="ml-4 rounded-lg bg-indigo-50 px-3 py-2 text-indigo-700">├ 订单数据管理</div>
                <div className="ml-4 rounded-lg bg-gray-50 px-3 py-2">└ 商品中心</div>
                <div className="ml-8 rounded-lg bg-gray-50 px-3 py-2 text-gray-500">└ 库存预警中心</div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 text-sm font-bold text-gray-900">进度条 Progress</div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-2/3 rounded-full bg-indigo-600" />
              </div>
              <div className="mt-2 text-xs font-semibold text-gray-500">审批进度 66%</div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-bold text-gray-900">卡片 Card</div>
            <div className="mt-3 text-2xl font-black text-indigo-600">1,286</div>
            <div className="text-xs text-gray-500">本月新增订单</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
              <List className="h-4 w-4 text-indigo-600" />
              列表 List
            </div>
            <div className="space-y-2">
              {['审核订单', '同步库存', '导出报表'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span className="text-sm font-semibold text-gray-700">{item}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">描述详情列表</div>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-xs font-semibold text-gray-500">角色</dt>
              <dd className="font-semibold text-gray-900">运营主管</dd>
              <dt className="text-xs font-semibold text-gray-500">权限</dt>
              <dd className="font-semibold text-gray-900">5 项</dd>
              <dt className="text-xs font-semibold text-gray-500">状态</dt>
              <dd className="font-semibold text-emerald-600">启用</dd>
            </dl>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">骨架屏 Skeleton</div>
            <div className="space-y-2">
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-4/5 rounded bg-gray-100" />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center xl:col-span-2">
            <img src={successIllustration} alt="成功结果页插画" className="mx-auto h-24 w-auto object-contain" />
            <div className="mt-2 text-sm font-bold text-gray-900">结果页 Result</div>
            <div className="mt-1 text-xs leading-5 text-gray-500">操作已完成，可返回列表继续处理。</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 xl:col-span-2">
            <div className="mb-3 text-sm font-bold text-gray-900">时间线 Timeline</div>
            <div className="space-y-3">
              {timelineItems.map(([time, title, detail]) => (
                <div key={time} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                  <div>
                    <div className="text-sm font-bold text-gray-900">{title} <span className="font-mono text-xs text-gray-400">{time}</span></div>
                    <div className="mt-0.5 text-xs leading-5 text-gray-500">{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </UiSection>

      <UiSection icon={Grid2X2} title="布局容器组件" description="覆盖 Row/Col 栅格、Space 间距、折叠面板、轮播和分割面板。">
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">栅格布局 Row / Col</div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12 rounded-lg bg-indigo-100 px-3 py-2 text-xs font-bold text-indigo-700">Col 12</div>
              <div className="col-span-6 rounded-lg bg-sky-100 px-3 py-2 text-xs font-bold text-sky-700">Col 6</div>
              <div className="col-span-6 rounded-lg bg-sky-100 px-3 py-2 text-xs font-bold text-sky-700">Col 6</div>
              <div className="col-span-4 rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">Col 4</div>
              <div className="col-span-4 rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">Col 4</div>
              <div className="col-span-4 rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">Col 4</div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">间距 Space</div>
            <div className="flex flex-wrap gap-2">
              {['8px', '12px', '16px', '24px'].map((gap) => (
                <span key={gap} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600">{gap}</span>
              ))}
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
              {['基础信息', '高级设置', '审计日志'].map((item, index) => (
                <div key={item} className={`flex items-center justify-between px-3 py-2 text-sm font-semibold ${index !== 2 ? 'border-b border-gray-100' : ''}`}>
                  {item}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">轮播 / 分割面板</div>
            <div className="rounded-xl bg-indigo-50 p-4">
              <div className="text-sm font-bold text-indigo-700">运营指标看板</div>
              <div className="mt-2 text-xs leading-5 text-indigo-600">Carousel Slide 1 / 3</div>
              <div className="mt-4 flex gap-1">
                <span className="h-1.5 w-5 rounded-full bg-indigo-600" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-200" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-200" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-[0.9fr_1.1fr] overflow-hidden rounded-xl border border-gray-200">
              <div className="bg-gray-50 p-3 text-xs font-semibold text-gray-500">左侧筛选面板</div>
              <div className="p-3 text-xs font-semibold text-gray-700">右侧数据内容</div>
            </div>
          </div>
        </div>
      </UiSection>

      <UiSection icon={SlidersHorizontal} title="业务自定义组件" description="沉淀系统常用业务组件：查询栏、高级筛选、状态组件、文件列表和图片预览。">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 text-sm font-bold text-gray-900">搜索查询栏 / 高级筛选</div>
            <div className="grid gap-3 md:grid-cols-4">
              <input readOnly value="关键词搜索" className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900" />
              <select className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900"><option>业务模块</option></select>
              <select className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900"><option>处理状态</option></select>
              <button className={actionButton.primary}>
                <Search className="h-4 w-4" />
                查询
              </button>
            </div>
            <div className="mt-3 grid gap-3 rounded-xl border border-gray-200 bg-white p-3 md:grid-cols-3">
              {['创建时间', '负责人', '风险等级'].map((item) => (
                <div key={item}>
                  <div className="mb-1 text-xs font-semibold text-gray-500">{item}</div>
                  <div className="h-9 rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-500">请选择</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 text-sm font-bold text-gray-900">状态组件</div>
              <div className="grid grid-cols-2 gap-2">
                {['在线', '处理中', '异常', '离线'].map((state, index) => (
                  <div key={state} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700">
                    <span className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-indigo-500' : index === 2 ? 'bg-rose-500' : 'bg-gray-400'}`} />
                    {state}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-3 text-sm font-bold text-gray-900">图片预览</div>
              <div className="grid grid-cols-3 gap-2">
                {[emptyOrderIllustration, emptyMessageIllustration, emptyDataIllustration].map((src, index) => (
                  <div key={src} className="aspect-square rounded-xl border border-gray-200 bg-gray-50 p-2">
                    <img src={src} alt={`图片预览 ${index + 1}`} className="h-full w-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-3 text-sm font-bold text-gray-900">文件列表 File List</div>
          <div className="grid gap-2 md:grid-cols-3">
            {fileItems.map(([name, size, state], index) => (
              <div key={name} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                {index === 1 ? <FileImage className="h-5 w-5 text-sky-500" /> : <FileText className="h-5 w-5 text-indigo-500" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-gray-900">{name}</div>
                  <div className="text-xs font-semibold text-gray-500">{size} · {state}</div>
                </div>
                <button aria-label="文件操作" className={actionButton.icon}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
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
                    <button className={actionButton.infoSoft}>
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

import React, { useMemo, useState } from 'react';
import {
  Archive,
  BellOff,
  ChevronRight,
  FileText,
  Mail,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Tag,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { CustomerItem } from '../types';
import { actionButton, compactBadge } from '../uiTheme';

type ConversationStatus = 'active' | 'archived';
type MessageSide = 'customer' | 'agent';

interface IMConversation {
  id: string;
  customerId: string;
  customerName: string;
  avatar: string;
  company: string;
  phone: string;
  email: string;
  channel: string;
  status: ConversationStatus;
  muted?: boolean;
  unread: number;
  time: string;
  summary: string;
  tags: string[];
  messages: {
    id: string;
    side: MessageSide;
    sender: string;
    time: string;
    content: string;
    attachment?: {
      title: string;
      description: string;
    };
  }[];
}

interface IMViewProps {
  customers: CustomerItem[];
  showToast: (msg: string) => void;
}

const conversations: IMConversation[] = [
  {
    id: 'im-1001',
    customerId: 'cust-8801',
    customerName: '张敏超',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    company: '字节跳动 ByteDance',
    phone: '13811223344',
    email: 'zhangmunchao@bytedance.com',
    channel: '企业微信',
    status: 'active',
    unread: 2,
    time: '10:24',
    summary: '采购合同已经确认，请协助安排 MacBook 订单的分批交付。',
    tags: ['大客户', '高价值', '交付跟进'],
    messages: [
      {
        id: 'm-1',
        side: 'customer',
        sender: '张敏超',
        time: '09:58',
        content: '有人在线吗？想确认一下这一批设备的交付安排。',
      },
      {
        id: 'm-2',
        side: 'agent',
        sender: '林国鑫',
        time: '10:02',
        content: '张总你好，我在的。MacBook Pro 这一批可以按部门拆分两次交付，我会把第一版交付计划同步给你。',
      },
      {
        id: 'm-3',
        side: 'customer',
        sender: '张敏超',
        time: '10:08',
        content: '好的。另外发票希望按两个成本中心拆开，备注我稍后发你。',
      },
      {
        id: 'm-4',
        side: 'agent',
        sender: '林国鑫',
        time: '10:17',
        content: '没问题。我已经把发票拆分需求同步到财务，并创建了交付跟进记录。',
        attachment: {
          title: '交付跟进单 IM-DELIVERY-1001',
          description: '包含分批发货、发票拆分和仓储节点确认。',
        },
      },
    ],
  },
  {
    id: 'im-1002',
    customerId: 'cust-8802',
    customerName: '李思婷',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    company: '恒生银行',
    phone: '18699887766',
    email: 'siting.li@gmail.com',
    channel: '在线客服',
    status: 'active',
    muted: true,
    unread: 1,
    time: '09:52',
    summary: '想了解企业采购优惠券是否可以叠加 VIP 折扣。',
    tags: ['VIP', '优惠券'],
    messages: [
      {
        id: 'm-5',
        side: 'customer',
        sender: '李思婷',
        time: '09:52',
        content: '请问企业采购优惠券可以和 V3 会员折扣同时使用吗？',
      },
      {
        id: 'm-6',
        side: 'agent',
        sender: '林国鑫',
        time: '09:56',
        content: '可以叠加，但仅限平台自营 SPU。你发我一下目标商品，我帮你核算到手价。',
      },
    ],
  },
  {
    id: 'im-1003',
    customerId: 'cust-8803',
    customerName: '王建国',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    company: '腾讯科技 Tencent',
    phone: '13566778899',
    email: 'jianguo.wang@tencent.com',
    channel: '邮件',
    status: 'active',
    unread: 0,
    time: '09:20',
    summary: '询问库存预警规则是否支持按仓库维度导出。',
    tags: ['库存', '报表'],
    messages: [
      {
        id: 'm-7',
        side: 'customer',
        sender: '王建国',
        time: '09:10',
        content: '库存预警中心是否可以按华东仓和华南仓分别导出？我们需要做内部对账。',
      },
      {
        id: 'm-8',
        side: 'agent',
        sender: '林国鑫',
        time: '09:18',
        content: '支持按仓储节点筛选后导出，我给你整理一份操作路径和字段说明。',
      },
    ],
  },
  {
    id: 'im-1004',
    customerId: 'cust-8804',
    customerName: '孙鸿飞',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    company: '个人散客',
    phone: '13988776655',
    email: 'sun.hongfei@qq.com',
    channel: '短信',
    status: 'active',
    unread: 0,
    time: '昨天',
    summary: '退款凭证已补充，等待财务审核。',
    tags: ['退款', '凭证'],
    messages: [
      {
        id: 'm-9',
        side: 'customer',
        sender: '孙鸿飞',
        time: '昨天 17:42',
        content: '退款凭证我已经重新上传了，麻烦帮忙确认一下。',
      },
    ],
  },
  {
    id: 'im-1005',
    customerId: 'cust-8805',
    customerName: '吴婷婷',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160&auto=format&fit=crop&q=80',
    company: '个人散客',
    phone: '13677889900',
    email: 'tingting.wu@sina.com',
    channel: '在线客服',
    status: 'active',
    unread: 1,
    time: '08:44',
    summary: '想查询订单是否可以改为顺丰特快。',
    tags: ['物流', '加急'],
    messages: [
      {
        id: 'm-10',
        side: 'customer',
        sender: '吴婷婷',
        time: '08:44',
        content: '你好，我的订单可以改成顺丰特快吗？希望明天能收到。',
      },
    ],
  },
  {
    id: 'im-1006',
    customerId: 'cust-8806',
    customerName: '钱浩然',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    company: '上海创客空间',
    phone: '13500001111',
    email: 'haoran.qian@example.com',
    channel: '邮件',
    status: 'archived',
    unread: 0,
    time: '08.02',
    summary: '设备开机异常，功能故障，售后已完成确认。',
    tags: ['售后', '已归档'],
    messages: [
      {
        id: 'm-11',
        side: 'agent',
        sender: '林国鑫',
        time: '08.02 18:30',
        content: '设备故障凭证已经确认，售后工单将进入换货处理流程。',
      },
    ],
  },
];

export const IMView: React.FC<IMViewProps> = ({ customers, showToast }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ConversationStatus>('active');
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [showMoreMenu, setShowMoreMenu] = useState(true);
  const [draft, setDraft] = useState('你也可以直接联系我的同事 @陈敏，她会协助你确认后续交付和发票信息。');

  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      const matchesKeyword =
        !keyword.trim() ||
        item.customerName.includes(keyword.trim()) ||
        item.company.includes(keyword.trim()) ||
        item.summary.includes(keyword.trim());
      return item.status === selectedStatus && matchesKeyword;
    });
  }, [keyword, selectedStatus]);

  const selectedConversation =
    conversations.find((item) => item.id === selectedId) || filteredConversations[0] || conversations[0];
  const linkedCustomer = customers.find((item) => item.name.includes(selectedConversation.customerName));

  const handleSend = () => {
    if (!draft.trim()) {
      showToast('请输入回复内容后再发送');
      return;
    }
    showToast(`已向 ${selectedConversation.customerName} 发送 IM 回复`);
    setDraft('');
  };

  return (
    <section className="h-[calc(100vh-104px)] min-h-[720px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="grid h-full min-w-0 xl:grid-cols-[280px_minmax(520px,1fr)_312px]">
        <aside className="flex min-h-0 flex-col border-r border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200/80 px-4 dark:border-gray-800">
            <div className="flex min-w-0 items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h1 className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">重点客户</h1>
            </div>
            <div className="flex items-center gap-1">
              <button className={actionButton.icon} title="更多客户分组" onClick={() => showToast('客户分组操作已展开')}>
                <MoreHorizontal className="h-4 w-4" />
              </button>
              <button className={actionButton.icon} title="新增会话" onClick={() => showToast('已新建客户会话')}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3 border-b border-gray-200/80 p-3 dark:border-gray-800">
            <div className="grid grid-cols-[1fr_32px] gap-2">
              <div className="grid grid-cols-2 rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-800 dark:bg-gray-800/60">
                {[
                  { id: 'active', label: '进行中' },
                  { id: 'archived', label: '已归档' },
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`h-8 rounded-lg text-sm font-semibold transition ${
                      selectedStatus === item.id
                        ? 'bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-gray-100'
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setSelectedStatus(item.id as ConversationStatus)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button className={actionButton.icon} title="筛选会话" onClick={() => showToast('会话筛选面板已打开')}>
                <Menu className="h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索客户或消息..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filteredConversations.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`flex w-full gap-3 border-b border-gray-100 px-3 py-3 text-left transition dark:border-gray-800 ${
                  selectedConversation.id === item.id
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/30'
                    : 'bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={item.avatar}
                    alt={item.customerName}
                    className="h-10 w-10 rounded-full border border-gray-200 object-cover dark:border-gray-800"
                  />
                  {item.status === 'active' && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">{item.customerName}</span>
                      {item.muted && <BellOff className="h-3 w-3 shrink-0 text-gray-400" />}
                    </div>
                    <span className="shrink-0 font-mono text-xs text-gray-400">{item.time}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{item.summary}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="truncate text-xs font-medium text-gray-400">{item.channel}</span>
                    {item.unread > 0 && (
                      <span className="flex h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col bg-white dark:bg-gray-900">
          <div className="relative flex h-14 shrink-0 items-center justify-between border-b border-gray-200/80 px-4 dark:border-gray-800">
            <div className="flex min-w-0 items-center gap-2.5">
              <img
                src={selectedConversation.avatar}
                alt={selectedConversation.customerName}
                className="h-8 w-8 rounded-full border border-gray-200 object-cover dark:border-gray-800"
              />
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">{selectedConversation.customerName}</h2>
                <p className="truncate text-xs text-gray-400">{selectedConversation.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className={actionButton.icon} title="重新分配客服" onClick={() => showToast('已打开会话分配面板')}>
                <UserPlus className="h-4 w-4" />
              </button>
              <button className={actionButton.icon} title="客户档案" onClick={() => showToast('已打开客户档案')}>
                <FileText className="h-4 w-4" />
              </button>
              <button className={actionButton.icon} title="表情" onClick={() => showToast('表情面板已打开')}>
                <Smile className="h-4 w-4" />
              </button>
              <button
                className={`${actionButton.icon} relative`}
                title="更多会话操作"
                onClick={() => setShowMoreMenu((prev) => !prev)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {showMoreMenu && (
              <div className="absolute right-4 top-12 z-20 w-48 rounded-lg border border-gray-200 bg-white p-1.5 text-sm shadow-xl dark:border-gray-800 dark:bg-gray-900">
                {[
                  { icon: BellOff, label: '消息免打扰', action: '已设置消息免打扰' },
                  { icon: Mail, label: '标记未读', action: '已标记为未读' },
                  { icon: Archive, label: '归档会话', action: '会话已归档' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className="flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => showToast(item.action)}
                    >
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                <button
                  className="flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/50"
                  onClick={() => showToast('已进入删除确认流程')}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>删除会话</span>
                </button>
              </div>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <div className="mb-5 flex items-center justify-center">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                今天，8月9日
              </span>
            </div>

            <div className="space-y-5">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${message.side === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.side === 'customer' && (
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.customerName}
                      className="h-8 w-8 rounded-full border border-gray-200 object-cover dark:border-gray-800"
                    />
                  )}
                  <div className={`max-w-[70%] ${message.side === 'agent' ? 'text-right' : ''}`}>
                    <div className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-400">
                      <span>{message.sender}</span>
                      <span>{message.time}</span>
                    </div>
                    <div
                      className={`rounded-lg border px-4 py-3 text-left text-sm leading-6 ${
                        message.side === 'agent'
                          ? 'border-indigo-100 bg-indigo-50 text-gray-900 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-gray-100'
                          : 'border-amber-100 bg-amber-50/70 text-gray-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-gray-100'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.attachment && (
                      <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          <FileText className="h-4 w-4" />
                          {message.attachment.title}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">{message.attachment.description}</p>
                      </div>
                    )}
                  </div>
                  {message.side === 'agent' && (
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80"
                      alt="林国鑫"
                      className="h-8 w-8 rounded-full border border-gray-200 object-cover dark:border-gray-800"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="rounded-lg border border-indigo-300 bg-white p-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-indigo-800 dark:bg-gray-950">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={3}
                placeholder="输入中文回复内容..."
                className="min-h-20 w-full resize-none border-0 bg-transparent text-sm leading-6 text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
              />
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1">
                  <button className={actionButton.icon} title="关闭草稿" onClick={() => setDraft('')}>
                    <X className="h-4 w-4" />
                  </button>
                  <button className={actionButton.icon} title="添加附件" onClick={() => showToast('附件选择器已打开')}>
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className={actionButton.icon} title="添加变量" onClick={() => showToast('已插入客户变量')}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button className={actionButton.primary} onClick={handleSend}>
                  <Send className="h-3.5 w-3.5" />
                  <span>发送</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <aside className="hidden min-h-0 flex-col border-l border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900 xl:flex">
          <div className="border-b border-gray-200/80 px-4 py-6 text-center dark:border-gray-800">
            <img
              src={selectedConversation.avatar}
              alt={selectedConversation.customerName}
              className="mx-auto h-20 w-20 rounded-full border border-gray-200 object-cover shadow-sm dark:border-gray-800"
            />
            <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">{selectedConversation.customerName}</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{selectedConversation.company}</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button className={actionButton.icon} title="发起沟通" onClick={() => showToast('已打开快捷沟通动作')}>
                <Send className="h-4 w-4" />
              </button>
              <button className={actionButton.icon} title="发送邮件" onClick={() => showToast('已打开客户邮件草稿')}>
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <ProfileSection title="客户资料" icon={<Tag className="h-3.5 w-3.5 text-indigo-600" />}>
              <InfoRow icon={<Phone className="h-4 w-4" />} label="电话" value={linkedCustomer?.phone || selectedConversation.phone} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="手机" value={linkedCustomer?.phone || '待补充'} />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="邮箱" value={linkedCustomer?.email || selectedConversation.email} />
            </ProfileSection>

            <ProfileFold title="备注记录" count="4" />
            <ProfileFold title="关联订单" count="5" />
            <ProfileFold title="会员权益" count={linkedCustomer?.tier || 'V5'} />

            <div className="border-t border-gray-200/80 p-4 dark:border-gray-800">
              <button className={`${actionButton.ghost} w-full justify-start`} onClick={() => showToast('已新增客户属性')}>
                <Plus className="h-4 w-4" />
                添加新的客户属性
              </button>
            </div>

            <div className="px-4 pb-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  服务建议
                </div>
                <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                  建议优先确认交付节点，并同步客户名录备注；如涉及发票或退款，可关联对应业务工单。
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedConversation.tags.map((tag) => (
                    <span key={tag} className={compactBadge.primary}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

const ProfileSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="border-b border-gray-200/80 dark:border-gray-800">
    <div className="flex h-10 items-center gap-2 px-4 text-sm font-bold text-gray-900 dark:text-gray-100">
      {icon}
      <span>{title}</span>
    </div>
    <div className="space-y-1 px-4 pb-3">{children}</div>
  </div>
);

const ProfileFold: React.FC<{ title: string; count: string }> = ({ title, count }) => (
  <button className="flex h-11 w-full items-center justify-between border-b border-gray-200/80 px-4 text-sm font-bold text-gray-900 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-800/60">
    <span className="flex items-center gap-2">
      <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
      {title}
    </span>
    <span className="font-mono text-xs text-gray-500">{count}</span>
  </button>
);

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="grid grid-cols-[20px_64px_minmax(0,1fr)] items-center gap-2 py-1.5 text-sm">
    <span className="text-gray-400">{icon}</span>
    <span className="text-gray-400">{label}</span>
    <span className="truncate font-medium text-gray-700 dark:text-gray-200">{value}</span>
  </div>
);

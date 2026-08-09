import React, { useMemo, useState } from 'react';
import {
  Archive,
  BellOff,
  CheckCheck,
  Clock3,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Star,
  Tag,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { CustomerItem } from '../types';
import { actionButton, compactBadge, statusBadge } from '../uiTheme';

type ConversationStatus = 'active' | 'pending' | 'closed';
type MessageSide = 'customer' | 'agent';

interface IMConversation {
  id: string;
  customerId: string;
  customerName: string;
  avatar: string;
  company: string;
  channel: string;
  status: ConversationStatus;
  unread: number;
  time: string;
  priority: '普通' | '重要' | '紧急';
  summary: string;
  tags: string[];
  messages: {
    id: string;
    side: MessageSide;
    sender: string;
    time: string;
    content: string;
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
    channel: '企业微信',
    status: 'active',
    unread: 3,
    time: '10:24',
    priority: '紧急',
    summary: '采购合同已经确认，请协助安排 MacBook 订单的分批交付。',
    tags: ['大客户', '高价值', '订单交付'],
    messages: [
      {
        id: 'm-1',
        side: 'customer',
        sender: '张敏超',
        time: '10:12',
        content: '我们这边采购合同已经确认，想确认 MacBook Pro 这一批能否按部门分两次交付？',
      },
      {
        id: 'm-2',
        side: 'agent',
        sender: '林国鑫',
        time: '10:14',
        content: '可以的，我已经同步仓储同事核对库存，预计今天 16:00 前给你第一批交付计划。',
      },
      {
        id: 'm-3',
        side: 'customer',
        sender: '张敏超',
        time: '10:21',
        content: '好的，另外发票希望按两个成本中心拆开，备注我稍后发你。',
      },
    ],
  },
  {
    id: 'im-1002',
    customerId: 'cust-8802',
    customerName: '李思婷',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    company: '恒生银行',
    channel: '在线客服',
    status: 'pending',
    unread: 1,
    time: '09:58',
    priority: '重要',
    summary: '想了解企业采购优惠券是否可以叠加 VIP 折扣。',
    tags: ['VIP', '优惠券', '售前咨询'],
    messages: [
      {
        id: 'm-4',
        side: 'customer',
        sender: '李思婷',
        time: '09:52',
        content: '请问企业采购优惠券可以和 V3 会员折扣同时使用吗？',
      },
      {
        id: 'm-5',
        side: 'agent',
        sender: '林国鑫',
        time: '09:55',
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
    channel: '邮件',
    status: 'active',
    unread: 0,
    time: '09:20',
    priority: '普通',
    summary: '询问库存预警规则是否支持按仓库维度导出。',
    tags: ['库存', '报表', '系统咨询'],
    messages: [
      {
        id: 'm-6',
        side: 'customer',
        sender: '王建国',
        time: '09:10',
        content: '库存预警中心是否可以按华东仓和华南仓分别导出？我们需要做内部对账。',
      },
      {
        id: 'm-7',
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
    channel: '短信',
    status: 'closed',
    unread: 0,
    time: '昨天',
    priority: '普通',
    summary: '售后退款凭证已补充，等待财务审核。',
    tags: ['退款', '凭证', '已归档'],
    messages: [
      {
        id: 'm-8',
        side: 'customer',
        sender: '孙鸿飞',
        time: '昨天 17:42',
        content: '退款凭证我已经重新上传了，麻烦帮忙确认一下。',
      },
      {
        id: 'm-9',
        side: 'agent',
        sender: '林国鑫',
        time: '昨天 17:50',
        content: '已收到，单据已经转到财务审核队列，有进展会第一时间同步你。',
      },
    ],
  },
];

const statusText: Record<ConversationStatus, string> = {
  active: '处理中',
  pending: '待回复',
  closed: '已归档',
};

const statusClass: Record<ConversationStatus, string> = {
  active: statusBadge.success,
  pending: statusBadge.warning,
  closed: statusBadge.neutral,
};

const priorityClass: Record<IMConversation['priority'], string> = {
  普通: compactBadge.neutral,
  重要: compactBadge.primary,
  紧急: compactBadge.danger,
};

export const IMView: React.FC<IMViewProps> = ({ customers, showToast }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ConversationStatus>('all');
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [draft, setDraft] = useState('你好，我已经在跟进这条需求，会尽快同步处理进度。');

  const stats = useMemo(() => {
    const unread = conversations.reduce((sum, item) => sum + item.unread, 0);
    const pending = conversations.filter((item) => item.status === 'pending').length;
    const active = conversations.filter((item) => item.status === 'active').length;
    return { unread, pending, active, total: conversations.length };
  }, []);

  const filteredConversations = useMemo(() => {
    return conversations.filter((item) => {
      const matchesKeyword =
        !keyword.trim() ||
        item.customerName.includes(keyword.trim()) ||
        item.company.includes(keyword.trim()) ||
        item.summary.includes(keyword.trim());
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      return matchesKeyword && matchesStatus;
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
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-gray-100">
              IM 客户消息中心
            </h1>
          </div>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-gray-500 dark:text-gray-400">
            聚合企业微信、在线客服、邮件与短信渠道会话，支持客户识别、标签沉淀和售前售后协同跟进。
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            className={actionButton.secondary}
            onClick={() => showToast('已将当前会话标记为未读')}
          >
            <BellOff className="h-3.5 w-3.5" />
            <span>标记未读</span>
          </button>
          <button
            className={actionButton.primary}
            onClick={() => showToast('已新建一条客户沟通会话')}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>新建会话</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: '全部会话', value: stats.total, helper: '跨渠道接入', icon: MessageSquare, className: 'text-gray-950 dark:text-gray-100' },
          { label: '处理中', value: stats.active, helper: '客服正在跟进', icon: CheckCheck, className: 'text-emerald-600 dark:text-emerald-400' },
          { label: '待回复', value: stats.pending, helper: '需优先处理', icon: Clock3, className: 'text-amber-700 dark:text-amber-300' },
          { label: '未读消息', value: stats.unread, helper: '客户新消息', icon: Star, className: 'text-indigo-600 dark:text-indigo-400' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="flex min-h-[88px] items-center justify-between rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
                <h3 className={`mt-1 text-2xl font-extrabold tracking-tight ${metric.className}`}>{metric.value}</h3>
                <p className="mt-0.5 truncate text-xs font-medium text-indigo-600 dark:text-indigo-400">{metric.helper}</p>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      <section className="grid min-h-[620px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:grid-cols-[320px_minmax(0,1fr)_300px]">
        <aside className="border-b border-gray-200/80 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-950/40 xl:border-b-0 xl:border-r">
          <div className="space-y-3 border-b border-gray-200/80 p-4 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索客户、公司或消息内容..."
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: '全部' },
                { id: 'active', label: '处理中' },
                { id: 'pending', label: '待回复' },
                { id: 'closed', label: '已归档' },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-semibold transition ${
                    selectedStatus === item.id
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedStatus(item.id as 'all' | ConversationStatus)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto p-2">
            {filteredConversations.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`mb-2 flex w-full gap-3 rounded-lg border p-3 text-left transition ${
                  selectedConversation.id === item.id
                    ? 'border-indigo-200 bg-indigo-50/80 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/30'
                    : 'border-transparent bg-white hover:border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:hover:border-gray-800 dark:hover:bg-gray-800/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={item.avatar}
                    alt={item.customerName}
                    className="h-10 w-10 rounded-full border border-gray-200 object-cover dark:border-gray-800"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">{item.customerName}</span>
                    <span className="shrink-0 font-mono text-xs text-gray-400">{item.time}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className={priorityClass[item.priority]}>{item.priority}</span>
                    <span className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{item.channel}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{item.summary}</p>
                </div>
                {item.unread > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
                    {item.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200/80 px-4 py-3 dark:border-gray-800">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={selectedConversation.avatar}
                alt={selectedConversation.customerName}
                className="h-10 w-10 rounded-full border border-gray-200 object-cover dark:border-gray-800"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">{selectedConversation.customerName}</h2>
                  <span className={statusClass[selectedConversation.status]}>{statusText[selectedConversation.status]}</span>
                </div>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {selectedConversation.company} · {selectedConversation.channel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className={actionButton.icon} title="拨打电话" onClick={() => showToast('已打开客户电话外呼面板')}>
                <Phone className="h-4 w-4" />
              </button>
              <button className={actionButton.icon} title="发送邮件" onClick={() => showToast('已打开客户邮件草稿')}>
                <Mail className="h-4 w-4" />
              </button>
              <button className={actionButton.icon} title="更多操作" onClick={() => showToast('更多会话操作已展开')}>
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#F8FBFF] p-4 dark:bg-gray-950/30">
            <div className="text-center">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-400 shadow-xs dark:bg-gray-900">
                今天
              </span>
            </div>
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
                <div className={`max-w-[72%] ${message.side === 'agent' ? 'text-right' : ''}`}>
                  <div className="mb-1 text-xs font-medium text-gray-400">
                    {message.sender} · {message.time}
                  </div>
                  <div
                    className={`rounded-xl border px-4 py-3 text-left text-sm leading-6 shadow-sm ${
                      message.side === 'agent'
                        ? 'border-indigo-200 bg-indigo-50 text-gray-900 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-gray-100'
                        : 'border-gray-200 bg-white text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/60">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={3}
                placeholder="输入中文回复内容..."
                className="min-h-20 w-full resize-none border-0 bg-transparent text-sm leading-6 text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
              />
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <button className={actionButton.icon} title="添加附件" onClick={() => showToast('附件选择器已打开')}>
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className={actionButton.secondary} onClick={() => showToast('已插入常用回复模板')}>
                    常用回复
                  </button>
                </div>
                <button className={actionButton.primary} onClick={handleSend}>
                  <Send className="h-3.5 w-3.5" />
                  <span>发送消息</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="border-t border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 xl:border-l xl:border-t-0">
          <div className="flex flex-col items-center text-center">
            <img
              src={selectedConversation.avatar}
              alt={selectedConversation.customerName}
              className="h-20 w-20 rounded-full border border-gray-200 object-cover shadow-sm dark:border-gray-800"
            />
            <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">{selectedConversation.customerName}</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{selectedConversation.company}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {selectedConversation.tags.map((tag) => (
                <span key={tag} className={compactBadge.primary}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/60">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                <Users className="h-4 w-4 text-indigo-600" />
                客户档案
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-400">电话</dt>
                  <dd className="font-mono text-gray-700 dark:text-gray-200">{linkedCustomer?.phone || '13811223344'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-400">邮箱</dt>
                  <dd className="truncate text-gray-700 dark:text-gray-200">{linkedCustomer?.email || 'contact@nexus.cn'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-400">会员</dt>
                  <dd className="font-semibold text-indigo-600 dark:text-indigo-400">{linkedCustomer?.tier || 'V5 黑金VIP'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-400">累计消费</dt>
                  <dd className="font-mono font-bold text-gray-900 dark:text-gray-100">
                    ￥{(linkedCustomer?.totalSpent || 186500).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/60">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                服务建议
              </div>
              <div className="space-y-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                <p>建议优先确认订单交付节点，并把会话同步到客户名录备注。</p>
                <p>如果涉及退款、发票或库存异常，可直接关联到对应业务工单。</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className={actionButton.secondary} onClick={() => showToast('会话已归档')}>
                <Archive className="h-3.5 w-3.5" />
                归档
              </button>
              <button className={actionButton.dangerSoft} onClick={() => showToast('已进入删除确认流程')}>
                <Trash2 className="h-3.5 w-3.5" />
                删除
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                <Tag className="h-4 w-4 text-indigo-600" />
                最近动作
              </div>
              <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>创建交付跟进</span>
                  <span>10:18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>同步客户标签</span>
                  <span>09:46</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>更新 VIP 档案</span>
                  <span>昨天</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

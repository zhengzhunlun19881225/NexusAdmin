import React, { useState, useMemo } from 'react';
import {
  Truck,
  Search,
  Plus,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  X,
  Printer,
  Download,
  ArrowUpDown,
  Send,
  Navigation,
  ShieldAlert,
  Copy,
  Check,
} from 'lucide-react';
import { LogisticsItem, LogisticsStatus, LogisticsTrackStep } from '../types';
import { statusBadge } from '../uiTheme';

interface LogisticsViewProps {
  logisticsList: LogisticsItem[];
  setLogisticsList: React.Dispatch<React.SetStateAction<LogisticsItem[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const LogisticsView: React.FC<LogisticsViewProps> = ({
  logisticsList,
  setLogisticsList,
  showToast,
}) => {
  // Search & Filter
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCarrier, setSelectedCarrier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'shipTime' | 'status'>('shipTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals & Drawers
  const [detailItem, setDetailItem] = useState<LogisticsItem | null>(null);
  const [editModalItem, setEditModalItem] = useState<Partial<LogisticsItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [addTrackNodeItem, setAddTrackNodeItem] = useState<LogisticsItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [waybillPrintItem, setWaybillPrintItem] = useState<LogisticsItem | null>(null);

  // Form states for Create/Edit
  const [formData, setFormData] = useState<Partial<LogisticsItem>>({
    trackingNo: '',
    carrier: '顺丰特快',
    orderNo: '',
    recipientName: '',
    recipientPhone: '',
    destination: '',
    status: 'in_transit',
    courierName: '',
    courierPhone: '',
    packagesCount: 1,
    weightKg: 2.5,
  });

  // Track Node Form
  const [nodeTime, setNodeTime] = useState('');
  const [nodeLocation, setNodeLocation] = useState('');
  const [nodeDesc, setNodeDesc] = useState('');
  const [nodeTag, setNodeTag] = useState('在途');

  // Stats calculation
  const stats = useMemo(() => {
    const total = logisticsList.length;
    const inTransit = logisticsList.filter((l) => l.status === 'in_transit').length;
    const delivering = logisticsList.filter((l) => l.status === 'delivering').length;
    const signed = logisticsList.filter((l) => l.status === 'signed').length;
    const exception = logisticsList.filter((l) => l.status === 'exception').length;
    return { total, inTransit, delivering, signed, exception };
  }, [logisticsList]);

  // Filtered and sorted list
  const filteredList = useMemo(() => {
    return logisticsList
      .filter((item) => {
        if (keyword.trim()) {
          const kw = keyword.toLowerCase().trim();
          const matches =
            item.trackingNo.toLowerCase().includes(kw) ||
            item.orderNo.toLowerCase().includes(kw) ||
            item.recipientName.toLowerCase().includes(kw) ||
            item.recipientPhone.includes(kw) ||
            item.destination.toLowerCase().includes(kw);
          if (!matches) return false;
        }

        if (selectedStatus !== 'all' && item.status !== selectedStatus) {
          return false;
        }

        if (selectedCarrier !== 'all' && !item.carrier.includes(selectedCarrier)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const valA = new Date(a.shipTime).getTime();
        const valB = new Date(b.shipTime).getTime();
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [logisticsList, keyword, selectedStatus, selectedCarrier, sortOrder]);

  // Handle open Create
  const handleOpenCreate = () => {
    const randomSeq = Math.floor(10000000000 + Math.random() * 90000000000);
    setFormData({
      trackingNo: `SF${randomSeq}`,
      carrier: '顺丰特快',
      orderNo: `ORD-202607-${Math.floor(8000 + Math.random() * 1000)}`,
      recipientName: '',
      recipientPhone: '',
      destination: '',
      status: 'in_transit',
      courierName: '徐师傅',
      courierPhone: '13899990000',
      packagesCount: 1,
      weightKg: 3.5,
    });
    setIsCreating(true);
    setEditModalItem(null);
  };

  // Handle open Edit
  const handleOpenEdit = (item: LogisticsItem) => {
    setFormData({ ...item });
    setEditModalItem(item);
    setIsCreating(false);
  };

  // Save Create or Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName?.trim()) {
      showToast('请输入收件人姓名', 'error');
      return;
    }
    if (!formData.destination?.trim()) {
      showToast('请输入收货完整地址', 'error');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (isCreating) {
      const newItem: LogisticsItem = {
        id: `logi-${Date.now()}`,
        trackingNo: formData.trackingNo || `SF${Date.now()}`,
        carrier: formData.carrier || '顺丰特快',
        orderNo: formData.orderNo || `ORD-${Date.now()}`,
        recipientName: formData.recipientName!,
        recipientPhone: formData.recipientPhone || '13800000000',
        destination: formData.destination!,
        status: (formData.status as LogisticsStatus) || 'in_transit',
        shipTime: nowStr,
        estimatedDelivery: '2026-07-29 18:00',
        courierName: formData.courierName,
        courierPhone: formData.courierPhone,
        packagesCount: Number(formData.packagesCount) || 1,
        weightKg: Number(formData.weightKg) || 1.0,
        tracks: [
          {
            id: `t-${Date.now()}`,
            time: nowStr,
            location: '华东电商物流仓',
            description: '包裹发货打包完成，顺丰快递员已接单揽收',
            statusTag: '已揽收',
          },
        ],
      };
      setLogisticsList((prev) => [newItem, ...prev]);
      showToast(`成功创建并签发新物流单 [${newItem.trackingNo}]`, 'success');
    } else if (editModalItem) {
      setLogisticsList((prev) =>
        prev.map((item) =>
          item.id === editModalItem.id
            ? {
                ...item,
                ...formData,
                packagesCount: Number(formData.packagesCount),
                weightKg: Number(formData.weightKg),
              }
            : item
        )
      );
      showToast(`运单 [${formData.trackingNo}] 信息已成功修改`, 'success');
    }

    setIsCreating(false);
    setEditModalItem(null);
  };

  // Open add track node modal
  const handleOpenAddTrack = (item: LogisticsItem) => {
    setAddTrackNodeItem(item);
    setNodeTime(new Date().toISOString().replace('T', ' ').substring(0, 19));
    setNodeLocation('发货地/中转站');
    setNodeDesc('包裹已抵达中转分拨中心，正在进行快件分拣');
    setNodeTag('转运');
  };

  // Confirm adding track node
  const handleConfirmAddNode = () => {
    if (!addTrackNodeItem) return;
    if (!nodeDesc.trim()) {
      showToast('请输入物流轨迹描述内容', 'error');
      return;
    }

    const newStep: LogisticsTrackStep = {
      id: `t-${Date.now()}`,
      time: nodeTime || new Date().toISOString().replace('T', ' ').substring(0, 19),
      location: nodeLocation || '中转站点',
      description: nodeDesc,
      statusTag: nodeTag,
    };

    setLogisticsList((prev) =>
      prev.map((item) => {
        if (item.id === addTrackNodeItem.id) {
          const updatedTracks = [newStep, ...item.tracks];
          return {
            ...item,
            tracks: updatedTracks,
          };
        }
        return item;
      })
    );

    // Also update detail item if open
    if (detailItem?.id === addTrackNodeItem.id) {
      setDetailItem((prev) =>
        prev
          ? {
              ...prev,
              tracks: [newStep, ...prev.tracks],
            }
          : null
      );
    }

    showToast(`运单 ${addTrackNodeItem.trackingNo} 已成功追加最新节点轨迹`, 'success');
    setAddTrackNodeItem(null);
  };

  // Delete
  const handleDeleteItem = (id: string) => {
    const target = logisticsList.find((l) => l.id === id);
    setLogisticsList((prev) => prev.filter((l) => l.id !== id));
    showToast(`已删除物流运单 ${target?.trackingNo || id}`, 'info');
    setDeleteConfirmId(null);
    if (detailItem?.id === id) setDetailItem(null);
  };

  // Render Status Badge
  const renderStatusBadge = (status: LogisticsStatus) => {
    switch (status) {
      case 'preparing':
        return (
          <span className={statusBadge.neutral}>
            待发货
          </span>
        );
      case 'in_transit':
        return (
          <span className={statusBadge.info}>
            运输中
          </span>
        );
      case 'delivering':
        return (
          <span className={statusBadge.warning}>
            派送中
          </span>
        );
      case 'signed':
        return (
          <span className={statusBadge.success}>
            已签收
          </span>
        );
      case 'exception':
        return (
          <span className={statusBadge.danger}>
            异常拦截
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Metrics */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-gray-100">
                物流追踪与发货
              </h2>
            </div>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-gray-500 dark:text-gray-400">
              对接全网运力（顺丰、京东、三通一达、DHL），实现包裹签发、实时全程轨道追踪节点追加与异常告警打标。
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => showToast('全网物流运力API接口数据同步成功', 'success')}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>刷新轨迹</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
              id="create-shipment-ticket-btn"
            >
              <Plus className="h-4 w-4" />
              <span>新建发货单</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              label: '包裹运单总数',
              value: stats.total,
              unit: '件',
              helper: '全网物流单',
              icon: Package,
              iconClassName: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-indigo-600 dark:text-indigo-400',
            },
            {
              label: '干线运输中',
              value: stats.inTransit,
              unit: '件',
              helper: '跨仓干线流转',
              icon: Truck,
              iconClassName: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-sky-600 dark:text-sky-400',
            },
            {
              label: '末端派送中',
              value: stats.delivering,
              unit: '件',
              helper: '即将送达客户',
              icon: Send,
              iconClassName: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
              valueClassName: 'text-amber-700 dark:text-amber-300',
              helperClassName: 'text-amber-600 dark:text-amber-400',
            },
            {
              label: '客户已签收',
              value: stats.signed,
              unit: '件',
              helper: '签收闭环完成',
              icon: CheckCircle2,
              iconClassName: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
              valueClassName: 'text-emerald-600 dark:text-emerald-400',
              helperClassName: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              label: '物流异常',
              value: stats.exception,
              unit: '件',
              helper: '滞留或拦截',
              icon: ShieldAlert,
              iconClassName: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
              valueClassName: 'text-rose-600 dark:text-rose-400',
              helperClassName: 'text-rose-600 dark:text-rose-400',
            },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="flex min-h-[88px] items-center justify-between rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
                  <h3 className={`mt-1 text-2xl font-extrabold tracking-tight ${metric.valueClassName}`}>
                    {metric.value}
                    <span className="ml-1 text-xs font-semibold text-gray-400">{metric.unit}</span>
                  </h3>
                  <p className={`mt-0.5 truncate text-xs font-medium ${metric.helperClassName}`}>{metric.helper}</p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${metric.iconClassName}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters & Control Bar */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: '全部包裹', count: logisticsList.length },
              { id: 'in_transit', label: '运输中', count: logisticsList.filter((l) => l.status === 'in_transit').length },
              { id: 'delivering', label: '派送中', count: logisticsList.filter((l) => l.status === 'delivering').length },
              { id: 'signed', label: '已签收', count: logisticsList.filter((l) => l.status === 'signed').length },
              { id: 'exception', label: '物流异常', count: logisticsList.filter((l) => l.status === 'exception').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedStatus === tab.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-xs ${
                    selectedStatus === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const jsonStr = JSON.stringify(filteredList, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `logistics_export_${Date.now()}.json`;
                a.click();
                showToast('已导出当前筛选的运单轨迹 JSON', 'success');
              }}
              className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
              <span>导出发货单</span>
            </button>
          </div>
        </div>

        {/* Search & Carrier filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索运单号 / 原订单 / 收件人 / 电话 / 目的地..."
              className="w-full rounded-xl border border-gray-200/80 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2 pl-9 pr-3 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-gray-400"
            />
            {keyword && (
              <button onClick={() => setKeyword('')} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
              <Filter className="h-3.5 w-3.5" />
              <span>快递公司:</span>
            </div>
            <select
              value={selectedCarrier}
              onChange={(e) => setSelectedCarrier(e.target.value)}
              className="rounded-xl border border-gray-200/80 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-1.5 px-3 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">全部快递承运商</option>
              <option value="顺丰">顺丰速运</option>
              <option value="京东">京东快递</option>
              <option value="中通">中通快递</option>
              <option value="圆通">圆通速递</option>
              <option value="DHL">DHL 国际快递</option>
            </select>

            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-1.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 shrink-0"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
              <span>发货时间 ({sortOrder === 'desc' ? '最新发货' : '最早发货'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table (Read - 查) */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">快递公司 / 运单号</th>
                <th className="py-3 px-4">关联订单号</th>
                <th className="py-3 px-4">收件人 & 送达地址</th>
                <th className="py-3 px-4">最新物流节点动向</th>
                <th className="py-3 px-4">派送员信息</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4">发货时间</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p>未找到匹配的物流运单记录</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const latestTrack = item.tracks && item.tracks.length > 0 ? item.tracks[0] : null;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                      {/* Carrier & Tracking No */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 text-xs font-bold text-sky-700 dark:text-sky-300 border border-sky-200/60">
                            {item.carrier}
                          </span>
                          <span className="font-mono font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                            {item.trackingNo}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.trackingNo);
                                showToast(`已复制运单号 ${item.trackingNo}`, 'success');
                              }}
                              className="text-gray-400 hover:text-sky-600 p-0.5"
                              title="复制单号"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          件数: {item.packagesCount || 1} 件 | 重量: {item.weightKg || 1} kg
                        </div>
                      </td>

                      {/* Linked Order No */}
                      <td className="py-3 px-4 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {item.orderNo}
                      </td>

                      {/* Recipient & Address */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                          <span>{item.recipientName}</span>
                          <span className="text-xs font-normal text-gray-400">({item.recipientPhone})</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate" title={item.destination}>
                          {item.destination}
                        </div>
                      </td>

                      {/* Latest Track Event */}
                      <td className="py-3 px-4 max-w-xs">
                        {latestTrack ? (
                          <div>
                            <div className="flex items-center gap-1">
                              {latestTrack.statusTag && (
                                <span className="rounded-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.2 text-xs font-medium text-gray-600 dark:text-gray-300">
                                  {latestTrack.statusTag}
                                </span>
                              )}
                              <span className="text-gray-800 dark:text-gray-200 truncate font-medium">
                                {latestTrack.description}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">{latestTrack.time} @ {latestTrack.location}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">尚无中转轨迹信息</span>
                        )}
                      </td>

                      {/* Courier */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.courierName ? (
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">{item.courierName}</div>
                            <div className="text-xs text-gray-400">{item.courierPhone}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">中转干线集散中</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">{renderStatusBadge(item.status)}</td>

                      {/* Ship Time */}
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                        {item.shipTime}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Track Timeline */}
                          <button
                            onClick={() => setDetailItem(item)}
                            className="inline-flex items-center gap-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 px-2 py-1 text-xs font-bold transition-colors"
                            title="查看全链路轨迹地图"
                          >
                            <Eye className="h-3 w-3" />
                            <span>追踪</span>
                          </button>

                          {/* Quick Append Node */}
                          <button
                            onClick={() => handleOpenAddTrack(item)}
                            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 transition-colors"
                            title="追加新节点"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>

                          {/* Print Electronic Waybill */}
                          <button
                            onClick={() => setWaybillPrintItem(item)}
                            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-emerald-600 transition-colors"
                            title="预览/打印电子面单"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 transition-colors"
                            title="修改运单"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1 rounded-md text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 transition-colors"
                            title="撤销删除运单"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL (增 / 改) */}
      {(isCreating || editModalItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-sky-600" />
                <span>{isCreating ? '录入并发起新货运单' : `修改运单 [${formData.trackingNo}]`}</span>
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditModalItem(null);
                }}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    快递承运商 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.carrier || '顺丰特快'}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="顺丰特快">顺丰特快</option>
                    <option value="京东快递">京东快递</option>
                    <option value="中通快递">中通快递</option>
                    <option value="圆通速递">圆通速递</option>
                    <option value="申通快递">申通快递</option>
                    <option value="德邦快递">德邦大件物流</option>
                    <option value="DHL 国际快递">DHL 国际快递</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    运单号 (Tracking No) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.trackingNo || ''}
                    onChange={(e) => setFormData({ ...formData, trackingNo: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    关联原订单号 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.orderNo || ''}
                    onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    物流状态
                  </label>
                  <select
                    value={formData.status || 'in_transit'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as LogisticsStatus })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="preparing">待发货</option>
                    <option value="in_transit">运输中</option>
                    <option value="delivering">派送中</option>
                    <option value="signed">已签收</option>
                    <option value="exception">异常拦截</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    收件人姓名 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName || ''}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="客户姓名"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    收件人联系电话
                  </label>
                  <input
                    type="text"
                    value={formData.recipientPhone || ''}
                    onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                    placeholder="e.g. 13812345678"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  收货完整地址 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.destination || ''}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="省市区及详细门牌地址"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    派送员姓名
                  </label>
                  <input
                    type="text"
                    value={formData.courierName || ''}
                    onChange={(e) => setFormData({ ...formData, courierName: e.target.value })}
                    placeholder="e.g. 王师傅"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    派送员电话
                  </label>
                  <input
                    type="text"
                    value={formData.courierPhone || ''}
                    onChange={(e) => setFormData({ ...formData, courierPhone: e.target.value })}
                    placeholder="手机号"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    包裹件数
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.packagesCount || 1}
                    onChange={(e) => setFormData({ ...formData, packagesCount: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    重量 (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weightKg || 1.0}
                    onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 1.0 })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditModalItem(null);
                  }}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 text-xs font-bold shadow-md transition-all"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TRACK NODE MODAL (追加物流节点) */}
      {addTrackNodeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4 bg-sky-50/50 dark:bg-sky-950/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Navigation className="h-5 w-5 text-sky-600" />
                <span>追加物流轨迹节点 - {addTrackNodeItem.trackingNo}</span>
              </h3>
              <button
                onClick={() => setAddTrackNodeItem(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl">
                <div>
                  <span className="text-gray-400">承运商: </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{addTrackNodeItem.carrier}</span>
                </div>
                <div>
                  <span className="text-gray-400">收件人: </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{addTrackNodeItem.recipientName}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  节点时间
                </label>
                <input
                  type="text"
                  value={nodeTime}
                  onChange={(e) => setNodeTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    当前中转地 / 站点
                  </label>
                  <input
                    type="text"
                    value={nodeLocation}
                    onChange={(e) => setNodeLocation(e.target.value)}
                    placeholder="e.g. 北京顺丰转运中心"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    状态标签
                  </label>
                  <select
                    value={nodeTag}
                    onChange={(e) => setNodeTag(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="在途">在途</option>
                    <option value="转运">转运中心</option>
                    <option value="派送">派送中</option>
                    <option value="已签收">已签收</option>
                    <option value="异常">异常滞留</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  轨迹详细描述
                </label>
                <textarea
                  rows={3}
                  value={nodeDesc}
                  onChange={(e) => setNodeDesc(e.target.value)}
                  placeholder="描述包裹动向，例如：快件已到达【北京集散中心】，正发往目的地..."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setAddTrackNodeItem(null)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmAddNode}
                  className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 text-xs font-bold shadow-md transition-all"
                >
                  确认追加节点
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRACKING TIMELINE DRAWER (查看全程轨迹 - 查) */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>{detailItem.carrier}</span>
                  {renderStatusBadge(detailItem.status)}
                </h3>
                <p className="text-xs font-mono text-gray-400 mt-0.5">运单号: {detailItem.trackingNo}</p>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
              {/* Courier & Recipient card */}
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-200/60 dark:border-gray-700/60 space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-gray-400 block text-xs">收件人档案</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{detailItem.recipientName}</span>
                    <span className="text-gray-500 text-xs ml-2">({detailItem.recipientPhone})</span>
                  </div>
                  <button
                    onClick={() => setWaybillPrintItem(detailItem)}
                    className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:underline"
                  >
                    <Printer className="h-3 w-3" />
                    电子面单
                  </button>
                </div>
                <div className="flex items-start gap-1.5 text-gray-600 dark:text-gray-300">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{detailItem.destination}</span>
                </div>

                {detailItem.courierName && (
                  <div className="pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-sm">
                    <span className="text-xs text-gray-500">末端派送员: <strong className="text-sm text-gray-800 dark:text-gray-200">{detailItem.courierName}</strong></span>
                    <a
                      href={`tel:${detailItem.courierPhone}`}
                      className="inline-flex items-center gap-1 text-sky-600 font-semibold hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      {detailItem.courierPhone}
                    </a>
                  </div>
                )}
              </div>

              {/* Simulated Map Visual */}
              <div className="rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 p-4 border border-sky-100 dark:border-sky-900/40 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-sky-900 dark:text-sky-200 flex items-center gap-1">
                    <Navigation className="h-3.5 w-3.5 text-sky-600" />
                    全程轨迹链路路线
                  </span>
                  <span className="text-gray-400">已用时 12 小时</span>
                </div>
                <div className="flex items-center justify-between px-2 py-3 bg-white/80 dark:bg-gray-900/80 rounded-lg shadow-xs">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-800 dark:text-gray-200">发货仓</div>
                    <div className="text-xs text-gray-400">华东总库</div>
                  </div>
                  <div className="flex-1 px-4 flex items-center justify-center">
                    <div className="w-full border-b-2 border-dashed border-sky-400 relative flex justify-center">
                      <Truck className="h-4 w-4 text-sky-600 absolute -top-2 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-800 dark:text-gray-200">目的地</div>
                    <div className="text-xs text-gray-400">客户收货地</div>
                  </div>
                </div>
              </div>

              {/* Timeline list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    包裹动向日志 ({detailItem.tracks.length} 个节点)
                  </h4>
                  <button
                    onClick={() => handleOpenAddTrack(detailItem)}
                    className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>追加节点</span>
                  </button>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                  {detailItem.tracks.map((step, idx) => (
                    <div key={step.id || idx} className="relative group">
                      {/* Circle Dot */}
                      <div
                        className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 bg-white dark:bg-gray-900 ${
                          idx === 0
                            ? 'border-sky-500 bg-sky-500 ring-4 ring-sky-100 dark:ring-sky-900/50'
                            : 'border-gray-300 dark:border-gray-700'
                        }`}
                      />

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-semibold text-sm ${
                              idx === 0 ? 'text-sky-600 dark:text-sky-400' : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {step.location}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">{step.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                        {step.statusTag && (
                          <span className="inline-block rounded-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.2 text-xs font-medium text-gray-500">
                            {step.statusTag}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center text-sm">
              <button
                onClick={() => handleOpenEdit(detailItem)}
                className="text-gray-600 hover:text-sky-600 font-medium"
              >
                编辑运单档案
              </button>
              <button
                onClick={() => setDetailItem(null)}
                className="rounded-xl bg-gray-200 dark:bg-gray-800 px-4 py-1.5 font-semibold text-gray-700 dark:text-gray-300"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WAYBILL PRINT PREVIEW MODAL */}
      {waybillPrintItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-gray-900 space-y-4 relative">
            <button
              onClick={() => setWaybillPrintItem(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Simulated Label Box */}
            <div className="border-2 border-black p-4 space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center border-b-2 border-black pb-2">
                <span className="text-xl font-black">{waybillPrintItem.carrier}</span>
                <span className="text-xs font-mono">标准快递面单</span>
              </div>

              {/* Barcode Mock */}
              <div className="text-center py-2 bg-gray-50 border border-gray-300">
                <div className="h-10 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px)] w-full max-w-[200px] mx-auto" />
                <div className="font-mono font-bold text-sm tracking-widest mt-1">{waybillPrintItem.trackingNo}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t-2 border-black pt-2 text-xs">
                <div>
                  <span className="font-bold block">收件人:</span>
                  <span>{waybillPrintItem.recipientName} {waybillPrintItem.recipientPhone}</span>
                  <p className="text-xs text-gray-600 line-clamp-2">{waybillPrintItem.destination}</p>
                </div>
                <div className="border-l border-gray-300 pl-2">
                  <span className="font-bold block">寄件人:</span>
                  <span>华东电商智能仓储中心</span>
                  <p className="text-xs text-gray-600">上海市闵行区华翔路999号</p>
                </div>
              </div>

              <div className="border-t border-black pt-2 flex justify-between text-xs">
                <span>关联订单: {waybillPrintItem.orderNo}</span>
                <span>件数: {waybillPrintItem.packagesCount || 1} 件 / {waybillPrintItem.weightKg || 1}kg</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setWaybillPrintItem(null)}
                className="rounded-lg border border-gray-300 px-4 py-1.5 text-xs font-medium"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  showToast(`指令已发送至面单打印机：${waybillPrintItem.trackingNo}`, 'success');
                  setWaybillPrintItem(null);
                }}
                className="rounded-lg bg-black text-white px-4 py-1.5 text-xs font-bold flex items-center gap-1"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>立即打印面单</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (删) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">确认撤销/删除运单？</h4>
                <p className="text-xs text-gray-500">删除后该物流订单轨迹将不可恢复</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100"
              >
                取消
              </button>
              <button
                onClick={() => handleDeleteItem(deleteConfirmId)}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold shadow-md"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Warehouse,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  PackageCheck,
  Truck,
  Phone,
  Edit3,
  Trash2,
  X,
  FileSpreadsheet,
  Download,
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
  Boxes,
  Check,
} from 'lucide-react';
import { StockAlertItem } from '../types';
import { stateFill, stateText, statusBadge } from '../uiTheme';

interface StockAlertViewProps {
  stockAlerts: StockAlertItem[];
  setStockAlerts: React.Dispatch<React.SetStateAction<StockAlertItem[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const StockAlertView: React.FC<StockAlertViewProps> = ({
  stockAlerts,
  setStockAlerts,
  showToast,
}) => {
  // Search & Filters
  const [keyword, setKeyword] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');

  // Modals & Drawers
  const [detailItem, setDetailItem] = useState<StockAlertItem | null>(null);
  const [editThresholdItem, setEditThresholdItem] = useState<StockAlertItem | null>(null);
  const [adjustStockItem, setAdjustStockItem] = useState<StockAlertItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [newThreshold, setNewThreshold] = useState<number>(20);
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);
  const [formData, setFormData] = useState<Partial<StockAlertItem>>({
    skuCode: '',
    spuName: '',
    specName: '',
    category: '数码电子',
    warehouse: '华东上海总仓',
    warehouseCode: 'WH-SH-01',
    currentStock: 5,
    safetyStock: 30,
    suggestedReplenish: 100,
    alertLevel: 'critical',
    supplierName: 'Apple 苹果直供代理',
    supplierContact: '021-88880000',
    estimatedDepletionDays: 2,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCount = stockAlerts.length;
    const criticalCount = stockAlerts.filter((a) => a.alertLevel === 'critical').length;
    const warningCount = stockAlerts.filter((a) => a.alertLevel === 'warning').length;
    const overstockCount = stockAlerts.filter((a) => a.alertLevel === 'overstock').length;
    const normalCount = stockAlerts.filter((a) => a.alertLevel === 'normal').length;

    return { totalCount, criticalCount, warningCount, overstockCount, normalCount };
  }, [stockAlerts]);

  // Distinct Warehouses
  const warehouseOptions = useMemo(() => {
    const set = new Set(stockAlerts.map((a) => a.warehouse));
    return Array.from(set);
  }, [stockAlerts]);

  // Filtered List
  const filteredList = useMemo(() => {
    return stockAlerts.filter((item) => {
      // Keyword
      if (keyword.trim()) {
        const kw = keyword.toLowerCase().trim();
        const matches =
          item.spuName.toLowerCase().includes(kw) ||
          item.skuCode.toLowerCase().includes(kw) ||
          item.specName.toLowerCase().includes(kw) ||
          item.supplierName.toLowerCase().includes(kw);
        if (!matches) return false;
      }

      // Level
      if (selectedLevel !== 'all' && item.alertLevel !== selectedLevel) {
        return false;
      }

      // Warehouse
      if (selectedWarehouse !== 'all' && item.warehouse !== selectedWarehouse) {
        return false;
      }

      return true;
    });
  }, [stockAlerts, keyword, selectedLevel, selectedWarehouse]);

  // Batch generate PO (一键生成采购单)
  const handleBatchPurchaseOrder = () => {
    const criticalItems = stockAlerts.filter(
      (a) => a.alertLevel === 'critical' || a.alertLevel === 'warning'
    );
    if (criticalItems.length === 0) {
      showToast('当前没有缺货预警的商品，无需批量生成补货采购单', 'info');
      return;
    }
    const totalReplenish = criticalItems.reduce((sum, a) => sum + a.suggestedReplenish, 0);
    showToast(
      `已针对 ${criticalItems.length} 款紧急缺货 SKU 自动派发采购补货单！建议补货总量: ${totalReplenish} 件`,
      'success'
    );
  };

  // Update Safety Threshold
  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editThresholdItem) return;

    setStockAlerts((prev) =>
      prev.map((item) => {
        if (item.id === editThresholdItem.id) {
          const updatedSafety = newThreshold;
          let level: StockAlertItem['alertLevel'] = 'normal';
          if (item.currentStock === 0 || item.currentStock <= updatedSafety * 0.2) {
            level = 'critical';
          } else if (item.currentStock <= updatedSafety) {
            level = 'warning';
          } else if (item.currentStock >= updatedSafety * 5) {
            level = 'overstock';
          }
          return {
            ...item,
            safetyStock: updatedSafety,
            alertLevel: level,
            suggestedReplenish: Math.max(0, updatedSafety * 3 - item.currentStock),
          };
        }
        return item;
      })
    );

    showToast(`安全库存预警线已调整为 ${newThreshold} 件`, 'success');
    setEditThresholdItem(null);
  };

  // Manual Stock Adjustment
  const handleSaveStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustStockItem) return;

    setStockAlerts((prev) =>
      prev.map((item) => {
        if (item.id === adjustStockItem.id) {
          const newStock = Math.max(0, item.currentStock + stockAdjustment);
          let level: StockAlertItem['alertLevel'] = 'normal';
          if (newStock === 0 || newStock <= item.safetyStock * 0.2) {
            level = 'critical';
          } else if (newStock <= item.safetyStock) {
            level = 'warning';
          } else if (newStock >= item.safetyStock * 5) {
            level = 'overstock';
          }
          return {
            ...item,
            currentStock: newStock,
            alertLevel: level,
            lastStockCheck: new Date().toISOString().replace('T', ' ').slice(0, 19),
            suggestedReplenish: Math.max(0, item.safetyStock * 3 - newStock),
          };
        }
        return item;
      })
    );

    showToast(
      `SKU [${adjustStockItem.skuCode}] 库存变动 ${
        stockAdjustment >= 0 ? '+' + stockAdjustment : stockAdjustment
      } 件，盘点完成`,
      'success'
    );
    setAdjustStockItem(null);
  };

  // Create new stock alert rule
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.skuCode || !formData.spuName) {
      showToast('请填写必要的 SKU 编码与商品名称', 'error');
      return;
    }

    const newItem: StockAlertItem = {
      id: `alert-${Date.now()}`,
      skuCode: formData.skuCode || `SKU-NEW-${Date.now().toString().slice(-4)}`,
      spuName: formData.spuName || '',
      specName: formData.specName || '默认规格',
      category: formData.category || '数码电子',
      warehouse: formData.warehouse || '华东上海总仓',
      warehouseCode: formData.warehouseCode || 'WH-SH-01',
      currentStock: Number(formData.currentStock) || 0,
      safetyStock: Number(formData.safetyStock) || 20,
      suggestedReplenish: Number(formData.suggestedReplenish) || 100,
      alertLevel: (formData.alertLevel as any) || 'critical',
      supplierName: formData.supplierName || '核心供应商',
      supplierContact: formData.supplierContact || '021-12345678',
      estimatedDepletionDays: Number(formData.estimatedDepletionDays) || 1,
      lastStockCheck: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setStockAlerts([newItem, ...stockAlerts]);
    showToast(`成功注册监控条目: ${newItem.spuName}`, 'success');
    setIsCreating(false);
  };

  // Delete Stock Alert Item
  const handleDelete = (id: string) => {
    setStockAlerts((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirmId(null);
    showToast('已移除该商品的库存预警卡片', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 opacity-15">
          <Warehouse className="h-64 w-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/20">
              <ShieldAlert className="h-3.5 w-3.5 text-indigo-200" />
              <span>多仓动态库存熔断与监控</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              多仓库存预警与自动化补货采购中心
            </h1>
            <p className="max-w-2xl text-xs text-indigo-100/80 leading-relaxed">
              实时监测华东总仓、华南仓及全国节点的实际物理库存。当低于安全水位阈值时自动触发熔断预警，并按日销模型一键生成采购补货任务单。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBatchPurchaseOrder}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-800 shadow-lg hover:bg-indigo-50 transition-all active:scale-95"
            >
              <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
              <span>一键生成补货采购单</span>
            </button>

            <button
              onClick={() => {
                setFormData({
                  skuCode: `SKU-ALERT-${Math.floor(100 + Math.random() * 900)}`,
                  spuName: '',
                  specName: '全新包装规格',
                  category: '数码电子',
                  warehouse: '华东上海总仓',
                  warehouseCode: 'WH-SH-01',
                  currentStock: 2,
                  safetyStock: 30,
                  suggestedReplenish: 100,
                  alertLevel: 'critical',
                  supplierName: '核心一级代理供货商',
                  supplierContact: '021-66668888',
                  estimatedDepletionDays: 1,
                });
                setIsCreating(true);
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-black/20 hover:bg-black/30 backdrop-blur-md border border-white/20 px-3.5 py-2.5 text-xs font-medium text-white transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>添加库存监控</span>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/10">
            <div className="text-xs text-rose-200 flex items-center justify-between">
              <span>严重缺货 (断货)</span>
              <AlertCircle className="h-3.5 w-3.5 text-rose-300" />
            </div>
            <div className="text-xl font-bold text-rose-300 mt-0.5">
              {stats.criticalCount} <span className="text-xs font-normal opacity-80">项</span>
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/10">
            <div className="text-xs text-amber-200 flex items-center justify-between">
              <span>安全线告警</span>
              <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
            </div>
            <div className="text-xl font-bold text-amber-300 mt-0.5">
              {stats.warningCount} <span className="text-xs font-normal opacity-80">项</span>
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/10">
            <div className="text-xs text-sky-200 flex items-center justify-between">
              <span>库存滞销积压</span>
              <TrendingUp className="h-3.5 w-3.5 text-sky-300" />
            </div>
            <div className="text-xl font-bold text-sky-300 mt-0.5">
              {stats.overstockCount} <span className="text-xs font-normal opacity-80">项</span>
            </div>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm border border-white/10">
            <div className="text-xs text-emerald-200 flex items-center justify-between">
              <span>正常健康库存</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">
              {stats.normalCount} <span className="text-xs font-normal opacity-80">项</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索 SKU 编码、商品名称、规格或供应商..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 py-2 pl-10 pr-4 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges & Selects */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Pills */}
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-1">
            {[
              { id: 'all', label: '全部分类' },
              { id: 'critical', label: '严重缺货' },
              { id: 'warning', label: '缺货告警' },
              { id: 'overstock', label: '积压告警' },
              { id: 'normal', label: '正常' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedLevel === lvl.id
                    ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* Warehouse Dropdown */}
          <select
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">全域仓储节点</option>
            {warehouseOptions.map((wh) => (
              <option key={wh} value={wh}>
                {wh}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Alert Table */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200/80 dark:border-gray-800">
              <tr>
                <th className="py-3.5 px-4">SKU 编码 / 变体规格</th>
                <th className="py-3.5 px-4">所属商品名称 & 类目</th>
                <th className="py-3.5 px-4">仓储节点</th>
                <th className="py-3.5 px-4 text-center">实际库存 vs 安全预警线</th>
                <th className="py-3.5 px-4 text-center">预计售罄</th>
                <th className="py-3.5 px-4 text-center">告警等级</th>
                <th className="py-3.5 px-4">供应商信息</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span>未查找到匹配的库存预警记录</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const percent = Math.min(
                    100,
                    Math.round((item.currentStock / Math.max(1, item.safetyStock)) * 100)
                  );

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      {/* SKU & Spec */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
                            {item.skuCode}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {item.specName}
                          </span>
                        </div>
                      </td>

                      {/* SPU Name & Category */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {item.spuName}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {item.category}
                          </span>
                        </div>
                      </td>

                      {/* Warehouse */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {item.warehouse}
                          </span>
                          <span className="font-mono text-xs text-gray-400">
                            {item.warehouseCode}
                          </span>
                        </div>
                      </td>

                      {/* Gauge / Stock vs Safety */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-center min-w-[140px]">
                          <div className="flex items-center justify-between w-full text-xs mb-1 font-mono">
                            <span
                              className={`font-bold ${
                                item.alertLevel === 'critical'
                                  ? stateText.danger
                                  : item.alertLevel === 'warning'
                                  ? stateText.warning
                                  : 'text-gray-800 dark:text-gray-200'
                              }`}
                            >
                              现存 {item.currentStock} 件
                            </span>
                            <span className="text-gray-400 text-xs">
                              (线: {item.safetyStock})
                            </span>
                          </div>
                          {/* Visual Progress Bar */}
                          <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.alertLevel === 'critical'
                                  ? stateFill.danger
                                  : item.alertLevel === 'warning'
                                  ? stateFill.warning
                                  : item.alertLevel === 'overstock'
                                  ? stateFill.info
                                  : stateFill.success
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Depletion Days */}
                      <td className="py-3 px-4 text-center font-mono">
                        {item.estimatedDepletionDays === 0 ? (
                          <span className="text-rose-600 font-bold">已彻底耗尽</span>
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300">
                            约 {item.estimatedDepletionDays} 天
                          </span>
                        )}
                      </td>

                      {/* Alert Level Badge */}
                      <td className="py-3 px-4 text-center">
                        {item.alertLevel === 'critical' && (
                          <span className={statusBadge.danger}>
                            严重缺货
                          </span>
                        )}
                        {item.alertLevel === 'warning' && (
                          <span className={statusBadge.warning}>
                            缺货预警
                          </span>
                        )}
                        {item.alertLevel === 'overstock' && (
                          <span className={statusBadge.info}>
                            积压告警
                          </span>
                        )}
                        {item.alertLevel === 'normal' && (
                          <span className={statusBadge.success}>
                            库存正常
                          </span>
                        )}
                      </td>

                      {/* Supplier Info */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {item.supplierName}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {item.supplierContact}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Purchase Requisition */}
                          {item.suggestedReplenish > 0 && (
                            <button
                              onClick={() =>
                                showToast(
                                  `已生成 [${item.skuCode}] 采购补货单 ${item.suggestedReplenish} 件，通知供应商 ${item.supplierName}`,
                                  'success'
                                )
                              }
                              className="rounded-lg bg-amber-50 dark:bg-amber-950/60 px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors"
                              title="向供应商下单补货"
                            >
                              补货+{item.suggestedReplenish}
                            </button>
                          )}

                          {/* Stock Adjustment */}
                          <button
                            onClick={() => {
                              setAdjustStockItem(item);
                              setStockAdjustment(0);
                            }}
                            className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                            title="盘点加减库存"
                          >
                            盘点
                          </button>

                          {/* Edit Threshold */}
                          <button
                            onClick={() => {
                              setEditThresholdItem(item);
                              setNewThreshold(item.safetyStock);
                            }}
                            className="rounded-lg bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                            title="调整预警线"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="rounded-lg bg-rose-50 dark:bg-rose-950/60 px-2 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                            title="移除监控"
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

      {/* Manual Stock Adjustment Modal */}
      {adjustStockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  <Warehouse className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  仓库物理盘点 / 调整库存
                </h3>
              </div>
              <button
                onClick={() => setAdjustStockItem(null)}
                className="p-1 rounded-md text-gray-400 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-semibold text-gray-900 dark:text-white">
                {adjustStockItem.spuName}
              </p>
              <p className="text-gray-400 font-mono">
                SKU: {adjustStockItem.skuCode} ({adjustStockItem.specName})
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                当前库存: <span className="font-bold font-mono">{adjustStockItem.currentStock} 件</span>
              </p>
            </div>

            <form onSubmit={handleSaveStockAdjustment} className="space-y-4 pt-2 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  库存变动数量 (正数为入库盘盈，负数为出库盘亏)
                </label>
                <input
                  type="number"
                  required
                  value={stockAdjustment}
                  onChange={(e) => setStockAdjustment(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="例如: +20 或 -5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setAdjustStockItem(null)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  确认盘点变动
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Threshold Modal */}
      {editThresholdItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  设定安全库存预警线
                </h3>
              </div>
              <button
                onClick={() => setEditThresholdItem(null)}
                className="p-1 rounded-md text-gray-400 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveThreshold} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  安全水位预警阈值 (件)
                </label>
                <input
                  type="number"
                  required
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  当仓库物理库存低于此阀值时，系统将触发紧急预警并高亮提醒。
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditThresholdItem(null)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700"
                >
                  保存设置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Alert Rule Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                  <Warehouse className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  添加新商品库存预警卡片
                </h3>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1 rounded-md text-gray-400 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  SKU 编码 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.skuCode}
                  onChange={(e) => setFormData({ ...formData, skuCode: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  商品全称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.spuName}
                  onChange={(e) => setFormData({ ...formData, spuName: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  placeholder="输入的商品名称"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    变体规格明细
                  </label>
                  <input
                    type="text"
                    value={formData.specName}
                    onChange={(e) => setFormData({ ...formData, specName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    选择仓储节点
                  </label>
                  <select
                    value={formData.warehouse}
                    onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="华东上海总仓">华东上海总仓 (WH-SH-01)</option>
                    <option value="华南广州仓">华南广州仓 (WH-GZ-02)</option>
                    <option value="北京顺义仓">北京顺义仓 (WH-BJ-03)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    当前实际库存 (件)
                  </label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) =>
                      setFormData({ ...formData, currentStock: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    安全预警线 (件)
                  </label>
                  <input
                    type="number"
                    value={formData.safetyStock}
                    onChange={(e) =>
                      setFormData({ ...formData, safetyStock: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  一级供应商名称及联系电话
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    placeholder="供应商公司名称"
                  />
                  <input
                    type="text"
                    value={formData.supplierContact}
                    onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    placeholder="联系电话"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700"
                >
                  保存监控卡片
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/80">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                删除库存预警监控？
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              确定要解除该 SKU 的预警熔断逻辑吗？解除后系统将不再追踪该 SKU 的缺货与补货报警！
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
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

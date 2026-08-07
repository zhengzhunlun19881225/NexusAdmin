import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  X,
  Check,
  Tag,
  Layers,
  ArrowUpDown,
  Download,
  AlertCircle,
  Package,
  TrendingUp,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Archive,
} from 'lucide-react';
import { ProductSPUItem, SKUVariant } from '../types';
import { statusBadge } from '../uiTheme';

interface SpuListViewProps {
  spuList: ProductSPUItem[];
  setSpuList: React.Dispatch<React.SetStateAction<ProductSPUItem[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SpuListView: React.FC<SpuListViewProps> = ({
  spuList,
  setSpuList,
  showToast,
}) => {
  // Search & Filter
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'totalSales' | 'minPrice'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals & Drawers
  const [detailItem, setDetailItem] = useState<ProductSPUItem | null>(null);
  const [editItem, setEditItem] = useState<Partial<ProductSPUItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ProductSPUItem>>({
    spuCode: '',
    name: '',
    brand: '',
    categoryName: '数码电子 / 电脑办公',
    status: 'on_sale',
    coverImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80',
    description: '',
    minPrice: 999,
    maxPrice: 1999,
    totalStock: 50,
    specs: ['标准参数', '黑色'],
  });

  // Calculate stats
  const stats = useMemo(() => {
    const totalSpu = spuList.length;
    const onSaleCount = spuList.filter((s) => s.status === 'on_sale').length;
    const soldOutCount = spuList.filter((s) => s.status === 'sold_out').length;
    const totalSkusCount = spuList.reduce((acc, curr) => acc + (curr.skus?.length || 0), 0);
    const totalStockCount = spuList.reduce((acc, curr) => acc + curr.totalStock, 0);

    return { totalSpu, onSaleCount, soldOutCount, totalSkusCount, totalStockCount };
  }, [spuList]);

  // Categories list for filter dropdown
  const categoryOptions = useMemo(() => {
    const categories = new Set(spuList.map((s) => s.categoryName.split(' / ')[0]));
    return Array.from(categories);
  }, [spuList]);

  // Filtered and sorted SPU list
  const filteredList = useMemo(() => {
    return spuList
      .filter((item) => {
        // Keyword filter
        if (keyword.trim()) {
          const kw = keyword.toLowerCase().trim();
          const matches =
            item.name.toLowerCase().includes(kw) ||
            item.spuCode.toLowerCase().includes(kw) ||
            item.brand.toLowerCase().includes(kw) ||
            item.categoryName.toLowerCase().includes(kw);
          if (!matches) return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && item.status !== selectedStatus) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && !item.categoryName.startsWith(selectedCategory)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];
        if (typeof valueA === 'string') {
          return sortOrder === 'asc'
            ? (valueA as string).localeCompare(valueB as string)
            : (valueB as string).localeCompare(valueA as string);
        }
        return sortOrder === 'asc'
          ? (valueA as number) - (valueB as number)
          : (valueB as number) - (valueA as number);
      });
  }, [spuList, keyword, selectedStatus, selectedCategory, sortBy, sortOrder]);

  // Handle Save (Create or Edit)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.spuCode) {
      showToast('请填写必要的 SPU 编码与商品名称', 'error');
      return;
    }

    if (isCreating) {
      const newSpu: ProductSPUItem = {
        id: `spu-${Date.now()}`,
        spuCode: formData.spuCode || `SPU-${Date.now().toString().slice(-6)}`,
        name: formData.name || '',
        brand: formData.brand || '自有品牌',
        categoryId: 'cat-100',
        categoryName: formData.categoryName || '数码电子 / 电脑办公',
        minPrice: Number(formData.minPrice) || 999,
        maxPrice: Number(formData.maxPrice) || 1999,
        totalStock: Number(formData.totalStock) || 50,
        totalSales: 0,
        status: (formData.status as any) || 'on_sale',
        coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80',
        specs: formData.specs || ['标准配置'],
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        description: formData.description || '暂无详细描述信息',
        skus: [
          {
            id: `sku-${Date.now()}-1`,
            skuCode: `SKU-${formData.spuCode}-01`,
            specName: '标准款 / 独家配置',
            price: Number(formData.minPrice) || 999,
            costPrice: Math.round((Number(formData.minPrice) || 999) * 0.6),
            stock: Number(formData.totalStock) || 50,
            salesCount: 0,
          },
        ],
      };
      setSpuList([newSpu, ...spuList]);
      showToast(`成功新增商品 SPU: ${newSpu.name}`, 'success');
    } else if (editItem) {
      setSpuList((prev) =>
        prev.map((item) =>
          item.id === editItem.id
            ? {
                ...item,
                ...formData,
                minPrice: Number(formData.minPrice) || item.minPrice,
                maxPrice: Number(formData.maxPrice) || item.maxPrice,
                totalStock: Number(formData.totalStock) || item.totalStock,
              }
            : item
        )
      );
      showToast(`成功更新商品 SPU 信息`, 'success');
    }

    setIsCreating(false);
    setEditItem(null);
  };

  // Toggle On/Off Sale
  const handleToggleStatus = (item: ProductSPUItem) => {
    const newStatus = item.status === 'on_sale' ? 'off_sale' : 'on_sale';
    setSpuList((prev) =>
      prev.map((s) => (s.id === item.id ? { ...s, status: newStatus } : s))
    );
    showToast(
      `商品 SPU [${item.spuCode}] 已切换为 ${newStatus === 'on_sale' ? '在售上架' : '已下架'}`,
      'info'
    );
  };

  // Delete SPU
  const handleDelete = (id: string) => {
    setSpuList((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirmId(null);
    showToast('已安全移除该商品 SPU 条目', 'success');
  };

  // Open Edit Modal
  const openEditModal = (item: ProductSPUItem) => {
    setEditItem(item);
    setFormData({
      spuCode: item.spuCode,
      name: item.name,
      brand: item.brand,
      categoryName: item.categoryName,
      status: item.status,
      coverImage: item.coverImage,
      description: item.description,
      minPrice: item.minPrice,
      maxPrice: item.maxPrice,
      totalStock: item.totalStock,
      specs: item.specs,
    });
  };

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({
      spuCode: `SPU-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      brand: 'Nexus精选',
      categoryName: '数码电子 / 电脑办公',
      status: 'on_sale',
      coverImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80',
      description: '全平台新品上市，限量首发，支持30天保价',
      minPrice: 1299,
      maxPrice: 2499,
      totalStock: 100,
      specs: ['高配尊享版', '全光彩外观'],
    });
    setIsCreating(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Metrics */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-gray-100">
                商品 SPU 列表
              </h1>
            </div>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-gray-500 dark:text-gray-400">
              集中管理全平台 SPU Standard Product Unit，精准打通多规格 SKU 组合、上下架状态控制、品牌划线定价与多仓库存同步。
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>发布新商品 SPU</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: '全库 SPU 总数',
              value: stats.totalSpu,
              unit: '款',
              helper: '平台商品主档',
              icon: Package,
              iconClassName: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-indigo-600 dark:text-indigo-400',
            },
            {
              label: '在售中 SPU',
              value: stats.onSaleCount,
              unit: '款',
              helper: '前台可售商品',
              icon: CheckCircle2,
              iconClassName: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
              valueClassName: 'text-emerald-600 dark:text-emerald-400',
              helperClassName: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              label: '衍生 SKU 种类',
              value: stats.totalSkusCount,
              unit: '个',
              helper: '规格组合总数',
              icon: Layers,
              iconClassName: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-sky-600 dark:text-sky-400',
            },
            {
              label: '预估物理总库存',
              value: stats.totalStockCount.toLocaleString(),
              unit: '件',
              helper: '多仓库存汇总',
              icon: Archive,
              iconClassName: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
              valueClassName: 'text-amber-700 dark:text-amber-300',
              helperClassName: 'text-amber-600 dark:text-amber-400',
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

      {/* Control & Filter Panel */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Keyword Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索 SPU 名称、SPU编码、品牌或分类..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 py-2 pl-10 pr-4 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
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

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Selector */}
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-1">
              {[
                { id: 'all', label: '全部状态' },
                { id: 'on_sale', label: '在售中' },
                { id: 'off_sale', label: '已下架' },
                { id: 'sold_out', label: '已售罄' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    selectedStatus === st.id
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">所有大类分类</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort Field */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="createdAt">按发布时间</option>
              <option value="totalSales">按累计销量</option>
              <option value="minPrice">按最低价格</option>
            </select>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="切换升序/降序"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>

            {/* Export CSV Button */}
            <button
              onClick={() => showToast('已导出目前筛选条件下的 SPU 报表 CSV', 'success')}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>导出</span>
            </button>
          </div>
        </div>
      </div>

      {/* SPU Data Table */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200/80 dark:border-gray-800">
              <tr>
                <th className="py-3.5 px-4">商品 SPU 主图/编码</th>
                <th className="py-3.5 px-4">商品名称 & 品牌</th>
                <th className="py-3.5 px-4">所属分类 hierarchy</th>
                <th className="py-3.5 px-4 text-right">标价范围 (元)</th>
                <th className="py-3.5 px-4 text-center">当前库存 / SKU款数</th>
                <th className="py-3.5 px-4 text-center">累计销量</th>
                <th className="py-3.5 px-4 text-center">状态</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span>未找到符合条件的商品 SPU 记录</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const skuCount = item.skus?.length || 0;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      {/* SPU Image & Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.coverImage}
                            alt={item.name}
                            className="h-11 w-11 rounded-xl object-cover border border-gray-200/80 dark:border-gray-800 shrink-0 bg-gray-100 dark:bg-gray-800"
                          />
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {item.spuCode}
                            </span>
                            <span className="text-xs text-gray-400 mt-0.5">
                              {item.createdAt.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Name & Brand */}
                      <td className="py-3 px-4 max-w-[240px]">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {item.name}
                          </span>
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
                            {item.brand}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                          {item.categoryName}
                        </span>
                      </td>

                      {/* Price Range */}
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-gray-100 font-mono">
                        {item.minPrice === item.maxPrice ? (
                          `¥${item.minPrice.toLocaleString()}`
                        ) : (
                          `¥${item.minPrice.toLocaleString()} ~ ¥${item.maxPrice.toLocaleString()}`
                        )}
                      </td>

                      {/* Stock & SKU Count */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`font-mono font-semibold ${
                              item.totalStock === 0
                                ? 'text-rose-500'
                                : item.totalStock < 10
                                ? 'text-amber-500'
                                : 'text-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {item.totalStock} 件
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            ({skuCount} 个SKU款)
                          </span>
                        </div>
                      </td>

                      {/* Total Sales */}
                      <td className="py-3 px-4 text-center font-mono font-medium text-gray-600 dark:text-gray-300">
                        {item.totalSales.toLocaleString()}
                      </td>

                      {/* Status Tag */}
                      <td className="py-3 px-4 text-center">
                        {item.status === 'on_sale' && (
                          <span className={statusBadge.success}>
                            在售中
                          </span>
                        )}
                        {item.status === 'off_sale' && (
                          <span className={statusBadge.neutral}>
                            已下架
                          </span>
                        )}
                        {item.status === 'sold_out' && (
                          <span className={statusBadge.danger}>
                            缺货售罄
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail Drawer */}
                          <button
                            onClick={() => setDetailItem(item)}
                            className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                            title="查看详情"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Toggle On/Off Sale */}
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
                              item.status === 'on_sale'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 hover:bg-amber-100'
                                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                            }`}
                            title={item.status === 'on_sale' ? '下架商品' : '上架商品'}
                          >
                            {item.status === 'on_sale' ? '下架' : '上架'}
                          </button>

                          {/* Edit SPU */}
                          <button
                            onClick={() => openEditModal(item)}
                            className="rounded-lg bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="编辑"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="rounded-lg bg-rose-50 dark:bg-rose-950/60 px-2 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
                            title="删除"
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

      {/* SPU Detail Drawer */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-xl bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    SPU 规格明细与 SKU 列表
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    {detailItem.spuCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Product Cover & Basic Info */}
              <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-800">
                <img
                  src={detailItem.coverImage}
                  alt={detailItem.name}
                  className="h-24 w-24 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                />
                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {detailItem.name}
                  </h4>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    品牌：{detailItem.brand}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    分类：{detailItem.categoryName}
                  </p>
                  <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100">
                    价格区间：¥{detailItem.minPrice.toLocaleString()} ~ ¥{detailItem.maxPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Specs tags */}
              <div className="space-y-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-indigo-500" />
                  通用规格属性标签
                </span>
                <div className="flex flex-wrap gap-2">
                  {detailItem.specs?.map((spec, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 px-2.5 py-1 text-xs text-indigo-700 dark:text-indigo-300"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  商品描述信息
                </span>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-200/60 dark:border-gray-800">
                  {detailItem.description || '暂无详细描述'}
                </div>
              </div>

              {/* SKU List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-indigo-500" />
                    关联 SKU 变体 (共 {detailItem.skus?.length || 0} 项)
                  </span>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <tr>
                        <th className="py-2.5 px-3">SKU 编码</th>
                        <th className="py-2.5 px-3">规格名称</th>
                        <th className="py-2.5 px-3 text-right">售价/成本</th>
                        <th className="py-2.5 px-3 text-center">库存</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {detailItem.skus?.map((sku) => (
                        <tr key={sku.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-2.5 px-3 font-mono text-gray-900 dark:text-gray-100">
                            {sku.skuCode}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-gray-200">
                            {sku.specName}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                              ¥{sku.price}
                            </span>
                            <span className="text-xs text-gray-400 block">
                              (成本 ¥{sku.costPrice})
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-semibold">
                            {sku.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2 bg-gray-50/50 dark:bg-gray-800/40">
              <button
                onClick={() => setDetailItem(null)}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  openEditModal(detailItem);
                  setDetailItem(null);
                }}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                编辑此 SPU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  <Boxes className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isCreating ? '发布新商品 SPU' : '编辑商品 SPU 信息'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditItem(null);
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    SPU 编码 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.spuCode}
                    onChange={(e) => setFormData({ ...formData, spuCode: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. SPU-ELEC-MAC16"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    品牌名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Apple / 苹果"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  商品全称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="输入的商品通用核心名称"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    所属层级类目
                  </label>
                  <input
                    type="text"
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    上架状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="on_sale">在售中 (On Sale)</option>
                    <option value="off_sale">已下架 (Off Sale)</option>
                    <option value="sold_out">售罄 (Sold Out)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    最低标价 (¥)
                  </label>
                  <input
                    type="number"
                    value={formData.minPrice}
                    onChange={(e) => setFormData({ ...formData, minPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    最高标价 (¥)
                  </label>
                  <input
                    type="number"
                    value={formData.maxPrice}
                    onChange={(e) => setFormData({ ...formData, maxPrice: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    物理总库存 (件)
                  </label>
                  <input
                    type="number"
                    value={formData.totalStock}
                    onChange={(e) => setFormData({ ...formData, totalStock: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  主图 Image URL
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  详细描述说明
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="填写关于该 SPU 的简要宣传卖点及规格说明..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditItem(null);
                  }}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  保存并提交
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
                确认删除此 SPU？
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              此操作将永久抹除该商品 SPU 及其关联的所有下级 SKU 数据，且不可恢复！
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

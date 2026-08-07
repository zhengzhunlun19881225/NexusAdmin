import React, { useState, useMemo } from 'react';
import {
  FolderTree,
  Search,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  X,
  ChevronRight,
  ChevronDown,
  Layers,
  Folder,
  FolderOpen,
  CheckCircle2,
  XCircle,
  Percent,
  SlidersHorizontal,
  Info,
  Check,
  AlertCircle,
  Hash,
} from 'lucide-react';
import { CategoryItem } from '../types';
import { statusBadge } from '../uiTheme';

interface CategoryConfigViewProps {
  categories: CategoryItem[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CategoryConfigView: React.FC<CategoryConfigViewProps> = ({
  categories,
  setCategories,
  showToast,
}) => {
  // Search & Filters
  const [keyword, setKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<string[]>(['cat-100', 'cat-101', 'cat-200', 'cat-300']);

  // Modals & States
  const [isCreating, setIsCreating] = useState(false);
  const [editItem, setEditItem] = useState<CategoryItem | null>(null);
  const [parentForSub, setParentForSub] = useState<CategoryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CategoryItem>>({
    code: '',
    name: '',
    parentId: null,
    level: 1,
    sortOrder: 1,
    status: 'enabled',
    commissionRate: 5.0,
    taxRate: 13.0,
    description: '',
  });

  // Calculate statistics
  const stats = useMemo(() => {
    let totalCount = 0;
    let enabledCount = 0;
    let totalProducts = 0;

    const countRecursive = (list: CategoryItem[]) => {
      list.forEach((item) => {
        totalCount++;
        if (item.status === 'enabled') enabledCount++;
        totalProducts += item.productCount || 0;
        if (item.children) countRecursive(item.children);
      });
    };

    countRecursive(categories);
    return { totalCount, enabledCount, totalProducts };
  }, [categories]);

  // Expand / Collapse all
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    const allIds: string[] = [];
    const collect = (list: CategoryItem[]) => {
      list.forEach((item) => {
        allIds.push(item.id);
        if (item.children) collect(item.children);
      });
    };
    collect(categories);
    setExpandedIds(allIds);
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  // Filter Categories by Keyword & Status
  const filterCategoryTree = (list: CategoryItem[]): CategoryItem[] => {
    if (!keyword.trim() && selectedStatus === 'all') return list;

    return list
      .map((item) => {
        const matchesKw =
          !keyword.trim() ||
          item.name.toLowerCase().includes(keyword.toLowerCase().trim()) ||
          item.code.toLowerCase().includes(keyword.toLowerCase().trim());

        const matchesStatus =
          selectedStatus === 'all' || item.status === selectedStatus;

        const filteredChildren = item.children ? filterCategoryTree(item.children) : [];

        if ((matchesKw && matchesStatus) || filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : item.children,
          };
        }
        return null;
      })
      .filter(Boolean) as CategoryItem[];
  };

  const filteredCategories = useMemo(
    () => filterCategoryTree(categories),
    [categories, keyword, selectedStatus]
  );

  // Toggle Status (启用 / 禁用)
  const handleToggleStatus = (targetId: string) => {
    const updateRecursive = (list: CategoryItem[]): CategoryItem[] => {
      return list.map((item) => {
        if (item.id === targetId) {
          const newStatus = item.status === 'enabled' ? 'disabled' : 'enabled';
          showToast(`类目 [${item.name}] 状态已调整为 ${newStatus === 'enabled' ? '启用' : '禁用'}`, 'info');
          return { ...item, status: newStatus };
        }
        if (item.children) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    setCategories((prev) => updateRecursive(prev));
  };

  // Open Create Sub-Category Modal
  const openAddSubModal = (parent: CategoryItem) => {
    setParentForSub(parent);
    setFormData({
      code: `CAT-${parent.code.replace('CAT-', '')}-${Math.floor(10 + Math.random() * 90)}`,
      name: '',
      parentId: parent.id,
      parentName: parent.name,
      level: (parent.level + 1) as 1 | 2 | 3,
      sortOrder: 1,
      status: 'enabled',
      commissionRate: parent.commissionRate,
      taxRate: parent.taxRate,
      description: `属于 [${parent.name}] 下的子级分类`,
    });
    setIsCreating(true);
  };

  // Open Create Top-Level Category Modal
  const openAddTopModal = () => {
    setParentForSub(null);
    setFormData({
      code: `CAT-TOP-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      parentId: null,
      level: 1,
      sortOrder: categories.length + 1,
      status: 'enabled',
      commissionRate: 5.0,
      taxRate: 13.0,
      description: '全平台一级核心商品大类',
    });
    setIsCreating(true);
  };

  // Open Edit Modal
  const openEditModal = (item: CategoryItem) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      parentId: item.parentId,
      parentName: item.parentName,
      level: item.level,
      sortOrder: item.sortOrder,
      status: item.status,
      commissionRate: item.commissionRate,
      taxRate: item.taxRate,
      description: item.description,
    });
  };

  // Save (Create or Edit)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      showToast('请填写必要的类目名称与编码', 'error');
      return;
    }

    if (isCreating) {
      const newCategory: CategoryItem = {
        id: `cat-${Date.now()}`,
        code: formData.code || `CAT-${Date.now().toString().slice(-4)}`,
        name: formData.name || '',
        parentId: formData.parentId || null,
        parentName: formData.parentName,
        level: formData.level as 1 | 2 | 3,
        sortOrder: Number(formData.sortOrder) || 1,
        status: (formData.status as any) || 'enabled',
        productCount: 0,
        commissionRate: Number(formData.commissionRate) || 5.0,
        taxRate: Number(formData.taxRate) || 13.0,
        description: formData.description || '',
      };

      if (!newCategory.parentId) {
        setCategories([...categories, newCategory]);
      } else {
        const addToParent = (list: CategoryItem[]): CategoryItem[] => {
          return list.map((item) => {
            if (item.id === newCategory.parentId) {
              return {
                ...item,
                children: [...(item.children || []), newCategory],
              };
            }
            if (item.children) {
              return { ...item, children: addToParent(item.children) };
            }
            return item;
          });
        };
        setCategories((prev) => addToParent(prev));
      }

      showToast(`新增类目 [${newCategory.name}] 成功`, 'success');
    } else if (editItem) {
      const updateRecursive = (list: CategoryItem[]): CategoryItem[] => {
        return list.map((item) => {
          if (item.id === editItem.id) {
            return {
              ...item,
              ...formData,
              commissionRate: Number(formData.commissionRate) || item.commissionRate,
              taxRate: Number(formData.taxRate) || item.taxRate,
              sortOrder: Number(formData.sortOrder) || item.sortOrder,
            };
          }
          if (item.children) {
            return { ...item, children: updateRecursive(item.children) };
          }
          return item;
        });
      };
      setCategories((prev) => updateRecursive(prev));
      showToast(`已成功保存类目配置更改`, 'success');
    }

    setIsCreating(false);
    setEditItem(null);
  };

  // Delete Category
  const handleDelete = (id: string) => {
    const deleteRecursive = (list: CategoryItem[]): CategoryItem[] => {
      return list
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: item.children ? deleteRecursive(item.children) : undefined,
        }));
    };

    setCategories((prev) => deleteRecursive(prev));
    setDeleteConfirmId(null);
    showToast('已移除该类目及其包含的属性设置', 'success');
  };

  // Recursive Table Row Renderer
  const renderCategoryRow = (item: CategoryItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.includes(item.id);

    return (
      <React.Fragment key={item.id}>
        <tr className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors border-b border-gray-100 dark:border-gray-800/60">
          {/* Category Tree Name & Code */}
          <td className="py-3 px-4">
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${depth * 24}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
              ) : (
                <span className="w-5" />
              )}

              {depth === 0 ? (
                <FolderOpen className="h-4 w-4 text-indigo-500 shrink-0" />
              ) : depth === 1 ? (
                <Folder className="h-4 w-4 text-indigo-400 shrink-0" />
              ) : (
                <Layers className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              )}

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </span>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-gray-500 dark:text-gray-400">
                  {item.code}
                </span>
              </div>
            </div>
          </td>

          {/* Hierarchy Level */}
          <td className="py-3 px-4 text-center">
            {item.level === 1 && (
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 text-xs font-bold border border-indigo-200/50 dark:border-indigo-800/50">
                一级大类
              </span>
            )}
            {item.level === 2 && (
              <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 text-xs font-bold border border-indigo-200/50 dark:border-indigo-800/50">
                二级子类
              </span>
            )}
            {item.level === 3 && (
              <span className="rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-0.5 text-xs font-medium">
                三级细分类
              </span>
            )}
          </td>

          {/* Product Count */}
          <td className="py-3 px-4 text-center font-mono font-medium text-gray-700 dark:text-gray-300">
            {item.productCount || 0} 件
          </td>

          {/* Commission & Tax Rate */}
          <td className="py-3 px-4 text-center font-mono">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {item.commissionRate}%
            </span>
            <span className="text-gray-400 text-xs ml-1">
              (税率 {item.taxRate}%)
            </span>
          </td>

          {/* Sort Weight */}
          <td className="py-3 px-4 text-center font-mono text-gray-500 dark:text-gray-400">
            #{item.sortOrder}
          </td>

          {/* Status Badge */}
          <td className="py-3 px-4 text-center">
            {item.status === 'enabled' ? (
              <span className={statusBadge.success}>
                已启用
              </span>
            ) : (
              <span className={statusBadge.neutral}>
                已禁用
              </span>
            )}
          </td>

          {/* Actions */}
          <td className="py-3 px-4 text-right">
            <div className="flex items-center justify-end gap-1.5">
              {item.level < 3 && (
                <button
                  onClick={() => openAddSubModal(item)}
                  className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                  title="添加下级子类目"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}

              <button
                onClick={() => handleToggleStatus(item.id)}
                className={`rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
                  item.status === 'enabled'
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 hover:bg-amber-100'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                }`}
                title={item.status === 'enabled' ? '禁用类目' : '启用类目'}
              >
                {item.status === 'enabled' ? '禁用' : '启用'}
              </button>

              <button
                onClick={() => openEditModal(item)}
                className="rounded-lg bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                title="编辑属性"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => setDeleteConfirmId(item.id)}
                className="rounded-lg bg-rose-50 dark:bg-rose-950/60 px-2 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                title="删除类目"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </td>
        </tr>

        {/* Child rows */}
        {hasChildren &&
          isExpanded &&
          item.children!.map((child) => renderCategoryRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Metrics */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-gray-100">
                多级类目配置
              </h1>
            </div>
            <p className="mt-2 max-w-3xl text-xs leading-5 text-gray-500 dark:text-gray-400">
              支持三级商品分类嵌套树（一级大类 / 二级中类 / 三级细节品类），灵活设置平台交易佣金扣率、发票增殖税率与全路径层级节点。
            </p>
          </div>

          <button
            onClick={openAddTopModal}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>添加一级大类目</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: '类目总节点数',
              value: stats.totalCount,
              unit: '个',
              helper: '全路径分类树',
              icon: FolderTree,
              iconClassName: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
              valueClassName: 'text-gray-950 dark:text-gray-100',
              helperClassName: 'text-indigo-600 dark:text-indigo-400',
            },
            {
              label: '生效启用中',
              value: stats.enabledCount,
              unit: '个',
              helper: '可用于商品挂载',
              icon: CheckCircle2,
              iconClassName: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
              valueClassName: 'text-emerald-600 dark:text-emerald-400',
              helperClassName: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              label: '挂载商品总数',
              value: stats.totalProducts.toLocaleString(),
              unit: '件',
              helper: '关联在线商品',
              icon: Hash,
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

      {/* Filter and Expand Controls */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索类目名称或分类编码..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 py-2 pl-10 pr-4 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            展开全部分类
          </button>
          <button
            onClick={collapseAll}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            折叠节点
          </button>
        </div>
      </div>

      {/* Category Tree Table */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200/80 dark:border-gray-800">
              <tr>
                <th className="py-3.5 px-4 min-w-[280px]">类目层级名称 & 编码</th>
                <th className="py-3.5 px-4 text-center">层级深度</th>
                <th className="py-3.5 px-4 text-center">关联商品数</th>
                <th className="py-3.5 px-4 text-center">平台扣率 / 税率</th>
                <th className="py-3.5 px-4 text-center">排序权重</th>
                <th className="py-3.5 px-4 text-center">状态</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span>未查询到匹配的多级类目</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((topCat) => renderCategoryRow(topCat, 0))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {(isCreating || editItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  <FolderTree className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isCreating
                    ? parentForSub
                      ? `新增 [${parentForSub.name}] 的下级类目`
                      : '新增一级根类目'
                    : '编辑类目属性配置'}
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
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  类目唯一编码 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. CAT-DIGITAL-LAPTOP"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  类目名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. 轻薄笔记本"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    平台抽成扣率 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.commissionRate}
                    onChange={(e) =>
                      setFormData({ ...formData, commissionRate: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    标准增殖税率 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.taxRate}
                    onChange={(e) =>
                      setFormData({ ...formData, taxRate: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    排序权重 (越小越靠前)
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="enabled">启用 (Enabled)</option>
                    <option value="disabled">禁用 (Disabled)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                  类目备注 / 规则说明
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  placeholder="填写该类目的审核提示或经营范围..."
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
                  保存配置
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
                删除类目节点？
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              将连同下属未解绑的子属性一并移除，请确认该类目下已无关联处于在线状态的商品 SPU！
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
                确认移除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

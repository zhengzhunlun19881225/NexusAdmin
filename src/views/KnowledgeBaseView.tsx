import React, { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  File,
  FileArchive,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { actionButton, compactBadge, statusBadge } from '../uiTheme';

type KnowledgeFileType = 'pdf' | 'doc' | 'sheet' | 'zip' | 'md';

interface KnowledgeFolder {
  id: string;
  title: string;
  count: number;
  children?: KnowledgeFolder[];
}

interface KnowledgeFile {
  id: string;
  name: string;
  type: KnowledgeFileType;
  size: string;
  folder: string;
  owner: string;
  updatedAt: string;
  status: 'ready' | 'parsing' | 'draft';
}

const folders: KnowledgeFolder[] = [
  {
    id: 'operations',
    title: '运营规范中心',
    count: 18,
    children: [
      { id: 'operations-process', title: '流程制度', count: 6 },
      { id: 'operations-service', title: '服务话术', count: 5 },
      { id: 'operations-risk', title: '风控说明', count: 7 },
    ],
  },
  {
    id: 'products',
    title: '商品资料库',
    count: 21,
    children: [
      { id: 'products-spu', title: 'SPU管理手册', count: 9 },
      { id: 'products-category', title: '类目配置说明', count: 4 },
      { id: 'products-stock', title: '库存预警资料', count: 8 },
    ],
  },
  {
    id: 'customers',
    title: '客户运营知识',
    count: 16,
    children: [
      { id: 'customers-crm', title: 'CRM SOP', count: 6 },
      { id: 'customers-vip', title: '会员权益规则', count: 5 },
      { id: 'customers-segment', title: '分群画像模板', count: 5 },
    ],
  },
  { id: 'analytics', title: '数据分析模板', count: 12 },
  { id: 'archive', title: '历史归档资料', count: 35 },
];

const files: KnowledgeFile[] = [
  {
    id: 'KB-202608-001',
    name: '售后争议处理标准作业说明',
    type: 'pdf',
    size: '248KB',
    folder: '流程制度',
    owner: '林国鑫',
    updatedAt: '2026-08-06 10:30',
    status: 'ready',
  },
  {
    id: 'KB-202608-002',
    name: '商品SPU上架字段填写规范',
    type: 'doc',
    size: '164KB',
    folder: 'SPU管理手册',
    owner: '周强',
    updatedAt: '2026-08-05 16:12',
    status: 'ready',
  },
  {
    id: 'KB-202608-003',
    name: '库存预警阈值计算模板',
    type: 'sheet',
    size: '96KB',
    folder: '库存预警资料',
    owner: '钱浩然',
    updatedAt: '2026-08-04 09:48',
    status: 'parsing',
  },
  {
    id: 'KB-202608-004',
    name: '会员等级权益配置清单',
    type: 'doc',
    size: '182KB',
    folder: '会员权益规则',
    owner: '李娜',
    updatedAt: '2026-08-03 14:20',
    status: 'ready',
  },
  {
    id: 'KB-202608-005',
    name: '订单审核异常场景问答集',
    type: 'pdf',
    size: '310KB',
    folder: '服务话术',
    owner: '张敏超',
    updatedAt: '2026-08-02 11:05',
    status: 'ready',
  },
  {
    id: 'KB-202608-006',
    name: '数据看板指标口径归档包',
    type: 'zip',
    size: '1.2MB',
    folder: '数据分析模板',
    owner: '刘洋',
    updatedAt: '2026-08-01 18:30',
    status: 'draft',
  },
  {
    id: 'KB-202608-007',
    name: '客户分群标签命名规则',
    type: 'md',
    size: '74KB',
    folder: '分群画像模板',
    owner: '王雅婷',
    updatedAt: '2026-07-31 15:42',
    status: 'ready',
  },
  {
    id: 'KB-202608-008',
    name: '开放API调用安全说明',
    type: 'pdf',
    size: '286KB',
    folder: '风控说明',
    owner: 'admin',
    updatedAt: '2026-07-30 10:10',
    status: 'ready',
  },
];

const typeMeta: Record<KnowledgeFileType, { label: string; icon: React.ElementType; className: string }> = {
  pdf: { label: 'PDF', icon: FileText, className: 'bg-rose-50 text-rose-700 border-rose-100' },
  doc: { label: 'DOC', icon: File, className: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  sheet: { label: 'XLS', icon: FileSpreadsheet, className: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  zip: { label: 'ZIP', icon: FileArchive, className: 'bg-amber-50 text-amber-700 border-amber-100' },
  md: { label: 'MD', icon: FileText, className: 'bg-sky-50 text-sky-700 border-sky-100' },
};

const statusMeta = {
  ready: { label: '可检索', className: statusBadge.success },
  parsing: { label: '解析中', className: statusBadge.warning },
  draft: { label: '草稿', className: statusBadge.neutral },
};

const statCards = [
  { label: '知识文件', value: '102', note: '8 个目录组', tone: 'text-indigo-600' },
  { label: '已解析内容', value: '86', note: '支持全文检索', tone: 'text-emerald-600' },
  { label: '本周新增', value: '12', note: '3 个待复核', tone: 'text-amber-600' },
  { label: '引用命中', value: '4,821', note: '近 30 天', tone: 'text-sky-600' },
];

export const KnowledgeBaseView: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState('operations-process');
  const [keyword, setKeyword] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['operations', 'products', 'customers']);

  const selectedFolderTitle = useMemo(() => {
    const flat = folders.flatMap((folder) => [folder, ...(folder.children || [])]);
    return flat.find((folder) => folder.id === selectedFolder)?.title || '全部资料';
  }, [selectedFolder]);

  const filteredFiles = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    return files.filter((file) => {
      const folderMatch = selectedFolder === 'archive' || file.folder === selectedFolderTitle || folders.some((folder) => folder.id === selectedFolder && folder.children?.some((child) => child.title === file.folder));
      const keywordMatch =
        !trimmed ||
        file.name.toLowerCase().includes(trimmed) ||
        file.folder.toLowerCase().includes(trimmed) ||
        file.owner.toLowerCase().includes(trimmed);
      return folderMatch && keywordMatch;
    });
  }, [keyword, selectedFolder, selectedFolderTitle]);

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const renderFolder = (folder: KnowledgeFolder, level = 0) => {
    const isExpanded = expandedFolders.includes(folder.id);
    const isSelected = selectedFolder === folder.id;
    const hasChildren = Boolean(folder.children?.length);
    const Icon = hasChildren && isExpanded ? FolderOpen : Folder;

    return (
      <div key={folder.id}>
        <button
          className={`flex h-8 w-full items-center gap-2 rounded-lg px-2 text-left text-sm font-semibold transition-colors ${
            isSelected ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
          style={{ paddingLeft: `${8 + level * 18}px` }}
          onClick={() => {
            setSelectedFolder(folder.id);
            if (hasChildren) toggleFolder(folder.id);
          }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <span className="h-4 w-4 shrink-0" />
          )}
          <Icon className="h-4 w-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate">{folder.title}</span>
          <span className="rounded-lg bg-gray-100 px-1.5 py-0.5 text-xs font-bold text-gray-500">{folder.count}</span>
        </button>
        {hasChildren && isExpanded && <div className="mt-1 space-y-1">{folder.children?.map((child) => renderFolder(child, level + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className={compactBadge.primary}>企业知识资产 / 文档解析与检索</div>
          <h1 className="mt-3 flex items-center gap-2 text-xl font-black text-gray-900">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            知识库
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            统一沉淀运营制度、商品资料、客户规则和数据口径，支持目录化管理、文件解析、检索与权限化引用。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className={actionButton.secondary}>
            <RefreshCw className="h-4 w-4" />
            刷新索引
          </button>
          <button className={actionButton.primary}>
            <Upload className="h-4 w-4" />
            上传资料
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-medium text-gray-500">{stat.label}</div>
            <div className={`mt-2 text-2xl font-black ${stat.tone}`}>{stat.value}</div>
            <div className="mt-1 text-xs text-gray-500">{stat.note}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <aside className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-gray-900">知识目录</h2>
            <button className={actionButton.icon} aria-label="新增目录">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="h-8 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="搜索目录..."
            />
          </div>
          <div className="space-y-1">{folders.map((folder) => renderFolder(folder))}</div>
        </aside>

        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">{selectedFolderTitle}</h2>
                <p className="mt-1 text-xs text-gray-500">当前目录共 {filteredFiles.length} 份资料，已按最近更新时间排序</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    className="h-8 w-[320px] rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="搜索文件名称、目录或负责人..."
                  />
                </div>
                <select className="h-8 w-[150px] rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                  <option>全部格式</option>
                  <option>PDF</option>
                  <option>DOC</option>
                  <option>表格</option>
                  <option>压缩包</option>
                </select>
                <button className={actionButton.secondary}>
                  <ArrowUpDown className="h-4 w-4" />
                  更新时间
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" aria-label="全选文件" />
                  </th>
                  <th className="px-4 py-3 font-bold">序号</th>
                  <th className="px-4 py-3 font-bold">文件名称</th>
                  <th className="px-4 py-3 font-bold">格式</th>
                  <th className="px-4 py-3 font-bold">文件大小</th>
                  <th className="px-4 py-3 font-bold">目录</th>
                  <th className="px-4 py-3 font-bold">更新时间</th>
                  <th className="px-4 py-3 font-bold">解析状态</th>
                  <th className="px-4 py-3 text-right font-bold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFiles.map((file, index) => {
                  const meta = typeMeta[file.type];
                  const TypeIcon = meta.icon;
                  return (
                    <tr key={file.id} className="text-gray-700 hover:bg-gray-50/80">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" aria-label={`选择 ${file.name}`} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{String(index + 1).padStart(2, '0')}</td>
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${meta.className}`}>
                            <TypeIcon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="truncate font-bold text-gray-900">{file.name}</div>
                            <div className="mt-0.5 font-mono text-xs text-gray-400">{file.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-lg border px-2 py-0.5 text-xs font-bold ${meta.className}`}>{meta.label}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-600">{file.size}</td>
                      <td className="px-4 py-3 text-gray-600">{file.folder}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{file.updatedAt}</td>
                      <td className="px-4 py-3">
                        <span className={statusMeta[file.status].className}>{statusMeta[file.status].label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className={actionButton.ghost}>
                            <Eye className="h-4 w-4" />
                            预览
                          </button>
                          <button className={actionButton.ghost}>
                            <Download className="h-4 w-4" />
                            下载
                          </button>
                          <button className={actionButton.iconDanger} aria-label={`删除 ${file.name}`}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className={actionButton.icon} aria-label={`更多操作 ${file.name}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <div className="text-sm text-gray-500">共 102 份资料，当前显示 {filteredFiles.length} 份</div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  className={`h-8 min-w-8 rounded-lg px-2 text-sm font-bold ${page === 1 ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              ))}
              <button className={actionButton.icon} aria-label="下一页">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  Clock,
  AlertTriangle,
  Truck,
  Package,
  Boxes,
  FolderTree,
  Warehouse,
  Users,
  UserCheck,
  PieChart,
  Award,
  Ticket,
  Tag,
  Zap,
  BarChart3,
  TrendingUp,
  DollarSign,
  Settings,
  ShieldCheck,
  FileText,
  KeyRound,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  Check,
  Search,
  Sparkles
} from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_TREE } from '../mockData';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activePath: string;
  setActivePath: (path: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  Clock,
  AlertTriangle,
  Truck,
  Package,
  Boxes,
  FolderTree,
  Warehouse,
  Users,
  UserCheck,
  PieChart,
  Award,
  Ticket,
  Tag,
  Zap,
  BarChart3,
  TrendingUp,
  DollarSign,
  Settings,
  ShieldCheck,
  FileText,
  KeyRound,
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  activePath,
  setActivePath,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['orders', 'products']);
  const [currentWorkspace, setCurrentWorkspace] = useState('华东数字运营中心');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderIcon = (name: string, className = 'h-4 w-4') => {
    const IconComponent = ICON_MAP[name] || LayoutDashboard;
    return <IconComponent className={className} />;
  };

  const filterMenu = (items: MenuItem[]): MenuItem[] => {
    if (!menuSearch.trim()) return items;
    return items
      .map((item) => {
        const matchesTitle = item.title.toLowerCase().includes(menuSearch.toLowerCase());
        const matchingChildren = item.children ? filterMenu(item.children) : [];
        if (matchesTitle || matchingChildren.length > 0) {
          return {
            ...item,
            children: matchingChildren.length > 0 ? matchingChildren : item.children,
          };
        }
        return null;
      })
      .filter(Boolean) as MenuItem[];
  };

  const filteredTree = filterMenu(MENU_TREE);

  return (
    <aside
      className={`fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] border-r border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Workspace Selector Bar */}
      {isOpen ? (
        <div className="p-3 border-b border-gray-100 dark:border-gray-800/80 relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex w-full items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800/60 p-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col text-left truncate">
                <span className="font-semibold text-gray-900 dark:text-white truncate">
                  {currentWorkspace}
                </span>
                <span className="text-xs text-gray-400">切换组织中心</span>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          </button>

          {/* Workspace Switcher Popover */}
          {showWorkspaceMenu && (
            <div className="absolute left-3 right-3 top-16 z-50 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-1.5 shadow-xl text-sm animate-in fade-in slide-in-from-top-1">
              {[
                '华东数字运营中心',
                '跨境电商自营事业部',
                '华南供应链仓储基地',
                '集团财务管控中心',
              ].map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    setCurrentWorkspace(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 transition-colors ${
                    ws === currentWorkspace
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="truncate">{ws}</span>
                  {ws === currentWorkspace && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          )}

          {/* Inline Quick Search for Menu */}
          <div className="mt-2 relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="快速搜索菜单..."
              className="w-full rounded-lg border border-gray-200/80 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 py-1.5 pl-8 pr-3 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-400"
            />
          </div>
        </div>
      ) : (
        <div className="py-3 flex justify-center border-b border-gray-100 dark:border-gray-800/80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Building2 className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Navigation Links Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
        {filteredTree.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          const hasChildren = item.children && item.children.length > 0;
          const isChildActive = item.children?.some(
            (c) => c.path === activePath || c.id === activePath
          );
          const isActive = item.path === activePath || item.id === activePath || isChildActive;

          return (
            <div key={item.id} className="space-y-1">
              {/* Top Level Item */}
              <button
                onClick={() => {
                  if (hasChildren && isOpen) {
                    toggleExpand(item.id);
                  } else if (item.path) {
                    setActivePath(item.path);
                  }
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                title={!isOpen ? item.title : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`transition-colors ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    }`}
                  >
                    {renderIcon(item.iconName)}
                  </div>
                  {isOpen && <span className="truncate">{item.title}</span>}
                </div>

                {isOpen && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs font-bold text-white ${
                          item.badgeColor || 'bg-indigo-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {hasChildren && (
                      <span className="text-gray-400 transition-transform duration-200">
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Submenu Items */}
              {isOpen && hasChildren && isExpanded && (
                <div className="ml-4 pl-2.5 border-l border-gray-200 dark:border-gray-800 space-y-1 my-1">
                  {item.children!.map((child) => {
                    const isSubActive =
                      (child.path && child.path === activePath) || child.id === activePath;

                    return (
                      <button
                        key={child.id}
                        onClick={() => setActivePath(child.path || child.id)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                          isSubActive
                            ? 'bg-indigo-600 text-white font-medium shadow-xs'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {renderIcon(child.iconName, 'h-3.5 w-3.5 opacity-80')}
                          <span className="truncate">{child.title}</span>
                        </div>
                        {child.badge && (
                          <span
                            className={`rounded-full px-1.5 py-0.2 text-xs font-semibold ${
                              isSubActive
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            {child.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Collapse Button */}
      <div className="p-2 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-center gap-2 rounded-xl p-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800 transition-colors"
          title={isOpen ? '收起侧边栏' : '展开侧边栏'}
          id="collapse-sidebar-toggle-btn"
        >
          {isOpen ? (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span>收起侧边栏</span>
            </>
          ) : (
            <ChevronsRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
};

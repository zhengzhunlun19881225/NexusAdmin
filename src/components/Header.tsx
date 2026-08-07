import React, { useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  Menu,
  Check,
  ChevronDown,
  User,
  Shield,
  HelpCircle,
  LogOut,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Plus
} from 'lucide-react';
import { NotificationItem, ThemeColor, LayoutDensity } from '../types';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  themeColor: ThemeColor;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onOpenNewOrder: () => void;
  layoutDensity: LayoutDensity;
  setLayoutDensity: (density: LayoutDensity) => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  notifications,
  setNotifications,
  onOpenCommandPalette,
  onOpenSettings,
  onOpenNewOrder,
  layoutDensity,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 px-4 sm:px-6 backdrop-blur-md transition-colors duration-200">
      {/* Left Area: Brand Logo & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-slate-800 text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <Layers className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-gray-900 dark:text-white tracking-tight">
                NexusAdmin
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              企业级数智化管理系统
            </span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          title="切换侧边栏"
          id="toggle-sidebar-btn"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Middle Area: Command Palette Trigger */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <button
          onClick={onOpenCommandPalette}
          className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-200/90 dark:border-gray-700/80 bg-gray-50/80 dark:bg-gray-800/50 px-3.5 text-xs text-gray-500 dark:text-gray-400 hover:border-indigo-400 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm group"
          id="global-command-search-btn"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <span>输入关键词全局搜索，或快捷执行命令...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-1.5 py-0.5 text-xs font-medium text-gray-400 dark:text-gray-500 shadow-2xs">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* Right Area: Actions, Quick Add, Theme, Notifications, User Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Quick Add Order Button */}
        <button
          onClick={onOpenNewOrder}
          className="hidden sm:flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs font-medium shadow-sm transition-colors active:scale-95"
          id="header-create-order-btn"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>新建订单</span>
        </button>

        {/* Search icon button for mobile */}
        <button
          onClick={onOpenCommandPalette}
          className="flex md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          title="快捷搜索"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="hidden lg:flex rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          title={isFullscreen ? '退出全屏' : '全屏显示'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          title={darkMode ? '切换至浅色模式' : '切换至暗黑模式'}
          id="theme-toggle-btn"
        >
          {darkMode ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            title="通知消息"
            id="notification-bell-btn"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-gray-900 dark:text-white">
                    消息提醒
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-100 dark:bg-rose-950 px-2 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                      {unreadCount} 未读
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    全部已读
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 text-xs transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      !item.read ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600 dark:text-gray-400 line-clamp-2 text-xs leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 p-2 text-center bg-gray-50/50 dark:bg-gray-800/50">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </div>

        {/* System Settings Drawer Trigger */}
        <button
          onClick={onOpenSettings}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          title="系统界面个性化设置"
          id="system-settings-trigger-btn"
        >
          <Settings className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1" />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            id="user-profile-menu-btn"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="管理员头像"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                林国鑫 (主管理员)
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                高级运营主管
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden lg:block" />
          </button>

          {/* User Profile Popover */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black/5 z-50 p-1.5 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                <p className="font-semibold text-gray-900 dark:text-white">林国鑫</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">linguoxin@nexusadmin.com</p>
              </div>

              <button
                onClick={() => setShowUserMenu(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User className="h-4 w-4 text-gray-400" />
                <span>个人资料与设置</span>
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenSettings();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Shield className="h-4 w-4 text-gray-400" />
                <span>安全与权限配置</span>
              </button>

              <button
                onClick={() => setShowUserMenu(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <HelpCircle className="h-4 w-4 text-gray-400" />
                <span>帮助与系统文档</span>
              </button>

              <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  alert('已安全退出登录');
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="h-4 w-4" />
                <span>退出登录</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { X, Check, Palette, Moon, Sun, Layout, Sparkles } from 'lucide-react';
import { ThemeColor, LayoutDensity } from '../types';

interface ThemeSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  layoutDensity: LayoutDensity;
  setLayoutDensity: (density: LayoutDensity) => void;
}

const COLOR_OPTIONS: { id: ThemeColor; name: string; class: string }[] = [
  { id: 'indigo', name: '系统品牌主色 (Indigo)', class: 'bg-indigo-600' },
];

const STATE_COLOR_GUIDE = [
  { name: '信息 / 处理中', class: 'bg-sky-500', text: 'text-sky-700 dark:text-sky-300' },
  { name: '成功 / 正常', class: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
  { name: '提醒 / 待处理', class: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' },
  { name: '危险 / 异常', class: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
  { name: '禁用 / 关闭', class: 'bg-gray-400', text: 'text-gray-600 dark:text-gray-300' },
];

export const ThemeSettingsDrawer: React.FC<ThemeSettingsDrawerProps> = ({
  isOpen,
  onClose,
  darkMode,
  setDarkMode,
  themeColor,
  setThemeColor,
  layoutDensity,
  setLayoutDensity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-250 p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-5">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              外观与交互个性化配置
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs flex-1 overflow-y-auto">
          {/* Dark / Light Theme Mode */}
          <div>
            <label className="block font-bold text-gray-900 dark:text-white mb-2.5">
              显示色彩主题外观 (Color Mode)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDarkMode(false)}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 border transition-all ${
                  !darkMode
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                    : 'border-gray-200 dark:border-gray-800 text-gray-500'
                }`}
              >
                <Sun className="h-4 w-4 text-amber-500" />
                <span>明亮浅色</span>
              </button>

              <button
                onClick={() => setDarkMode(true)}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 border transition-all ${
                  darkMode
                    ? 'border-indigo-600 bg-gray-800 text-white font-bold'
                    : 'border-gray-200 dark:border-gray-800 text-gray-500'
                }`}
              >
                <Moon className="h-4 w-4 text-indigo-400" />
                <span>暗黑沉浸</span>
              </button>
            </div>
          </div>

          {/* Theme Primary Accent Colors */}
          <div>
            <label className="block font-bold text-gray-900 dark:text-white mb-2.5">
              系统品牌主色调
            </label>
            <div className="space-y-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setThemeColor(c.id)}
                  className={`flex w-full items-center justify-between rounded-xl p-2.5 border transition-all ${
                    themeColor === c.id
                      ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/40 text-gray-900 dark:text-white font-semibold'
                      : 'border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`h-4 w-4 rounded-full ${c.class}`}></span>
                    <span>{c.name}</span>
                  </div>
                  {themeColor === c.id && <Check className="h-4 w-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-900 dark:text-white mb-2.5">
              状态颜色规范
            </label>
            <div className="grid grid-cols-1 gap-2">
              {STATE_COLOR_GUIDE.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 px-3 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`h-3.5 w-3.5 rounded-full ${item.class}`}></span>
                    <span className={`font-semibold ${item.text}`}>{item.name}</span>
                  </div>
                  <Check className="h-3.5 w-3.5 text-gray-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Table & Layout Density */}
          <div>
            <label className="block font-bold text-gray-900 dark:text-white mb-2.5">
              列表表格紧凑度 (Layout Density)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['compact', 'normal', 'comfortable'] as LayoutDensity[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setLayoutDensity(d)}
                  className={`rounded-xl p-2.5 border text-center transition-all ${
                    layoutDensity === d
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-gray-200 dark:border-gray-800 text-gray-500'
                  }`}
                >
                  {d === 'compact' && '紧凑密实'}
                  {d === 'normal' && '标准适中'}
                  {d === 'comfortable' && '松散舒适'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            保存并应用配置
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Check, Columns3, RotateCcw } from 'lucide-react';
import { ColumnConfig } from '../types';
import { actionButton } from '../uiTheme';

interface ColumnCustomizerModalProps {
  columns: ColumnConfig[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnConfig[]>>;
  onClose: () => void;
  onResetColumns: () => void;
}

export const ColumnCustomizerModal: React.FC<ColumnCustomizerModalProps> = ({
  columns,
  setColumns,
  onClose,
  onResetColumns,
}) => {
  const toggleColumnVisibility = (id: ColumnConfig['id']) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === id ? { ...col, visible: !col.visible } : col
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl p-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-center gap-2">
            <Columns3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              自定义列表列显示设置
            </h3>
          </div>
          <button onClick={onClose} className={actionButton.icon}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          勾选需要显示的列字段，未勾选的列将在表格中平滑隐藏：
        </p>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
          {columns.map((col) => (
            <button
              key={col.id}
              onClick={() => toggleColumnVisibility(col.id)}
              className={`flex w-full items-center justify-between rounded-xl p-2.5 transition-colors border ${
                col.visible
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100 font-medium'
                  : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 text-gray-400'
              }`}
            >
              <span>{col.label}</span>
              <div
                className={`flex h-4 w-4 items-center justify-center rounded ${
                  col.visible ? 'bg-indigo-600 text-white' : 'border border-gray-300'
                }`}
              >
                {col.visible && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <button
            onClick={onResetColumns}
            className={actionButton.ghost}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>恢复默认列</span>
          </button>

          <button
            onClick={onClose}
            className={actionButton.primary}
          >
            完成设置
          </button>
        </div>
      </div>
    </div>
  );
};

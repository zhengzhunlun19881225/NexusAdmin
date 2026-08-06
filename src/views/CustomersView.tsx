import React from 'react';
import { UserCheck, PieChart, Award, Users } from 'lucide-react';
import { CustomerItem, CustomerSegmentItem, VipTierItem } from '../types';
import { CustomerDirectoryView } from './CustomerDirectoryView';
import { CustomerSegmentView } from './CustomerSegmentView';
import { VipRightsView } from './VipRightsView';

interface CustomersViewProps {
  customers: CustomerItem[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerItem[]>>;
  segments: CustomerSegmentItem[];
  setSegments: React.Dispatch<React.SetStateAction<CustomerSegmentItem[]>>;
  vipTiers: VipTierItem[];
  setVipTiers: React.Dispatch<React.SetStateAction<VipTierItem[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  subPath?: string;
  setActivePath?: (path: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  setCustomers,
  segments,
  setSegments,
  vipTiers,
  setVipTiers,
  showToast,
  subPath = 'list',
  setActivePath,
}) => {
  // Determine current active tab key
  const currentTab = subPath === 'segment' ? 'segment' : subPath === 'vip' ? 'vip' : 'list';

  const handleTabChange = (tab: 'list' | 'segment' | 'vip') => {
    if (setActivePath) {
      setActivePath(`/customers/${tab}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Navigation Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/80 pb-4 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            <span>客户关系 CRM 中心</span>
            <span>/</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {currentTab === 'list' && '客户名录'}
              {currentTab === 'segment' && '分群画像'}
              {currentTab === 'vip' && 'VIP 权益体系'}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl">
            客户资产与全生命周期运营体系
          </h1>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800/80">
          <button
            onClick={() => handleTabChange('list')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              currentTab === 'list'
                ? 'bg-white text-indigo-600 shadow-xs dark:bg-gray-900 dark:text-indigo-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>客户名录</span>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-extrabold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-300">
              {customers.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('segment')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              currentTab === 'segment'
                ? 'bg-white text-indigo-600 shadow-xs dark:bg-gray-900 dark:text-indigo-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <PieChart className="h-4 w-4" />
            <span>分群画像</span>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-extrabold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-300">
              {segments.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('vip')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              currentTab === 'vip'
                ? 'bg-white text-amber-600 shadow-xs dark:bg-gray-900 dark:text-amber-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>VIP 权益体系</span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-extrabold text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
              {vipTiers.length}
            </span>
          </button>
        </div>
      </div>

      {/* View Content Rendering */}
      {currentTab === 'list' && (
        <CustomerDirectoryView
          customers={customers}
          setCustomers={setCustomers}
          showToast={showToast}
        />
      )}

      {currentTab === 'segment' && (
        <CustomerSegmentView
          segments={segments}
          setSegments={setSegments}
          customers={customers}
          showToast={showToast}
        />
      )}

      {currentTab === 'vip' && (
        <VipRightsView
          vipTiers={vipTiers}
          setVipTiers={setVipTiers}
          customers={customers}
          showToast={showToast}
        />
      )}
    </div>
  );
};

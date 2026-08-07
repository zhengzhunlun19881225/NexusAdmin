import React from 'react';
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
}) => {
  const currentTab = subPath === 'segment' ? 'segment' : subPath === 'vip' ? 'vip' : 'list';

  return (
    <div className="space-y-6">
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

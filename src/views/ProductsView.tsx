import React, { useState } from 'react';
import { ProductItem, ProductSPUItem, CategoryItem, StockAlertItem } from '../types';
import { MOCK_SPU_LIST, MOCK_CATEGORIES, MOCK_STOCK_ALERTS } from '../mockData';
import { SpuListView } from './SpuListView';
import { CategoryConfigView } from './CategoryConfigView';
import { StockAlertView } from './StockAlertView';

interface ProductsViewProps {
  products: ProductItem[];
  setProducts: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  subPath?: string;
  spuList?: ProductSPUItem[];
  setSpuList?: React.Dispatch<React.SetStateAction<ProductSPUItem[]>>;
  categories?: CategoryItem[];
  setCategories?: React.Dispatch<React.SetStateAction<CategoryItem[]>>;
  stockAlerts?: StockAlertItem[];
  setStockAlerts?: React.Dispatch<React.SetStateAction<StockAlertItem[]>>;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  showToast,
  subPath = 'list',
  spuList: propSpuList,
  setSpuList: propSetSpuList,
  categories: propCategories,
  setCategories: propSetCategories,
  stockAlerts: propStockAlerts,
  setStockAlerts: propSetStockAlerts,
}) => {
  // Local state fallbacks if not provided at top-level
  const [localSpuList, setLocalSpuList] = useState<ProductSPUItem[]>(MOCK_SPU_LIST);
  const [localCategories, setLocalCategories] = useState<CategoryItem[]>(MOCK_CATEGORIES);
  const [localStockAlerts, setLocalStockAlerts] = useState<StockAlertItem[]>(MOCK_STOCK_ALERTS);

  const spuList = propSpuList || localSpuList;
  const setSpuList = propSetSpuList || setLocalSpuList;

  const categories = propCategories || localCategories;
  const setCategories = propSetCategories || setLocalCategories;

  const stockAlerts = propStockAlerts || localStockAlerts;
  const setStockAlerts = propSetStockAlerts || setLocalStockAlerts;

  const getActiveTab = () => {
    if (subPath.includes('category')) return 'category';
    if (subPath.includes('stock')) return 'stock';
    return 'spu';
  };

  const activeTab = getActiveTab();

  return (
    <div className="space-y-6">
      {/* Render Active View */}
      {activeTab === 'spu' && (
        <SpuListView spuList={spuList} setSpuList={setSpuList} showToast={showToast} />
      )}

      {activeTab === 'category' && (
        <CategoryConfigView
          categories={categories}
          setCategories={setCategories}
          showToast={showToast}
        />
      )}

      {activeTab === 'stock' && (
        <StockAlertView
          stockAlerts={stockAlerts}
          setStockAlerts={setStockAlerts}
          showToast={showToast}
        />
      )}
    </div>
  );
};

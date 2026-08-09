import React, { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatSummaryCards } from './components/StatSummaryCards';
import { FilterSection } from './components/FilterSection';
import { DataTable } from './components/DataTable';
import { GridView } from './components/GridView';
import { KanbanView } from './components/KanbanView';
import { DetailDrawer } from './components/DetailDrawer';
import { OrderFormModal } from './components/OrderFormModal';
import { ColumnCustomizerModal } from './components/ColumnCustomizerModal';
import { CommandPalette } from './components/CommandPalette';
import { ThemeSettingsDrawer } from './components/ThemeSettingsDrawer';

// Views
import { DashboardView } from './views/DashboardView';
import { ProductsView } from './views/ProductsView';
import { CustomersView } from './views/CustomersView';
import { MarketingView } from './views/MarketingView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { AbnormalRefundsView } from './views/AbnormalRefundsView';
import { LogisticsView } from './views/LogisticsView';
import { UIKitView } from './views/UIKitView';
import { PendingApprovalView } from './views/PendingApprovalView';
import { IMView } from './views/IMView';

import {
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_CUSTOMERS,
  MOCK_CUSTOMER_SEGMENTS,
  MOCK_VIP_TIERS,
  MOCK_COUPONS,
  MOCK_MARKETING_ACTIVITIES,
  MOCK_SYSTEM_USERS,
  MOCK_ROLES,
  MOCK_AUDIT_LOGS,
  MOCK_API_KEYS,
  MOCK_REFUNDS,
  MOCK_LOGISTICS,
  MOCK_SPU_LIST,
  MOCK_CATEGORIES,
  MOCK_STOCK_ALERTS,
  INITIAL_FILTER_STATE,
  DEFAULT_COLUMNS,
  MOCK_NOTIFICATIONS,
} from './mockData';
import {
  OrderItem,
  ProductItem,
  CustomerItem,
  CustomerSegmentItem,
  VipTierItem,
  CouponItem,
  MarketingActivity,
  SystemUser,
  RoleItem,
  AuditLogItem,
  ApiKeyItem,
  AbnormalRefundItem,
  LogisticsItem,
  ProductSPUItem,
  CategoryItem,
  StockAlertItem,
  FilterState,
  ColumnConfig,
  ViewMode,
  LayoutDensity,
  ThemeColor,
  NotificationItem,
} from './types';
import {
  List,
  Grid,
  Kanban,
  RefreshCw,
  Plus,
  Download,
  ChevronRight,
  Home,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { actionButton } from './uiTheme';

export default function App() {
  // Global States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePath, setActivePath] = useState('/dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('nexus-dark-mode') === 'true';
  });
  const [themeColor, setThemeColor] = useState<ThemeColor>('indigo');
  const [layoutDensity, setLayoutDensity] = useState<LayoutDensity>('normal');

  // Data States
  const [orders, setOrders] = useState<OrderItem[]>(MOCK_ORDERS);
  const [refunds, setRefunds] = useState<AbnormalRefundItem[]>(MOCK_REFUNDS);
  const [logistics, setLogistics] = useState<LogisticsItem[]>(MOCK_LOGISTICS);
  const [products, setProducts] = useState<ProductItem[]>(MOCK_PRODUCTS);
  const [spuList, setSpuList] = useState<ProductSPUItem[]>(MOCK_SPU_LIST);
  const [categories, setCategories] = useState<CategoryItem[]>(MOCK_CATEGORIES);
  const [stockAlerts, setStockAlerts] = useState<StockAlertItem[]>(MOCK_STOCK_ALERTS);
  const [customers, setCustomers] = useState<CustomerItem[]>(MOCK_CUSTOMERS);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegmentItem[]>(MOCK_CUSTOMER_SEGMENTS);
  const [vipTiers, setVipTiers] = useState<VipTierItem[]>(MOCK_VIP_TIERS);
  const [coupons, setCoupons] = useState<CouponItem[]>(MOCK_COUPONS);
  const [activities, setActivities] = useState<MarketingActivity[]>(MOCK_MARKETING_ACTIVITIES);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(MOCK_SYSTEM_USERS);
  const [roles, setRoles] = useState<RoleItem[]>(MOCK_ROLES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(MOCK_API_KEYS);

  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // View & Modal States
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<OrderItem | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<OrderItem | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isColumnCustomizerOpen, setIsColumnCustomizerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    window.localStorage.setItem('nexus-dark-mode', String(darkMode));
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Logic Implementation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Keyword (Order No / Customer Name / Phone)
      if (filterState.keyword.trim()) {
        const kw = filterState.keyword.toLowerCase().trim();
        const matchesNo = order.orderNo.toLowerCase().includes(kw);
        const matchesName = order.customerName.toLowerCase().includes(kw);
        const matchesPhone = order.customerPhone.includes(kw);
        if (!matchesNo && !matchesName && !matchesPhone) return false;
      }

      // 2. Status
      if (filterState.status.length > 0) {
        if (!filterState.status.includes(order.status)) return false;
      }

      // 3. Category
      if (filterState.category !== 'all') {
        if (order.category !== filterState.category) return false;
      }

      // 4. Assignee
      if (filterState.assigneeId !== 'all') {
        if (order.assignee.id !== filterState.assigneeId) return false;
      }

      // 5. Payment Methods
      if (filterState.paymentMethods.length > 0) {
        if (!filterState.paymentMethods.includes(order.paymentMethod)) return false;
      }

      // 6. Min Amount
      if (filterState.minAmount) {
        if (order.totalAmount < Number(filterState.minAmount)) return false;
      }

      // 7. Max Amount
      if (filterState.maxAmount) {
        if (order.totalAmount > Number(filterState.maxAmount)) return false;
      }

      // 8. Channel
      if (filterState.channel !== 'all') {
        if (order.channel !== filterState.channel) return false;
      }

      // 9. Priority
      if (filterState.priority !== 'all') {
        if (order.priority !== filterState.priority) return false;
      }

      // 10. Invoice Status
      if (filterState.invoiceStatus !== 'all') {
        if (order.invoiceStatus !== filterState.invoiceStatus) return false;
      }

      // 11. Risk Level
      if (filterState.riskLevel !== 'all') {
        if (order.riskLevel !== filterState.riskLevel) return false;
      }

      return true;
    });
  }, [orders, filterState]);

  // Count active filter conditions
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.keyword) count++;
    if (filterState.status.length > 0) count++;
    if (filterState.dateRange.preset && filterState.dateRange.preset !== 'all') count++;
    if (filterState.category !== 'all') count++;
    if (filterState.assigneeId !== 'all') count++;
    if (filterState.paymentMethods.length > 0) count++;
    if (filterState.minAmount || filterState.maxAmount) count++;
    if (filterState.channel !== 'all') count++;
    if (filterState.priority !== 'all') count++;
    if (filterState.invoiceStatus !== 'all') count++;
    if (filterState.riskLevel !== 'all') count++;
    return count;
  }, [filterState]);

  // Reset Filters
  const handleResetFilters = () => {
    setFilterState(INITIAL_FILTER_STATE);
    showToast('已重置所有筛选过滤条件');
  };

  // Save Preset View
  const handleSavePreset = (name: string) => {
    showToast(`筛选方案 "${name}" 已成功保存至常用方案列表！`);
  };

  // Handlers for Data Mutations
  const handleSaveOrder = (savedData: Partial<OrderItem>) => {
    if (orderToEdit) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderToEdit.id ? ({ ...o, ...savedData } as OrderItem) : o))
      );
      showToast(`订单 ${savedData.orderNo} 已成功更新！`);
    } else {
      setOrders((prev) => [savedData as OrderItem, ...prev]);
      showToast(`新订单 ${savedData.orderNo} 已创建！`);
    }
    setOrderToEdit(null);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast('订单状态已更改并即时同步！');
  };

  const handleBatchDelete = () => {
    if (window.confirm(`确定要删除选中的 ${selectedIds.length} 笔订单吗？`)) {
      setOrders((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
      setSelectedIds([]);
      showToast('选定订单已安全删除');
    }
  };

  const handleBatchApprove = () => {
    setOrders((prev) =>
      prev.map((o) => (selectedIds.includes(o.id) ? { ...o, status: 'processing' } : o))
    );
    showToast(`选中的 ${selectedIds.length} 笔订单已全部通过人工审核！`);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const headers = '订单号,客户姓名,联系电话,商品,金额,状态,下单时间\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.orderNo}","${o.customerName}","${o.customerPhone}","${o.products[0]?.name}",${o.totalAmount},"${o.status}","${o.createdAt}"`
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NexusAdmin_Orders_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('数据已成功导出为 CSV 表格文件');
  };

  return (
    <div className={`${darkMode ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-50/60 text-gray-900'} min-h-screen flex flex-col font-sans transition-colors duration-200 antialiased`}>
      {/* Toast Popup Message */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        themeColor={themeColor}
        notifications={notifications}
        setNotifications={setNotifications}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNewOrder={() => {
          setOrderToEdit(null);
          setIsNewOrderModalOpen(true);
        }}
        layoutDensity={layoutDensity}
        setLayoutDensity={setLayoutDensity}
      />

      <div className="flex flex-1 relative">
        {/* Left Navigation Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          activePath={activePath}
          setActivePath={setActivePath}
        />

        {/* Right Main Content Area */}
        <main
          className={`min-w-0 flex-1 p-5 transition-all duration-300 ${
            activePath.startsWith('/orders/abnormal') ||
            activePath.startsWith('/orders/refund') ||
            activePath.startsWith('/orders/logistics') ||
            activePath.startsWith('/products') ||
            activePath.startsWith('/im')
              ? 'bg-[#F8FBFF]'
              : ''
          } ${
            sidebarOpen ? 'lg:ml-64' : 'ml-16'
          }`}
        >
          {activePath === '/dashboard' && (
            <DashboardView
              orders={orders}
              products={products}
              customers={customers}
              onNavigate={(path) => setActivePath(path)}
            />
          )}

          {activePath === '/ui-kit' && <UIKitView />}

          {activePath.startsWith('/im') && (
            <IMView
              customers={customers}
              showToast={showToast}
            />
          )}

          {activePath.startsWith('/products') && (
            <ProductsView
              products={products}
              setProducts={setProducts}
              spuList={spuList}
              setSpuList={setSpuList}
              categories={categories}
              setCategories={setCategories}
              stockAlerts={stockAlerts}
              setStockAlerts={setStockAlerts}
              showToast={showToast}
              subPath={activePath.split('/')[2]}
            />
          )}

          {activePath.startsWith('/customers') && (
            <CustomersView
              customers={customers}
              setCustomers={setCustomers}
              segments={customerSegments}
              setSegments={setCustomerSegments}
              vipTiers={vipTiers}
              setVipTiers={setVipTiers}
              showToast={showToast}
              subPath={activePath.split('/')[2]}
              setActivePath={setActivePath}
            />
          )}

          {activePath.startsWith('/marketing') && (
            <MarketingView
              coupons={coupons}
              setCoupons={setCoupons}
              activities={activities}
              setActivities={setActivities}
              showToast={showToast}
              subPath={activePath.split('/')[2]}
            />
          )}

          {activePath.startsWith('/analytics') && (
            <AnalyticsView
              orders={orders}
              showToast={showToast}
              subPath={activePath.split('/')[2]}
            />
          )}

          {activePath.startsWith('/settings') && (
            <SettingsView
              systemUsers={systemUsers}
              setSystemUsers={setSystemUsers}
              roles={roles}
              setRoles={setRoles}
              auditLogs={auditLogs}
              setAuditLogs={setAuditLogs}
              apiKeys={apiKeys}
              setApiKeys={setApiKeys}
              showToast={showToast}
              subPath={activePath.split('/')[2]}
              setActivePath={setActivePath}
            />
          )}

          {/* Abnormal & Refunds View */}
          {(activePath.startsWith('/orders/abnormal') || activePath.startsWith('/orders/refund')) && (
            <AbnormalRefundsView
              refunds={refunds}
              setRefunds={setRefunds}
              showToast={showToast}
            />
          )}

          {/* Logistics Tracking View */}
          {activePath.startsWith('/orders/logistics') && (
            <LogisticsView
              logisticsList={logistics}
              setLogisticsList={setLogistics}
              showToast={showToast}
            />
          )}

          {activePath.startsWith('/orders/approval') && (
            <PendingApprovalView
              orders={orders}
              onOpenDetail={(o) => setSelectedOrderForDetail(o)}
              onOpenEdit={(o) => {
                setOrderToEdit(o);
                setIsNewOrderModalOpen(true);
              }}
              onUpdateStatus={handleUpdateStatus}
              showToast={showToast}
            />
          )}

          {/* Orders List View */}
          {activePath.startsWith('/orders') &&
            !activePath.startsWith('/orders/approval') &&
            !activePath.startsWith('/orders/abnormal') &&
            !activePath.startsWith('/orders/refund') &&
            !activePath.startsWith('/orders/logistics') && (
            <>
              {/* Breadcrumb & Title Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  {/* Breadcrumb path */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                    <Home className="h-3.5 w-3.5" />
                    <span>首页</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>订单数据管理</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-gray-700 dark:text-gray-200 font-semibold">
                      全部订单列表
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                      全渠道订单管理与高级筛选列表
                    </h1>
                    <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800">
                      {filteredOrders.length} 条过滤结果
                    </span>
                  </div>
                </div>

                {/* Page Header Actions & View Mode Switcher */}
                <div className="flex items-center gap-2">
                  {/* View Mode Segmented Controls */}
                  <div className="flex items-center rounded-xl bg-gray-200/60 dark:bg-gray-800/80 p-1 text-xs">
                    <button
                      onClick={() => setViewMode('table')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all ${
                        viewMode === 'table'
                          ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                      }`}
                      title="表格视图"
                    >
                      <List className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">表格</span>
                    </button>

                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                      }`}
                      title="卡片网格视图"
                    >
                      <Grid className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">网格</span>
                    </button>

                    <button
                      onClick={() => setViewMode('kanban')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all ${
                        viewMode === 'kanban'
                          ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                      }`}
                      title="看板流程视图"
                    >
                      <Kanban className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">看板</span>
                    </button>
                  </div>

                  {/* Refresh */}
                  <button
                    onClick={() => showToast('数据视图已即时刷新!')}
                    className={actionButton.icon}
                    title="刷新数据"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Metric KPI Cards */}
              <StatSummaryCards orders={filteredOrders} />

              {/* Core Feature: Filter Section (Fixed 5 + Folded Extended Conditions) */}
              <FilterSection
                filterState={filterState}
                setFilterState={setFilterState}
                onReset={handleResetFilters}
                onSavePreset={handleSavePreset}
                activeFilterCount={activeFilterCount}
                totalResultsCount={filteredOrders.length}
              />

              {/* Main List Display (Table / Grid / Kanban) */}
              {viewMode === 'table' && (
                <DataTable
                  orders={filteredOrders}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  columns={columns}
                  onOpenDetail={(o) => setSelectedOrderForDetail(o)}
                  onOpenEdit={(o) => {
                    setOrderToEdit(o);
                    setIsNewOrderModalOpen(true);
                  }}
                  onOpenColumnCustomizer={() => setIsColumnCustomizerOpen(true)}
                  onBatchDelete={handleBatchDelete}
                  onBatchApprove={handleBatchApprove}
                  onExportCSV={handleExportCSV}
                  layoutDensity={layoutDensity}
                  keywordHighlight={filterState.keyword}
                />
              )}

              {viewMode === 'grid' && (
                <GridView
                  orders={filteredOrders}
                  onOpenDetail={(o) => setSelectedOrderForDetail(o)}
                  onOpenEdit={(o) => {
                    setOrderToEdit(o);
                    setIsNewOrderModalOpen(true);
                  }}
                />
              )}

              {viewMode === 'kanban' && (
                <KanbanView
                  orders={filteredOrders}
                  onOpenDetail={(o) => setSelectedOrderForDetail(o)}
                  onOpenEdit={(o) => {
                    setOrderToEdit(o);
                    setIsNewOrderModalOpen(true);
                  }}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      {selectedOrderForDetail && (
        <DetailDrawer
          order={selectedOrderForDetail}
          onClose={() => setSelectedOrderForDetail(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {isNewOrderModalOpen && (
        <OrderFormModal
          orderToEdit={orderToEdit}
          onClose={() => {
            setIsNewOrderModalOpen(false);
            setOrderToEdit(null);
          }}
          onSave={handleSaveOrder}
        />
      )}

      {isColumnCustomizerOpen && (
        <ColumnCustomizerModal
          columns={columns}
          setColumns={setColumns}
          onClose={() => setIsColumnCustomizerOpen(false)}
          onResetColumns={() => setColumns(DEFAULT_COLUMNS)}
        />
      )}

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectOrder={(o) => setSelectedOrderForDetail(o)}
        onNavigateMenu={(p) => setActivePath(p)}
      />

      <ThemeSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        layoutDensity={layoutDensity}
        setLayoutDensity={setLayoutDensity}
      />
    </div>
  );
}

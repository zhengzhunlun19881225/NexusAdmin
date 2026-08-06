export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled' | 'refunded';
export type PaymentMethod = 'wechat' | 'alipay' | 'credit_card' | 'bank_transfer';
export type PriorityLevel = 'high' | 'medium' | 'normal' | 'low';
export type ChannelSource = 'web' | 'ios' | 'android' | 'mini_app' | 'offline';
export type InvoiceStatus = 'invoiced' | 'uninvoiced' | 'processing';
export type RiskLevel = 'low' | 'moderate' | 'high';

export interface OrderItem {
  id: string;
  orderNo: string;
  customerName: string;
  customerAvatar?: string;
  customerPhone: string;
  customerEmail: string;
  products: {
    name: string;
    quantity: number;
    price: number;
    sku: string;
  }[];
  totalAmount: number;
  status: OrderStatus;
  category: string;
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  paymentMethod: PaymentMethod;
  channel: ChannelSource;
  priority: PriorityLevel;
  invoiceStatus: InvoiceStatus;
  riskLevel: RiskLevel;
  deliveryAddress: string;
  notes?: string;
}

export interface FilterState {
  // Top 5 Fixed Fields
  keyword: string;            // 1. 关键词 (订单号/客户/手机号)
  status: OrderStatus[];      // 2. 订单状态
  dateRange: {                // 3. 时间范围
    start: string;
    end: string;
    preset?: string;
  };
  category: string;           // 4. 商品分类
  assigneeId: string;         // 5. 负责人

  // Folded / Expanded Fields (>5)
  paymentMethods: PaymentMethod[]; // 6. 支付方式
  minAmount: string;          // 7. 最低金额
  maxAmount: string;          // 8. 最高金额
  channel: string;            // 9. 渠道来源
  priority: string;           // 10. 优先级
  invoiceStatus: string;      // 11. 发票状态
  riskLevel: string;          // 12. 风险等级
}

export interface FilterPreset {
  id: string;
  name: string;
  isDefault?: boolean;
  filters: Partial<FilterState>;
}

export type ViewMode = 'table' | 'grid' | 'kanban' | 'compact';
export type LayoutDensity = 'compact' | 'normal' | 'comfortable';
export type ThemeColor = 'indigo';

export interface ColumnConfig {
  id: keyof OrderItem | 'actions';
  label: string;
  visible: boolean;
  sortable?: boolean;
  width?: string;
}

export interface MenuItem {
  id: string;
  title: string;
  iconName: string;
  badge?: number | string;
  badgeColor?: string;
  children?: MenuItem[];
  path?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  time: string;
  type: 'order' | 'system' | 'approval' | 'warning';
  read: boolean;
}

// Product Center
export interface ProductItem {
  id: string;
  spuCode: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStockWarning: number;
  salesCount: number;
  status: 'on_sale' | 'off_sale' | 'sold_out';
  image: string;
  createdAt: string;
  specifications: string[];
}

// Customer CRM
export interface CustomerItem {
  id: string;
  customerNo: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  company?: string;
  tier: string; // e.g. 'V1 普通会员' | 'V2 白银会员' | 'V3 黄金会员' | 'V4 钻石会员' | 'V5 黑金VIP'
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  segment: string; // e.g. '高价值客户' | '潜力新客' | '沉睡客户' | '流失预警'
  status: 'active' | 'suspended';
  gender?: 'male' | 'female' | 'unknown';
  tags?: string[];
  notes?: string;
  registerDate?: string;
}

export interface CustomerSegmentItem {
  id: string;
  code: string;               // e.g. SEG-001
  name: string;               // e.g. 高价值VIP客群
  description: string;        // 核心描述
  criteria: string;           // 规则/判断条件 (e.g., 年消费>￥50,000 & 购买次数≥5)
  memberCount: number;        // 覆盖客群数
  avgSpent: number;           // 人均消费金额 ￥
  repurchaseRate: number;     // 复购率 %
  growthTrend: 'up' | 'down' | 'stable'; // 趋势
  status: 'active' | 'paused';// 状态
  tags: string[];             // 标签
  updatedAt: string;          // 刷新更新时间
}

export interface VipTierItem {
  id: string;
  code: string;               // e.g. TIER-V1
  tierName: string;           // e.g. V1 普通会员
  level: number;              // 1 ~ 5
  minSpent: number;           // 升级门槛金额 ￥
  discountRate: number;       // 专享折扣 (e.g. 100表无折扣，95表95折, 85表85折)
  pointsRate: number;         // 积分赠送倍率 (e.g. 1.0, 1.5, 2.0, 3.0)
  rightsList: string[];       // 专享权益列表
  memberCount: number;        // 当前等级会员人数
  status: 'active' | 'disabled';
  badgeColor: string;         // 视觉主题色描述
  description?: string;
}

// Marketing & Coupons
export interface CouponItem {
  id: string;
  title: string;
  code: string;
  discountType: 'fixed' | 'percent';
  value: number; // e.g., 50 (￥50 off) or 85 (15% off)
  minSpend: number;
  totalQuantity: number;
  issuedCount: number;
  usedCount: number;
  validUntil: string;
  status: 'active' | 'expired' | 'paused';
}

export interface MarketingActivity {
  id: string;
  title: string;
  type: '秒杀' | '满减' | '团购' | '新客专享';
  discountInfo: string;
  startTime: string;
  endTime: string;
  participatingProductsCount: number;
  status: 'upcoming' | 'ongoing' | 'ended';
}

// System & RBAC
export interface SystemUser {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  department: string;
  role: '超级管理员' | '运营主管' | '客服专员' | '财务审计' | '仓储调度';
  status: 'active' | 'disabled';
  lastLogin: string;
  avatar: string;
}

export interface RoleItem {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  operator: string;
  ip: string;
  action: string;
  module: string;
  status: 'success' | 'failure';
  timestamp: string;
  details: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;                // e.g. ERP 基础对接秘钥
  keyPrefix: string;           // e.g. nx_live_9f8a...
  secretKey: string;           // e.g. nx_live_9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c
  scopes: string[];            // e.g. ['orders:read', 'products:write', 'inventory:sync']
  ipWhitelist: string[];       // e.g. ['114.242.25.10', '218.75.32.0/24']
  status: 'active' | 'disabled' | 'expired';
  createdAt: string;
  expiresAt: string;           // e.g. '2027-12-31' or '永不过期'
  totalCalls: number;          // e.g. 142500
  lastCallTime: string;        // e.g. '2026-07-28 09:15:20'
  description?: string;
}

// Exceptions & Refunds
export type RefundType = '仅退款' | '退货退款' | '换货' | '异常申报';
export type RefundStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'completed' | 'closed';

export interface AbnormalRefundItem {
  id: string;
  refundNo: string;           // 售后单号, e.g., RF-202607-1001
  orderNo: string;            // 关联原订单号, e.g., ORD-202607-8891
  customerName: string;       // 客户姓名
  customerPhone: string;      // 联系电话
  type: RefundType;           // 售后类型
  reason: string;             // 原因说明
  refundAmount: number;       // 退款/索赔金额
  status: RefundStatus;       // 状态
  applyTime: string;          // 申请时间
  auditTime?: string;         // 审核/处理时间
  handler?: string;           // 处理负责人
  description?: string;       // 异常详情描述
  evidenceImages?: string[];  // 凭证图片
  auditRemark?: string;       // 审核批注/驳回原因
  logisticsCode?: string;     // 退货物流单号
}

// Logistics & Tracking
export type LogisticsStatus = 'preparing' | 'in_transit' | 'delivering' | 'signed' | 'exception';

export interface LogisticsTrackStep {
  id: string;
  time: string;
  location: string;
  description: string;
  statusTag?: string;
}

export interface LogisticsItem {
  id: string;
  trackingNo: string;        // 运单号, e.g., SF14289901238
  carrier: string;           // 快递公司, e.g., 顺丰特快, 京东快递, 中通快递
  orderNo: string;           // 关联订单号
  recipientName: string;     // 收件人
  recipientPhone: string;    // 收件人电话
  destination: string;       // 收货地址
  status: LogisticsStatus;   // 物流状态
  shipTime: string;          // 发货时间
  estimatedDelivery?: string;// 预计送达时间
  courierName?: string;      // 派送员姓名
  courierPhone?: string;     // 派送员电话
  packagesCount?: number;    // 件数
  weightKg?: number;         // 重量 (kg)
  tracks: LogisticsTrackStep[]; // 实时物流轨迹
}

// Category Configuration
export interface CategoryItem {
  id: string;
  code: string;           // 类目编码 e.g. CAT-DIGITAL-01
  name: string;           // 类目名称 e.g. 数码电子
  parentId: string | null;// 上级类目ID (null为顶级类目)
  parentName?: string;    // 上级类目名称
  level: 1 | 2 | 3;       // 1-一级, 2-二级, 3-三级
  sortOrder: number;      // 排序权重
  status: 'enabled' | 'disabled'; // 状态: 启用 / 禁用
  productCount: number;   // 关联商品数
  commissionRate: number; // 平台佣金抽成% e.g. 5.0
  taxRate: number;        // 开票税率% e.g. 13.0
  iconName?: string;      // 图标名称
  description?: string;   // 类目说明
  children?: CategoryItem[];
}

// Product SPU & SKU
export interface SKUVariant {
  id: string;
  skuCode: string;
  specName: string;      // e.g. "深空灰 / 16GB+512GB"
  price: number;
  costPrice: number;
  stock: number;
  salesCount: number;
}

export interface ProductSPUItem {
  id: string;
  spuCode: string;       // SPU编码 e.g. SPU-ELEC-MAC16
  name: string;          // 商品SPU全称
  brand: string;         // 品牌 e.g. 苹果 (Apple)
  categoryId: string;    // 所属类目ID
  categoryName: string;  // 所属类目名称
  minPrice: number;      // 最低卖价
  maxPrice: number;      // 最高卖价
  totalStock: number;    // 总库存
  totalSales: number;    // 累计销量
  status: 'on_sale' | 'off_sale' | 'draft' | 'sold_out'; // 状态
  coverImage: string;    // 封面主图
  specs: string[];       // 规格属性标签
  skus: SKUVariant[];    // 下属SKU列表
  createdAt: string;     // 创建/发布时间
  description?: string;  // 详细说明
}

// Stock Alert
export interface StockAlertItem {
  id: string;
  skuCode: string;       // SKU编码
  spuName: string;       // 商品名称
  specName: string;      // 规格明细
  category: string;      // 类目
  warehouse: string;     // 所属仓库 (华东总仓/华南仓/北京仓)
  warehouseCode: string; // 仓库编码
  currentStock: number;  // 当前实际库存
  safetyStock: number;   // 安全库存预警线
  suggestedReplenish: number; // 建议补货数量
  alertLevel: 'critical' | 'warning' | 'overstock' | 'normal'; // 严重缺货, 缺货告警, 积压告警, 正常
  supplierName: string;  // 供应商
  supplierContact: string;// 供应商电话
  estimatedDepletionDays: number; // 预计销售耗尽天数
  lastStockCheck: string;// 上次盘点时间
}



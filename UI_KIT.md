# Nexus Admin System — UI KIT & 设计规范指南

本文档全面总结并规范了 **Nexus B2B/B2C 电商中后台管理系统** 的全套 UI/UX 设计规范、视觉 Design Tokens、组件交互模型以及页面布局模版。

---

## 目录
1. [设计哲学与基本原则](#1-设计哲学与基本原则)
2. [色彩系统 (Color System)](#2-色彩系统-color-system)
3. [字体与排版 (Typography)](#3-字体与排版-typography)
4. [圆角、间距与阴影 (Radius, Spacing & Shadows)](#4-圆角间距与阴影-radius-spacing--shadows)
5. [核心组件库 (Component Library)](#5-核心组件库-component-library)
6. [模版与页面布局 (Layout Patterns)](#6-模版与页面布局-layout-patterns)
7. [无障碍与响应式规范 (Accessibility & Responsive)](#7-无障碍与响应式规范-accessibility--responsive)

---

## 1. 设计哲学与基本原则

Nexus 中后台设计系统遵循 **“高密度清晰度、强语义识别、优雅对比”** 的核心原则：

*   **视觉分级 (Visual Hierarchy)**：采用渐变 Hero Banner 划分模块主场，搭配卡片层级与柔和微阴影，杜绝 AI 常见的单调无差别排列。
*   **语义色彩化 (Semantic Color Coding)**：状态标签与警告信息均绑定强语义颜色（绿代表正常/启用，黄代表预警/处理中，红代表严重/售罄/删除，蓝/紫代表系统/类目）。
*   **高精等宽对齐 (Data Density & Precision)**：所有数字、价格（¥）、单号、SPU/SKU 编码均统一使用等宽字体（`font-mono`），确保表格数据垂直精准对齐。
*   **双模式无缝适配 (Light & Dark Support)**：原生适配 Tailwind 深色模式（`dark:` 前缀），保持对比度在 WCAG AA (4.5:1) 标准以上。

---

## 2. 色彩系统 (Color System)

### 2.1 主品牌色 (Primary Brand)
*   **Indigo (靛蓝)**：核心操作、激活状态、顶栏主视觉
    *   主色：`indigo-600` (`#4F46E5`)
    *   深态/悬浮：`indigo-700` (`#4338CA`)
    *   淡底色：`indigo-50` (`#EEF2FF`) / 深色模式：`indigo-950/60`
    *   边框高亮：`indigo-200/50` / 深色模式：`indigo-800/50`

### 2.2 辅助品牌与模块色 (Secondary Accent)
*   **Purple (紫色)**：多级类目配置、高级属性
    *   主色：`purple-600` / 渐变底色：`from-purple-800 via-indigo-800 to-indigo-900`
*   **Amber / Orange (琥珀金/橙)**：库存预警、物流追踪中转
    *   主色：`amber-600` / 渐变底色：`from-amber-700 via-orange-800 to-rose-900`

### 2.3 状态与语义色彩 (Semantic Colors)

| 语义类型 | Light 模式浅底 | Light 文本/图标 | Dark 模式深底 | Dark 文本/图标 | 应用场景 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Success (成功/在售)** | `bg-emerald-50` | `text-emerald-600` | `bg-emerald-950/60` | `text-emerald-400` | 在售中、启用、正常签收 |
| **Warning (预警/待处理)** | `bg-amber-50` | `text-amber-600` | `bg-amber-950/60` | `text-amber-400` | 缺货预警、退款审核中 |
| **Danger (严重/售罄/删除)** | `bg-rose-50` | `text-rose-600` | `bg-rose-950/60` | `text-rose-400` | 严重断货、退款异常拒绝、删除 |
| **Info / Sky (信息/过剩)** | `bg-sky-50` | `text-sky-600` | `bg-sky-950/60` | `text-sky-400` | 积压告警、物流揽收、提示 |

---

## 3. 字体与排版 (Typography)

系统的字体阶梯设计如下：

```
2xl (24px) - 模块大标题 Hero Banner Title
xl  (20px) - 弹窗/抽屉主标题 Modal Title
lg  (18px) - 数值指标卡 Key Stat Value
base(16px) - 强调文本 Body Highlight
sm  (14px) - 区块小标题 Block Title
xs  (12px) - 默认表格文本、表单 Label、按钮文本
11px       - 辅助数据、属性次要标签、小按钮
10px       - 胶囊 Badges、状态脚标
```

*   **等宽字体规则**：订单号、SPU/SKU Code、物流单号、金额 `¥12,800.00`、时间戳等，统一添加 `font-mono font-semibold` 类。

---

## 4. 圆角、间距与阴影 (Radius, Spacing & Shadows)

### 4.1 圆角阶梯 (Border Radius)
*   **模块外壳/大卡片/Banner**：`rounded-2xl` (16px)
*   **输入框/下拉框/常态按钮**：`rounded-xl` (12px)
*   **表格行操作小按钮/次级 Card**：`rounded-lg` (8px)
*   **状态胶囊/Badges/Pills**：`rounded-full` (9999px)

### 4.2 内外边距数学法则 (Padding Rule)
*   `Outer Radius = Inner Radius + Padding`
*   标准容器内边距：`p-4` (16px) 或 `p-6` (24px)
*   按钮 padding：水平内边距严格保持为垂直内边距的 2 倍（例如 `px-4 py-2`）。

---

## 5. 核心组件库 (Component Library)

### 5.1 顶部模块 Hero Banner 规范
用于各独立业务模块顶部，聚合视觉冲击力与核心数据。
```tsx
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-900 p-6 text-white shadow-xl">
  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="space-y-2">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/20">
        <Icon className="h-3.5 w-3.5 text-indigo-300" />
        <span>模块子标签</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-white">页面主标题</h1>
      <p className="max-w-2xl text-xs text-indigo-100/80 leading-relaxed">业务描述与操作引导说明...</p>
    </div>
    <button className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-indigo-900 shadow-lg hover:bg-indigo-50 transition-all active:scale-95">
      <Plus className="h-4 w-4 text-indigo-600" />
      <span>主操作按钮</span>
    </button>
  </div>
</div>
```

### 5.2 状态胶囊标签 (Status Badge Component)
```tsx
// 成功 / 在售中
<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
  <CheckCircle2 className="h-3 w-3" />
  在售中
</span>

// 警告 / 预警
<span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
  <AlertTriangle className="h-3 w-3" />
  缺货预警
</span>
```

### 5.3 统一控制栏 (Control & Filter Bar)
```tsx
<div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
  {/* 搜索框 */}
  <div className="relative flex-1 min-w-[240px]">
    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
    <input type="text" className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 py-2 pl-10 pr-4 text-xs" placeholder="搜索关键词..." />
  </div>
  {/* 快捷筛选与按钮组 */}
  <div className="flex flex-wrap items-center gap-2">
    {/* 选项组 */}
  </div>
</div>
```

### 5.4 侧滑详情抽屉 (Slide-over Drawer)
采用微模糊遮罩与流畅 slide-in 动画：
*   **Backdrop**: `fixed inset-0 z-50 bg-black/40 backdrop-blur-xs`
*   **Container**: `w-full max-w-xl bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-200`

---

## 6. 模版与页面布局 (Layout Patterns)

全站架构采用标准的双栏控制面板结构：
1.  **左侧 Sidebar**：260px 宽度固定，支持二级菜单展开折叠与高亮指示器。
2.  **顶部 Header**：搜索全局、通知中心、暗黑模式切换、全局面包屑与用户 Profile。
3.  **主工作区 Main Container**：最高宽度内嵌居中，间距 `space-y-6`，保障在大屏与小屏均有良好延伸与缩放表现。

---

## 7. 无障碍与响应式规范 (Accessibility & Responsive)

*   **触摸与点击区域**：PC端交互按键最小高为 32px-36px，Mobile 端保持在 44px 以上。
*   **文本对比度**：正文灰色选择 `text-gray-600` (Light) / `text-gray-300` (Dark)，避免低对比度盲区。
*   **多端响应**：在移动设备自动隐藏不必要的次要表格列，重点展示关键数据与侧滑抽屉。

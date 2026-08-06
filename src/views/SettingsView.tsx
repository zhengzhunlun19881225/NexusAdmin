import React, { useState, useMemo } from 'react';
import {
  Settings,
  ShieldCheck,
  FileText,
  KeyRound,
  UserCheck,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  UserPlus,
  Copy,
  Lock,
  Unlock,
  ShieldAlert,
  X,
  Check,
  Download,
  Terminal,
  AlertTriangle,
  Globe,
  Zap,
  Tag,
  Key,
  Layers,
  Activity,
  Cpu,
} from 'lucide-react';
import { SystemUser, RoleItem, AuditLogItem, ApiKeyItem } from '../types';
import { compactBadge, statusBadge } from '../uiTheme';

interface SettingsViewProps {
  systemUsers: SystemUser[];
  setSystemUsers: React.Dispatch<React.SetStateAction<SystemUser[]>>;
  roles: RoleItem[];
  setRoles: React.Dispatch<React.SetStateAction<RoleItem[]>>;
  auditLogs: AuditLogItem[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLogItem[]>>;
  apiKeys: ApiKeyItem[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKeyItem[]>>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  subPath?: string;
  setActivePath?: (path: string) => void;
}

// Available permission nodes grouped by module
const PERMISSION_GROUPS = [
  {
    module: '订单数据管理',
    permissions: [
      { code: 'orders:read', label: '查看订单列表与详情' },
      { code: 'orders:write', label: '创建与改价订单' },
      { code: 'orders:update_status', label: '更新发货与物流状态' },
      { code: 'orders:audit', label: '风控异常单审核' },
      { code: 'orders:delete', label: '作废与强制取消订单' },
    ],
  },
  {
    module: '商品与库存中心',
    permissions: [
      { code: 'products:read', label: '查看商品SPU/SKU列表' },
      { code: 'products:write', label: '发布与编辑商品信息' },
      { code: 'products:stock', label: '库存盘点与预警设置' },
      { code: 'products:category', label: '类目树与佣金配置' },
    ],
  },
  {
    module: '客户关系 CRM',
    permissions: [
      { code: 'customers:read', label: '查看客户档案与历史消费' },
      { code: 'customers:write', label: '修改客户标签与归属' },
      { code: 'customers:segment', label: '分群画像规则管理' },
      { code: 'customers:vip', label: 'VIP权益与折上折配置' },
    ],
  },
  {
    module: '营销与优惠券',
    permissions: [
      { code: 'marketing:coupons', label: '创建与发放优惠券' },
      { code: 'marketing:activities', label: '发布秒杀与拼团活动' },
    ],
  },
  {
    module: '数据决策与财务',
    permissions: [
      { code: 'analytics:read', label: '查看销售转化与漏斗报表' },
      { code: 'finance:export', label: '导出对账单与开票流水' },
    ],
  },
  {
    module: '系统安全与配置',
    permissions: [
      { code: 'settings:rbac', label: '分配管理员账号与角色权限' },
      { code: 'settings:logs', label: '查看与导出全量审计日志' },
      { code: 'settings:api', label: '生成与撤销开放API秘钥' },
    ],
  },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  systemUsers,
  setSystemUsers,
  roles,
  setRoles,
  auditLogs,
  setAuditLogs,
  apiKeys,
  setApiKeys,
  showToast,
  subPath = 'roles',
  setActivePath,
}) => {
  // Tab Switcher
  const currentTab = useMemo(() => {
    if (subPath === 'users') return 'users';
    if (subPath === 'logs') return 'logs';
    if (subPath === 'api') return 'api';
    return 'roles';
  }, [subPath]);

  // Common Search & Filters
  const [keyword, setKeyword] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Stats calculation
  const stats = useMemo(() => {
    const totalUsers = systemUsers.length;
    const activeUsers = systemUsers.filter((u) => u.status === 'active').length;
    const totalRoles = roles.length;
    const totalLogs = auditLogs.length;
    const totalApiKeys = apiKeys.length;
    const activeApiKeys = apiKeys.filter((k) => k.status === 'active').length;

    return {
      totalUsers,
      activeUsers,
      totalRoles,
      totalLogs,
      totalApiKeys,
      activeApiKeys,
    };
  }, [systemUsers, roles, auditLogs, apiKeys]);

  // ---------------------------------------------------------------------------
  // 1. ROLES RBAC STATE & HANDLERS
  // ---------------------------------------------------------------------------
  const [detailRole, setDetailRole] = useState<RoleItem | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [deleteRoleConfirmId, setDeleteRoleConfirmId] = useState<string | null>(null);

  const [roleForm, setRoleForm] = useState<Partial<RoleItem>>({
    name: '',
    description: '',
    permissions: [],
  });

  const handleOpenAddRole = () => {
    setEditingRole(null);
    setRoleForm({
      name: '',
      description: '',
      permissions: ['orders:read', 'products:read', 'customers:read'],
    });
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: RoleItem) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setIsRoleModalOpen(true);
  };

  const handleTogglePermission = (code: string) => {
    const current = roleForm.permissions || [];
    if (current.includes(code)) {
      setRoleForm({ ...roleForm, permissions: current.filter((p) => p !== code) });
    } else {
      setRoleForm({ ...roleForm, permissions: [...current, code] });
    }
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name?.trim()) {
      showToast('请填写角色名称！', 'error');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? ({
                ...r,
                name: roleForm.name,
                description: roleForm.description,
                permissions: roleForm.permissions || [],
                updatedAt: todayStr,
              } as RoleItem)
            : r
        )
      );
      showToast(`角色 "${roleForm.name}" 的 RBAC 权限配置已更新`, 'success');
    } else {
      const newRole: RoleItem = {
        id: `role-${Date.now()}`,
        name: roleForm.name || '新角色',
        description: roleForm.description || '自定义系统权限组',
        userCount: 0,
        permissions: roleForm.permissions || ['orders:read'],
        updatedAt: todayStr,
      };
      setRoles((prev) => [...prev, newRole]);
      showToast(`新增系统角色 "${newRole.name}" 成功！`, 'success');
    }

    setIsRoleModalOpen(false);
  };

  const handleConfirmDeleteRole = () => {
    if (!deleteRoleConfirmId) return;
    const target = roles.find((r) => r.id === deleteRoleConfirmId);
    if (target?.name === '超级管理员') {
      showToast('超级管理员为底层核心系统角色，严禁注销或删除！', 'error');
      setDeleteRoleConfirmId(null);
      return;
    }

    setRoles((prev) => prev.filter((r) => r.id !== deleteRoleConfirmId));
    showToast(`角色 "${target?.name || ''}" 已安全删除`, 'info');
    setDeleteRoleConfirmId(null);
  };

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      if (keyword.trim()) {
        const kw = keyword.toLowerCase().trim();
        const matchName = role.name.toLowerCase().includes(kw);
        const matchDesc = role.description.toLowerCase().includes(kw);
        const matchPerm = role.permissions.some((p) => p.toLowerCase().includes(kw));
        if (!matchName && !matchDesc && !matchPerm) return false;
      }
      return true;
    });
  }, [roles, keyword]);

  // ---------------------------------------------------------------------------
  // 2. SYSTEM USERS STATE & HANDLERS
  // ---------------------------------------------------------------------------
  const [detailUser, setDetailUser] = useState<SystemUser | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [deleteUserConfirmId, setDeleteUserConfirmId] = useState<string | null>(null);

  const [userForm, setUserForm] = useState<Partial<SystemUser>>({
    username: '',
    realName: '',
    email: '',
    phone: '',
    department: '华东运营中心',
    role: '客服专员',
    status: 'active',
  });

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserForm({
      username: '',
      realName: '',
      email: '',
      phone: '',
      department: '华东运营中心',
      role: '客服专员',
      status: 'active',
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (usr: SystemUser) => {
    setEditingUser(usr);
    setUserForm({ ...usr });
    setIsUserModalOpen(true);
  };

  const handleToggleUserStatus = (usr: SystemUser) => {
    const nextStatus: SystemUser['status'] = usr.status === 'active' ? 'disabled' : 'active';
    setSystemUsers((prev) =>
      prev.map((item) => (item.id === usr.id ? { ...item, status: nextStatus } : item))
    );
    showToast(
      `管理员 "${usr.realName}" 登录状态已更新为：${nextStatus === 'active' ? '允许登录' : '禁止登录/已冻结'}`,
      nextStatus === 'active' ? 'success' : 'info'
    );
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.realName?.trim() || !userForm.username?.trim()) {
      showToast('请填写用户名与真实姓名！', 'error');
      return;
    }

    if (editingUser) {
      setSystemUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? ({ ...u, ...userForm } as SystemUser) : u))
      );
      showToast(`管理员账号 "${userForm.realName}" 资料已更新`, 'success');
    } else {
      const newUser: SystemUser = {
        id: `sys-usr-${Date.now()}`,
        username: userForm.username || 'newuser',
        realName: userForm.realName || '新成员',
        email: userForm.email || 'user@nexus.com',
        phone: userForm.phone || '13800000000',
        department: userForm.department || '华东运营中心',
        role: (userForm.role as SystemUser['role']) || '客服专员',
        status: 'active',
        lastLogin: new Date().toLocaleString(),
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      };
      setSystemUsers((prev) => [newUser, ...prev]);

      // Update role userCount
      setRoles((prev) =>
        prev.map((r) => (r.name === newUser.role ? { ...r, userCount: r.userCount + 1 } : r))
      );

      showToast(`新建管理员账号 "${newUser.realName}" 成功！`, 'success');
    }

    setIsUserModalOpen(false);
  };

  const handleConfirmDeleteUser = () => {
    if (!deleteUserConfirmId) return;
    const target = systemUsers.find((u) => u.id === deleteUserConfirmId);
    setSystemUsers((prev) => prev.filter((u) => u.id !== deleteUserConfirmId));
    showToast(`管理员账号 "${target?.realName || ''}" 已彻底注销`, 'info');
    setDeleteUserConfirmId(null);
  };

  const filteredUsers = useMemo(() => {
    return systemUsers.filter((usr) => {
      if (keyword.trim()) {
        const kw = keyword.toLowerCase().trim();
        const matchName = usr.realName.toLowerCase().includes(kw);
        const matchUsername = usr.username.toLowerCase().includes(kw);
        const matchEmail = usr.email.toLowerCase().includes(kw);
        const matchPhone = usr.phone.includes(kw);
        const matchDept = usr.department.toLowerCase().includes(kw);
        if (!matchName && !matchUsername && !matchEmail && !matchPhone && !matchDept)
          return false;
      }

      if (statusFilter !== 'all' && usr.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [systemUsers, keyword, statusFilter]);

  // ---------------------------------------------------------------------------
  // 3. AUDIT LOGS STATE & HANDLERS
  // ---------------------------------------------------------------------------
  const [detailLog, setDetailLog] = useState<AuditLogItem | null>(null);
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);
  const [isClearLogConfirmOpen, setIsClearLogConfirmOpen] = useState(false);

  const [logForm, setLogForm] = useState<Partial<AuditLogItem>>({
    operator: '张伟 (超级管理员)',
    ip: '114.242.25.10',
    module: '系统与权限配置',
    action: '',
    details: '',
  });

  const handleSaveManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.action?.trim()) {
      showToast('请填写操作动作说明！', 'error');
      return;
    }

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      operator: logForm.operator || '系统操作员',
      ip: logForm.ip || '127.0.0.1',
      action: logForm.action,
      module: logForm.module || '人工上报审计',
      status: 'success',
      timestamp: new Date().toLocaleString(),
      details: logForm.details || '手动备注录入审计日志',
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    showToast('已录入一条防篡改审计日志记录！', 'success');
    setIsAddLogModalOpen(false);
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    showToast('已安全清空历史审计操作日志记录', 'info');
    setIsClearLogConfirmOpen(false);
  };

  const handleExportLogsCsv = () => {
    const headers = ['日志ID', '操作员', 'IP地址', '业务模块', '动作描述', '状态', '时间戳'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.operator,
      l.ip,
      l.module,
      l.action,
      l.status,
      l.timestamp,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `system_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('防篡改审计操作日志 CSV 报表已成功导出！', 'success');
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (keyword.trim()) {
        const kw = keyword.toLowerCase().trim();
        const matchOp = log.operator.toLowerCase().includes(kw);
        const matchIp = log.ip.includes(kw);
        const matchAct = log.action.toLowerCase().includes(kw);
        const matchMod = log.module.toLowerCase().includes(kw);
        if (!matchOp && !matchIp && !matchAct && !matchMod) return false;
      }

      if (moduleFilter !== 'all' && log.module !== moduleFilter) {
        return false;
      }

      if (statusFilter !== 'all' && log.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [auditLogs, keyword, moduleFilter, statusFilter]);

  // ---------------------------------------------------------------------------
  // 4. OPEN API KEYS STATE & HANDLERS
  // ---------------------------------------------------------------------------
  const [detailKey, setDetailKey] = useState<ApiKeyItem | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKeyItem | null>(null);
  const [deleteKeyConfirmId, setDeleteKeyConfirmId] = useState<string | null>(null);
  const [resetSecretKeyItem, setResetSecretKeyItem] = useState<ApiKeyItem | null>(null);

  const [keyForm, setKeyForm] = useState<Partial<ApiKeyItem>>({
    name: '',
    description: '',
    scopes: ['orders:read', 'products:read'],
    ipWhitelist: ['0.0.0.0/0'],
    expiresAt: '2027-12-31',
    status: 'active',
  });
  const [ipInput, setIpInput] = useState('');

  const handleOpenAddKey = () => {
    setEditingKey(null);
    setKeyForm({
      name: '',
      description: '',
      scopes: ['orders:read', 'products:read'],
      ipWhitelist: ['114.242.25.10'],
      expiresAt: '2027-12-31',
      status: 'active',
    });
    setIpInput('');
    setIsKeyModalOpen(true);
  };

  const handleOpenEditKey = (keyItem: ApiKeyItem) => {
    setEditingKey(keyItem);
    setKeyForm({ ...keyItem });
    setIpInput('');
    setIsKeyModalOpen(true);
  };

  const handleToggleKeyScope = (scopeCode: string) => {
    const current = keyForm.scopes || [];
    if (current.includes(scopeCode)) {
      setKeyForm({ ...keyForm, scopes: current.filter((s) => s !== scopeCode) });
    } else {
      setKeyForm({ ...keyForm, scopes: [...current, scopeCode] });
    }
  };

  const handleAddIp = () => {
    if (!ipInput.trim()) return;
    const current = keyForm.ipWhitelist || [];
    if (!current.includes(ipInput.trim())) {
      setKeyForm({ ...keyForm, ipWhitelist: [...current, ipInput.trim()] });
    }
    setIpInput('');
  };

  const handleRemoveIp = (ipToRemove: string) => {
    setKeyForm({
      ...keyForm,
      ipWhitelist: (keyForm.ipWhitelist || []).filter((ip) => ip !== ipToRemove),
    });
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyForm.name?.trim()) {
      showToast('请填写 API 秘钥名称！', 'error');
      return;
    }

    if (editingKey) {
      setApiKeys((prev) =>
        prev.map((k) => (k.id === editingKey.id ? ({ ...k, ...keyForm } as ApiKeyItem) : k))
      );
      showToast(`开放 API 秘钥 "${keyForm.name}" 配置已更新`, 'success');
    } else {
      const randomRandomStr = Math.random().toString(36).substring(2, 10);
      const randomFullStr = `nx_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
      const newKey: ApiKeyItem = {
        id: `key-${Date.now()}`,
        name: keyForm.name || '新开放 API 秘钥',
        keyPrefix: `nx_live_${randomRandomStr.substring(0, 4)}`,
        secretKey: randomFullStr,
        scopes: keyForm.scopes?.length ? keyForm.scopes : ['orders:read'],
        ipWhitelist: keyForm.ipWhitelist?.length ? keyForm.ipWhitelist : ['0.0.0.0/0'],
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: keyForm.expiresAt || '2028-12-31',
        totalCalls: 0,
        lastCallTime: '尚未调用',
        description: keyForm.description || '自定义 Open API 对接秘钥',
      };
      setApiKeys((prev) => [newKey, ...prev]);
      showToast(`开放 API 秘钥 "${newKey.name}" 创建成功！`, 'success');
    }

    setIsKeyModalOpen(false);
  };

  const handleConfirmResetSecret = () => {
    if (!resetSecretKeyItem) return;
    const newSecret = `nx_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    const newPrefix = newSecret.substring(0, 12);

    setApiKeys((prev) =>
      prev.map((k) =>
        k.id === resetSecretKeyItem.id
          ? { ...k, secretKey: newSecret, keyPrefix: newPrefix }
          : k
      )
    );

    showToast(`秘钥 "${resetSecretKeyItem.name}" 已生成全新的安全 Secret！`, 'success');
    setResetSecretKeyItem(null);
  };

  const handleConfirmDeleteKey = () => {
    if (!deleteKeyConfirmId) return;
    const target = apiKeys.find((k) => k.id === deleteKeyConfirmId);
    setApiKeys((prev) => prev.filter((k) => k.id !== deleteKeyConfirmId));
    showToast(`API 秘钥 "${target?.name || ''}" 已彻底注销销毁`, 'info');
    setDeleteKeyConfirmId(null);
  };

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    showToast('API 秘钥 (Secret Key) 已成功复制到剪贴板！', 'success');
  };

  const filteredKeys = useMemo(() => {
    return apiKeys.filter((k) => {
      if (keyword.trim()) {
        const kw = keyword.toLowerCase().trim();
        const matchName = k.name.toLowerCase().includes(kw);
        const matchPrefix = k.keyPrefix.toLowerCase().includes(kw);
        const matchDesc = k.description && k.description.toLowerCase().includes(kw);
        if (!matchName && !matchPrefix && !matchDesc) return false;
      }

      if (statusFilter !== 'all' && k.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [apiKeys, keyword, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Hero Banner (Same visual design as AbnormalRefundsView) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md border border-indigo-500/30">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>系统与权限配置中心 (RBAC & Audit & Open API)</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              细粒度 RBAC 权限体系、安全审计与 Open API 平台
            </h2>
            <p className="text-sm text-indigo-200/80">
              保障企业级全链路权限安全，全量操作行为防篡改追溯与开放 API 授权管理
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentTab === 'roles' && (
              <button
                onClick={handleOpenAddRole}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>新增系统角色</span>
              </button>
            )}

            {currentTab === 'users' && (
              <button
                onClick={handleOpenAddUser}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 active:scale-95"
              >
                <UserPlus className="h-4 w-4" />
                <span>新增管理员账号</span>
              </button>
            )}

            {currentTab === 'logs' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportLogsCsv}
                  className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
                >
                  <Download className="h-4 w-4 text-indigo-300" />
                  <span>导出日志 CSV</span>
                </button>
                <button
                  onClick={() => setIsAddLogModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  <span>手动上报审计</span>
                </button>
              </div>
            )}

            {currentTab === 'api' && (
              <button
                onClick={handleOpenAddKey}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 active:scale-95"
              >
                <Key className="h-4 w-4" />
                <span>创建 API 秘钥</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs text-indigo-200/70">系统管理员账号</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-300">{stats.totalUsers}</span>
              <span className="text-xs text-emerald-400">{stats.activeUsers} 允许登录</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs text-indigo-200/70">RBAC 角色节点</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{stats.totalRoles}</span>
              <span className="text-xs text-indigo-300">个角色组</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs text-indigo-200/70">审计操作日志存量</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-300">{stats.totalLogs}</span>
              <span className="text-xs text-indigo-200/60">条流水</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs text-indigo-200/70">开放 API 秘钥</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-300">{stats.totalApiKeys}</span>
              <span className="text-xs text-emerald-400">{stats.activeApiKeys} 生效中</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar inside controls */}
      <div className="flex justify-end border-b border-gray-200/80 pb-4 dark:border-gray-800">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="全局搜寻名称、代码、模块或说明..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2 pl-9 pr-8 text-xs text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400 dark:focus:bg-gray-800"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 1. ROLES VIEW */}
      {/* --------------------------------------------------------------------- */}
      {currentTab === 'roles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoles.length === 0 ? (
              <div className="col-span-2 rounded-2xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-800">
                <p className="text-base font-medium text-gray-500 dark:text-gray-400">
                  未搜寻到符合条件的 RBAC 角色
                </p>
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                            {role.name}
                          </h3>
                          <span className="text-xs text-gray-400 font-mono">ID: {role.id}</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {role.userCount} 位授权账号
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {role.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-gray-400 block mb-1.5">
                      细粒度授权节点 ({role.permissions.length} 项):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {role.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="rounded-lg bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <span className="text-gray-400 text-xs">更新时间: {role.updatedAt}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDetailRole(role)}
                        className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>查看视角</span>
                      </button>
                      <button
                        onClick={() => handleOpenEditRole(role)}
                        className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>配置策略</span>
                      </button>
                      <button
                        onClick={() => setDeleteRoleConfirmId(role.id)}
                        className="rounded-xl border border-gray-200 p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:border-gray-800 dark:hover:bg-rose-950/50"
                        title="删除角色"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 2. USERS VIEW */}
      {/* --------------------------------------------------------------------- */}
      {currentTab === 'users' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  管理员账号列表 ({filteredUsers.length} 位)
                </span>
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <option value="all">全部登录状态</option>
                    <option value="active">允许登录</option>
                    <option value="disabled">禁止登录/冻结</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/80 text-sm text-gray-500 font-semibold border-b border-gray-100 dark:bg-gray-800/60 dark:border-gray-800">
                  <tr>
                    <th className="p-3.5 pl-5">管理员账号</th>
                    <th className="p-3.5">归属部门</th>
                    <th className="p-3.5">分配 RBAC 角色</th>
                    <th className="p-3.5">手机 / 邮箱</th>
                    <th className="p-3.5">最近登录时间</th>
                    <th className="p-3.5">状态</th>
                    <th className="p-3.5 pr-5 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">
                        未搜寻到符合条件的管理员账号
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((usr) => (
                      <tr
                        key={usr.id}
                        className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition"
                      >
                        <td className="p-3.5 pl-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={usr.avatar}
                              alt={usr.realName}
                              className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-800"
                            />
                            <div>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {usr.realName}
                              </span>
                              <p className="text-xs text-gray-400 font-mono">@{usr.username}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-medium text-gray-600 dark:text-gray-400">
                          {usr.department}
                        </td>

                        <td className="p-3.5">
                          <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2 py-0.5 font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                            {usr.role}
                          </span>
                        </td>

                        <td className="p-3.5 font-mono text-gray-500">
                          <div>{usr.phone}</div>
                          <div className="text-xs text-gray-400">{usr.email}</div>
                        </td>

                        <td className="p-3.5 font-mono text-gray-400">{usr.lastLogin}</td>

                        <td className="p-3.5">
                          {usr.status === 'active' ? (
                            <span className={statusBadge.success}>
                              <span>允许登录</span>
                            </span>
                          ) : (
                            <span className={statusBadge.danger}>
                              <span>已冻结</span>
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 pr-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setDetailUser(usr)}
                              className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
                            >
                              详情
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(usr)}
                              className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
                            >
                              {usr.status === 'active' ? '冻结' : '解冻'}
                            </button>
                            <button
                              onClick={() => handleOpenEditUser(usr)}
                              className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteUserConfirmId(usr.id)}
                              className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 3. AUDIT LOGS VIEW */}
      {/* --------------------------------------------------------------------- */}
      {currentTab === 'logs' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-amber-500" />
                  <span>防篡改全量审计日志 ({filteredLogs.length} 条)</span>
                </span>

                <div className="flex items-center gap-2">
                  <select
                    value={moduleFilter}
                    onChange={(e) => setModuleFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <option value="all">全量业务模块</option>
                    <option value="订单数据管理">订单数据管理</option>
                    <option value="商品中心">商品中心</option>
                    <option value="数据决策看板">数据决策看板</option>
                    <option value="系统与权限配置">系统与权限配置</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <option value="all">全部结果状态</option>
                    <option value="success">成功 (200 OK)</option>
                    <option value="failure">异常/拒绝 (403/500)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setIsClearLogConfirmOpen(true)}
                className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>归档清空日志</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-mono">
                <thead className="bg-gray-50/80 text-sm text-gray-500 font-semibold border-b border-gray-100 dark:bg-gray-800/60 dark:border-gray-800">
                  <tr>
                    <th className="p-3.5 pl-5">操作员账号</th>
                    <th className="p-3.5">客户端 IP</th>
                    <th className="p-3.5">业务模块</th>
                    <th className="p-3.5">具体动作说明</th>
                    <th className="p-3.5">执行结果</th>
                    <th className="p-3.5 pr-5 text-right">时间戳</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">
                        暂无符合条件的审计操作流水
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        onClick={() => setDetailLog(log)}
                        className="hover:bg-amber-50/30 cursor-pointer dark:hover:bg-gray-800/40 transition"
                      >
                        <td className="p-3.5 pl-5 font-bold text-gray-900 dark:text-white">
                          {log.operator}
                        </td>
                        <td className="p-3.5 text-gray-500">{log.ip}</td>
                        <td className="p-3.5">
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200/60">
                            {log.module}
                          </span>
                        </td>
                        <td className="p-3.5 text-gray-900 font-medium dark:text-gray-100">
                          {log.action}
                        </td>
                        <td className="p-3.5">
                          {log.status === 'success' ? (
                            <span className={`${compactBadge.success} font-bold`}>
                              200 OK
                            </span>
                          ) : (
                            <span className={`${compactBadge.danger} font-bold`}>
                              403 Denied
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 pr-5 text-right text-gray-400">{log.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 4. OPEN API KEYS VIEW */}
      {/* --------------------------------------------------------------------- */}
      {currentTab === 'api' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKeys.length === 0 ? (
              <div className="col-span-2 rounded-2xl border border-dashed border-gray-300 py-12 text-center dark:border-gray-800">
                <p className="text-base font-medium text-gray-500 dark:text-gray-400">
                  暂无开放 API 秘钥记录
                </p>
              </div>
            ) : (
              filteredKeys.map((keyItem) => (
                <div
                  key={keyItem.id}
                  className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                            {keyItem.name}
                          </h3>
                          <span className="text-xs font-mono text-gray-400">
                            Prefix: {keyItem.keyPrefix}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`${
                          keyItem.status === 'active'
                            ? statusBadge.success
                            : statusBadge.neutral
                        }`}
                      >
                        {keyItem.status === 'active' ? '生产生效中' : '已注销/停用'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {keyItem.description}
                    </p>

                    {/* Masked secret bar */}
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-200/80 bg-gray-50/80 p-2.5 dark:border-gray-800 dark:bg-gray-800/60 font-mono text-xs">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {keyItem.secretKey.substring(0, 16)}••••••••
                      </span>
                      <button
                        onClick={() => handleCopySecret(keyItem.secretKey)}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:text-indigo-300"
                      >
                        <Copy className="h-3 w-3" />
                        <span>复制完整Secret</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-400 block mb-1">
                        接口权限范围 Scopes ({keyItem.scopes.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {keyItem.scopes.map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-emerald-50/80 px-2 py-0.5 font-mono text-xs font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-gray-400 block mb-1">
                        IP 白名单限制:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {keyItem.ipWhitelist.map((ip) => (
                          <span
                            key={ip}
                            className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <div className="text-xs text-gray-400">
                      <span>调用: {keyItem.totalCalls.toLocaleString()} 次</span>
                      <span className="mx-1">·</span>
                      <span>截止: {keyItem.expiresAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setResetSecretKeyItem(keyItem)}
                        className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300"
                        title="重置安全Secret"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>重置Secret</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditKey(keyItem)}
                        className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>编辑</span>
                      </button>

                      <button
                        onClick={() => setDeleteKeyConfirmId(keyItem.id)}
                        className="rounded-xl border border-gray-200 p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:border-gray-800 dark:hover:bg-rose-950/50"
                        title="注销秘钥"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* DRAWERS & MODALS */}
      {/* --------------------------------------------------------------------- */}

      {/* Role Detail Drawer */}
      {detailRole && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl h-full overflow-y-auto p-6 space-y-6 flex flex-col border-l border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 font-bold dark:bg-indigo-950 dark:text-indigo-300">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {detailRole.name} 权限策略矩阵
                  </h3>
                  <span className="text-xs font-mono text-gray-400">{detailRole.id}</span>
                </div>
              </div>
              <button
                onClick={() => setDetailRole(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 p-3 rounded-xl border border-gray-200/80 dark:bg-gray-800/50 dark:border-gray-800">
              {detailRole.description}
            </p>

            <div className="space-y-3">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>该角色已生效权限清单 ({detailRole.permissions.length} 项)</span>
              </span>

              <div className="space-y-2">
                {detailRole.permissions.map((p) => (
                  <div
                    key={p}
                    className="flex items-center justify-between rounded-xl border border-gray-200/80 bg-gray-50/50 p-2.5 text-sm dark:border-gray-800 dark:bg-gray-800/40"
                  >
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {p}
                    </span>
                    <span className="text-gray-500 text-xs">校验通过</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setDetailRole(null)}
                className="rounded-xl bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                <span>{editingRole ? '修改 RBAC 角色与授权' : '新增系统角色'}</span>
              </h3>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">角色名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 仓库发货调度组"
                  value={roleForm.name || ''}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">角色权责说明</label>
                <textarea
                  rows={2}
                  placeholder="简述该角色负责的业务岗位与职责边界..."
                  value={roleForm.description || ''}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  配置模块级授权权限节点 (多选)
                </label>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border border-gray-200/80 rounded-xl p-3 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/40">
                  {PERMISSION_GROUPS.map((grp, gIdx) => (
                    <div key={gIdx} className="space-y-1.5">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block border-b border-gray-200/60 pb-1">
                        {grp.module}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {grp.permissions.map((p) => {
                          const checked = (roleForm.permissions || []).includes(p.code);
                          return (
                            <label
                              key={p.code}
                              onClick={() => handleTogglePermission(p.code)}
                              className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition select-none ${
                                checked
                                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200'
                                  : 'border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300'
                              }`}
                            >
                              <div
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                  checked
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'border-gray-300'
                                }`}
                              >
                                {checked && <Check className="h-3 w-3" />}
                              </div>
                              <div>
                                <p className="font-bold text-xs">{p.label}</p>
                                <p className="font-mono text-xs text-gray-400">{p.code}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500"
                >
                  保存角色权限
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Role Confirm Modal */}
      {deleteRoleConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                确定要删除此 RBAC 角色吗？
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                删除后关联管理员绑定的权限节点将可能失效或受限。
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteRoleConfirmId(null)}
                className="w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteRole}
                className="w-full rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-500"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Add/Edit Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                <span>{editingUser ? '修改管理员账号' : '新增系统管理员账号'}</span>
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  真实姓名 *
                </label>
                <input
                  type="text"
                  required
                  value={userForm.realName || ''}
                  onChange={(e) => setUserForm({ ...userForm, realName: e.target.value })}
                  placeholder="例如：张伟"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    登录用户名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={userForm.username || ''}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    placeholder="zhangwei"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    分配系统角色
                  </label>
                  <select
                    value={userForm.role || '客服专员'}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    联系手机
                  </label>
                  <input
                    type="text"
                    value={userForm.phone || ''}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    归属部门
                  </label>
                  <input
                    type="text"
                    value={userForm.department || ''}
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  企业邮箱
                </label>
                <input
                  type="email"
                  value={userForm.email || ''}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 shadow-md"
                >
                  保存授权
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirm Modal */}
      {deleteUserConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                确定要彻底注销此管理员账号吗？
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                注销后该账号将无法再登录控制台或执行任何管理动作。
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteUserConfirmId(null)}
                className="w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteUser}
                className="w-full rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-500"
              >
                确定注销
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Drawer */}
      {detailUser && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl h-full overflow-y-auto p-6 space-y-6 flex flex-col border-l border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  src={detailUser.avatar}
                  alt={detailUser.realName}
                  className="h-12 w-12 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {detailUser.realName}
                  </h3>
                  <p className="text-xs font-mono text-gray-400">@{detailUser.username}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailUser(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-3.5 space-y-2 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">分配角色:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {detailUser.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">所属部门:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {detailUser.department}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">联系电话:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">
                    {detailUser.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">企业邮箱:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">
                    {detailUser.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">最近登录:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">
                    {detailUser.lastLogin}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setDetailUser(null)}
                className="rounded-xl bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Audit Log Modal */}
      {isAddLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-500" />
                <span>手动上报防篡改审计日志</span>
              </h3>
              <button
                onClick={() => setIsAddLogModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualLog} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  操作员与岗位 *
                </label>
                <input
                  type="text"
                  required
                  value={logForm.operator || ''}
                  onChange={(e) => setLogForm({ ...logForm, operator: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    所属业务模块
                  </label>
                  <select
                    value={logForm.module || '人工上报审计'}
                    onChange={(e) => setLogForm({ ...logForm, module: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="订单数据管理">订单数据管理</option>
                    <option value="商品中心">商品中心</option>
                    <option value="客户关系 CRM">客户关系 CRM</option>
                    <option value="系统与权限配置">系统与权限配置</option>
                    <option value="人工合规追溯">人工合规追溯</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    IP 地址
                  </label>
                  <input
                    type="text"
                    value={logForm.ip || '127.0.0.1'}
                    onChange={(e) => setLogForm({ ...logForm, ip: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  动作说明 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：人工复核公户对账单打款状态"
                  value={logForm.action || ''}
                  onChange={(e) => setLogForm({ ...logForm, action: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  审计备注 / Payload 报文
                </label>
                <textarea
                  rows={2}
                  value={logForm.details || ''}
                  onChange={(e) => setLogForm({ ...logForm, details: e.target.value })}
                  placeholder="可录入审批流水号或上下文参数..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-amber-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLogModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-5 py-2 font-semibold text-stone-950 shadow-md hover:bg-amber-400"
                >
                  提交审计记录
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Logs Confirm Modal */}
      {isClearLogConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                确定要清空历史审计操作日志吗？
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                清空后历史行为跟踪流将不可恢复，请谨慎操作！
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsClearLogConfirmOpen(false)}
                className="w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleClearAuditLogs}
                className="w-full rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-500"
              >
                确定清空
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Detail Drawer */}
      {detailLog && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl h-full overflow-y-auto p-6 space-y-6 flex flex-col border-l border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold dark:bg-amber-950 dark:text-amber-300">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    审计日志流水详情
                  </h3>
                  <span className="text-xs font-mono text-gray-400">{detailLog.id}</span>
                </div>
              </div>
              <button
                onClick={() => setDetailLog(null)}
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm font-mono">
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-3.5 space-y-2 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400 font-sans">操作员:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{detailLog.operator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400 font-sans">客户端 IP:</span>
                  <span className="text-gray-800 dark:text-gray-200">{detailLog.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400 font-sans">业务模块:</span>
                  <span className="text-gray-800 dark:text-gray-200">{detailLog.module}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400 font-sans">触发动作:</span>
                  <span className="text-amber-600 font-bold dark:text-amber-400">
                    {detailLog.action}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400 font-sans">时间戳:</span>
                  <span className="text-xs text-gray-500">{detailLog.timestamp}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-sans font-bold text-gray-700 dark:text-gray-300">
                  扩展批注 Payload 报文
                </span>
                <pre className="rounded-xl border border-gray-200 bg-gray-900 p-3 text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      logId: detailLog.id,
                      operator: detailLog.operator,
                      action: detailLog.action,
                      ip: detailLog.ip,
                      status: detailLog.status,
                      details: detailLog.details,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
              <button
                onClick={() => setDetailLog(null)}
                className="rounded-xl bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Add/Edit Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Key className="h-5 w-5 text-emerald-500" />
                <span>{editingKey ? '修改开放 API 秘钥配置' : '创建开放 API 秘钥'}</span>
              </h3>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  秘钥名称 / 用途说明 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：金蝶 ERP 生产同步 Key"
                  value={keyForm.name || ''}
                  onChange={(e) => setKeyForm({ ...keyForm, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    秘钥状态
                  </label>
                  <select
                    value={keyForm.status || 'active'}
                    onChange={(e) => setKeyForm({ ...keyForm, status: e.target.value as any })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="active">生产生效中</option>
                    <option value="disabled">暂停/禁用</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    有效截止日期
                  </label>
                  <input
                    type="date"
                    value={keyForm.expiresAt || '2028-12-31'}
                    onChange={(e) => setKeyForm({ ...keyForm, expiresAt: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  接口作用域 Scopes (勾选授权)
                </label>
                <div className="grid grid-cols-2 gap-2 border border-gray-200/80 rounded-xl p-2.5 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/40">
                  {[
                    'orders:read',
                    'orders:write',
                    'products:read',
                    'inventory:sync',
                    'customers:read',
                    'logistics:write',
                  ].map((sc) => {
                    const checked = (keyForm.scopes || []).includes(sc);
                    return (
                      <label
                        key={sc}
                        onClick={() => handleToggleKeyScope(sc)}
                        className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer select-none font-mono text-xs ${
                          checked
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'border-gray-200 bg-white text-gray-600 dark:border-gray-800 dark:bg-gray-900'
                        }`}
                      >
                        <div
                          className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${
                            checked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-gray-300'
                          }`}
                        >
                          {checked && <Check className="h-2.5 w-2.5" />}
                        </div>
                        <span>{sc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  IP 白名单限制
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="114.242.25.10 (回车添加)"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddIp();
                      }
                    }}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-2 outline-none focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-800 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddIp}
                    className="rounded-xl bg-emerald-100 px-3 py-2 font-semibold text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300"
                  >
                    添加 IP
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(keyForm.ipWhitelist || []).map((ip) => (
                    <span
                      key={ip}
                      className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-800 border border-emerald-200 font-mono text-xs dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                    >
                      <span>{ip}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIp(ip)}
                        className="hover:text-rose-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  业务详细描述
                </label>
                <textarea
                  rows={2}
                  value={keyForm.description || ''}
                  onChange={(e) => setKeyForm({ ...keyForm, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 outline-none focus:border-emerald-500 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white shadow-md hover:bg-emerald-500"
                >
                  保存 API 秘钥
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Secret Modal */}
      {resetSecretKeyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                确定重置 "{resetSecretKeyItem.name}" 的 Secret 吗？
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                重置后原有 Secret 将即刻作废，依赖旧秘钥的接口调用将返回 401 Unauthorized。
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setResetSecretKeyItem(null)}
                className="w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirmResetSecret}
                className="w-full rounded-xl bg-amber-500 py-2 text-xs font-semibold text-stone-950 shadow-md hover:bg-amber-400"
              >
                确定重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Key Confirm Modal */}
      {deleteKeyConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                确定要注销销毁此 API 秘钥吗？
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                注销后任何来自此 Key 的 API 请求将直接被拒绝。
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteKeyConfirmId(null)}
                className="w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDeleteKey}
                className="w-full rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white shadow-md hover:bg-rose-500"
              >
                确定注销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  OperatorRole,
  TrustChips,
  HeadlineKPIs,
  ActivationFunnel,
  KycVerificationItem,
  PayoutRequestItem,
  SupportCaseItem,
  PlatformNodeTelemetry,
  StoreTenant,
  AuditLogEntry,
} from '../types';
import {
  INITIAL_HEADLINE_KPIS,
  INITIAL_FUNNEL,
  INITIAL_KYC_QUEUE,
  INITIAL_PAYOUTS_QUEUE,
  INITIAL_SUPPORT_CASES,
  INITIAL_STORES,
  INITIAL_AUDIT_LOGS,
  probeMicroservices,
} from '../api';

interface AdminContextType {
  role: OperatorRole;
  setRole: (role: OperatorRole) => void;
  toggleRole: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  trustChips: TrustChips;
  headlineKpis: HeadlineKPIs;
  funnel: ActivationFunnel;
  kycQueue: KycVerificationItem[];
  payoutsQueue: PayoutRequestItem[];
  supportCases: SupportCaseItem[];
  stores: StoreTenant[];
  auditLogs: AuditLogEntry[];
  microserviceNodes: PlatformNodeTelemetry[];
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  setNotification: (notif: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
  // Operations
  approveKyc: (id: string, reason: string) => void;
  rejectKyc: (id: string, reason: string) => void;
  authorizePayout: (id: string, reason: string) => boolean;
  suspendStore: (storeId: string, reasonCode: string, justification: string) => void;
  reinstateStore: (storeId: string, justification: string) => void;
  refreshTelemetry: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<OperatorRole>('Super Admin');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [trustChips] = useState<TrustChips>({
    systemHealth: { status: 'healthy', latencyMs: 12, dlqCount: 0 },
    ledgerAudit: { status: 'balanced', lastChecked: 'Just now', varianceCents: 0 },
    dataFreshness: { status: 'fresh', lagMinutes: 2 },
    incidentsCount: 0,
  });

  const [headlineKpis] = useState<HeadlineKPIs>(INITIAL_HEADLINE_KPIS);
  const [funnel] = useState<ActivationFunnel>(INITIAL_FUNNEL);
  const [kycQueue, setKycQueue] = useState<KycVerificationItem[]>(INITIAL_KYC_QUEUE);
  const [payoutsQueue, setPayoutsQueue] = useState<PayoutRequestItem[]>(INITIAL_PAYOUTS_QUEUE);
  const [supportCases] = useState<SupportCaseItem[]>(INITIAL_SUPPORT_CASES);
  const [stores, setStores] = useState<StoreTenant[]>(INITIAL_STORES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [microserviceNodes, setMicroserviceNodes] = useState<PlatformNodeTelemetry[]>([]);

  const toggleRole = () => {
    setRole(prev => (prev === 'Super Admin' ? 'Admin' : 'Super Admin'));
  };

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const refreshTelemetry = async () => {
    try {
      const nodes = await probeMicroservices();
      setMicroserviceNodes(nodes);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshTelemetry();
    const interval = setInterval(refreshTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // KYC Actions
  const approveKyc = (id: string, justification: string) => {
    const item = kycQueue.find(k => k.id === id);
    if (!item) return;

    setKycQueue(prev => prev.filter(k => k.id !== id));

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: `${role.toLowerCase().replace(' ', '')}@platform.internal`,
      role,
      action: 'KYC_APPROVE',
      targetType: 'KYC_RECORD',
      targetId: id,
      reasonCode: 'KYC_VALID_DOCUMENTATION',
      justification: justification || 'Verified merchant identity and bank documentation successfully.',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    notify(`KYC for ${item.storeName} approved successfully.`, 'success');
  };

  const rejectKyc = (id: string, justification: string) => {
    const item = kycQueue.find(k => k.id === id);
    if (!item) return;

    setKycQueue(prev => prev.filter(k => k.id !== id));

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: `${role.toLowerCase().replace(' ', '')}@platform.internal`,
      role,
      action: 'KYC_REJECT',
      targetType: 'KYC_RECORD',
      targetId: id,
      reasonCode: 'KYC_INVALID_DOCUMENTATION',
      justification: justification || 'Documentation mismatch or unreadable bank statement.',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    notify(`KYC for ${item.storeName} rejected. Reason recorded.`, 'error');
  };

  // Payout Authorization (Gated: Super Admin Only)
  const authorizePayout = (id: string, justification: string): boolean => {
    if (role !== 'Super Admin') {
      notify('Access Denied: Payout execution requires Super Admin role.', 'error');
      return false;
    }

    const item = payoutsQueue.find(p => p.id === id);
    if (!item) return false;

    setPayoutsQueue(prev => prev.filter(p => p.id !== id));

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: 'superadmin@platform.internal',
      role: 'Super Admin',
      action: 'PAYOUT_AUTHORIZE',
      targetType: 'PAYOUT',
      targetId: id,
      reasonCode: 'PAYOUT_SCHEDULED_CYCLE',
      justification: justification || `Executed disbursement of $${(item.netPayoutCents / 100).toLocaleString()}`,
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    notify(`Payout of $${(item.netPayoutCents / 100).toLocaleString()} for ${item.storeName} authorized.`, 'success');
    return true;
  };

  // Store Suspension
  const suspendStore = (storeId: string, reasonCode: string, justification: string) => {
    setStores(prev =>
      prev.map(s => (s.id === storeId ? { ...s, status: 'SUSPENDED', suspensionReason: `${reasonCode}: ${justification}` } : s))
    );

    const store = stores.find(s => s.id === storeId);

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: `${role.toLowerCase().replace(' ', '')}@platform.internal`,
      role,
      action: 'STORE_SUSPEND',
      targetType: 'STORE',
      targetId: storeId,
      reasonCode,
      justification,
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    notify(`Store ${store?.name || storeId} suspended under ${reasonCode}.`, 'error');
  };

  const reinstateStore = (storeId: string, justification: string) => {
    setStores(prev =>
      prev.map(s => (s.id === storeId ? { ...s, status: 'ACTIVE', suspensionReason: undefined } : s))
    );

    const store = stores.find(s => s.id === storeId);

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: `${role.toLowerCase().replace(' ', '')}@platform.internal`,
      role,
      action: 'STORE_REINSTATE',
      targetType: 'STORE',
      targetId: storeId,
      reasonCode: 'REMEDY_VERIFIED',
      justification,
    };
    setAuditLogs(prev => [newAudit, ...prev]);
    notify(`Store ${store?.name || storeId} reinstated to ACTIVE state.`, 'success');
  };

  return (
    <AdminContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        activeTab,
        setActiveTab,
        isSearchOpen,
        setIsSearchOpen,
        trustChips,
        headlineKpis,
        funnel,
        kycQueue,
        payoutsQueue,
        supportCases,
        stores,
        auditLogs,
        microserviceNodes,
        notification,
        setNotification,
        approveKyc,
        rejectKyc,
        authorizePayout,
        suspendStore,
        reinstateStore,
        refreshTelemetry,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

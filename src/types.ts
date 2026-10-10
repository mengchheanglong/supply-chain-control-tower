export type OperatorRole = 'Admin' | 'Super Admin';

export type SystemStatusState = 'healthy' | 'busy' | 'degraded';

export interface TrustChips {
  systemHealth: {
    status: 'healthy' | 'degraded';
    latencyMs: number;
    dlqCount: number;
  };
  ledgerAudit: {
    status: 'balanced' | 'drift_detected';
    lastChecked: string;
    varianceCents: number;
  };
  dataFreshness: {
    status: 'fresh' | 'stale';
    lagMinutes: number;
  };
  incidentsCount: number;
}

export interface HeadlineKPIs {
  activePaidStores: {
    value: number;
    net30d: number;
    churnRate: number;
  };
  subscriptionMrr: {
    valueCents: number;
    periodCollectedCents: number;
    collectionRate: number;
  };
  platformGmv: {
    valueCents: number;
    orderCount: number;
    takeRatePercent: number;
    revenueCents: number;
  };
  paymentGatewayHealth: {
    successRatePercent: number;
    failedRatePercent: number;
    stalePendingPercent: number;
    totalAttempts: number;
  };
}

export interface ActivationFunnel {
  createdCount: number;
  activatedCount: number;
  firstSaleCount: number;
  activationConversionPercent: number;
  firstSaleConversionPercent: number;
}

export interface KycVerificationItem {
  id: string;
  merchantId: string;
  storeName: string;
  bankName: string;
  accountNumberMasked: string;
  routingNumber: string;
  documentType: string;
  documentUrl: string;
  submittedAt: string;
  slaExpiresAt: string;
  hoursRemaining: number;
  isBreached: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface PayoutRequestItem {
  id: string;
  merchantId: string;
  storeName: string;
  requestedAmountCents: number;
  platformFeeCents: number;
  netPayoutCents: number;
  destinationAccount: string;
  submittedAt: string;
  slaExpiresAt: string;
  hoursRemaining: number;
  isBreached: boolean;
  status: 'AWAITING_SUPER_ADMIN' | 'PROCESSING' | 'COMPLETED' | 'HELD';
  isGatedByRole: boolean;
}

export interface SupportCaseItem {
  id: string;
  ticketNumber: string;
  storeName: string;
  subject: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  slaBreached: boolean;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}

export interface PlatformNodeTelemetry {
  id: string;
  name: string;
  subsystem: 'e-commerce' | 'supply-chain' | 'pathfinder' | 'sandbox' | 'intelligence';
  port: number;
  externalUiUrl?: string;
  status: 'online' | 'offline' | 'degraded';
  latencyMs: number;
  lastHeartbeat: string;
  metrics: Record<string, string | number>;
  description: string;
}

export interface StoreTenant {
  id: string;
  name: string;
  slug: string;
  tier: 'Starter' | 'Growth' | 'Enterprise';
  status: 'ACTIVE' | 'SUSPENDED' | 'PROVISIONING';
  gmvCents: number;
  orders30d: number;
  ownerEmail: string;
  createdAt: string;
  suspensionReason?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: OperatorRole;
  action: string;
  targetType: 'STORE' | 'KYC_RECORD' | 'PAYOUT' | 'SOLVER' | 'SIMULATION';
  targetId: string;
  reasonCode: string;
  justification: string;
  diffJson?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  iconName: string;
  badge?: string | number;
  badgeColor?: 'blue' | 'rose' | 'amber' | 'emerald';
}

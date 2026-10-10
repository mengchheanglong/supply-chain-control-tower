import {
  HeadlineKPIs,
  ActivationFunnel,
  KycVerificationItem,
  PayoutRequestItem,
  SupportCaseItem,
  PlatformNodeTelemetry,
  StoreTenant,
  AuditLogEntry,
} from './types';

// Initial Mock Datasets faithful to Blueprint Specifications

export const INITIAL_HEADLINE_KPIS: HeadlineKPIs = {
  activePaidStores: {
    value: 1248,
    net30d: 34,
    churnRate: 2.1,
  },
  subscriptionMrr: {
    valueCents: 3480000,
    periodCollectedCents: 3120000,
    collectionRate: 89.65,
  },
  platformGmv: {
    valueCents: 41265000,
    orderCount: 18420,
    takeRatePercent: 2.8,
    revenueCents: 1155420,
  },
  paymentGatewayHealth: {
    successRatePercent: 94.2,
    failedRatePercent: 3.1,
    stalePendingPercent: 2.7,
    totalAttempts: 19560,
  },
};

export const INITIAL_FUNNEL: ActivationFunnel = {
  createdCount: 124,
  activatedCount: 88,
  firstSaleCount: 52,
  activationConversionPercent: 70.9,
  firstSaleConversionPercent: 41.9,
};

export const INITIAL_KYC_QUEUE: KycVerificationItem[] = [
  {
    id: 'kyc-901',
    merchantId: 'm-301',
    storeName: 'AeroTech Electronics',
    bankName: 'JPMorgan Chase',
    accountNumberMasked: '••••••••4892',
    routingNumber: '021000021',
    documentType: 'Voided Check & Articles of Inc.',
    documentUrl: '#',
    submittedAt: '2026-10-09T21:15:00Z',
    slaExpiresAt: '2026-10-10T21:15:00Z',
    hoursRemaining: 5,
    isBreached: false,
    status: 'PENDING',
  },
  {
    id: 'kyc-902',
    merchantId: 'm-302',
    storeName: 'Nordic Artisan Bakery',
    bankName: 'Wells Fargo',
    accountNumberMasked: '••••••••1104',
    routingNumber: '121000247',
    documentType: 'Corporate Resolution & Bank Statement',
    documentUrl: '#',
    submittedAt: '2026-10-09T18:40:00Z',
    slaExpiresAt: '2026-10-10T18:40:00Z',
    hoursRemaining: 2,
    isBreached: false,
    status: 'PENDING',
  },
  {
    id: 'kyc-903',
    merchantId: 'm-303',
    storeName: 'EcoVibe Apparel',
    bankName: 'Silicon Valley Bank',
    accountNumberMasked: '••••••••7731',
    routingNumber: '121140399',
    documentType: 'W-9 Form & Tax Certificate',
    documentUrl: '#',
    submittedAt: '2026-10-09T15:00:00Z',
    slaExpiresAt: '2026-10-10T15:00:00Z',
    hoursRemaining: 0,
    isBreached: true,
    status: 'PENDING',
  },
  {
    id: 'kyc-904',
    merchantId: 'm-304',
    storeName: 'Apex Precision Tools',
    bankName: 'Bank of America',
    accountNumberMasked: '••••••••9023',
    routingNumber: '026009593',
    documentType: 'Government Photo ID & Utility Bill',
    documentUrl: '#',
    submittedAt: '2026-10-10T02:30:00Z',
    slaExpiresAt: '2026-10-11T02:30:00Z',
    hoursRemaining: 10,
    isBreached: false,
    status: 'PENDING',
  },
  {
    id: 'kyc-905',
    merchantId: 'm-305',
    storeName: 'Pacific Harvest Organic',
    bankName: 'Citibank N.A.',
    accountNumberMasked: '••••••••3421',
    routingNumber: '021000089',
    documentType: 'Operating Agreement',
    documentUrl: '#',
    submittedAt: '2026-10-10T05:10:00Z',
    slaExpiresAt: '2026-10-11T05:10:00Z',
    hoursRemaining: 13,
    isBreached: false,
    status: 'PENDING',
  },
];

export const INITIAL_PAYOUTS_QUEUE: PayoutRequestItem[] = [
  {
    id: 'po-501',
    merchantId: 'm-301',
    storeName: 'AeroTech Electronics',
    requestedAmountCents: 450000,
    platformFeeCents: 12600,
    netPayoutCents: 437400,
    destinationAccount: 'JPMorgan Chase ••••4892',
    submittedAt: '2026-10-09T08:00:00Z',
    slaExpiresAt: '2026-10-11T08:00:00Z',
    hoursRemaining: 16,
    isBreached: false,
    status: 'PENDING',
    isGatedByRole: false,
  },
  {
    id: 'po-502',
    merchantId: 'm-298',
    storeName: 'Summit Peak Outfitters',
    requestedAmountCents: 285000,
    platformFeeCents: 7980,
    netPayoutCents: 277020,
    destinationAccount: 'Wells Fargo ••••9912',
    submittedAt: '2026-10-09T02:15:00Z',
    slaExpiresAt: '2026-10-11T02:15:00Z',
    hoursRemaining: 10,
    isBreached: false,
    status: 'PENDING',
    isGatedByRole: false,
  },
  {
    id: 'po-503',
    merchantId: 'm-280',
    storeName: 'Luxe Botanica',
    requestedAmountCents: 165000,
    platformFeeCents: 4620,
    netPayoutCents: 160380,
    destinationAccount: 'Citibank ••••0034',
    submittedAt: '2026-10-08T17:00:00Z',
    slaExpiresAt: '2026-10-10T17:00:00Z',
    hoursRemaining: 1,
    isBreached: false,
    status: 'PENDING',
    isGatedByRole: false,
  },
  {
    id: 'po-504',
    merchantId: 'm-275',
    storeName: 'Velocity Motors Direct',
    requestedAmountCents: 345000,
    platformFeeCents: 9660,
    netPayoutCents: 335340,
    destinationAccount: 'US Bank ••••4419',
    submittedAt: '2026-10-10T01:00:00Z',
    slaExpiresAt: '2026-10-12T01:00:00Z',
    hoursRemaining: 33,
    isBreached: false,
    status: 'PENDING',
    isGatedByRole: false,
  },
];

export const INITIAL_SUPPORT_CASES: SupportCaseItem[] = [
  {
    id: 'tic-101',
    ticketNumber: 'SUP-4921',
    storeName: 'Nordic Artisan Bakery',
    subject: 'Stripe Connect webhook timeout on checkout refund',
    priority: 'CRITICAL',
    createdAt: '2026-10-10T11:20:00Z',
    slaBreached: true,
    status: 'OPEN',
  },
  {
    id: 'tic-102',
    ticketNumber: 'SUP-4922',
    storeName: 'AeroTech Electronics',
    subject: 'Warehouse facility inventory reserve API returning 429',
    priority: 'HIGH',
    createdAt: '2026-10-10T13:45:00Z',
    slaBreached: false,
    status: 'OPEN',
  },
  {
    id: 'tic-103',
    ticketNumber: 'SUP-4923',
    storeName: 'EcoVibe Apparel',
    subject: 'Custom subdomain SSL cert renewal pending DNS validation',
    priority: 'MEDIUM',
    createdAt: '2026-10-10T14:10:00Z',
    slaBreached: false,
    status: 'IN_PROGRESS',
  },
];

export const INITIAL_STORES: StoreTenant[] = [
  {
    id: 'str-101',
    name: 'AeroTech Electronics',
    slug: 'aerotech',
    tier: 'Enterprise',
    status: 'ACTIVE',
    gmvCents: 9482000,
    orders30d: 3410,
    ownerEmail: 'ops@aerotech.io',
    createdAt: '2025-08-14',
  },
  {
    id: 'str-102',
    name: 'Nordic Artisan Bakery',
    slug: 'nordic-bakery',
    tier: 'Growth',
    status: 'ACTIVE',
    gmvCents: 4120000,
    orders30d: 1980,
    ownerEmail: 'lars@nordicbakery.se',
    createdAt: '2025-11-20',
  },
  {
    id: 'str-103',
    name: 'Summit Peak Outfitters',
    slug: 'summit-peak',
    tier: 'Growth',
    status: 'ACTIVE',
    gmvCents: 5890000,
    orders30d: 2150,
    ownerEmail: 'dispatch@summitpeak.com',
    createdAt: '2025-09-02',
  },
  {
    id: 'str-104',
    name: 'EcoVibe Apparel',
    slug: 'ecovibe',
    tier: 'Starter',
    status: 'ACTIVE',
    gmvCents: 1240000,
    orders30d: 840,
    ownerEmail: 'hello@ecovibe.store',
    createdAt: '2026-01-15',
  },
  {
    id: 'str-105',
    name: 'Apex Precision Tools',
    slug: 'apex-tools',
    tier: 'Enterprise',
    status: 'ACTIVE',
    gmvCents: 11450000,
    orders30d: 4120,
    ownerEmail: 'fulfillment@apextools.com',
    createdAt: '2025-06-30',
  },
  {
    id: 'str-106',
    name: 'Luxe Botanica',
    slug: 'luxebotanica',
    tier: 'Starter',
    status: 'SUSPENDED',
    gmvCents: 320000,
    orders30d: 120,
    ownerEmail: 'contact@luxebotanica.com',
    createdAt: '2026-02-10',
    suspensionReason: 'SUSP_FRAUD_DISPUTE_SPIKE: Chargeback ratio exceeded 2.5% threshold.',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-801',
    timestamp: '2026-10-10T14:45:10Z',
    actor: 'admin@platform.internal',
    role: 'Control Tower Lead',
    action: 'STORE_SUSPEND',
    targetType: 'STORE',
    targetId: 'str-106',
    reasonCode: 'SUSP_FRAUD_DISPUTE_SPIKE',
    justification: 'Card network dispute surge reached 2.8% within 48h rolling window.',
  },
  {
    id: 'aud-802',
    timestamp: '2026-10-10T13:20:00Z',
    actor: 'admin@platform.internal',
    role: 'Control Tower Lead',
    action: 'KYC_APPROVE',
    targetType: 'KYC_RECORD',
    targetId: 'kyc-889',
    reasonCode: 'KYC_VALID_DOCUMENTATION',
    justification: 'Verified TIN against IRS database and bank statement matches business entity.',
  },
  {
    id: 'aud-803',
    timestamp: '2026-10-10T11:05:32Z',
    actor: 'admin@platform.internal',
    role: 'Control Tower Lead',
    action: 'PAYOUT_AUTHORIZE',
    targetType: 'PAYOUT',
    targetId: 'po-498',
    reasonCode: 'PAYOUT_SCHEDULED_CYCLE',
    justification: 'Weekly settlement cycle executed after automated risk screening cleared.',
  },
];

// Operator credentials for operational supply-chain platform
export const PLATFORM_TOKEN = '2rTa1EJWQC6EyeyhpIcsDf2rEpRPBLGAz7eFwCwRQQo';
export const TENANT_ID = '0948f598-13c6-46ec-a0f5-0ec1b4984476';

export interface ServiceEndpointConfig {
  healthPath: string;
  directBaseUrl: string;
  proxyBaseUrl: string;
}

export const ECOSYSTEM_ENDPOINTS: Record<string, ServiceEndpointConfig> = {
  ecommerce: {
    healthPath: '/',
    directBaseUrl: 'http://localhost:8401',
    proxyBaseUrl: '/proxy/ecommerce',
  },
  supplyChain: {
    healthPath: '/api/health/ready',
    directBaseUrl: 'http://localhost:8100',
    proxyBaseUrl: '/proxy/platform',
  },
  pathfinder: {
    healthPath: '/api/health',
    directBaseUrl: 'http://localhost:8000',
    proxyBaseUrl: '/proxy/routing',
  },
  sandbox: {
    healthPath: '/api/health',
    directBaseUrl: 'http://localhost:8500',
    proxyBaseUrl: '/proxy/sandbox',
  },
  intelligence: {
    healthPath: '/api/health',
    directBaseUrl: 'http://localhost:8200',
    proxyBaseUrl: '/proxy/intelligence',
  },
};

// Generic resilient fetch helper (tries Vite proxy first, falls back to direct URL)
async function resilientFetch(
  endpointKey: keyof typeof ECOSYSTEM_ENDPOINTS,
  subpath: string,
  options?: RequestInit
): Promise<Response> {
  const config = ECOSYSTEM_ENDPOINTS[endpointKey];
  const proxyUrl = `${config.proxyBaseUrl}${subpath}`;
  const directUrl = `${config.directBaseUrl}${subpath}`;

  try {
    const res = await fetch(proxyUrl, options);
    if (res.ok || res.status === 409 || res.status === 400 || res.status === 404) return res;
  } catch {
    // Fall back to direct URL
  }
  return fetch(directUrl, options);
}

// Dynamic health probe across all 5 ecosystem microservices
export async function probeMicroservices(): Promise<PlatformNodeTelemetry[]> {
  const nodes: (PlatformNodeTelemetry & { endpointKey: keyof typeof ECOSYSTEM_ENDPOINTS })[] = [
    {
      id: 'node-ecommerce',
      name: 'E-Commerce Storefront Engine',
      subsystem: 'e-commerce',
      port: 8401,
      externalUiUrl: 'http://localhost:8401',
      status: 'offline',
      latencyMs: 0,
      lastHeartbeat: new Date().toISOString(),
      metrics: {
        'Next.js Web': 'Port 8401 Active',
        'Storefront': 'Connected via Bridge',
        'Checkout Pipeline': 'Double-Entry Linked',
      },
      description: 'Multi-tenant online storefronts, customer carts, catalog, and checkout processing.',
      endpointKey: 'ecommerce',
    },
    {
      id: 'node-supply-chain',
      name: 'Supply Chain Operations Platform',
      subsystem: 'supply-chain',
      port: 8100,
      externalUiUrl: 'http://localhost:8101',
      status: 'offline',
      latencyMs: 0,
      lastHeartbeat: new Date().toISOString(),
      metrics: {
        'PostGIS Hubs': '4 Regional Hubs',
        'Ledger State': 'Double-entry Balanced (0 variance)',
        'Active SKUs': '4 Enterprise SKUs',
        'Fastify API': 'Port 8100 Active',
      },
      description: 'Physical inventory ledger, multi-echelon distribution network, PostGIS spatial hubs, and fulfillment demand.',
      endpointKey: 'supplyChain',
    },
    {
      id: 'node-pathfinder',
      name: 'OSM Pathfinder Routing Daemon',
      subsystem: 'pathfinder',
      port: 8000,
      status: 'offline',
      latencyMs: 0,
      lastHeartbeat: new Date().toISOString(),
      metrics: {
        'Engine': 'Rust Contraction Hierarchies',
        'Road Network': '86 nodes / 224 edges',
        'Matrix Latency': '< 5 ms avg',
        'Vehicle Profiles': 'Truck, Van, Cargo Bike',
      },
      description: 'High-performance physical road graph calculation, asymmetric turn penalties, and travel time matrices.',
      endpointKey: 'pathfinder',
    },
    {
      id: 'node-sandbox',
      name: 'Logistics Digital-Twin Sandbox',
      subsystem: 'sandbox',
      port: 8500,
      externalUiUrl: 'http://localhost:8501',
      status: 'offline',
      latencyMs: 0,
      lastHeartbeat: new Date().toISOString(),
      metrics: {
        'Sim Clock': 'Discrete Tick Loop',
        'Active Couriers': '40 Vehicles',
        'Operational Ingestion': 'Filter allocated > 0',
        'Isolation Gate': 'Read-Only (Zero DB Writes)',
      },
      description: 'Simulation environment for agent fleet testing, synthetic driver telemetry, dispatch optimization, and replay.',
      endpointKey: 'sandbox',
    },
    {
      id: 'node-intelligence',
      name: 'Distribution Intelligence Solver',
      subsystem: 'intelligence',
      port: 8200,
      status: 'offline',
      latencyMs: 0,
      lastHeartbeat: new Date().toISOString(),
      metrics: {
        'Algorithm': 'Hybrid VRPTW Metaheuristics',
        'Evaluators': 'PlanComparator, CostModel',
        'Solvers': 'Greedy & ALNS Local Search',
        'Service': 'Port 8200 Active',
      },
      description: 'Mathematical solver optimizing delivery routes, vehicle time windows, multi-capacity fleet assignments, and fuel overhead.',
      endpointKey: 'intelligence',
    },
  ];

  // Dynamically test each microservice concurrently
  await Promise.all(
    nodes.map(async (node) => {
      const start = performance.now();
      try {
        const config = ECOSYSTEM_ENDPOINTS[node.endpointKey];
        const res = await resilientFetch(node.endpointKey, config.healthPath);
        const duration = Math.round(performance.now() - start);

        if (res && (res.ok || res.status === 200 || res.status === 304)) {
          node.status = 'online';
          node.latencyMs = Math.max(1, duration);
          node.lastHeartbeat = new Date().toISOString();
        } else {
          node.status = 'offline';
        }
      } catch {
        node.status = 'offline';
      }
    })
  );

  return nodes;
}

// -------------------------------------------------------------
// LIVE CROSS-REPOSITORY DATA CONNECTOR FUNCTIONS
// -------------------------------------------------------------

// 1. Fetch Real Operational Facilities from PostgreSQL / PostGIS
export async function fetchOperationalFacilities() {
  try {
    const res = await resilientFetch('supplyChain', '/api/v1/facilities', {
      headers: { Authorization: `Bearer ${PLATFORM_TOKEN}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.warn('[AdminAPI] Failed to fetch facilities from platform, falling back to master defaults', err);
    return [
      { id: 'DC-PNH-01', code: 'DC-PNH-01', name: 'Phnom Penh Central Fulfillment Hub', kind: 'warehouse', latitude: 11.5564, longitude: 104.9282 },
      { id: 'DC-REP-01', code: 'DC-REP-01', name: 'Siem Reap Regional Depot', kind: 'depot', latitude: 13.3671, longitude: 103.8448 },
      { id: 'DC-KOS-01', code: 'DC-KOS-01', name: 'Sihanoukville Coastal Cross-Dock', kind: 'warehouse', latitude: 10.6253, longitude: 103.5234 },
      { id: 'DC-BAT-01', code: 'DC-BAT-01', name: 'Battambang Distribution Center', kind: 'depot', latitude: 13.0957, longitude: 103.2022 },
    ];
  }
}

// 2. Fetch Real Enterprise SKUs from PostgreSQL
export async function fetchOperationalSkus() {
  try {
    const res = await resilientFetch('supplyChain', '/api/v1/skus', {
      headers: { Authorization: `Bearer ${PLATFORM_TOKEN}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.warn('[AdminAPI] Failed to fetch SKUs from platform, falling back to master defaults', err);
    return [
      { id: 'SKU-FOOD-01', code: 'SKU-FOOD-01', name: 'Organic Jasmine Rice 25kg Bag', unit: 'each' },
      { id: 'SKU-ELEC-01', code: 'SKU-ELEC-01', name: 'Solar Inverter Battery 5kWh', unit: 'each' },
      { id: 'SKU-COLD-01', code: 'SKU-COLD-01', name: 'Temperature-Controlled Vaccine Vial', unit: 'each' },
      { id: 'SKU-MED-01', code: 'SKU-MED-01', name: 'Emergency First Aid Kit (Type A)', unit: 'each' },
    ];
  }
}

// 3. Fetch Real Operational Fulfillment Orders from PostgreSQL
export async function fetchOperationalOrders() {
  try {
    const res = await resilientFetch('supplyChain', '/api/v1/fulfillment/orders', {
      headers: { Authorization: `Bearer ${PLATFORM_TOKEN}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.warn('[AdminAPI] Failed to fetch orders from platform', err);
    return [];
  }
}

// 4. Fetch Live OSM Pathfinder Graph Statistics
export async function fetchPathfinderStats() {
  try {
    const res = await resilientFetch('pathfinder', '/api/graph/stats');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[AdminAPI] Failed to fetch graph stats from pathfinder', err);
    return { nodes: 86, edges: 224, is_demo: true, dataset_name: 'demo-cambodia' };
  }
}

// 5. Query Real Turn-by-Turn Route from OSM Pathfinder
export async function fetchPathfinderRoute(
  originLat: number,
  originLon: number,
  destLat: number,
  destLon: number,
  profile: 'van' | 'truck' | 'bike' = 'van'
) {
  try {
    const res = await resilientFetch('pathfinder', '/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start_lat: originLat,
        start_lon: originLon,
        end_lat: destLat,
        end_lon: destLon,
        algorithm: 'astar',
        metric: 'time',
        departure_time: '08:00',
        profile,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[AdminAPI] Failed to query route from pathfinder', err);
    return null;
  }
}

// 6. Trigger Live VRPTW Solver Run on Distribution Intelligence
export async function fetchOptimizerSolve(problemPayload?: any) {
  try {
    const res = await resilientFetch('intelligence', '/api/optimizer/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problemPayload || {}),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[AdminAPI] Failed to execute optimizer solve', err);
    return null;
  }
}

// 7. Trigger Live Compare (Greedy Baseline vs Metaheuristic) on Distribution Intelligence
export async function fetchOptimizerCompare(problemPayload?: any) {
  try {
    const res = await resilientFetch('intelligence', '/api/optimizer/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problemPayload || {}),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[AdminAPI] Failed to execute optimizer comparison', err);
    return null;
  }
}

// 8. Fetch Live Simulation State from Logistics Sandbox
export async function fetchSimulationState() {
  try {
    const res = await resilientFetch('sandbox', '/api/simulation/state');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[AdminAPI] Failed to fetch simulation state', err);
    return null;
  }
}

// 9. Control Simulation in Logistics Sandbox
export async function controlSimulation(action: 'start' | 'stop' | 'pause' | 'resume' | 'step', payload?: any) {
  try {
    const res = await resilientFetch('sandbox', `/api/simulation/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[AdminAPI] Failed to send simulation command: ${action}`, err);
    return null;
  }
}

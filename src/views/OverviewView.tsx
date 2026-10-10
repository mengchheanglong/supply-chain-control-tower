import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Store,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { KycModal, PayoutModal } from '../components/ActionModals';
import { KycVerificationItem, PayoutRequestItem } from '../types';

export const OverviewView: React.FC = () => {
  const {
    headlineKpis,
    funnel,
    kycQueue,
    payoutsQueue,
    microserviceNodes,
    setActiveTab,
    role
  } = useAdmin();

  const [selectedKyc, setSelectedKyc] = useState<KycVerificationItem | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequestItem | null>(null);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Ecosystem Control Plane</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time executive oversight, cross-platform telemetry, and SLA-governed action queues.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Role Clearance:</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
            {role}
          </span>
        </div>
      </div>

      {/* =========================================================================
          BAND 1: HEADLINE HEALTH PRIMARY KPIS (4 Cards)
          ========================================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Band 1: Headline Ecosystem Health
          </h3>
          <span className="text-[11px] text-slate-400">Trailing 30-Day Window</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Paid Stores */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Active Paid Stores</span>
              <Store className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-white">
                {headlineKpis.activePaidStores.value.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="text-emerald-400 font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{headlineKpis.activePaidStores.net30d} net 30d
                </span>
                <span className="text-slate-400">
                  • {headlineKpis.activePaidStores.churnRate}% churn
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              1,310 total tenants provisioning
            </div>
          </div>

          {/* Card 2: Subscription MRR & Collections */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Subscription MRR & Collections</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-white">
                ${(headlineKpis.subscriptionMrr.valueCents / 100).toLocaleString()}/mo
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="text-emerald-400 font-medium font-mono">
                  ${(headlineKpis.subscriptionMrr.periodCollectedCents / 100).toLocaleString()} collected
                </span>
                <span className="text-slate-400">
                  • {headlineKpis.subscriptionMrr.collectionRate}% rate
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              $3,600 pending collection / grace
            </div>
          </div>

          {/* Card 3: Platform Paid GMV & Orders */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Platform GMV & Orders</span>
              <ShoppingCart className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-white">
                ${(headlineKpis.platformGmv.valueCents / 100).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="text-slate-200 font-medium">
                  {headlineKpis.platformGmv.orderCount.toLocaleString()} orders
                </span>
                <span className="text-purple-400 font-mono">
                  • ${(headlineKpis.platformGmv.revenueCents / 100).toLocaleString()} take
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              2.8% blended platform transaction fee
            </div>
          </div>

          {/* Card 4: Payment Gateway Success Rate */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Payment Gateway Health</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {headlineKpis.paymentGatewayHealth.successRatePercent}%
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="text-rose-400 font-medium">
                  {headlineKpis.paymentGatewayHealth.failedRatePercent}% failed
                </span>
                <span className="text-amber-400">
                  • {headlineKpis.paymentGatewayHealth.stalePendingPercent}% stale
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              {headlineKpis.paymentGatewayHealth.totalAttempts.toLocaleString()} payment attempts logged
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 2: TENANT GROWTH & ACTIVATION FUNNEL
          ========================================================================= */}
      <section className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Band 2: Store Lifecycle & Activation Funnel
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracking new store onboarding progression from registration to initial merchant GMV.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('stores')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Manage Stores <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Funnel Visual Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Step 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Stage 1: Store Created</span>
              <span className="font-mono text-white text-base font-bold">
                {funnel.createdCount}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-full" />
            </div>
            <p className="text-[11px] text-slate-400">
              Base accounts initialized with store subdomain in past 30 days.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Stage 2: Activated (Live Products)</span>
              <span className="font-mono text-emerald-400 text-base font-bold">
                {funnel.activatedCount}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${funnel.activationConversionPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-medium">
                {funnel.activationConversionPercent}% conversion
              </span>
              <span className="text-slate-400">36 dropped off</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Stage 3: First Sale Recorded</span>
              <span className="font-mono text-purple-400 text-base font-bold">
                {funnel.firstSaleCount}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full"
                style={{ width: `${funnel.firstSaleConversionPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-purple-400 font-medium">
                {funnel.firstSaleConversionPercent}% of total
              </span>
              <span className="text-slate-400">36 awaiting first customer</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 3: ACTION CENTER WORKBENCH (SLA-Governed Queues)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Band 3: Operations Action Center (SLA-Governed Queues)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Prioritized merchant approvals, compliance verification, and pending disbursements.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('settlements')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View Full Queue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KYC Review Queue */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-semibold text-white">
                  Bank Account KYC Verification ({kycQueue.length} Pending)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                SLA: 24h
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
              {kycQueue.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  All merchant KYC applications verified. Zero items pending.
                </div>
              ) : (
                kycQueue.map(item => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-900/50 transition gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-slate-200">
                        {item.storeName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.bankName} • {item.accountNumberMasked}
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span
                          className={`flex items-center gap-1 ${
                            item.isBreached
                              ? 'text-rose-400 font-semibold'
                              : item.hoursRemaining <= 4
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {item.isBreached
                            ? 'SLA BREACHED'
                            : `${item.hoursRemaining}h remaining`}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-400">{item.documentType}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedKyc(item)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium transition shrink-0"
                    >
                      Review
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payouts Awaiting Action */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-semibold text-white">
                  Payouts Awaiting Action ({payoutsQueue.length} Requests • $12,450)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded">
                SLA: 48h
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
              {payoutsQueue.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Zero pending payouts in disbursement pipeline.
                </div>
              ) : (
                payoutsQueue.map(item => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-900/50 transition gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-slate-200">
                        {item.storeName}
                      </div>
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        ${(item.netPayoutCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        <span className="text-[11px] text-slate-400 font-normal ml-2">
                          (fee: ${(item.platformFeeCents / 100).toLocaleString()})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Destination: {item.destinationAccount}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPayout(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 flex items-center gap-1.5 ${
                        role === 'Super Admin'
                          ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      <span>{role === 'Super Admin' ? 'Execute' : 'Restricted'}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BAND 4: CROSS-PLATFORM CONTROL & OVERLOOK PANELS (5 Ecosystem Nodes)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Band 4: Sovereign Platform Perspectives
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Overlooking the 5 autonomous nodes powering the supply chain and commerce workspace.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('system')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            System Topology <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {microserviceNodes.map(node => (
            <div
              key={node.id}
              className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono font-semibold text-slate-200">
                      Port :{node.port}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {node.subsystem}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-white">{node.name}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {node.description}
                </p>

                {/* Key live metrics */}
                <div className="mt-4 bg-slate-900/80 rounded-lg p-3 border border-slate-800 space-y-1.5 text-xs">
                  {Object.entries(node.metrics).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-slate-400">{key}:</span>
                      <span className="font-mono text-slate-200 font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action link */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (node.subsystem === 'supply-chain') setActiveTab('supply-chain');
                    else if (node.subsystem === 'sandbox') setActiveTab('sandbox');
                    else if (node.subsystem === 'pathfinder') setActiveTab('pathfinder');
                    else if (node.subsystem === 'intelligence') setActiveTab('intelligence');
                    else if (node.subsystem === 'e-commerce') setActiveTab('stores');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  Inspect Perspective <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {node.externalUiUrl && (
                  <a
                    href={node.externalUiUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
                    title={`Open standalone UI (${node.externalUiUrl})`}
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Modals */}
      <KycModal item={selectedKyc} onClose={() => setSelectedKyc(null)} />
      <PayoutModal item={selectedPayout} onClose={() => setSelectedPayout(null)} />
    </div>
  );
};

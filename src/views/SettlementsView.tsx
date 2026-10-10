import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Clock, Shield, FileText } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { KycModal, PayoutModal } from '../components/ActionModals';
import { KycVerificationItem, PayoutRequestItem } from '../types';

export const SettlementsView: React.FC = () => {
  const { kycQueue, payoutsQueue } = useAdmin();
  const [selectedKyc, setSelectedKyc] = useState<KycVerificationItem | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequestItem | null>(null);

  const totalPendingPayoutsCents = payoutsQueue.reduce((acc, p) => acc + p.netPayoutCents, 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Settlements & Merchant KYC Compliance
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300">
              SLA-GOVERNED ACTION QUEUES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            24h SLA for merchant bank KYC approvals; 48h SLA for scheduled ACH/wire payout disbursements.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending KYC Verifications</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {kycQueue.length} Records
          </div>
          <p className="text-[11px] text-slate-400">
            Oldest submission: {kycQueue[0] ? `${kycQueue[0].hoursRemaining}h SLA remaining` : 'Queue clear'}
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Payout Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ${(totalPendingPayoutsCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">
            {payoutsQueue.length} Merchant requests awaiting transfer execution
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Disbursement Governance</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-semibold text-white">Direct Authority Active</div>
          <p className="text-[11px] text-slate-400">
            Automated scheduled ACH and wire settlement batch transfers.
          </p>
        </div>
      </div>

      {/* KYC Queue Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden space-y-0">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              1. Merchant Bank Account KYC Queue (24h SLA)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
            Target SLA: &lt; 24h
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Store & Merchant ID</th>
                <th className="table-header">Bank Institution</th>
                <th className="table-header">Account / ABA Routing</th>
                <th className="table-header">Documentation Package</th>
                <th className="table-header">SLA Clock</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {kycQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-slate-400">
                    No pending KYC verifications. All merchant accounts up to date.
                  </td>
                </tr>
              ) : (
                kycQueue.map(item => (
                  <tr key={item.id} className="hover:bg-slate-900/40 text-xs">
                    <td className="table-cell font-semibold text-white">
                      {item.storeName}
                      <span className="text-[11px] text-slate-400 block font-mono font-normal">
                        ID: {item.merchantId}
                      </span>
                    </td>
                    <td className="table-cell text-slate-300">{item.bankName}</td>
                    <td className="table-cell font-mono text-slate-400">
                      {item.accountNumberMasked} • ABA: {item.routingNumber}
                    </td>
                    <td className="table-cell text-blue-400 font-mono text-[11px]">
                      {item.documentType}
                    </td>
                    <td className="table-cell">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded border ${
                          item.isBreached
                            ? 'bg-rose-950/60 text-rose-300 border-rose-800/60 font-bold'
                            : item.hoursRemaining <= 3
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                            : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {item.isBreached ? 'BREACHED' : `${item.hoursRemaining}h left`}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setSelectedKyc(item)}
                        className="px-3 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-medium transition"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Queue Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden space-y-0">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              2. Merchant Payout Disbursement Queue (48h SLA)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
            Target SLA: &lt; 48h
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Store & Merchant ID</th>
                <th className="table-header text-right">Gross Requested</th>
                <th className="table-header text-right">Platform Fee (2.8%)</th>
                <th className="table-header text-right">Net Disbursement</th>
                <th className="table-header">Destination Account</th>
                <th className="table-header">SLA Clock</th>
                <th className="table-header text-right">Disbursement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {payoutsQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-slate-400">
                    No pending payouts. All merchant batches successfully settled.
                  </td>
                </tr>
              ) : (
                payoutsQueue.map(item => (
                  <tr key={item.id} className="hover:bg-slate-900/40 text-xs">
                    <td className="table-cell font-semibold text-white">
                      {item.storeName}
                      <span className="text-[11px] text-slate-400 block font-mono font-normal">
                        ID: {item.merchantId}
                      </span>
                    </td>
                    <td className="table-cell text-right font-mono text-slate-300">
                      ${(item.requestedAmountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="table-cell text-right font-mono text-rose-400">
                      -${(item.platformFeeCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="table-cell text-right font-mono font-bold text-emerald-400">
                      ${(item.netPayoutCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="table-cell text-slate-400 font-mono text-[11px]">
                      {item.destinationAccount}
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        <Clock className="w-3 h-3 text-blue-400" />
                        {item.hoursRemaining}h remaining
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => setSelectedPayout(item)}
                        className="px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ml-auto bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Authorize</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <KycModal item={selectedKyc} onClose={() => setSelectedKyc(null)} />
      <PayoutModal item={selectedPayout} onClose={() => setSelectedPayout(null)} />
    </div>
  );
};

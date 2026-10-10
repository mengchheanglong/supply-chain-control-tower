import React, { useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { KycVerificationItem, PayoutRequestItem, StoreTenant } from '../types';

interface KycModalProps {
  item: KycVerificationItem | null;
  onClose: () => void;
}

export const KycModal: React.FC<KycModalProps> = ({ item, onClose }) => {
  const { approveKyc, rejectKyc } = useAdmin();
  const [justification, setJustification] = useState('');

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Merchant Bank KYC Verification</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-400 block">Store Name:</span>
              <span className="font-semibold text-slate-200">{item.storeName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Bank Institution:</span>
              <span className="font-semibold text-slate-200">{item.bankName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Masked Account:</span>
              <span className="font-mono text-slate-200">{item.accountNumberMasked}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Routing (ABA):</span>
              <span className="font-mono text-slate-200">{item.routingNumber}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block">Document Package:</span>
              <span className="text-blue-400 font-mono text-[11px] underline cursor-pointer">
                {item.documentType} [View PDF]
              </span>
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-medium mb-1.5">
              Verification Compliance Notes / Reason:
            </label>
            <textarea
              rows={3}
              value={justification}
              onChange={e => setJustification(e.target.value)}
              placeholder="e.g. TIN and articles of incorporation verified against national database."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              SLA: {item.hoursRemaining}h remaining
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  rejectKyc(item.id, justification);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/80 hover:bg-rose-900/60 text-xs font-medium transition"
              >
                Reject KYC
              </button>
              <button
                onClick={() => {
                  approveKyc(item.id, justification);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm"
              >
                Approve & Unlock Payouts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PayoutModalProps {
  item: PayoutRequestItem | null;
  onClose: () => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({ item, onClose }) => {
  const { authorizePayout } = useAdmin();
  const [justification, setJustification] = useState('');

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Authorize Merchant Payout Disbursement</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Beneficiary:</span>
              <span className="font-semibold text-white">{item.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gross Amount:</span>
              <span className="font-mono text-slate-300">
                ${(item.requestedAmountCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Platform Take Fee (2.8%):</span>
              <span className="font-mono text-rose-400">
                -${(item.platformFeeCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm">
              <span className="text-slate-300 font-medium">Net Disbursed:</span>
              <span className="font-mono font-bold text-emerald-400">
                ${(item.netPayoutCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Destination: {item.destinationAccount}
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-medium mb-1.5">
              Disbursement Authorization Audit Note:
            </label>
            <input
              type="text"
              value={justification}
              onChange={e => setJustification(e.target.value)}
              placeholder="e.g. Standard 48h settlement batch approved."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (authorizePayout(item.id, justification)) {
                  onClose();
                }
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Authorize ACH/Wire Wire Transfer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SuspendStoreModalProps {
  store: StoreTenant | null;
  onClose: () => void;
}

export const SuspendStoreModal: React.FC<SuspendStoreModalProps> = ({ store, onClose }) => {
  const { suspendStore } = useAdmin();
  const [reasonCode, setReasonCode] = useState('SUSP_FRAUD_DISPUTE_SPIKE');
  const [justification, setJustification] = useState('');

  if (!store) return null;

  const REASON_CODES = [
    { code: 'SUSP_FRAUD_DISPUTE_SPIKE', label: 'Fraud / Dispute Ratio Exceeded 2.5%' },
    { code: 'SUSP_KYC_FAILED', label: 'KYC Document Falsification or Invalid Entity' },
    { code: 'SUSP_ABUSE_TOS', label: 'Prohibited Merchandise or Terms Violation' },
    { code: 'SUSP_UNPAID_INVOICE', label: 'Subscription Fee Delinquency (> 60 Days)' },
    { code: 'SUSP_SANCTIONS_AML', label: 'OFAC / AML Watchlist Screening Match' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-semibold text-white">Suspend Store Tenant</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-300">
            Suspending <strong>{store.name}</strong> will immediately disable checkout, revoke public storefront routing, and freeze merchant withdrawals. An immutable audit record will be logged.
          </p>

          <div className="text-xs space-y-1.5">
            <label className="block text-slate-300 font-medium">Mandatory Reason Code:</label>
            <select
              value={reasonCode}
              onChange={e => setReasonCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-rose-500"
            >
              {REASON_CODES.map(rc => (
                <option key={rc.code} value={rc.code}>
                  {rc.code} — {rc.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs space-y-1.5">
            <label className="block text-slate-300 font-medium">
              Detailed Compliance Justification:
            </label>
            <textarea
              rows={3}
              value={justification}
              onChange={e => setJustification(e.target.value)}
              placeholder="Provide evidence reference, chargeback log IDs, or compliance ticket link..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              disabled={!justification.trim()}
              onClick={() => {
                suspendStore(store.id, reasonCode, justification);
                onClose();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                justification.trim()
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              Execute Suspension
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

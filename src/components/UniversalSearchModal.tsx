import React, { useState, useEffect } from 'react';
import { Search, X, Store, Boxes, Truck, DollarSign, ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const UniversalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, stores, kycQueue, payoutsQueue, setActiveTab } = useAdmin();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredStores = stores.filter(
    s => s.name.toLowerCase().includes(query.toLowerCase()) || s.slug.toLowerCase().includes(query.toLowerCase())
  );

  const filteredKyc = kycQueue.filter(
    k => k.storeName.toLowerCase().includes(query.toLowerCase()) || k.bankName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPayouts = payoutsQueue.filter(
    p => p.storeName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl max-w-xl w-full overflow-hidden shadow-2xl animate-fade-in">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stores, KYC records, payouts, facilities, couriers..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Nav Suggestions */}
          {!query && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 block">
                Quick Perspectives
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveTab('supply-chain');
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-left text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-blue-400" />
                    <span>Supply Chain Facilities</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('sandbox');
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-left text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Logistics Sandbox Fleet</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* Stores */}
          {filteredStores.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 block">
                Store Tenants ({filteredStores.length})
              </span>
              {filteredStores.map(store => (
                <div
                  key={store.id}
                  onClick={() => {
                    setActiveTab('stores');
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/80 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="font-medium text-slate-200 block">{store.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {store.slug}.hive.internal • Tier: {store.tier}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border ${
                      store.status === 'ACTIVE'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        : 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                    }`}
                  >
                    {store.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* KYC Records */}
          {filteredKyc.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 block">
                Pending KYC Verifications ({filteredKyc.length})
              </span>
              {filteredKyc.map(kyc => (
                <div
                  key={kyc.id}
                  onClick={() => {
                    setActiveTab('settlements');
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/80 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="font-medium text-slate-200 block">{kyc.storeName}</span>
                      <span className="text-[11px] text-slate-400">
                        {kyc.bankName} • SLA: {kyc.hoursRemaining}h remaining
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
                    PENDING REVIEW
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Payouts */}
          {filteredPayouts.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 block">
                Payout Requests ({filteredPayouts.length})
              </span>
              {filteredPayouts.map(payout => (
                <div
                  key={payout.id}
                  onClick={() => {
                    setActiveTab('settlements');
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/80 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-medium text-slate-200 block">{payout.storeName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Net: ${(payout.netPayoutCents / 100).toLocaleString()} • {payout.destinationAccount}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60">
                    SUPER ADMIN GATED
                  </span>
                </div>
              ))}
            </div>
          )}

          {query && filteredStores.length === 0 && filteredKyc.length === 0 && filteredPayouts.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No matching records found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

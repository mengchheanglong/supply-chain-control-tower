import React, { useState } from 'react';
import { Store, Search, AlertTriangle, ShieldCheck, ExternalLink, Filter } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { SuspendStoreModal } from '../components/ActionModals';
import { StoreTenant } from '../types';

export const StoresDirectoryView: React.FC = () => {
  const { stores, reinstateStore } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'Starter' | 'Growth' | 'Enterprise'>('ALL');
  const [selectedStoreToSuspend, setSelectedStoreToSuspend] = useState<StoreTenant | null>(null);

  const filteredStores = stores.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'ALL' || s.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              E-Commerce Stores Directory
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
              1,248 ACTIVE TENANTS • PORT 3001
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tenant provisioning status, merchant GMV volume, subscription tiers, and governance suspension controls.
          </p>
        </div>

        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700"
        >
          <span>Launch E-Commerce Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0f172a] border border-slate-800 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by store name, slug, or owner..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Tier:
          </span>
          {(['ALL', 'Starter', 'Growth', 'Enterprise'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-2.5 py-1 rounded-md transition ${
                tierFilter === t
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Store & Subdomain</th>
                <th className="table-header">Tier</th>
                <th className="table-header text-right">30d GMV</th>
                <th className="table-header text-right">Orders</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStores.map(store => (
                <tr key={store.id} className="hover:bg-slate-900/40 text-xs">
                  <td className="table-cell">
                    <div className="font-semibold text-white">{store.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {store.slug}.hive.internal • {store.ownerEmail}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                      {store.tier}
                    </span>
                  </td>
                  <td className="table-cell text-right font-mono font-bold text-white">
                    ${(store.gmvCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="table-cell text-right font-mono text-slate-300">
                    {store.orders30d.toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <div>
                      <span
                        className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                          store.status === 'ACTIVE'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                            : 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                        }`}
                      >
                        {store.status}
                      </span>
                      {store.suspensionReason && (
                        <p className="text-[10px] text-rose-400/90 mt-1 max-w-xs truncate" title={store.suspensionReason}>
                          {store.suspensionReason}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="table-cell text-right">
                    {store.status === 'ACTIVE' ? (
                      <button
                        onClick={() => setSelectedStoreToSuspend(store)}
                        className="px-2.5 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80 font-medium transition flex items-center gap-1 ml-auto"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>Suspend</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => reinstateStore(store.id, 'Remediation completed; dispute ratio returned below threshold.')}
                        className="px-2.5 py-1 rounded-md bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/80 font-medium transition flex items-center gap-1 ml-auto"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Reinstate</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SuspendStoreModal
        store={selectedStoreToSuspend}
        onClose={() => setSelectedStoreToSuspend(null)}
      />
    </div>
  );
};

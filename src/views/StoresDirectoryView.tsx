import React, { useState } from 'react';
import {
  Store,
  Search,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  Plus,
  MapPin,
  Tag
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { SuspendStoreModal } from '../components/ActionModals';
import { StoreTenant } from '../types';

interface PendingStoreApplication {
  id: string;
  name: string;
  owner: string;
  email: string;
  category: string;
  province: string;
  submittedAt: string;
  status: 'PENDING_REVIEW' | 'APPROVED';
}

const INITIAL_PENDING_APPLICATIONS: PendingStoreApplication[] = [
  {
    id: 'app-101',
    name: 'Khmer Golden Silk & Weaving',
    owner: 'Sokha Meng',
    email: 'sokha@khmersilk.com',
    category: 'Handicrafts & Apparel',
    province: 'Phnom Penh',
    submittedAt: '2026-10-09T18:20:00Z',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'app-102',
    name: 'Battambang Organic Jasmine Rice',
    owner: 'Vireak Chan',
    email: 'vireak@btbrice.store',
    category: 'Agriculture & Food',
    province: 'Battambang',
    submittedAt: '2026-10-10T02:15:00Z',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'app-103',
    name: 'Angkor Spice & Herb Sanctuary',
    owner: 'Sophea Kim',
    email: 'sophea@angkorspice.io',
    category: 'Specialty Grocery',
    province: 'Siem Reap',
    submittedAt: '2026-10-10T08:40:00Z',
    status: 'PENDING_REVIEW',
  },
  {
    id: 'app-104',
    name: 'Kampot Pepper Collective Co.',
    owner: 'Ratanak Bun',
    email: 'ratanak@kampotpepper.kh',
    category: 'Gourmet Agriculture',
    province: 'Kampot',
    submittedAt: '2026-10-10T11:00:00Z',
    status: 'PENDING_REVIEW',
  },
];

export const StoresDirectoryView: React.FC = () => {
  const { stores, reinstateStore, setNotification } = useAdmin();
  const [activeTab, setActiveTab] = useState<'active' | 'onboarding'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'Starter' | 'Growth' | 'Enterprise'>('ALL');
  const [selectedStoreToSuspend, setSelectedStoreToSuspend] = useState<StoreTenant | null>(null);

  const [pendingApplications, setPendingApplications] = useState<PendingStoreApplication[]>(
    INITIAL_PENDING_APPLICATIONS
  );

  const filteredStores = stores.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'ALL' || s.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const filteredPending = pendingApplications.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveApplication = (id: string) => {
    const app = pendingApplications.find(p => p.id === id);
    if (!app) return;

    setPendingApplications(prev => prev.filter(p => p.id !== id));
    setNotification({
      message: `Merchant store "${app.name}" approved and tenant provisioned!`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              E-Commerce Stores & Merchant Onboarding Directory
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
              1,248 ACTIVE TENANTS • PORT 8401
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tenant provisioning status, merchant GMV volume, catalog onboarding reviews, and governance suspension controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setNotification({
                message: 'Merchant onboarding invitation link generated: https://hive.internal/onboard?token=inv-8821',
                type: 'info',
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Invite New Merchant</span>
          </button>

          <a
            href="http://localhost:8401"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700"
          >
            <span>Launch Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 w-fit text-xs">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Active Stores Directory ({stores.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('onboarding')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition ${
            activeTab === 'onboarding'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Onboarding Approvals ({pendingApplications.length})</span>
          {pendingApplications.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0f172a] border border-slate-800 rounded-xl p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by store name, owner, or category..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {activeTab === 'active' && (
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
        )}
      </div>

      {/* Tab 1: Active Stores Table */}
      {activeTab === 'active' && (
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
      )}

      {/* Tab 2: Onboarding Approvals Table */}
      {activeTab === 'onboarding' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header">Store Application</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Province / Region</th>
                  <th className="table-header">Applicant</th>
                  <th className="table-header">Submission Clock</th>
                  <th className="table-header text-right">Adjudication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredPending.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-xs text-slate-400">
                      No pending merchant onboarding applications. Queue clear!
                    </td>
                  </tr>
                ) : (
                  filteredPending.map(app => (
                    <tr key={app.id} className="hover:bg-slate-900/40 text-xs">
                      <td className="table-cell">
                        <div className="font-semibold text-white">{app.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          App ID: {app.id}
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Tag className="w-3 h-3 text-blue-400" />
                          {app.category}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {app.province}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="text-slate-200 font-medium">{app.owner}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{app.email}</div>
                      </td>
                      <td className="table-cell text-slate-400 font-mono">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="table-cell text-right">
                        <button
                          onClick={() => handleApproveApplication(app.id)}
                          className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition flex items-center gap-1 ml-auto shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Activate</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SuspendStoreModal
        store={selectedStoreToSuspend}
        onClose={() => setSelectedStoreToSuspend(null)}
      />
    </div>
  );
};

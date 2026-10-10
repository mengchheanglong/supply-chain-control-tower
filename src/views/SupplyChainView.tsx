import React from 'react';
import { Boxes, MapPin, Database, ExternalLink, CheckCircle2 } from 'lucide-react';

export const SupplyChainView: React.FC = () => {

  const facilities = [
    {
      id: 'fac-sea-01',
      name: 'Seattle Primary Fulfillment Center',
      type: 'FULFILLMENT_CENTER',
      lat: 47.6062,
      lng: -122.3321,
      capacitySku: 45000,
      activeSku: 38200,
      utilization: 84.8,
      status: 'OPERATIONAL',
    },
    {
      id: 'fac-lax-02',
      name: 'Los Angeles Metro Cross-Dock',
      type: 'CROSS_DOCK',
      lat: 34.0522,
      lng: -118.2437,
      capacitySku: 20000,
      activeSku: 14100,
      utilization: 70.5,
      status: 'OPERATIONAL',
    },
    {
      id: 'fac-chi-03',
      name: 'Chicago Central Consolidation Hub',
      type: 'REGIONAL_HUB',
      lat: 41.8781,
      lng: -87.6298,
      capacitySku: 60000,
      activeSku: 51200,
      utilization: 85.3,
      status: 'OPERATIONAL',
    },
    {
      id: 'fac-dfw-04',
      name: 'Dallas-Fort Worth Transshipment',
      type: 'TRANSSHIPMENT',
      lat: 32.7767,
      lng: -96.7970,
      capacitySku: 30000,
      activeSku: 18900,
      utilization: 63.0,
      status: 'OPERATIONAL',
    },
  ];

  const ledgerAccounts = [
    { account: 'INV-ON-HAND', type: 'ASSET', debitUnits: 122400, creditUnits: 0, balanceUnits: 122400 },
    { account: 'INV-ALLOCATED', type: 'LIABILITY', debitUnits: 0, creditUnits: 18450, balanceUnits: 18450 },
    { account: 'INV-IN-TRANSIT', type: 'ASSET', debitUnits: 9800, creditUnits: 0, balanceUnits: 9800 },
    { account: 'INV-SHIPPED', type: 'EXPENSE', debitUnits: 34100, creditUnits: 0, balanceUnits: 34100 },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Supply Chain Operations Platform
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
              PORT 3100 (API) / PORT 3101 (WEB)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Overlooking warehouse inventory ledgers, PostGIS multi-echelon hubs, and fulfillment demand queues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3101"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm"
          >
            <span>Launch Platform Web SPA</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* High-level status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PostGIS Distribution Hubs</span>
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">4 Active Facilities</div>
          <p className="text-[11px] text-slate-400">
            155,000 Total SKU capacity across North American network.
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Double-Entry Ledger Audit</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            <span>Balanced</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Zero variance detected across all SKU inventory journal entries.
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fulfillment Queue</span>
            <Boxes className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">1,420 Orders</div>
          <p className="text-[11px] text-slate-400">
            98.4% on-time picking rate across automated batch pickers.
          </p>
        </div>
      </div>

      {/* Facilities Roster */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
            PostGIS Spatial Distribution Hubs
          </h3>
          <span className="text-xs text-slate-400 font-mono">SRID: 4326 (WGS 84)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Facility Name</th>
                <th className="table-header">Type</th>
                <th className="table-header">Coordinates (Lat / Lng)</th>
                <th className="table-header">SKU Utilization</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {facilities.map(fac => (
                <tr key={fac.id} className="hover:bg-slate-900/40">
                  <td className="table-cell font-medium text-white">
                    {fac.name}
                    <span className="text-[11px] text-slate-400 block font-mono">{fac.id}</span>
                  </td>
                  <td className="table-cell">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {fac.type}
                    </span>
                  </td>
                  <td className="table-cell font-mono text-xs text-slate-400">
                    {fac.lat.toFixed(4)}, {fac.lng.toFixed(4)}
                  </td>
                  <td className="table-cell">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{fac.activeSku.toLocaleString()} / {fac.capacitySku.toLocaleString()}</span>
                        <span className="text-slate-400">{fac.utilization}%</span>
                      </div>
                      <div className="w-36 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${fac.utilization}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                      {fac.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Double-Entry Ledger Summary */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Double-Entry Inventory Ledger Accounts
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono">Audit Invariant: Σ Debits = Σ Credits</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Account Code</th>
                <th className="table-header">Account Category</th>
                <th className="table-header text-right">Debit Units</th>
                <th className="table-header text-right">Credit Units</th>
                <th className="table-header text-right">Net Balance Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {ledgerAccounts.map(acc => (
                <tr key={acc.account} className="hover:bg-slate-900/40 font-mono text-xs">
                  <td className="table-cell font-semibold text-white">{acc.account}</td>
                  <td className="table-cell text-slate-400">{acc.type}</td>
                  <td className="table-cell text-right text-slate-300">{acc.debitUnits.toLocaleString()}</td>
                  <td className="table-cell text-right text-slate-300">{acc.creditUnits.toLocaleString()}</td>
                  <td className="table-cell text-right font-bold text-emerald-400">{acc.balanceUnits.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

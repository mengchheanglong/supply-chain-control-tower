import React from 'react';
import {
  Search,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminHeader: React.FC = () => {
  const {
    trustChips,
    setIsSearchOpen,
    refreshTelemetry,
    notification
  } = useAdmin();

  return (
    <header className="sticky top-0 z-30 shrink-0 bg-[#0c1322]/95 backdrop-blur border-b border-slate-800 px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* Left: Brand + Universal Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm shadow-blue-500/20">
            PA
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              Platform Administration HQ
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
                ECOSYSTEM CONTROL PLANE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Sovereign oversight across E-Commerce, Supply Chain, Routing, Sandbox & Solver
            </p>
          </div>
        </div>

        {/* Universal Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs transition"
          title="Search stores, orders, facilities, couriers (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Global Search...</span>
          <kbd className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Center: 4 Live Trust Chips */}
      <div className="flex items-center flex-wrap gap-2 text-xs">
        {/* Trust Chip 1: System Health */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Health:</span>
          <span className="font-medium text-emerald-400 font-mono">
            100% ({trustChips.systemHealth.latencyMs}ms)
          </span>
        </div>

        {/* Trust Chip 2: Ledger Audit */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Ledger:</span>
          <span className="font-medium text-emerald-400">Balanced</span>
        </div>

        {/* Trust Chip 3: Data Freshness */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Freshness:</span>
          <span className="font-mono text-slate-200">
            {trustChips.dataFreshness.lagMinutes}m lag
          </span>
        </div>

        {/* Trust Chip 4: Incidents / DLQ */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
          <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">DLQ:</span>
          <span className="font-mono font-medium text-slate-200">
            {trustChips.systemHealth.dlqCount}
          </span>
        </div>
      </div>

      {/* Right: Manual Telemetry Refresh Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => refreshTelemetry()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition"
          title="Refresh microservice telemetry probes"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 animate-fade-in flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-slate-900 shadow-xl text-xs font-medium border-slate-700 text-slate-200">
          <span
            className={`w-2 h-2 rounded-full ${
              notification.type === 'success'
                ? 'bg-emerald-400'
                : notification.type === 'error'
                ? 'bg-rose-400'
                : 'bg-blue-400'
            }`}
          />
          {notification.message}
        </div>
      )}
    </header>
  );
};

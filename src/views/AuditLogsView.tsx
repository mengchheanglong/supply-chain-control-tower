import React, { useState } from 'react';
import { ScrollText, Search, Lock } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(
    l =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reasonCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.justification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Immutable Administrative Audit Trail
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
              WORM (WRITE ONCE, READ MANY)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident log of all governance operations, store interventions, KYC adjudications, and financial disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Non-repudiable ledger</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Filter audit entries by actor, action, reason, target..."
          className="w-full bg-[#0f172a] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Timestamp</th>
                <th className="table-header">Actor & Role</th>
                <th className="table-header">Action Code</th>
                <th className="table-header">Target Entity</th>
                <th className="table-header">Reason Code</th>
                <th className="table-header">Justification / Compliance Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/40 text-xs">
                  <td className="table-cell font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <span className="font-medium text-slate-200 block">{log.actor}</span>
                    <span className="text-[10px] font-mono text-blue-400">{log.role}</span>
                  </td>
                  <td className="table-cell font-mono font-semibold text-white">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="table-cell font-mono text-slate-300">
                    {log.targetType}:{log.targetId}
                  </td>
                  <td className="table-cell">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                      {log.reasonCode}
                    </span>
                  </td>
                  <td className="table-cell text-slate-300 max-w-xs">
                    {log.justification}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

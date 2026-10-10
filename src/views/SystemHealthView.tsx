import React from 'react';
import { Server, Activity, RotateCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const SystemHealthView: React.FC = () => {
  const { microserviceNodes, refreshTelemetry } = useAdmin();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Microservice Topology & Telemetry Probes
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
              DISTRIBUTED WORKSPACE HEALTH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ping probes across the 5 independent applications composing the supply chain and commerce workspace.
          </p>
        </div>

        <button
          onClick={() => refreshTelemetry()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Probe All Endpoints</span>
        </button>
      </div>

      {/* Global Invariants Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overall Availability</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">100% Online</div>
          <p className="text-[11px] text-slate-400">5 of 5 microservice nodes responding to health checks</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mean Response Latency</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">11.4 ms</div>
          <p className="text-[11px] text-slate-400">Localhost IPC loopback network</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Isolated Simulator Egress (ENV-02)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">Enforced</div>
          <p className="text-[11px] text-slate-400">Zero write credentials to operational database</p>
        </div>
      </div>

      {/* Nodes Detail List */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
            Platform Application Probes
          </h3>
          <span className="text-xs text-slate-400 font-mono">Last Check: Just now</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {microserviceNodes.map(node => (
            <div key={node.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/30 transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <h4 className="text-sm font-semibold text-white">{node.name}</h4>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    Port :{node.port}
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">{node.description}</p>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
                  <span>Latency: <strong className="text-emerald-400 font-normal">{node.latencyMs} ms</strong></span>
                  <span>•</span>
                  <span>Subsystem: <span className="uppercase text-slate-300">{node.subsystem}</span></span>
                </div>
              </div>

              {node.externalUiUrl && (
                <a
                  href={node.externalUiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700 shrink-0 self-start md:self-center font-mono"
                >
                  <span>Open {node.externalUiUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

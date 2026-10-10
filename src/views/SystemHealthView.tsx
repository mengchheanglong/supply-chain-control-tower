import React, { useState } from 'react';
import {
  Server,
  Activity,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Database,
  Zap,
  Radio
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const SystemHealthView: React.FC = () => {
  const { microserviceNodes, refreshTelemetry, setNotification } = useAdmin();
  const [splitSimulated, setSplitSimulated] = useState(false);

  const polyglotDatastores = [
    {
      name: 'MongoDB Document Cluster',
      role: 'Product Catalog, JSON Schemas & Reviews',
      paradigm: 'Document Store (Flexible Schema)',
      cap: 'CP (Consistent & Partition Tolerant)',
      status: 'HEALTHY',
      records: '14,200 Documents',
      latency: '2.1 ms',
    },
    {
      name: 'Redis In-Memory Engine',
      role: 'User Carts, Flash Sessions, Rate Limiting & PubSub',
      paradigm: 'Key-Value / In-Memory RAM',
      cap: 'AP (High Availability & Sub-millisecond)',
      status: 'HEALTHY',
      records: '82,400 Keys',
      latency: '0.4 ms',
    },
    {
      name: 'Neo4j Graph Database',
      role: 'Social Referrals, Friend Trees & Distribution Feeder Paths',
      paradigm: 'Property Graph (Bolt Protocol / Cypher)',
      cap: 'ACID Graph Transactions',
      status: 'HEALTHY',
      records: '45,000 Nodes / 120k Edges',
      latency: '3.4 ms',
    },
    {
      name: 'PostgreSQL 18 + PostGIS',
      role: 'Double-Entry Ledger, Hub Geometry & Physical Spatial Polygons',
      paradigm: 'Relational + Spatial Geospatial Engine',
      cap: 'Strict ACID Double-Entry Ledger',
      status: 'HEALTHY',
      records: '155,000 SKU Lines',
      latency: '1.2 ms',
    },
    {
      name: 'Apache Hive 3.1 on Tez',
      role: 'Big Data Data Lake, Monthly OLAP Analytics & Historical Fact Tables',
      paradigm: 'Columnar ORC / HDFS MapReduce',
      cap: 'Massive Batch Parallel Processing',
      status: 'HEALTHY',
      records: '1,000,000+ Staged Orders',
      latency: '50.8 ms',
    },
  ];

  const handleToggleSplit = () => {
    setSplitSimulated(prev => {
      const next = !prev;
      if (next) {
        setNotification({
          message: 'CAP Partition Active! AP Carts operating independently; CP Ledger Wallets locked to prevent double-spending.',
          type: 'error',
        });
      } else {
        setNotification({
          message: 'Network link restored. Eventual consistency reconciliation synced across cluster nodes.',
          type: 'success',
        });
      }
      return next;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Polyglot Persistence & Ecosystem Topology
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
              5 DATASTORES • 5 MICROSERVICES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ping probes across the 5 independent applications and polyglot database clusters composing the workspace.
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

      {/* CAP Theorem Network Split Simulation Interactive Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                CAP Theorem Partition Tolerance Testing Workbench
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Simulates network disconnect between AP customer shopping carts (Redis/Mongo) and CP double-entry financial ledger (Postgres).
            </p>
          </div>

          <button
            onClick={handleToggleSplit}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition flex items-center gap-2 ${
              splitSimulated
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{splitSimulated ? 'Heal Network Link' : 'Simulate Network Partition (Split-Brain)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-sans font-semibold">
              <span>AP Cluster (Availability Preferred)</span>
              <span className="text-emerald-400 text-xs">ONLINE</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Customer shopping carts, wishlists, and catalog browsing remain 100% responsive without blocking.
            </p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-sans font-semibold">
              <span>CP Cluster (Consistency Preferred)</span>
              <span className={splitSimulated ? 'text-amber-400 text-xs' : 'text-emerald-400 text-xs'}>
                {splitSimulated ? 'LOCKED (SAFETY MODE)' : 'ONLINE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Financial ledger journal allocations refuse uncommitted entries to guarantee mathematical consistency.
            </p>
          </div>
        </div>
      </div>

      {/* Polyglot Datastores Matrix */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Polyglot Persistence Architecture Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">5 Specialized Engines</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Datastore Engine</th>
                <th className="table-header">Operational Role</th>
                <th className="table-header">Architectural Paradigm</th>
                <th className="table-header">CAP Classification</th>
                <th className="table-header text-right">Data Volume</th>
                <th className="table-header text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {polyglotDatastores.map(ds => (
                <tr key={ds.name} className="hover:bg-slate-900/40 text-xs">
                  <td className="table-cell font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{ds.name}</span>
                  </td>
                  <td className="table-cell text-slate-300">{ds.role}</td>
                  <td className="table-cell font-mono text-[11px] text-slate-400">{ds.paradigm}</td>
                  <td className="table-cell">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
                      {ds.cap}
                    </span>
                  </td>
                  <td className="table-cell text-right font-mono text-slate-300">{ds.records}</td>
                  <td className="table-cell text-right font-mono font-bold text-emerald-400">{ds.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Microservice Probes */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
            Platform Application Microservice Probes
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-time Heartbeats</span>
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

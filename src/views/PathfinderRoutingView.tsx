import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Network, Shield } from 'lucide-react';

export const PathfinderRoutingView: React.FC = () => {
  const [profile, setProfile] = useState<'truck' | 'van' | 'bike'>('van');

  const matrixResults = [
    { from: 'Node-14 (Downtown FC)', to: 'Node-42 (Westlake Cross-Dock)', distKm: 4.8, durMin: 11.2, profile: 'van' },
    { from: 'Node-42 (Westlake Cross-Dock)', to: 'Node-14 (Downtown FC)', distKm: 5.1, durMin: 12.8, profile: 'van', asymmetricNote: '+1.6 min one-way turn penalty' },
    { from: 'Node-14 (Downtown FC)', to: 'Node-78 (Capitol Hill Hub)', distKm: 3.2, durMin: 8.4, profile: 'van' },
    { from: 'Node-78 (Capitol Hill Hub)', to: 'Node-86 (Ballard Terminal)', distKm: 9.4, durMin: 22.1, profile: 'truck' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              OSM Pathfinder Physical Routing Daemon
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
              PORT 3000 (RUST ACTIX / TOKIO)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Physical OpenStreetMap graph topology, Contraction Hierarchies, asymmetric routing matrices, and vehicle profile constraints.
          </p>
        </div>
      </div>

      {/* Engine Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Road Graph Topology</span>
            <Network className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">86 Nodes</div>
          <p className="text-[11px] text-slate-400">224 directed road segments</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Routing Algorithm</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">CH + A*</div>
          <p className="text-[11px] text-slate-400">Contraction Hierarchies acceleration</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Matrix Latency</span>
            <Navigation className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">3.2 ms</div>
          <p className="text-[11px] text-slate-400">p99 latency across all pairwise queries</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Geometry Invariant</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">Strict OSM</div>
          <p className="text-[11px] text-slate-400">Zero straight-line synthetic fallbacks</p>
        </div>
      </div>

      {/* Asymmetric Distance Matrix View */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Directed Asymmetric Cost Matrix (ROUTE-01)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Demonstrates forward/reverse duration disparity due to physical one-way streets and turn delays.
            </p>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {(['van', 'truck', 'bike'] as const).map(p => (
              <button
                key={p}
                onClick={() => setProfile(p)}
                className={`px-3 py-1 rounded-md uppercase transition ${
                  profile === p ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Origin Node</th>
                <th className="table-header">Destination Node</th>
                <th className="table-header">Profile</th>
                <th className="table-header">Distance (km)</th>
                <th className="table-header">Duration (min)</th>
                <th className="table-header">Asymmetric Graph Annotation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {matrixResults.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 text-xs font-mono">
                  <td className="table-cell font-medium text-white">{row.from}</td>
                  <td className="table-cell font-medium text-slate-200">{row.to}</td>
                  <td className="table-cell">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 uppercase">
                      {row.profile}
                    </span>
                  </td>
                  <td className="table-cell text-slate-300">{row.distKm} km</td>
                  <td className="table-cell font-bold text-blue-400">{row.durMin} min</td>
                  <td className="table-cell text-slate-400 font-sans">
                    {row.asymmetricNote || 'Symmetric segment'}
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

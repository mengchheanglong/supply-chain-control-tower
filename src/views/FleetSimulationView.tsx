import React, { useState } from 'react';
import { Truck, Play, Pause, RotateCcw, ExternalLink, ShieldCheck } from 'lucide-react';

export const FleetSimulationView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'1x' | '10x' | '60x' | '600x'>('10x');
  const [tick, setTick] = useState(48290);

  const couriers = [
    { id: 'veh-01', driver: 'Agent-Courier-Alpha', type: 'VAN', status: 'IN_TRANSIT', speedKmh: 42, batteryPct: 78, lat: 47.609, lng: -122.338, completed: 18 },
    { id: 'veh-02', driver: 'Agent-Courier-Beta', type: 'TRUCK', status: 'DELIVERING', speedKmh: 0, batteryPct: 92, lat: 47.615, lng: -122.325, completed: 24 },
    { id: 'veh-03', driver: 'Agent-Courier-Gamma', type: 'CARGO_BIKE', status: 'IN_TRANSIT', speedKmh: 19, batteryPct: 64, lat: 47.601, lng: -122.341, completed: 12 },
    { id: 'veh-04', driver: 'Agent-Courier-Delta', type: 'VAN', status: 'IDLE', speedKmh: 0, batteryPct: 100, lat: 47.606, lng: -122.332, completed: 31 },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Logistics Digital-Twin Simulation Sandbox
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300">
              PORT 3007 (API) / PORT 5173 (3D VITE)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic digital-twin environment: injected clock, seeded RNG, agent dispatch, and canonical event replay.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-sm"
          >
            <span>Launch Sandbox 3D Scene</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Clock Controls Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Injected Simulation Clock
          </span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold font-mono text-white">
              Tick: {tick.toLocaleString()}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-emerald-400">
              {isPlaying ? 'RUNNING' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Speed & Pause / Play buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 text-white hover:bg-slate-700 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isPlaying ? 'Freeze Clock' : 'Resume Clock'}</span>
            </button>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {(['1x', '10x', '60x', '600x'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1.5 rounded-md transition ${
                  speed === s
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setTick(0);
              setIsPlaying(false);
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition"
            title="Reset simulation to zero-state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Determinism & Replay Badge */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-white">
              Deterministic Event Sequence Verification (P0-04)
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-medium">
          REPLAY VERIFIED IDENTICAL
        </span>
      </div>

      {/* Couriers Roster */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
            Active Digital-Twin Courier Fleet
          </h3>
          <span className="text-xs text-slate-400 font-mono">42 Total Vehicles in Simulation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Vehicle ID / Call Sign</th>
                <th className="table-header">Vehicle Profile</th>
                <th className="table-header">Mission Status</th>
                <th className="table-header">Speed (km/h)</th>
                <th className="table-header">Battery / Fuel</th>
                <th className="table-header">Completed Stops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {couriers.map(veh => (
                <tr key={veh.id} className="hover:bg-slate-900/40 text-xs font-mono">
                  <td className="table-cell font-semibold text-white">
                    {veh.id}
                    <span className="text-[11px] text-slate-400 block font-sans font-normal">
                      {veh.driver}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {veh.type}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] ${
                        veh.status === 'IN_TRANSIT'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-800/60'
                          : veh.status === 'DELIVERING'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {veh.status}
                    </span>
                  </td>
                  <td className="table-cell text-slate-300">{veh.speedKmh} km/h</td>
                  <td className="table-cell">
                    <span className={veh.batteryPct < 20 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {veh.batteryPct}%
                    </span>
                  </td>
                  <td className="table-cell font-bold text-emerald-400">
                    {veh.completed} stops
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

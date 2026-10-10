import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, TrendingDown, Layers } from 'lucide-react';

export const OptimizationView: React.FC = () => {
  const [isSolving, setIsSolving] = useState(false);
  const [activeScenario, setActiveScenario] = useState<'baseline' | 'heuristic' | 'metaheuristic'>('metaheuristic');

  const scenarios = [
    {
      id: 'baseline',
      name: 'Track 1: Unoptimized Dispatch',
      costUsd: 4820,
      vehicles: 14,
      totalDistanceKm: 182,
      serviceViolations: 4,
      savingsPct: 0,
    },
    {
      id: 'heuristic',
      name: 'Track 2: Nearest-Neighbor Heuristic',
      costUsd: 4210,
      vehicles: 12,
      totalDistanceKm: 154,
      serviceViolations: 1,
      savingsPct: 12.6,
    },
    {
      id: 'metaheuristic',
      name: 'Track 3: Hybrid VRPTW Metaheuristic (Solver)',
      costUsd: 3610,
      vehicles: 10,
      totalDistanceKm: 131,
      serviceViolations: 0,
      savingsPct: 25.1,
    },
  ];

  const handleRunSolver = () => {
    setIsSolving(true);
    setTimeout(() => {
      setIsSolving(false);
      setActiveScenario('metaheuristic');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Distribution Intelligence Solver
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800/80 text-purple-300">
              PORT 3200 (VRPTW SOLVER)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mathematical route optimization, time-window constraints (VRPTW), multi-depot fleet allocation, and cost reduction.
          </p>
        </div>

        <button
          onClick={handleRunSolver}
          disabled={isSolving}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition shadow-sm"
        >
          {isSolving ? (
            <span>Optimizing Matrix (ALNS)...</span>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Trigger Optimization Scenario</span>
            </>
          )}
        </button>
      </div>

      {/* Summary highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Operating Cost Reduction</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">-25.1% Savings</div>
          <p className="text-[11px] text-slate-400">
            $1,210 saved per dispatch wave vs manual unoptimized routes.
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fleet Utilization Efficiency</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">10 Vehicles (from 14)</div>
          <p className="text-[11px] text-slate-400">
            4 vehicles released for ad-hoc on-demand delivery capacity.
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Time Window Compliance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">100% On-Time</div>
          <p className="text-[11px] text-slate-400">
            Zero customer delivery window breaches across 98 stops.
          </p>
        </div>
      </div>

      {/* Three-track Scenario Comparison */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
            Three-Track Scenario Benchmark Evaluation
          </h3>
          <span className="text-xs text-slate-400 font-mono">Dataset: Seattle-Metro 98 Stops</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Scenario Strategy</th>
                <th className="table-header text-right">Dispatch Cost</th>
                <th className="table-header text-right">Fleet Size</th>
                <th className="table-header text-right">Distance (km)</th>
                <th className="table-header text-right">Time Breaches</th>
                <th className="table-header text-right">Net Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {scenarios.map(sc => (
                <tr
                  key={sc.id}
                  onClick={() => setActiveScenario(sc.id as any)}
                  className={`hover:bg-slate-900/40 cursor-pointer text-xs font-mono transition ${
                    activeScenario === sc.id ? 'bg-purple-950/20' : ''
                  }`}
                >
                  <td className="table-cell font-sans font-semibold text-white flex items-center gap-2">
                    {sc.name}
                    {sc.id === 'metaheuristic' && (
                      <span className="text-[10px] px-2 py-0.2 rounded bg-purple-950/80 border border-purple-800/80 text-purple-300 font-mono">
                        SOLVER OPTIMAL
                      </span>
                    )}
                  </td>
                  <td className="table-cell text-right font-bold text-white">
                    ${sc.costUsd.toLocaleString()}
                  </td>
                  <td className="table-cell text-right text-slate-300">{sc.vehicles} vans</td>
                  <td className="table-cell text-right text-slate-300">{sc.totalDistanceKm} km</td>
                  <td className="table-cell text-right">
                    {sc.serviceViolations > 0 ? (
                      <span className="text-rose-400 font-bold">{sc.serviceViolations} breaches</span>
                    ) : (
                      <span className="text-emerald-400">0</span>
                    )}
                  </td>
                  <td className="table-cell text-right font-bold text-emerald-400">
                    {sc.savingsPct > 0 ? `+${sc.savingsPct}%` : '—'}
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

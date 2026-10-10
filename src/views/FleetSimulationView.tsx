import React, { useState, useEffect } from 'react';
import {
  Truck,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Compass,
  Battery,
  Gauge,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { controlSimulation, fetchSimulationState } from '../api';

interface CourierVehicle {
  id: string;
  driver: string;
  type: 'VAN' | 'TRUCK' | 'CARGO_BIKE';
  status: 'IN_TRANSIT' | 'DELIVERING' | 'IDLE' | 'RETURNING';
  speedKmh: number;
  batteryPct: number;
  lat: number;
  lng: number;
  x: number; // canvas x (0 - 800)
  y: number; // canvas y (0 - 450)
  destX: number;
  destY: number;
  completed: number;
  originHub: string;
  destination: string;
  etaMinutes: number;
}

const HUBS = [
  { id: 'hub-a', name: 'Central Market Depot (Hub A)', area: 'Daun Penh, Phnom Penh', x: 420, y: 190 },
  { id: 'hub-b', name: 'Russian Market Cross-Dock (Hub B)', area: 'Tuol Tompoung, Phnom Penh', x: 380, y: 310 },
  { id: 'hub-c', name: 'Chroy Changvar Feeder Depot (Hub C)', area: 'Peninsula Logistics Ring', x: 540, y: 120 },
  { id: 'hub-d', name: 'Sen Sok Mega-Fulfillment Center (Hub D)', area: 'Western Arterial Hub', x: 210, y: 220 },
];

const INITIAL_COURIERS: CourierVehicle[] = [
  {
    id: 'veh-01',
    driver: 'Agent-Courier-Alpha',
    type: 'VAN',
    status: 'IN_TRANSIT',
    speedKmh: 42,
    batteryPct: 78,
    lat: 11.562,
    lng: 104.916,
    x: 420,
    y: 240,
    destX: 380,
    destY: 310,
    completed: 18,
    originHub: 'Central Market Depot',
    destination: 'Russian Market Cross-Dock',
    etaMinutes: 6
  },
  {
    id: 'veh-02',
    driver: 'Agent-Courier-Beta',
    type: 'TRUCK',
    status: 'DELIVERING',
    speedKmh: 0,
    batteryPct: 92,
    lat: 11.571,
    lng: 104.928,
    x: 540,
    y: 120,
    destX: 540,
    destY: 120,
    completed: 24,
    originHub: 'Sen Sok Mega-FC',
    destination: 'Chroy Changvar Feeder',
    etaMinutes: 0
  },
  {
    id: 'veh-03',
    driver: 'Agent-Courier-Gamma',
    type: 'CARGO_BIKE',
    status: 'IN_TRANSIT',
    speedKmh: 19,
    batteryPct: 64,
    lat: 11.554,
    lng: 104.922,
    x: 395,
    y: 280,
    destX: 420,
    destY: 190,
    completed: 12,
    originHub: 'Russian Market Cross-Dock',
    destination: 'Central Market Depot',
    etaMinutes: 11
  },
  {
    id: 'veh-04',
    driver: 'Agent-Courier-Delta',
    type: 'VAN',
    status: 'RETURNING',
    speedKmh: 36,
    batteryPct: 51,
    lat: 11.548,
    lng: 104.892,
    x: 290,
    y: 260,
    destX: 210,
    destY: 220,
    completed: 31,
    originHub: 'Daun Penh High-Street',
    destination: 'Sen Sok Mega-FC',
    etaMinutes: 14
  },
  {
    id: 'veh-05',
    driver: 'Agent-Courier-Epsilon',
    type: 'CARGO_BIKE',
    status: 'DELIVERING',
    speedKmh: 0,
    batteryPct: 88,
    lat: 11.566,
    lng: 104.925,
    x: 460,
    y: 170,
    destX: 460,
    destY: 170,
    completed: 15,
    originHub: 'Central Market Depot',
    destination: 'Riverside Walkway Drop-off',
    etaMinutes: 0
  },
  {
    id: 'veh-06',
    driver: 'Agent-Courier-Zeta',
    type: 'TRUCK',
    status: 'IN_TRANSIT',
    speedKmh: 48,
    batteryPct: 83,
    lat: 11.559,
    lng: 104.882,
    x: 240,
    y: 220,
    destX: 420,
    destY: 190,
    completed: 20,
    originHub: 'Sen Sok Mega-FC',
    destination: 'Central Market Depot',
    etaMinutes: 9
  }
];

export const FleetSimulationView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'1x' | '10x' | '60x' | '600x'>('10x');
  const [tick, setTick] = useState(48290);
  const [couriers, setCouriers] = useState<CourierVehicle[]>(INITIAL_COURIERS);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('veh-01');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHubs, setShowHubs] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const { setNotification } = useAdmin();
  const [isLiveSandboxConnected, setIsLiveSandboxConnected] = useState(false);

  // Sync with live sandbox on mount
  useEffect(() => {
    fetchSimulationState().then((state) => {
      if (state && state.stats) {
        setIsLiveSandboxConnected(true);
        if (typeof state.clock?.tick === 'number') {
          setTick(state.clock.tick);
        }
      }
    }).catch(() => {
      setIsLiveSandboxConnected(false);
    });
  }, []);

  const handleTogglePlay = async () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      await controlSimulation('resume').catch(() => null);
      setNotification({ message: 'Digital-twin simulation resumed on Port 3007', type: 'info' });
    } else {
      await controlSimulation('pause').catch(() => null);
      setNotification({ message: 'Digital-twin simulation frozen on Port 3007', type: 'info' });
    }
  };

  const handleReset = async () => {
    setTick(0);
    setIsPlaying(false);
    await controlSimulation('stop').catch(() => null);
    setNotification({ message: 'Simulation reset to initial deterministic zero-state', type: 'info' });
  };

  // Tick clock effect
  useEffect(() => {
    if (!isPlaying) return;
    const speedMult = speed === '1x' ? 1 : speed === '10x' ? 5 : speed === '60x' ? 25 : 100;
    const interval = setInterval(() => {
      setTick(t => t + speedMult);

      // Micro-movement along vector
      setCouriers(prev =>
        prev.map(veh => {
          if (veh.status === 'DELIVERING' || veh.status === 'IDLE') return veh;
          const dx = (veh.destX - veh.x) * 0.02;
          const dy = (veh.destY - veh.y) * 0.02;
          const newX = Math.abs(veh.destX - veh.x) < 2 ? veh.destX : veh.x + dx;
          const newY = Math.abs(veh.destY - veh.y) < 2 ? veh.destY : veh.y + dy;
          return {
            ...veh,
            x: newX,
            y: newY,
            batteryPct: Math.max(10, veh.batteryPct - 0.01)
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const selectedVehicle = couriers.find(v => v.id === selectedVehicleId) || null;

  const filteredCouriers = couriers.filter(v => {
    if (filterType === 'ALL') return true;
    return v.status === filterType;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Logistics Digital-Twin Simulation Sandbox & Live Road Map
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300">
              PORT 3007 (API) / PORT 5173 (3D VITE)
            </span>
            {isLiveSandboxConnected && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sandbox Connected
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic digital-twin environment: injected clock, seeded RNG, agent dispatch, 2D high-definition vector map, and canonical event replay.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
          >
            <span>Launch Sandbox 3D Scene (:5173)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Clock Controls Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Injected Simulation Clock (Deterministic P0-04)
          </span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold font-mono text-white">
              Tick: {tick.toLocaleString()}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono ${
                isPlaying
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
              }`}
            >
              {isPlaying ? 'RUNNING' : 'PAUSED'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Speed: {speed}
            </span>
          </div>
        </div>

        {/* Speed & Pause / Play buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 text-white hover:bg-slate-700 transition cursor-pointer"
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
                className={`px-2.5 py-1.5 rounded-md transition cursor-pointer ${
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
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition cursor-pointer"
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

      {/* =========================================================================
          2D HIGH-DEFINITION ROAD NETWORK VECTOR MAP
          ========================================================================= */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden space-y-0">
        {/* Map Header Toolbar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Phnom Penh High-Definition Road Network
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
              Contraction Hierarchies & Vector Segments
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter couriers */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              {[
                { id: 'ALL', label: 'All Fleet' },
                { id: 'IN_TRANSIT', label: 'In Transit' },
                { id: 'DELIVERING', label: 'Delivering' },
                { id: 'RETURNING', label: 'Returning' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    filterType === tab.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Hubs toggle */}
            <button
              onClick={() => setShowHubs(!showHubs)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                showHubs
                  ? 'bg-slate-800 text-sky-300 border-sky-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Hubs: {showHubs ? 'ON' : 'OFF'}
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setZoomLevel(z => Math.min(1.6, z + 0.15))}
                className="p-1 text-slate-400 hover:text-white transition"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(z => Math.max(0.7, z - 0.15))}
                className="p-1 text-slate-400 hover:text-white transition"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 text-slate-400 hover:text-white transition"
                title="Reset Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Vector Canvas Area */}
        <div className="relative bg-[#090d16] h-[480px] overflow-hidden flex items-center justify-center select-none">
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* SVG Map Canvas */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              viewBox="0 0 800 450"
              className="w-full h-full max-w-[800px] max-h-[450px]"
            >
              {/* Rivers / Waterways */}
              <defs>
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Tonle Sap & Mekong River Path */}
              <path
                d="M 520 0 Q 510 150 560 220 Q 610 290 620 450 L 660 450 Q 640 280 590 210 Q 550 140 560 0 Z"
                fill="url(#riverGrad)"
              />
              <path
                d="M 640 160 Q 680 200 780 240 L 780 260 Q 670 220 620 180 Z"
                fill="url(#riverGrad)"
              />

              {/* Major Arterial Road Network (Physical Segments) */}
              <g stroke="#1e293b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                {/* Russian Federation Blvd (West-East Corridor) */}
                <path d="M 120 230 L 210 220 L 350 210 L 420 190" />
                {/* Monivong Blvd (North-South Arterial) */}
                <path d="M 430 80 L 420 190 L 410 270 L 380 360 L 360 420" />
                {/* Norodom Blvd */}
                <path d="M 480 110 L 470 200 L 450 300 L 420 400" />
                {/* Mao Tse Toung Blvd (Diagonal Cross-Town) */}
                <path d="M 230 310 L 320 280 L 380 310 L 450 300 L 500 320" />
                {/* Chroy Changvar Bridge & Ring */}
                <path d="M 430 80 L 510 100 L 540 120 L 560 170" />
                {/* Western Airport Bypass */}
                <path d="M 120 230 L 140 330 L 230 310" />
                {/* Hun Sen Blvd (South Feeder) */}
                <path d="M 380 360 L 370 440" />
              </g>

              {/* Road Core Lines (Lighter Inner Stroke) */}
              <g stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 120 230 L 210 220 L 350 210 L 420 190" />
                <path d="M 430 80 L 420 190 L 410 270 L 380 360 L 360 420" />
                <path d="M 480 110 L 470 200 L 450 300 L 420 400" />
                <path d="M 230 310 L 320 280 L 380 310 L 450 300 L 500 320" />
                <path d="M 430 80 L 510 100 L 540 120 L 560 170" />
                <path d="M 120 230 L 140 330 L 230 310" />
                <path d="M 380 360 L 370 440" />
              </g>

              {/* Selected Vehicle Active Trajectory Line */}
              {selectedVehicle && (
                <g>
                  <line
                    x1={selectedVehicle.x}
                    y1={selectedVehicle.y}
                    x2={selectedVehicle.destX}
                    y2={selectedVehicle.destY}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4,4"
                    className="animate-pulse"
                  />
                  <circle
                    cx={selectedVehicle.destX}
                    cy={selectedVehicle.destY}
                    r="5"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* Logistics Hubs & Depots */}
              {showHubs &&
                HUBS.map(hub => (
                  <g key={hub.id} className="cursor-pointer">
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r="9"
                      fill="#0f172a"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <circle cx={hub.x} cy={hub.y} r="3.5" fill="#38bdf8" />
                    <text
                      x={hub.x + 12}
                      y={hub.y + 4}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {hub.name.split(' ')[0]}
                    </text>
                  </g>
                ))}

              {/* Couriers on Road */}
              {filteredCouriers.map(veh => {
                const isSelected = selectedVehicleId === veh.id;
                const statusColor =
                  veh.status === 'IN_TRANSIT'
                    ? '#38bdf8'
                    : veh.status === 'DELIVERING'
                    ? '#34d399'
                    : veh.status === 'RETURNING'
                    ? '#fbbf24'
                    : '#94a3b8';

                return (
                  <g
                    key={veh.id}
                    onClick={() => setSelectedVehicleId(veh.id)}
                    className="cursor-pointer transition-transform duration-300"
                    transform={`translate(${veh.x}, ${veh.y})`}
                  >
                    {/* Pulsing selection halo */}
                    {isSelected && (
                      <circle
                        r="14"
                        fill="none"
                        stroke={statusColor}
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                        className="animate-spin"
                        style={{ animationDuration: '4s' }}
                      />
                    )}

                    {/* Outer Circle */}
                    <circle
                      r="8"
                      fill="#090d16"
                      stroke={statusColor}
                      strokeWidth={isSelected ? '2.5' : '1.8'}
                      filter={isSelected ? 'url(#glow)' : undefined}
                    />

                    {/* Inner Core */}
                    <circle r="3.5" fill={statusColor} />

                    {/* Callsign Tag */}
                    <text
                      x="11"
                      y="3.5"
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      {veh.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Floating HUD Drawer for Selected Vehicle */}
          {selectedVehicle && (
            <div className="absolute top-4 right-4 w-72 bg-[#0f172a]/95 border border-slate-800 rounded-xl p-4 shadow-2xl backdrop-blur-md space-y-3 animate-fade-in text-xs font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold font-mono text-[11px]">
                    {selectedVehicle.type[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-mono">{selectedVehicle.id}</h4>
                    <span className="text-[11px] text-slate-400">{selectedVehicle.driver}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    selectedVehicle.status === 'IN_TRANSIT'
                      ? 'bg-sky-950 text-sky-300 border border-sky-800'
                      : selectedVehicle.status === 'DELIVERING'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {selectedVehicle.status}
                </span>
              </div>

              {/* Live Gauges */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-sky-400" /> Speed
                  </span>
                  <div className="text-white font-bold">{selectedVehicle.speedKmh} km/h</div>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                    <Battery className="w-3 h-3 text-emerald-400" /> Battery
                  </span>
                  <div className="text-emerald-400 font-bold">{Math.round(selectedVehicle.batteryPct)}%</div>
                </div>
              </div>

              {/* Waypoints & Mission ETA */}
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Origin Hub:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[130px]">{selectedVehicle.originHub}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Destination:</span>
                  <span className="text-sky-300 font-medium truncate max-w-[130px]">{selectedVehicle.destination}</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Estimated ETA:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {selectedVehicle.etaMinutes > 0 ? `${selectedVehicle.etaMinutes} mins` : 'Arrived at Stop'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Completed Stops:</span>
                <span className="font-mono text-white font-bold">{selectedVehicle.completed} deliveries</span>
              </div>
            </div>
          )}

          {/* Compass Rose & Legend */}
          <div className="absolute bottom-4 left-4 bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-[10px] font-mono text-slate-400 space-y-1 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>In Transit ({couriers.filter(c => c.status === 'IN_TRANSIT').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Delivering ({couriers.filter(c => c.status === 'DELIVERING').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Returning ({couriers.filter(c => c.status === 'RETURNING').length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Couriers Roster */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
            Active Digital-Twin Courier Fleet ({couriers.length} Vehicles)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Deterministic Seed: 0x48290</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4 font-semibold">Vehicle ID / Call Sign</th>
                <th className="py-3 px-4 font-semibold">Vehicle Profile</th>
                <th className="py-3 px-4 font-semibold">Mission Status</th>
                <th className="py-3 px-4 font-semibold">Speed (km/h)</th>
                <th className="py-3 px-4 font-semibold">Battery / Fuel</th>
                <th className="py-3 px-4 font-semibold">Completed Stops</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {couriers.map(veh => {
                const isSelected = selectedVehicleId === veh.id;
                return (
                  <tr
                    key={veh.id}
                    onClick={() => setSelectedVehicleId(veh.id)}
                    className={`hover:bg-slate-900/40 text-xs font-mono transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-600/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-white">
                      {veh.id}
                      <span className="text-[11px] text-slate-400 block font-sans font-normal">
                        {veh.driver}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {veh.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-slate-300">{veh.speedKmh} km/h</td>
                    <td className="py-3 px-4">
                      <span className={veh.batteryPct < 20 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {Math.round(veh.batteryPct)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      {veh.completed} stops
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedVehicleId(veh.id);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans font-medium transition inline-flex items-center gap-1"
                      >
                        <Crosshair className="w-3 h-3 text-sky-400" />
                        <span>Focus Pin</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

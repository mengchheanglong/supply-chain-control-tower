import React, { useState, useMemo } from 'react';
import {
  Share2,
  Network,
  Users,
  Terminal,
  Zap,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  CheckCheck,
  MapPin,
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'root' | 'tier1' | 'tier2' | 'tier3' | 'hub' | 'depot' | 'store' | 'courier' | 'zone';
  x: number;
  y: number;
  city?: string;
  spend?: number;
  earned?: number;
  commission?: string;
  details?: Record<string, any>;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  rate?: string;
}

export const Neo4jGraphView: React.FC = () => {
  const [perspective, setPerspective] = useState<'social' | 'logistics'>('social');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('C0457');
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Social Referral Network Dataset
  const socialNodes: GraphNode[] = useMemo(
    () => [
      {
        id: 'C0457',
        label: 'Sokha Meas (Root Anchor)',
        type: 'root',
        x: 380,
        y: 200,
        city: 'Phnom Penh',
        spend: 4170,
        earned: 184.5,
        details: { tier: 'VIP Gold', depth: '0 (Anchor)', downlineCount: 6, joined: '2026-06-01' },
      },
      {
        id: 'C1001',
        label: 'Vireak Chan',
        type: 'tier1',
        x: 220,
        y: 110,
        city: 'Phnom Penh',
        spend: 420,
        earned: 21,
        commission: '5%',
        details: { tier: 'Silver', depth: 'Hop 1', referredBy: 'C0457', joined: '2026-07-10' },
      },
      {
        id: 'C1002',
        label: 'Sophea Kim',
        type: 'tier1',
        x: 540,
        y: 110,
        city: 'Siem Reap',
        spend: 650,
        earned: 32.5,
        commission: '5%',
        details: { tier: 'Silver', depth: 'Hop 1', referredBy: 'C0457', joined: '2026-07-15' },
      },
      {
        id: 'C1003',
        label: 'Rithy Pen',
        type: 'tier2',
        x: 120,
        y: 240,
        city: 'Battambang',
        spend: 180,
        earned: 5.4,
        commission: '3%',
        details: { tier: 'Bronze', depth: 'Hop 2', referredBy: 'C1001', joined: '2026-08-01' },
      },
      {
        id: 'C1004',
        label: 'Bopha Nuon',
        type: 'tier2',
        x: 280,
        y: 290,
        city: 'Kandal',
        spend: 310,
        earned: 9.3,
        commission: '3%',
        details: { tier: 'Bronze', depth: 'Hop 2', referredBy: 'C1001', joined: '2026-08-12' },
      },
      {
        id: 'C1005',
        label: 'Dara Heng',
        type: 'tier3',
        x: 80,
        y: 380,
        city: 'Kampong Cham',
        spend: 95,
        earned: 1.9,
        commission: '2%',
        details: { tier: 'Standard', depth: 'Hop 3', referredBy: 'C1003', joined: '2026-09-02' },
      },
      {
        id: 'C1006',
        label: 'Channary Som',
        type: 'tier3',
        x: 480,
        y: 260,
        city: 'Siem Reap',
        spend: 210,
        earned: 4.2,
        commission: '2%',
        details: { tier: 'Standard', depth: 'Hop 3', referredBy: 'C1002', joined: '2026-09-18' },
      },
    ],
    []
  );

  const socialLinks: GraphLink[] = useMemo(
    () => [
      { source: 'C0457', target: 'C1001', label: 'REFERS_TIER_1', rate: '5%' },
      { source: 'C0457', target: 'C1002', label: 'REFERS_TIER_1', rate: '5%' },
      { source: 'C1001', target: 'C1003', label: 'REFERS_TIER_2', rate: '3%' },
      { source: 'C1001', target: 'C1004', label: 'REFERS_TIER_2', rate: '3%' },
      { source: 'C1003', target: 'C1005', label: 'REFERS_TIER_3', rate: '2%' },
      { source: 'C1002', target: 'C1006', label: 'REFERS_TIER_2', rate: '3%' },
    ],
    []
  );

  // Logistics Topology Dataset
  const logisticsNodes: GraphNode[] = useMemo(
    () => [
      { id: 'HUB-PP', label: 'Phnom Penh Central DC', type: 'hub', x: 380, y: 180, city: 'Phnom Penh', details: { capacity: '120k parcels/day', fleet: '18 Trucks' } },
      { id: 'DEP-SR', label: 'Siem Reap Regional Cross-Dock', type: 'depot', x: 180, y: 100, city: 'Siem Reap', details: { capacity: '45k parcels/day', fleet: '8 Trucks' } },
      { id: 'DEP-BTB', label: 'Battambang Depot', type: 'depot', x: 560, y: 120, city: 'Battambang', details: { capacity: '30k parcels/day', fleet: '6 Vans' } },
      { id: 'ZN-CENTRAL', label: 'Doun Penh Zone 1', type: 'zone', x: 260, y: 280, city: 'Phnom Penh', details: { radius: '4.2 km', couriers: 12 } },
      { id: 'ZN-TKM', label: 'Tuol Kouk Zone 2', type: 'zone', x: 480, y: 290, city: 'Phnom Penh', details: { radius: '5.8 km', couriers: 16 } },
      { id: 'STR-01', label: 'AeroTech Electronics Flagship', type: 'store', x: 200, y: 390, city: 'Phnom Penh', details: { skuLines: 3200, volume: 'High' } },
      { id: 'STR-02', label: 'Nordic Artisan Bakery', type: 'store', x: 540, y: 400, city: 'Phnom Penh', details: { skuLines: 840, volume: 'Perishable' } },
    ],
    []
  );

  const logisticsLinks: GraphLink[] = useMemo(
    () => [
      { source: 'HUB-PP', target: 'DEP-SR', label: 'TRUNK_LINE_N6', rate: '314 km' },
      { source: 'HUB-PP', target: 'DEP-BTB', label: 'TRUNK_LINE_N5', rate: '290 km' },
      { source: 'HUB-PP', target: 'ZN-CENTRAL', label: 'FEEDER_LINE', rate: '8 km' },
      { source: 'HUB-PP', target: 'ZN-TKM', label: 'FEEDER_LINE', rate: '11 km' },
      { source: 'ZN-CENTRAL', target: 'STR-01', label: 'LAST_MILE', rate: '1.4 km' },
      { source: 'ZN-TKM', target: 'STR-02', label: 'LAST_MILE', rate: '2.1 km' },
    ],
    []
  );

  const currentNodes = perspective === 'social' ? socialNodes : logisticsNodes;
  const currentLinks = perspective === 'social' ? socialLinks : logisticsLinks;

  const selectedNode = currentNodes.find(n => n.id === selectedNodeId) || currentNodes[0];

  const queries = [
    {
      title: 'Recursive Referral Tree Hop (Neo4j Cypher)',
      cypher: `MATCH path = (root:Customer {id: "${selectedNode?.id || 'C0457'}"})-[:REFERS*1..3]->(downline:Customer)
RETURN path, downline.spend AS total_spend, length(path) AS depth_level
ORDER BY depth_level ASC;`,
      purpose: 'Queries multi-tier viral downline relationships and calculates depth commission allocations recursively.',
    },
    {
      title: 'Top Influencer Revenue Attribution',
      cypher: `MATCH (root:Customer)-[:REFERS*]->(child:Customer)
WITH root, count(child) AS network_size, sum(child.spend) AS network_gmv
WHERE network_size >= 3
RETURN root.name, network_size, network_gmv, (network_gmv * 0.05) AS commission_payout
ORDER BY network_gmv DESC;`,
      purpose: 'Aggregates community revenue attribution to identify primary referral powerhouses across merchant stores.',
    },
    {
      title: 'Logistics Facility Feeder Network Path',
      cypher: `MATCH p = (hub:Hub)-[:TRUNK_LINE|FEEDER_LINE*]->(store:Store)
WHERE hub.id = 'HUB-PP'
RETURN p, reduce(totalKm = 0, r in relationships(p) | totalKm + r.distanceKm) AS transit_distance_km;`,
      purpose: 'Computes multi-hop distribution feeder paths from primary hubs down to destination merchant storefronts.',
    },
  ];

  const handleCopyCypher = () => {
    navigator.clipboard.writeText(queries[activeQueryIndex].cypher);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteCypher = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
    }, 700);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Neo4j Graph Explorer & Relationship Engine
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
              BOLT PROTOCOL • CYPHER v5.2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing multi-tier customer referral downlines, store merchant connections, and physical hub network topology.
          </p>
        </div>

        {/* Perspective Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => {
              setPerspective('social');
              setSelectedNodeId('C0457');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              perspective === 'social'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Social Referral Graph</span>
          </button>
          <button
            onClick={() => {
              setPerspective('logistics');
              setSelectedNodeId('HUB-PP');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              perspective === 'logistics'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Distribution Topology</span>
          </button>
        </div>
      </div>

      {/* Main Canvas & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Graph Canvas (2 Columns) */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm">
          {/* Canvas Top Bar */}
          <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-slate-200">
                {perspective === 'social' ? 'Multi-Tier Referral Tree' : 'Regional Feeder Network'}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                ({currentNodes.length} Nodes • {currentLinks.length} Edges)
              </span>
            </div>

            {/* Zoom & Pan Controls */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.6))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Graph Viewport */}
          <div className="relative h-96 sm:h-[460px] bg-[#090d16] overflow-hidden flex items-center justify-center p-4">
            <svg
              className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
              viewBox="0 0 700 480"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                </marker>
              </defs>

              {/* Links */}
              {currentLinks.map((link, i) => {
                const sourceNode = currentNodes.find(n => n.id === link.source);
                const targetNode = currentNodes.find(n => n.id === link.target);
                if (!sourceNode || !targetNode) return null;

                const midX = (sourceNode.x + targetNode.x) / 2;
                const midY = (sourceNode.y + targetNode.y) / 2;

                return (
                  <g key={`link-${i}`}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke="#1e293b"
                      strokeWidth="2"
                      markerEnd="url(#arrow)"
                    />
                    <rect
                      x={midX - 22}
                      y={midY - 8}
                      width="44"
                      height="16"
                      rx="4"
                      fill="#0f172a"
                      stroke="#1e293b"
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                    >
                      {link.rate}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {currentNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const isRoot = node.type === 'root' || node.type === 'hub';

                let fillBg = '#0f172a';
                let strokeColor = '#3b82f6';

                if (node.type === 'root') {
                  fillBg = '#1e3a8a';
                  strokeColor = '#60a5fa';
                } else if (node.type === 'tier1') {
                  fillBg = '#064e3b';
                  strokeColor = '#34d399';
                } else if (node.type === 'hub') {
                  fillBg = '#1e3a8a';
                  strokeColor = '#60a5fa';
                } else if (node.type === 'depot') {
                  fillBg = '#581c87';
                  strokeColor = '#c084fc';
                }

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer transition-all hover:scale-105"
                  >
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isRoot ? 28 : 22}
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="2.5"
                        strokeDasharray="4 3"
                        className="animate-spin-slow"
                      />
                    )}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isRoot ? 22 : 16}
                      fill={fillBg}
                      stroke={isSelected ? '#ffffff' : strokeColor}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      fill="#ffffff"
                      fontSize={isRoot ? '10' : '8'}
                      fontWeight="bold"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                    >
                      {node.id}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + (isRoot ? 36 : 28)}
                      fill="#cbd5e1"
                      fontSize="10"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Canvas Bottom Legend */}
          <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Root / Central Hub
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Tier 1 / Direct Children
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Sub-Tiers / Depots
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Click any node to inspect</span>
          </div>
        </div>

        {/* Selected Node Detail Inspector (1 Column) */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Node Inspector
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedNode.label}</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
                {selectedNode.id}
              </span>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Location / City</span>
                <div className="font-semibold text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{selectedNode.city || 'Regional'}</span>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Node Type</span>
                <div className="font-semibold text-slate-200 uppercase font-mono text-[11px]">
                  {selectedNode.type}
                </div>
              </div>

              {selectedNode.spend !== undefined && (
                <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px]">Lifetime Spend</span>
                  <div className="font-mono font-bold text-white text-sm">
                    ${selectedNode.spend.toLocaleString()}
                  </div>
                </div>
              )}

              {selectedNode.earned !== undefined && (
                <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px]">Referral Earned</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    +${selectedNode.earned.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            {/* Extended Details */}
            {selectedNode.details && (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Property Attributes
                </span>
                <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-800 space-y-2 text-xs font-mono">
                  {Object.entries(selectedNode.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="text-slate-400">{k}:</span>
                      <span className="text-slate-200 font-semibold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Backed by Neo4j graph cluster index with ACID transaction guarantees.
          </div>
        </div>
      </div>

      {/* Cypher Query Runner Terminal */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold text-white tracking-wide uppercase">
              Neo4j Cypher Execution Console
            </h4>
          </div>

          {/* Preset Query Tabs */}
          <div className="flex items-center gap-2">
            {queries.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveQueryIndex(idx)}
                className={`px-2.5 py-1 rounded text-xs transition ${
                  activeQueryIndex === idx
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
                }`}
              >
                Query {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300">
              {queries[activeQueryIndex].title}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCypher}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Cypher'}</span>
              </button>
              <button
                onClick={handleExecuteCypher}
                disabled={isExecuting}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isExecuting ? 'Running Query...' : 'Execute Cypher'}</span>
              </button>
            </div>
          </div>

          {/* Cypher Code Box */}
          <pre className="p-4 rounded-lg bg-[#090d16] border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
            {queries[activeQueryIndex].cypher}
          </pre>

          <p className="text-xs text-slate-400">
            {queries[activeQueryIndex].purpose}
          </p>
        </div>
      </div>
    </div>
  );
};

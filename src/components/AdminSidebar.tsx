import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  MapPin,
  Cpu,
  Store,
  DollarSign,
  ScrollText,
  Server,
  Layers
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  port?: number;
  badge?: string | number;
  badgeAlert?: boolean;
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

export const AdminSidebar: React.FC = () => {
  const { activeTab, setActiveTab, kycQueue, payoutsQueue } = useAdmin();

  const totalSlaItems = kycQueue.length + payoutsQueue.length;

  const sections: SidebarSection[] = [
    {
      label: 'EXECUTIVE OVERLOOK',
      items: [
        { id: 'overview', label: 'Ecosystem Overview', icon: LayoutDashboard },
      ],
    },
    {
      label: 'INTEGRATED PLATFORMS',
      items: [
        { id: 'supply-chain', label: 'Supply Chain Ops', icon: Boxes, port: 3100 },
        { id: 'sandbox', label: 'Logistics Sandbox', icon: Truck, port: 3007 },
        { id: 'pathfinder', label: 'OSM Pathfinder', icon: MapPin, port: 3000 },
        { id: 'intelligence', label: 'Distribution Solver', icon: Cpu, port: 3200 },
      ],
    },
    {
      label: 'COMMERCE & OPERATIONS',
      items: [
        { id: 'stores', label: 'Stores Directory', icon: Store, badge: '1,248' },
        {
          id: 'settlements',
          label: 'Settlements & KYC',
          icon: DollarSign,
          badge: totalSlaItems > 0 ? totalSlaItems : undefined,
          badgeAlert: true,
        },
      ],
    },
    {
      label: 'GOVERNANCE & SYSTEM',
      items: [
        { id: 'audit', label: 'Immutable Audit Trail', icon: ScrollText },
        { id: 'system', label: 'Microservices & Health', icon: Server },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800 flex flex-col shrink-0 h-[calc(100vh-65px)] overflow-y-auto">
      <div className="p-4 space-y-6">
        {sections.map(section => (
          <div key={section.label} className="space-y-1">
            <h2 className="px-2.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              {section.label}
            </h2>
            <nav className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.port && (
                        <span className="text-[10px] font-mono text-slate-400 px-1 py-0.2 rounded bg-slate-900 border border-slate-800">
                          :{item.port}
                        </span>
                      )}
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            item.badgeAlert
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer workspace status summary */}
      <div className="mt-auto p-4 border-t border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Standalone Control Plane</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Connected across 5 microservice nodes on localhost.
        </p>
      </div>
    </aside>
  );
};

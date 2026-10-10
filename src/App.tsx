import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar } from './components/AdminSidebar';
import { UniversalSearchModal } from './components/UniversalSearchModal';

import { OverviewView } from './views/OverviewView';
import { SupplyChainView } from './views/SupplyChainView';
import { FleetSimulationView } from './views/FleetSimulationView';
import { PathfinderRoutingView } from './views/PathfinderRoutingView';
import { OptimizationView } from './views/OptimizationView';
import { StoresDirectoryView } from './views/StoresDirectoryView';
import { SettlementsView } from './views/SettlementsView';
import { AuditLogsView } from './views/AuditLogsView';
import { SystemHealthView } from './views/SystemHealthView';
import { Neo4jGraphView } from './views/Neo4jGraphView';
import { HiveAnalyticsView } from './views/HiveAnalyticsView';
import { OrdersStreamView } from './views/OrdersStreamView';

const AdminContent: React.FC = () => {
  const { activeTab } = useAdmin();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'analytics':
        return <HiveAnalyticsView />;
      case 'supply-chain':
        return <SupplyChainView />;
      case 'sandbox':
        return <FleetSimulationView />;
      case 'pathfinder':
        return <PathfinderRoutingView />;
      case 'intelligence':
        return <OptimizationView />;
      case 'stores':
        return <StoresDirectoryView />;
      case 'orders':
        return <OrdersStreamView />;
      case 'graph':
        return <Neo4jGraphView />;
      case 'settlements':
        return <SettlementsView />;
      case 'audit':
        return <AuditLogsView />;
      case 'system':
        return <SystemHealthView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="h-screen bg-[#090d16] flex flex-col overflow-hidden">
      <AdminHeader />
      <div className="flex-1 flex overflow-hidden min-h-0">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#090d16]">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
      <UniversalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}

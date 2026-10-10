# Supply Chain Control Tower

Centralized real-time operations control tower and mission control for the supply chain and logistics ecosystem.

Port: `3300`

## Overview

The **Supply Chain Control Tower** provides sovereign end-to-end visibility and real-time execution across the entire multi-repository ecosystem:

1. **E-Commerce Commercial Front & Demand**: Live customer order ingestion and checkout bridge (`ecommerce-storefront` on port `3001`).
2. **Operational Warehouse & Inventory Ledger**: Real-time facility stock levels, double-entry inventory ledger movements, and picking/packing fulfillment workflows (`supply-chain-platform` on port `3100`).
3. **Fleet Dispatch & Simulation**: Fleet vehicle routing, telematics, traffic conditions, driver dispatching, and chaos simulation (`logistics-sandbox` on port `3007`).
4. **Physical Road Routing Engine**: Turn-by-turn road network routing, A* graph traversal, and geometry rendering (`osm-pathfinder` on port `3000`).
5. **AI Fleet Route Optimization Cockpit**: Fleet Vehicle Routing with Time Windows (VRPTW) solver, financial cost-to-serve analytics, and scenario evaluation (`fleet-route-optimizer` on port `3200`).
6. **Polyglot System Telemetry**: Real-time health, latency, error rates, and circuit monitoring across all backend microservice nodes.

---

## Architectural Principles

- **Sovereign Operational Gateway**: Connects directly to backend HTTP endpoints with transparent reverse proxy fallback in development.
- **Zero Simulation Contamination**: Upholds the operational boundary defined in `AGENTS.md`. The Control Tower visualizes both live operational data (PostgreSQL/PostGIS) and simulated sandbox scenarios without allowing synthetic runs to write directly into operational ledgers.
- **Real-Time Interactive Dispatching**: Operators can trigger inventory allocations, trigger VRPTW optimizations, dispatch delivery fleets, and inspect road paths directly from one unified dashboard.

---

## Getting Started

### Development
```bash
pnpm install
pnpm dev
```
Runs the control tower dashboard on `http://localhost:3300`.

### Production Build
```bash
pnpm build
pnpm preview
```

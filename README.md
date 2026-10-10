# 🛰️ Supply Chain Control Tower

Centralized real-time operations control tower and mission control for the supply chain and logistics ecosystem.

[![Vite](https://img.shields.io/badge/Vite-6.x-B73BFE?logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Port](https://img.shields.io/badge/Port-8300-blue)](http://localhost:8300)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Overview

The **Supply Chain Control Tower** provides sovereign end-to-end visibility and real-time operational execution across the entire distributed supply chain ecosystem:

1. **E-Commerce Demand & Stores**: Live customer order ingestion, checkout bridge, and multi-tenant store directory (`ecommerce-storefront` on port `8401` / API `8400`).
2. **Operational Warehouse & Inventory Ledger**: Real-time facility stock levels, double-entry inventory movements, and picking/packing fulfillment workflows (`supply-chain-platform` on port `8100` / Web `8101`).
3. **Fleet Dispatch & Simulation**: Fleet vehicle routing, telematics, traffic conditions, driver dispatching, and chaos simulation (`logistics-sandbox` on port `8500` / Web `8501`).
4. **Physical Road Routing Engine**: Turn-by-turn road network routing, A* graph traversal, and geometry rendering (`osm-pathfinder` on port `8000`).
5. **AI Fleet Route Optimization Cockpit**: Fleet Vehicle Routing with Time Windows (VRPTW) solver, financial cost-to-serve analytics, and scenario evaluation (`fleet-route-optimizer` on port `8200`).
6. **Polyglot System Telemetry**: Real-time health, latency, error rates, and circuit monitoring across all microservice nodes.

---

## 🏛️ Architectural Principles

- **Sovereign Operational Gateway**: Connects directly to backend HTTP endpoints with transparent Vite reverse proxy fallbacks (`/proxy/*`) during local development.
- **Zero Simulation Contamination**: Upholds the operational boundary defined in `AGENTS.md`. The Control Tower visualizes both live operational data (PostgreSQL/PostGIS) and simulated sandbox scenarios without permitting synthetic runs to mutate operational ledgers.
- **Real-Time Interactive Dispatching**: Operators can trigger inventory allocations, execute VRPTW route optimizations, dispatch delivery fleets, and inspect road paths directly from one unified dashboard.

---

## ⚡ Ecosystem Port Configuration

| Service Route | Reverse Proxy Target | Backend Node |
| :--- | :--- | :--- |
| `/proxy/routing/*` | `http://127.0.0.1:8000` | `osm-pathfinder` (Rust Axum Road Routing) |
| `/proxy/platform/*` | `http://127.0.0.1:8100` | `supply-chain-platform` (Operations API) |
| `/proxy/optimizer/*` | `http://127.0.0.1:8200` | `fleet-route-optimizer` (VRPTW Solver) |
| `/proxy/ecommerce/*` | `http://127.0.0.1:8401` | `ecommerce-storefront` (Storefront Web / API) |
| `/proxy/sandbox/*` | `http://127.0.0.1:8500` | `logistics-sandbox` (Discrete Twin Simulation) |

---

## 🚀 Getting Started

### Development
```bash
pnpm install
pnpm dev
```
Runs the mission control dashboard on **[http://localhost:8300](http://localhost:8300)**.

### Production Build & Preview
```bash
pnpm build
pnpm preview
```

---

## 📄 License
MIT License.

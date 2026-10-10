import React, { useState } from 'react';
import {
  BarChart3,
  Database,
  TrendingUp,
  MapPin,
  Users,
  Sparkles,
  Layers,
  Terminal,
  Play,
  RotateCw,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const HiveAnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'provinces' | 'customers' | 'workbench'>('overview');
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryLatency, setQueryLatency] = useState(50.87);
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);

  const metrics = {
    totalMonthlyOrders: 1000000,
    activeCustomers: 50000,
    customerBuckets: 8,
    septemberRevenue: 76554792.32,
    queryLatencyMs: queryLatency,
    csvLatencyMs: 423.32,
    speedupMultiplier: 8.3,
    compressionRatio: 3.52,
  };

  const provinces = [
    { province: 'Phnom Penh', revenue: 42130965.2, share: '55.0%', orders: 550000 },
    { province: 'Siem Reap', revenue: 19191375.01, share: '25.1%', orders: 251000 },
    { province: 'Battambang', revenue: 7570672.18, share: '9.9%', orders: 99000 },
    { province: 'Kandal', revenue: 3058095.15, share: '4.0%', orders: 40000 },
    { province: 'Sihanoukville', revenue: 2341096.15, share: '3.1%', orders: 31000 },
    { province: 'Kampot', revenue: 2253587.83, share: '2.9%', orders: 29000 },
  ];

  const topCustomers = [
    { rank: 1, name: 'Bopha Pich (C10524)', city: 'Battambang', spend: 14479.74, tier: 'VIP Platinum', orders: 112 },
    { rank: 2, name: 'Neary Long (C47708)', city: 'Phnom Penh', spend: 13982.51, tier: 'VIP Platinum', orders: 98 },
    { rank: 3, name: 'Bopha Pich (C28429)', city: 'Phnom Penh', spend: 13311.93, tier: 'VIP Gold', orders: 84 },
    { rank: 4, name: 'Sophea Mao (C13118)', city: 'Phnom Penh', spend: 13257.03, tier: 'VIP Gold', orders: 79 },
    { rank: 5, name: 'Neary Long (C45423)', city: 'Siem Reap', spend: 13150.46, tier: 'VIP Gold', orders: 82 },
  ];

  const orderTiers = {
    highTier: { label: '> $100', count: 421842, percentage: '42.2%', totalRevenue: 54120000 },
    normalTier: { label: '≤ $100', count: 578158, percentage: '57.8%', totalRevenue: 22434792 },
  };

  const sampleQueries = [
    {
      title: 'Monthly GMV Aggregation by Province (ORC Columnar)',
      sql: `-- Apache Hive 3.1 on Tez (ORC Format + Snappy Compression)
SELECT 
    province, 
    COUNT(*) AS total_orders, 
    SUM(order_total) AS gross_revenue,
    ROUND(SUM(order_total) * 100.0 / 76554792.32, 2) AS revenue_share_pct
FROM hive_dw.orders_orc_partitioned
WHERE order_date BETWEEN '2026-09-01' AND '2026-09-30'
GROUP BY province
ORDER BY gross_revenue DESC;`,
      executionStats: 'Scan 1,000,000 rows in 50.87 ms (0.8 GB scanned vs 2.8 GB raw CSV)',
    },
    {
      title: 'VIP Customer Lifetime Spend Ranking (Top 1% Percentile)',
      sql: `-- Window Functions & Customer Percentile Segmentation
WITH RankedCustomers AS (
    SELECT 
        customer_id, 
        customer_name, 
        city,
        SUM(order_total) as lifetime_spend,
        COUNT(order_id) as total_purchases,
        PERCENT_RANK() OVER (ORDER BY SUM(order_total) DESC) as spend_percentile
    FROM hive_dw.customer_orders_orc
    GROUP BY customer_id, customer_name, city
)
SELECT * FROM RankedCustomers
WHERE spend_percentile <= 0.01
ORDER BY lifetime_spend DESC
LIMIT 10;`,
      executionStats: 'Execution completed across 8 Tez map-reduce containers in 42.10 ms',
    },
    {
      title: 'Cart Basket Size Tier Distribution & Margin Contribution',
      sql: `-- Basket Distribution Threshold Analysis
SELECT 
    CASE WHEN order_total > 100.0 THEN 'HIGH_TIER (> $100)' ELSE 'NORMAL_TIER (<= $100)' END AS basket_tier,
    COUNT(*) AS order_count,
    ROUND(AVG(order_total), 2) AS average_basket_size,
    SUM(order_total) AS aggregate_tier_revenue
FROM hive_dw.orders_orc_partitioned
GROUP BY CASE WHEN order_total > 100.0 THEN 'HIGH_TIER (> $100)' ELSE 'NORMAL_TIER (<= $100)' END;`,
      executionStats: 'Partition pruning eliminated 84% unnecessary columnar splits in 38.45 ms',
    },
  ];

  const handleRunQuery = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setQueryLatency(Math.round((45 + Math.random() * 12) * 100) / 100);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Big Data & Hive OLAP Analytics
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
              APACHE HIVE 3.1 • TEZ ENGINE • HDFS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing 1,000,000+ staged orders, columnar ORC Snappy compression, regional province aggregates, and customer lifetime value.
          </p>
        </div>

        {/* Tez Speedup Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Tez Query Latency:</span>
          <span className="font-mono font-bold text-emerald-400">
            {metrics.queryLatencyMs} ms
          </span>
          <span className="text-[11px] text-slate-400">({metrics.speedupMultiplier}x vs CSV)</span>
        </div>
      </div>

      {/* Headline Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Staged Orders</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics.totalMonthlyOrders.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Staged in HDFS partitioned tables</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Aggregated Gross GMV</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ${(metrics.septemberRevenue / 1000000).toFixed(2)}M USD
          </div>
          <p className="text-[11px] text-slate-400">$76.5M monthly volume processed</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ORC Compression Ratio</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {metrics.compressionRatio}x Smaller
          </div>
          <p className="text-[11px] text-slate-400">0.8 GB ORC vs 2.8 GB raw CSV storage</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Customers & Buckets</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {metrics.activeCustomers.toLocaleString()} Users
          </div>
          <p className="text-[11px] text-slate-400">{metrics.customerBuckets} Hash-partitioned buckets</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 w-fit text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-md font-medium transition ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Regional Breakdown
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-3 py-1.5 rounded-md font-medium transition ${
            activeTab === 'customers' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          VIP Customer Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('workbench')}
          className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
            activeTab === 'workbench' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Hive SQL Workbench</span>
        </button>
      </div>

      {/* Tab 1: Regional Province Breakdown */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Province Revenue Aggregation & Market Share
              </h3>
              <span className="text-[11px] font-mono text-slate-400">1,000,000 Orders Analyzed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="table-header">Province / Region</th>
                    <th className="table-header text-right">Orders Volume</th>
                    <th className="table-header text-right">Gross GMV</th>
                    <th className="table-header text-right">Market Share</th>
                    <th className="table-header">Distribution Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {provinces.map(p => (
                    <tr key={p.province} className="hover:bg-slate-900/40 text-xs">
                      <td className="table-cell font-semibold text-white flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>{p.province}</span>
                      </td>
                      <td className="table-cell text-right font-mono text-slate-300">
                        {p.orders.toLocaleString()}
                      </td>
                      <td className="table-cell text-right font-mono font-bold text-white">
                        ${(p.revenue / 1000000).toFixed(2)}M
                      </td>
                      <td className="table-cell text-right font-mono text-emerald-400 font-semibold">
                        {p.share}
                      </td>
                      <td className="table-cell">
                        <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-full"
                            style={{ width: p.share }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Basket Size Segmentation */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wide">
                  Order Basket Tier Distribution
                </h3>
                <PieChart className="w-4 h-4 text-purple-400" />
              </div>

              {/* High Tier */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-purple-300">High-Tier (&gt; $100)</span>
                  <span className="font-mono font-bold text-white">{orderTiers.highTier.percentage}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between font-mono">
                  <span>{orderTiers.highTier.count.toLocaleString()} orders</span>
                  <span className="text-emerald-400">${(orderTiers.highTier.totalRevenue / 1000000).toFixed(1)}M GMV</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: orderTiers.highTier.percentage }} />
                </div>
              </div>

              {/* Normal Tier */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-blue-300">Standard Tier (≤ $100)</span>
                  <span className="font-mono font-bold text-white">{orderTiers.normalTier.percentage}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between font-mono">
                  <span>{orderTiers.normalTier.count.toLocaleString()} orders</span>
                  <span className="text-emerald-400">${(orderTiers.normalTier.totalRevenue / 1000000).toFixed(1)}M GMV</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: orderTiers.normalTier.percentage }} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              High-tier orders account for 70.7% of marketplace net transaction volume.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: VIP Customer Leaderboard */}
      {activeTab === 'customers' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              VIP Customer Lifetime Spend Ranking (Top 1% Percentile)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Total Customer Pool: 50,000</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-header">Rank</th>
                  <th className="table-header">Customer Profile</th>
                  <th className="table-header">City / Province</th>
                  <th className="table-header text-right">Orders Count</th>
                  <th className="table-header">VIP Tier</th>
                  <th className="table-header text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {topCustomers.map(cust => (
                  <tr key={cust.rank} className="hover:bg-slate-900/40 text-xs">
                    <td className="table-cell font-mono font-bold text-slate-400">
                      #{cust.rank}
                    </td>
                    <td className="table-cell font-semibold text-white">
                      {cust.name}
                    </td>
                    <td className="table-cell text-slate-300 font-mono">
                      {cust.city}
                    </td>
                    <td className="table-cell text-right font-mono text-slate-300">
                      {cust.orders}
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300 font-mono text-[11px]">
                        {cust.tier}
                      </span>
                    </td>
                    <td className="table-cell text-right font-mono font-bold text-emerald-400">
                      ${cust.spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Hive SQL Workbench */}
      {activeTab === 'workbench' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden space-y-0">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Interactive Apache Hive OLAP Workbench
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {sampleQueries.map((_, idx) => (
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

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                {sampleQueries[activeQueryIndex].title}
              </span>

              <button
                onClick={handleRunQuery}
                disabled={isExecuting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition shadow-sm"
              >
                {isExecuting ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isExecuting ? 'Executing in Tez Containers...' : 'Run Query on Hive Cluster'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-lg bg-[#090d16] border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {sampleQueries[activeQueryIndex].sql}
            </pre>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{sampleQueries[activeQueryIndex].executionStats}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

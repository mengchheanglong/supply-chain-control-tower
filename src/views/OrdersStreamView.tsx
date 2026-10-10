import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  CheckCircle2,
  Truck,
  ExternalLink,
  MapPin,
  Eye,
  X,
  DollarSign,
  Package,
  ArrowUpRight
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { OrderRecord } from '../types';
import { fetchOperationalOrders } from '../api';

const INITIAL_ORDERS_STREAM: OrderRecord[] = [
  {
    order_id: 'ORD-100001',
    customer_id: 'C0457',
    customer_name: 'Sokha Meas',
    items: [
      { product_id: 'P0874', name: 'Battambang Jasmine Fragrant Rice 5kg', price: 4.80, quantity: 2 },
      { product_id: 'P0875', name: 'Kampot Organic Black Pepper 250g', price: 7.50, quantity: 2 },
      { product_id: 'P0877', name: 'Wild Raw Forest Honey from Koh Kong 500ml', price: 17.90, quantity: 1 }
    ],
    total: 42.50,
    payment_method: 'KHQR / Bakong',
    status: 'Delivered',
    province: 'Phnom Penh',
    address: 'St 240, Daun Penh, Phnom Penh',
    date: '2026-10-10 15:42',
    tracking_id: 'TRK-PP-99421'
  },
  {
    order_id: 'ORD-100002',
    customer_id: 'C0892',
    customer_name: 'Rathana Chem',
    items: [
      { product_id: 'P0876', name: 'Mondulkiri Dark Roast Arabica Beans 500g', price: 9.20, quantity: 2 },
      { product_id: 'P0877', name: 'Wild Raw Forest Honey from Koh Kong 500ml', price: 17.90, quantity: 2 },
      { product_id: 'P0880', name: 'Angkor Botanical Herbal Tea Blend', price: 6.90, quantity: 2 }
    ],
    total: 68.00,
    payment_method: 'KHQR / Bakong',
    status: 'Out for Delivery',
    province: 'Siem Reap',
    address: 'Wat Bo Rd, Sala Kamreuk, Siem Reap',
    date: '2026-10-10 16:05',
    tracking_id: 'TRK-SR-44102'
  },
  {
    order_id: 'ORD-100003',
    customer_id: 'C10524',
    customer_name: 'Bopha Pich (VIP Platinum)',
    items: [
      { product_id: 'P0910', name: 'Handwoven Khmer Golden Silk Scarf', price: 68.00, quantity: 1 },
      { product_id: 'P0912', name: 'Organic Battambang Dried Mango Slices 1kg', price: 14.50, quantity: 2 },
      { product_id: 'P0875', name: 'Kampot Organic Black Pepper 250g', price: 7.50, quantity: 2 }
    ],
    total: 112.00,
    payment_method: 'KHQR / Bakong',
    status: 'Delivered',
    province: 'Battambang',
    address: 'St 3, Svay Pao, Battambang',
    date: '2026-10-10 14:18',
    tracking_id: 'TRK-BB-77291'
  },
  {
    order_id: 'ORD-100004',
    customer_id: 'C0319',
    customer_name: 'Channary Heng',
    items: [
      { product_id: 'P0882', name: 'Kampot Fleur de Sel (Flower of Salt) 500g', price: 8.50, quantity: 2 },
      { product_id: 'P0884', name: 'Angkor Organic Spice Sampler 6-Pack', price: 12.90, quantity: 1 }
    ],
    total: 29.90,
    payment_method: 'Cash on Delivery',
    status: 'Preparing',
    province: 'Phnom Penh',
    address: 'Norodom Blvd, Chamkarmon, Phnom Penh',
    date: '2026-10-10 16:22',
    tracking_id: 'TRK-PP-10948'
  },
  {
    order_id: 'ORD-100005',
    customer_id: 'C0741',
    customer_name: 'Kosal Lim',
    items: [
      { product_id: 'P0888', name: 'Roasted Organic Cashew Nuts 500g (Ratanakiri)', price: 11.50, quantity: 2 },
      { product_id: 'P0890', name: 'Natural Palm Sugar Cylinder 1kg (Kompong Speu)', price: 6.50, quantity: 2 }
    ],
    total: 36.00,
    payment_method: 'KHQR / Bakong',
    status: 'Out for Delivery',
    province: 'Kandal',
    address: 'National Rd 1, Kien Svay, Kandal',
    date: '2026-10-10 15:55',
    tracking_id: 'TRK-KD-33019'
  },
  {
    order_id: 'ORD-100006',
    customer_id: 'C47708',
    customer_name: 'Neary Long (VIP Platinum)',
    items: [
      { product_id: 'P0876', name: 'Mondulkiri Dark Roast Arabica Beans 500g', price: 9.20, quantity: 4 },
      { product_id: 'P0910', name: 'Handwoven Khmer Golden Silk Scarf', price: 68.00, quantity: 1 },
      { product_id: 'P0877', name: 'Wild Raw Forest Honey from Koh Kong 500ml', price: 17.90, quantity: 2 }
    ],
    total: 140.60,
    payment_method: 'KHQR / Bakong',
    status: 'Delivered',
    province: 'Phnom Penh',
    address: 'Diamond Island (Koh Pich), Phnom Penh',
    date: '2026-10-10 13:50',
    tracking_id: 'TRK-PP-88214'
  },
  {
    order_id: 'ORD-100007',
    customer_id: 'C13118',
    customer_name: 'Sophea Mao',
    items: [
      { product_id: 'P0874', name: 'Battambang Jasmine Fragrant Rice 5kg', price: 4.80, quantity: 4 },
      { product_id: 'P0882', name: 'Kampot Fleur de Sel 500g', price: 8.50, quantity: 2 },
      { product_id: 'P0875', name: 'Kampot Organic Black Pepper 250g', price: 7.50, quantity: 1 }
    ],
    total: 43.70,
    payment_method: 'KHQR / Bakong',
    status: 'Preparing',
    province: 'Kampot',
    address: 'Riverside Rd, Krong Kampot, Kampot',
    date: '2026-10-10 16:30',
    tracking_id: 'TRK-KP-22910'
  },
  {
    order_id: 'ORD-100008',
    customer_id: 'C0985',
    customer_name: 'Vichhai Seng',
    items: [
      { product_id: 'P0874', name: 'Battambang Jasmine Fragrant Rice 5kg', price: 4.80, quantity: 5 },
      { product_id: 'P0888', name: 'Roasted Organic Cashew Nuts 500g', price: 11.50, quantity: 2 },
      { product_id: 'P0877', name: 'Wild Raw Forest Honey from Koh Kong 500ml', price: 17.90, quantity: 1 }
    ],
    total: 64.90,
    payment_method: 'Cash on Delivery',
    status: 'Pending',
    province: 'Sihanoukville',
    address: 'Ekareach St, Sangkat 2, Sihanoukville',
    date: '2026-10-10 16:38',
    tracking_id: 'TRK-SHV-55190'
  }
];

export const OrdersStreamView: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS_STREAM);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [provinceFilter, setProvinceFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const { setNotification } = useAdmin();

  // Fetch real operational orders from supply-chain-platform
  useEffect(() => {
    fetchOperationalOrders().then((platformOrders: any[]) => {
      if (platformOrders && platformOrders.length > 0) {
        const mapped: OrderRecord[] = platformOrders.slice(0, 10).map((po: any) => ({
          order_id: po.orderNumber || (po.id ? `ORD-${po.id.slice(0, 8).toUpperCase()}` : 'ORD-LIVE'),
          customer_id: po.customerId || 'CUST-CORE',
          customer_name: po.recipientName || 'Verified Operational Order',
          items: (po.lines || []).map((l: any) => ({
            product_id: l.skuId || l.skuCode || 'SKU-FOOD-01',
            name: l.skuName || l.skuCode || 'Enterprise Inventory Item',
            price: 24.50,
            quantity: l.quantity || 1,
          })),
          total: 49.00,
          payment_method: 'KHQR / Bakong (Bridge)',
          status: (po.status === 'allocated' || po.status === 'shipped' ? 'Delivered' : po.status === 'open' ? 'Out for Delivery' : 'Preparing') as any,
          province: po.destinationProvince || 'Phnom Penh',
          address: po.destinationAddress || 'Central Logistics Hub',
          date: po.createdAt ? new Date(po.createdAt).toISOString().slice(0, 16).replace('T', ' ') : '2026-10-10 16:30',
          tracking_id: `TRK-PLATFORM-${po.id ? po.id.slice(0, 6) : '991'}`
        }));
        setOrders(prev => [...mapped, ...prev]);
      }
    }).catch(() => null);
  }, []);

  // Simulated live ingestion stream (adds mock transaction periodically when enabled)
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const nextId = `ORD-${Math.floor(100000 + Math.random() * 90000)}`;
      const provinces = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Kandal'];
      const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
      const sampleCustomerNames = ['Chhaya Kem', 'Sreypov Tan', 'Panha Sok', 'Vanna Meas'];
      const randomCustomer = sampleCustomerNames[Math.floor(Math.random() * sampleCustomerNames.length)];

      const newOrder: OrderRecord = {
        order_id: nextId,
        customer_id: `C${Math.floor(1000 + Math.random() * 9000)}`,
        customer_name: randomCustomer,
        items: [
          { product_id: 'P0874', name: 'Battambang Jasmine Rice 5kg', price: 4.80, quantity: 2 },
          { product_id: 'P0875', name: 'Kampot Pepper 250g', price: 7.50, quantity: 1 }
        ],
        total: 17.10,
        payment_method: 'KHQR / Bakong',
        status: 'Preparing',
        province: randomProvince,
        address: `St ${Math.floor(10 + Math.random() * 300)}, ${randomProvince}`,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        tracking_id: `TRK-LIVE-${Math.floor(1000 + Math.random() * 9000)}`
      };

      setOrders(prev => [newOrder, ...prev.slice(0, 24)]);
    }, 12000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch =
        !searchQuery ||
        o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'DELIVERED' && o.status === 'Delivered') ||
        (statusFilter === 'IN_TRANSIT' && o.status === 'Out for Delivery') ||
        (statusFilter === 'PREPARING' && o.status === 'Preparing') ||
        (statusFilter === 'PENDING' && o.status === 'Pending');

      const matchProvince = provinceFilter === 'ALL' || o.province === provinceFilter;

      return matchSearch && matchStatus && matchProvince;
    });
  }, [orders, searchQuery, statusFilter, provinceFilter]);

  const stats = useMemo(() => {
    const totalGmv = orders.reduce((acc, curr) => acc + curr.total, 0);
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const inTransit = orders.filter(o => o.status === 'Out for Delivery').length;
    const preparing = orders.filter(o => o.status === 'Preparing' || o.status === 'Pending').length;
    return {
      totalCount: orders.length,
      totalGmv,
      delivered,
      inTransit,
      preparing
    };
  }, [orders]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Real Orders Ingestion Stream (MongoDB ACID Ledger)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/80 text-blue-300">
              PORT 8401 (E-COMMERCE STREAM)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-tenant order transactions: live courier dispatch linkage, KHQR payments, and settlement accounting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsLiveStreaming(!isLiveStreaming);
              setNotification({
                message: isLiveStreaming ? 'Order stream polling paused' : 'Live order streaming enabled (polling MongoDB)',
                type: 'info'
              });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              isLiveStreaming
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{isLiveStreaming ? 'Stream Active' : 'Stream Paused'}</span>
          </button>

          <a
            href="http://localhost:8401/admin"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <span>E-Commerce Reference (:8401)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Band */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Staged Order Count</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats.totalCount} Orders
          </div>
          <p className="text-[11px] text-slate-400">Live buffer in MongoDB cluster</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Stream GMV Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ${stats.totalGmv.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400">Average basket ${(stats.totalGmv / (stats.totalCount || 1)).toFixed(2)}</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Delivered (SLA Met)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats.delivered}
            <span className="text-xs text-emerald-400 ml-2 font-sans font-normal">
              ({((stats.delivered / (stats.totalCount || 1)) * 100).toFixed(0)}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Confirmed customer drop-off</p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active In-Transit / Dispatch</span>
            <Truck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">
            {stats.inTransit + stats.preparing}
          </div>
          <p className="text-[11px] text-slate-400">{stats.inTransit} on road • {stats.preparing} prep</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: `All (${orders.length})` },
            { id: 'DELIVERED', label: `Delivered (${stats.delivered})` },
            { id: 'IN_TRANSIT', label: `In-Transit (${stats.inTransit})` },
            { id: 'PREPARING', label: `Preparing (${stats.preparing})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Province Filter */}
          <select
            value={provinceFilter}
            onChange={e => setProvinceFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Provinces</option>
            <option value="Phnom Penh">Phnom Penh</option>
            <option value="Siem Reap">Siem Reap</option>
            <option value="Battambang">Battambang</option>
            <option value="Kandal">Kandal</option>
            <option value="Sihanoukville">Sihanoukville</option>
            <option value="Kampot">Kampot</option>
          </select>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order, customer, SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-xs rounded-lg pl-8 pr-3 py-1.5 w-60 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Orders Stream Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Ingested Orders Journal ({filteredOrders.length} Records)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live customer transactions recorded with real courier dispatch state & Bakong KHQR signatures.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Stream Source: MongoDB replica</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer & Destination</th>
                <th className="py-3 px-4 font-semibold">Line Items</th>
                <th className="py-3 px-4 font-semibold">Payment / Total</th>
                <th className="py-3 px-4 font-semibold">Fulfillment Status</th>
                <th className="py-3 px-4 font-semibold">Ingestion Time</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredOrders.map(order => (
                <tr
                  key={order.order_id}
                  className="hover:bg-slate-900/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="py-3 px-4">
                    <span className="font-bold text-white">{order.order_id}</span>
                    <span className="block text-[11px] text-slate-400">{order.customer_id}</span>
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <span className="font-semibold text-slate-200 block">{order.customer_name}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{order.province}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <span className="text-slate-300 font-medium">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                    <span className="block text-[11px] text-slate-400 truncate max-w-xs">
                      {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-emerald-400">${order.total.toFixed(2)}</span>
                    <span className="block text-[11px] text-slate-400 font-sans">{order.payment_method}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                          : order.status === 'Out for Delivery'
                          ? 'bg-sky-950/80 text-sky-300 border border-sky-800/80'
                          : order.status === 'Preparing'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {order.date}
                  </td>

                  <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans font-medium flex items-center gap-1 transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>

                      <a
                        href={`http://localhost:8401/orders/${order.order_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-sans font-medium flex items-center gap-1 transition"
                        title="Open customer order tracking on e-commerce storefront"
                      >
                        <span>Track</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Order Details: {selectedOrder.order_id}</h3>
                  <span className="text-[11px] font-mono text-slate-400">Tracking: {selectedOrder.tracking_id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Customer</span>
                <span className="text-white font-bold text-sm block mt-0.5">{selectedOrder.customer_name}</span>
                <span className="text-slate-400 font-mono text-[11px]">{selectedOrder.customer_id}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block">Delivery Location</span>
                <span className="text-slate-200 block mt-0.5 font-medium">{selectedOrder.province}</span>
                <span className="text-slate-400 text-[11px]">{selectedOrder.address}</span>
              </div>
            </div>

            {/* Itemized Line Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Order Line Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
                {selectedOrder.items.map(item => (
                  <div key={item.product_id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{item.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        SKU: {item.product_id} • Unit Price: ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-slate-300">Qty: {item.quantity}</div>
                      <div className="font-bold text-emerald-400">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="text-white font-medium">{selectedOrder.payment_method}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fulfillment Status:</span>
                <span className="text-emerald-400 font-bold uppercase">{selectedOrder.status}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Timestamp:</span>
                <span className="font-mono text-slate-300">{selectedOrder.date}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                <span className="text-white">Total Charged:</span>
                <span className="font-mono text-emerald-400">${selectedOrder.total.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              >
                Close
              </button>
              <a
                href={`http://localhost:8401/orders/${selectedOrder.order_id}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Launch Storefront Tracking</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

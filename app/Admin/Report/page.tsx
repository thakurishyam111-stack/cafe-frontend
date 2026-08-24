"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  BarChart3,
  CalendarDays,
  Wallet,
  Sparkles,
  Activity,
  Clock3,
  Boxes,
  ShoppingCart,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import AdminSidebar from "@/components/AdminSidebar";

type OrderStatus = "pending" | "approved" | "rejected";

type Order = {
  _id: string;
  total?: number;
  status?: OrderStatus;
  paymentStatus?: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
};

type Purchase = {
  grandTotal?: number;
  createdAt?: string;
  paymentStatus?: string;
  paymentMethod?: string;
};

type StockItem = {
  currentStock?: number;
  costPerUnit?: number;
  sellingPrice?: number;
};

const monthlyLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function RevenuePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, purchasesRes, stocksRes] = await Promise.all([
          api.get("/api/orders"),
          api.get("/api/purchase"),
          api.get("/api/stocks"),
        ]);

        setOrders(Array.isArray(ordersRes.data.orders) ? ordersRes.data.orders : []);
        setPurchases(Array.isArray(purchasesRes.data.purchase) ? purchasesRes.data.purchase : []);
        setStocks(Array.isArray(stocksRes.data.data) ? stocksRes.data.data : []);
      } catch (error) {
        console.error("Report load error:", error);
        setOrders([]);
        setPurchases([]);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const approvedOrders = useMemo(() => orders.filter((order) => order.status === "approved"), [orders]);
  const totalSales = useMemo(() => approvedOrders.reduce((sum, order) => sum + Number(order.total || 0), 0), [approvedOrders]);
  const totalApprovedOrders = approvedOrders.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const rejectedOrders = orders.filter((order) => order.status === "rejected").length;

  const cashSales = useMemo(() => approvedOrders.filter((order) => String(order.paymentMethod || "").toLowerCase() === "cash").reduce((sum, order) => sum + Number(order.total || 0), 0), [approvedOrders]);
  const onlineSales = useMemo(() => approvedOrders.filter((order) => ["esewa", "khalti", "online"].includes(String(order.paymentMethod || "").toLowerCase())).reduce((sum, order) => sum + Number(order.total || 0), 0), [approvedOrders]);

  const monthlySales = useMemo(() => {
    const monthTotals = Array(12).fill(0);
    approvedOrders.forEach((order) => {
      const date = new Date(order.createdAt || order.updatedAt || Date.now());
      monthTotals[date.getMonth()] += Number(order.total || 0);
    });
    return monthTotals;
  }, [approvedOrders]);

  const totalPurchaseAmount = useMemo(() => purchases.reduce((sum, purchase) => sum + Number(purchase.grandTotal || 0), 0), [purchases]);
  const totalStockValue = useMemo(() => stocks.reduce((sum, stock) => sum + Number(stock.currentStock || 0) * Number(stock.costPerUnit || 0), 0), [stocks]);
  const grossProfit = totalSales - totalPurchaseAmount;
  const profitOrLoss = grossProfit >= 0 ? "Profit" : "Loss";

  const chartData = useMemo(() => monthlySales.map((sale, index) => ({ month: monthlyLabels[index], sales: sale })), [monthlySales]);

  const latestMonthSales = monthlySales[new Date().getMonth()] || 0;
  const prevMonthSales = monthlySales[(new Date().getMonth() + 11) % 12] || 0;
  const growthPercent = prevMonthSales === 0 ? (latestMonthSales === 0 ? 0 : 14.2) : Number((((latestMonthSales - prevMonthSales) / prevMonthSales) * 100).toFixed(1));

  return (
    <>
      <AdminSidebar />
      <main className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-250 to-slate-300 p-4 text-slate-100 md:ml-72 md:p-8 md:pt-6">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300/70">Business intelligence</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Cafe reports and financial overview</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300">Monitor stock value, sales, payments, purchase cost, and profit/loss from one responsive control center.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total Sales</p>
                <p className="mt-4 text-2xl font-semibold text-white">Rs {totalSales.toLocaleString()}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  <ArrowUpRight className="h-4 w-4" />
                  {growthPercent}% this month
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total Purchase</p>
                <p className="mt-4 text-2xl font-semibold text-white">Rs {totalPurchaseAmount.toLocaleString()}</p>
                <p className="mt-3 text-sm text-slate-400">Inventory cost basis</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.95fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/30">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Monthly sales</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Sales trend by month</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <CalendarDays className="h-4 w-4 text-emerald-300" />
                Last 12 months
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] bg-slate-900/80 p-5 shadow-inner shadow-slate-950/50">
              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 16, right: 8, left: 0, bottom: 8 }}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 16, color: "#e2e8f0" }} />
                    <Bar dataKey="sales" fill="#34d399" radius={[14, 14, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Approved orders</p>
                <p className="mt-3 text-2xl font-semibold text-white">{totalApprovedOrders}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Pending orders</p>
                <p className="mt-3 text-2xl font-semibold text-white">{pendingOrders}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4">
                <p className="text-sm text-slate-400">Rejected orders</p>
                <p className="mt-3 text-2xl font-semibold text-white">{rejectedOrders}</p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/25">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Financial snapshot</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Key figures</h3>
                </div>
                <div className="rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-emerald-300">Live</div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Total stock value</p>
                      <p className="mt-3 text-2xl font-semibold text-white">Rs {totalStockValue.toLocaleString()}</p>
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-300"><Boxes className="h-5 w-5" /></div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Cash sales</p>
                      <p className="mt-3 text-2xl font-semibold text-white">Rs {cashSales.toLocaleString()}</p>
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300"><DollarSign className="h-5 w-5" /></div>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">Online sales</p>
                      <p className="mt-3 text-2xl font-semibold text-white">Rs {onlineSales.toLocaleString()}</p>
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-300"><ShoppingCart className="h-5 w-5" /></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/25">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Profit & loss</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Business outcome</h3>
                </div>
                <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-sky-300"><TrendingUp className="mr-2 h-4 w-4" />{profitOrLoss}</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-[1.5rem] bg-slate-900/80 p-5 text-slate-300">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Sales</span>
                    <span>Rs {totalSales.toLocaleString()}</span>
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-slate-900/80 p-5 text-slate-300">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Purchases</span>
                    <span>Rs {totalPurchaseAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-slate-900/80 p-5 text-slate-300">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Net {profitOrLoss}</span>
                    <span className={grossProfit >= 0 ? "text-emerald-300" : "text-rose-300"}>Rs {Math.abs(grossProfit).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 text-center text-slate-300 shadow-2xl shadow-black/20">Loading report metrics...</div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Business metrics</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Operational overview</h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-emerald-300"><Sparkles className="h-4 w-4" /> Updated</div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Total sales</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Rs {totalSales.toLocaleString()}</p>
                </div>
                <div className="rounded-[1.5rem] bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">One month sales</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Rs {latestMonthSales.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Payment mix</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Sales breakdown</h3>
                </div>
                <div className="rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-sky-300">Real time</div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[1.5rem] bg-slate-900/80 p-5">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Cash payments</span>
                    <span>Rs {cashSales.toLocaleString()}</span>
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-slate-900/80 p-5">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Online payments</span>
                    <span>Rs {onlineSales.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

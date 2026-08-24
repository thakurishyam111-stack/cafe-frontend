"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import StatCard from "@/components/Dashboard/StatCard";
import LowStockAlert from "@/components/Dashboard/LowStockAlert";
import QuickActions from "@/components/Dashboard/QuickActions";
import RecentOrders from "@/components/Dashboard/RecentOrders";
import SummaryItem from "@/components/Dashboard/SummaryItem";
import SimpleChart from "@/components/Dashboard/SimpleChart";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Users,
  Coffee,
  Table2,
  ChefHat,
  Plus,
  Eye,
  BarChart3,
  Zap,
} from "lucide-react";

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  email?: string;
  items: Array<{
    title: string;
    quantity: number;
    price?: number;
  }>;
  total: number;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt?: string;
}

export default function PremiumDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // AUTH CHECK
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/Admin/Login");
      return;
    }

    fetchOrders();

    // Refresh orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [router]);

  // ======================
  // FETCH ORDERS
  // ======================
  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders");
      const data = res.data?.orders;
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.log("Fetch Error:", error?.message || error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // APPROVE ORDER
  // ======================
  const approveOrder = async (id: string) => {
    try {
      await api.put(`/api/orders/approve/${id}`, {});
      fetchOrders();
    } catch (err: any) {
      console.log("Approve Error:", err?.message || err);
    }
  };

  // ======================
  // REJECT ORDER
  // ======================
  const rejectOrder = async (id: string) => {
    try {
      await api.put(`/api/orders/reject/${id}`, {});
      fetchOrders();
    } catch (err: any) {
      console.log("Reject Error:", err?.message || err);
    }
  };

  // ======================
  // SAFE DATA
  // ======================
  const safeOrders = Array.isArray(orders) ? orders : [];

  // ======================
  // STATS CALCULATION
  // ======================
  const totalOrders = safeOrders.length;
  const pendingOrders = safeOrders.filter((o) => o.status === "pending").length;
  const approvedOrders = safeOrders.filter((o) => o.status === "approved").length;
  const completedOrders = safeOrders.filter((o) => o.status === "completed").length;
  const rejectedOrders = safeOrders.filter((o) => o.status === "rejected").length;

  const totalRevenue = safeOrders
    .filter((o) => o.status === "approved" || o.status === "completed")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const todaySales = safeOrders
    .filter((o) => {
      const orderDate = new Date(o.createdAt || "");
      const today = new Date();
      return (
        orderDate.toDateString() === today.toDateString() &&
        (o.status === "approved" || o.status === "completed")
      );
    })
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const netProfit = totalRevenue * 0.65; // Assuming 35% cost
  const lowStockItems = [
    {
      id: "1",
      name: "Arabica Coffee Beans",
      currentStock: 5,
      minimumStock: 20,
      unit: "kg",
      percentage: 25,
    },
    {
      id: "2",
      name: "Fresh Milk",
      currentStock: 8,
      minimumStock: 25,
      unit: "liters",
      percentage: 32,
    },
    {
      id: "3",
      name: "Chocolate Syrup",
      currentStock: 3,
      minimumStock: 15,
      unit: "bottles",
      percentage: 20,
    },
  ];

  // Chart Data
  const salesData = [
    { label: "Monday", value: 45000, color: "bg-green-500" },
    { label: "Tuesday", value: 52000, color: "bg-green-500" },
    { label: "Wednesday", value: 48000, color: "bg-green-500" },
    { label: "Thursday", value: 61000, color: "bg-green-500" },
    { label: "Friday", value: 55000, color: "bg-green-500" },
    { label: "Saturday", value: 73000, color: "bg-green-500" },
    { label: "Sunday", value: 68000, color: "bg-green-500" },
  ];

  const orderStatusData = [
    { label: "Pending", value: pendingOrders, color: "bg-yellow-500" },
    { label: "Approved", value: approvedOrders, color: "bg-green-500" },
    { label: "Completed", value: completedOrders, color: "bg-blue-500" },
    { label: "Rejected", value: rejectedOrders, color: "bg-red-500" },
  ];

  // Quick Actions
  const quickActions = [
    {
      icon: Plus,
      label: "New Order",
      href: "/Admin/Order",
      color: "green" as const,
      description: "Create a new order",
    },
    {
      icon: Users,
      label: "Add Customer",
      href: "/Admin/Customer",
      color: "blue" as const,
      description: "Register new customer",
    },
    {
      icon: Coffee,
      label: "Add Menu Item",
      href: "/Admin/Menu",
      color: "orange" as const,
      description: "Add to menu",
    },
    {
      icon: Table2,
      label: "Manage Tables",
      href: "/Admin/Tables",
      color: "purple" as const,
      description: "Table reservations",
    },
    {
      icon: ChefHat,
      label: "View Kitchen",
      href: "/Kitchen",
      color: "pink" as const,
      description: "Kitchen orders",
    },
    {
      icon: BarChart3,
      label: "View Reports",
      href: "/Admin/Report",
      color: "indigo" as const,
      description: "Analytics & reports",
    },
  ];

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500/30 border-t-green-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // ======================
  // UI
  // ======================
  return (
    <>
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-4 md:p-8 md:ml-72">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            The Deurali Cafe
          </h1>
          <p className="text-gray-400 text-lg">
            ☕ Welcome back! Here's your business overview for today
          </p>
        </div>

        {/* TOP KPIs - 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon={ShoppingCart}
            label="💰 Today's Sales"
            value={`Rs ${todaySales.toLocaleString()}`}
            color="green"
            trend={12}
            description="vs yesterday"
          />
          <StatCard
            icon={TrendingUp}
            label="🧾 Total Orders"
            value={totalOrders}
            color="blue"
            description={`${pendingOrders} pending`}
          />
          <StatCard
            icon={Clock}
            label="⏳ Pending Orders"
            value={pendingOrders}
            color="yellow"
            description="Requires action"
          />
          <StatCard
            icon={TrendingUp}
            label="💵 Net Profit"
            value={`Rs ${netProfit.toLocaleString()}`}
            color="purple"
            trend={8}
            description="Estimated margin"
          />
        </div>

        {/* MAIN GRID - Quick Actions + Charts + Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* LEFT COLUMN - Quick Actions */}
          <div className="lg:col-span-3">
            <QuickActions actions={quickActions} />
          </div>
        </div>

        {/* CHARTS ROW - Sales Overview and Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleChart
            title="Sales Overview"
            icon="📈"
            data={salesData}
            format={(v) => `Rs ${(v / 1000).toFixed(0)}k`}
          />
          <SimpleChart
            title="Order Status"
            icon="🍩"
            data={orderStatusData}
          />
        </div>

        {/* ALERTS & SUMMARY ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Low Stock Alert - Spans 2 columns */}
          <div className="lg:col-span-2">
            <LowStockAlert items={lowStockItems} />
          </div>

          {/* Summary Cards - Right Column */}
          <div className="grid grid-cols-1 gap-4">
            <SummaryItem
              icon={Users}
              label="👥 Customers"
              count={127}
              color="blue"
              href="/Admin/Customer"
              description="Active customers"
            />
            <SummaryItem
              icon={Coffee}
              label="☕ Menu Items"
              count={42}
              color="orange"
              href="/Admin/Menu"
              description="Available items"
            />
            <SummaryItem
              icon={Table2}
              label="🪑 Tables"
              count={12}
              color="purple"
              href="/Admin/Tables"
              description="Total capacity"
            />
            <SummaryItem
              icon={ChefHat}
              label="👨‍🍳 Kitchen"
              count={3}
              color="pink"
              href="/Kitchen"
              description="Active staff"
            />
          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="mb-8">
          <RecentOrders
            orders={safeOrders}
            onApprove={approveOrder}
            onReject={rejectOrder}
            loading={loading}
          />
        </div>

        {/* BOTTOM SECTION - Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-green-300 text-sm font-medium mb-2">✅ Approved</p>
            <p className="text-3xl font-bold text-white">{approvedOrders}</p>
            <p className="text-xs text-gray-400 mt-3">Ready to serve</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-red-300 text-sm font-medium mb-2">❌ Rejected</p>
            <p className="text-3xl font-bold text-white">{rejectedOrders}</p>
            <p className="text-xs text-gray-400 mt-3">Needs review</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-blue-300 text-sm font-medium mb-2">🎯 Completion</p>
            <p className="text-3xl font-bold text-white">
              {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-400 mt-3">Success rate</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-yellow-300 text-sm font-medium mb-2">⚡ Avg Order</p>
            <p className="text-3xl font-bold text-white">
              Rs{" "}
              {totalOrders > 0
                ? Math.round(totalRevenue / totalOrders)
                : 0}
            </p>
            <p className="text-xs text-gray-400 mt-3">Average value</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            © 2024 The Deurali Cafe • Premium Management System
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </main>
    </>
  );
}

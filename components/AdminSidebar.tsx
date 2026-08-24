"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Coffee,
  Wallet,
  Users,
  LogOut,
  Menu,
  X,
  Flame,
  Warehouse,
  User2,
  ChefHat,
  Trash,
} from "lucide-react";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    // Get admin data from localStorage
    const name = localStorage.getItem("adminName") || "";
    const email = localStorage.getItem("adminEmail") || "";
    setAdminName(name);
    setAdminEmail(email);
  }, []);

  const menuItems = [
    {
      label: "Dashboard",
      href: "/Admin/Dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Customers",
      href: "/Admin/Customer",
      icon: Users,
    },
    {
      label: "Orders",
      href: "/Admin/Order",
      icon: ShoppingCart,
    },
    {
      label: "Menu",
      href: "/Admin/Menu",
      icon: Coffee,
    },

    {
      label: "Today-special",
      href: "/Admin/Today-special",
      icon: Flame,
    },
    {
      label: "Staffs",
      href: "/Admin/Staff",
      icon: User2,
    },
   
    {
      label: "Stock",
      href: "/Admin/Stock",
      icon: Warehouse,
    },
    {
      label: "Suppliers",
      href: "/Admin/Suppliers",
      icon: Warehouse,
    },
    
    {
      label: "Purchase",
      href: "/Admin/Purchase",
      icon: ShoppingCart,
    },
    {
      label: "Recipe",
      href: "/Admin/Recipe",
      icon: ChefHat,
    },
    {
      label: "Wasteg",
      href: "/Admin/Waste",
      icon: Trash,
    },
    {
      label: "Report",
      href: "/Admin/Report",
      icon: Wallet,
    },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/Admin/Login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-green-500 p-2 rounded-lg text-white hover:bg-green-600 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 w-72 h-screen bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 p-6 transition-transform duration-300 ease-in-out z-50 overflow-y-auto md:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-2">
            Deurali Cafe
          </h1>
          <p className="text-gray-400 text-sm">Admin Dashboard</p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8"></div>

        {/* User Info */}
        {adminName && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
            <p className="text-gray-400 text-center text-xs uppercase tracking-wider mb-1">
              Logged in as
            </p>
            <p className="text-white font-semibold truncate">{adminName}</p>
            <p className="text-gray-400 text-xs truncate">{adminEmail}</p>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} className="text-red-500" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

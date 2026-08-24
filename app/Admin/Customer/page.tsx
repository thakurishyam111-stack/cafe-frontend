"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Trash2, Phone, User, AlertCircle } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

type CustomerSummary = {
  _id: string;
  customerName: string;
  phone: string;
  totalOrders: number;
  lastOrder: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/orders");

      const orders = res.data.orders as Array<{
        _id: string;
        customerName: string;
        phone: string;
        createdAt: string;
      }>;

      const uniqueCustomers = orders.reduce((acc: CustomerSummary[], order) => {
        const exists = acc.find((c) => c.phone === order.phone);

        if (!exists) {
          acc.push({
            _id: order._id,
            customerName: order.customerName,
            phone: order.phone,
            totalOrders: 1,
            lastOrder: order.createdAt,
          });
        } else {
          exists.totalOrders += 1;
        }

        return acc;
      }, []);

      setCustomers(uniqueCustomers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();

    const interval = setInterval(() => {
      fetchCustomers();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const deleteCustomerOrders = async (phone: string) => {
    const confirmDelete = window.confirm("Delete all orders of this customer?");

    if (!confirmDelete) return;

    try {
      const res = await api.get("/api/orders");

      const customerOrders = res.data.orders.filter((o: { phone: string }) => o.phone === phone);

      await Promise.all(
        customerOrders.map((o: { _id: string }) =>
          api.delete(`/api/orders/${o._id}`),
        ),
      );

      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading)
    return (
      <>
        <AdminSidebar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white flex items-center justify-center md:ml-72">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading Customers...</p>
          </div>
        </div>
      </>
    );

  return (
    <>
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-4 md:p-8 md:pt-6 md:ml-72">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Customers</h1>
          <p className="text-gray-400">Manage and track your customers 👥</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Customers */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6 rounded-xl hover:border-blue-500/40 transition-all duration-300">
            <p className="text-blue-300 text-sm font-medium">Total Customers</p>
            <p className="text-3xl font-bold mt-2">{customers.length}</p>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 p-6 rounded-xl hover:border-green-500/40 transition-all duration-300">
            <p className="text-green-300 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold mt-2">
              {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </p>
          </div>

          {/* Avg Orders per Customer */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 p-6 rounded-xl hover:border-purple-500/40 transition-all duration-300">
            <p className="text-purple-300 text-sm font-medium">
              Avg Orders/Customer
            </p>
            <p className="text-3xl font-bold mt-2">
              {customers.length > 0
                ? (
                    customers.reduce((sum, c) => sum + c.totalOrders, 0) /
                    customers.length
                  ).toFixed(1)
                : "0"}
            </p>
          </div>
        </div>

        {/* CUSTOMERS TABLE */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold">Customer List</h2>
          </div>

          {customers.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Customer Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Total Orders
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Last Visit
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.phone}
                      className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <User size={18} className="text-white" />
                          </div>
                          <span className="font-medium">
                            {customer.customerName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone size={16} className="text-blue-400" />
                          <a
                            href={`tel:${customer.phone}`}
                            className="hover:text-blue-400 transition-colors"
                          >
                            {customer.phone}
                          </a>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-semibold">
                          {customer.totalOrders}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center text-gray-300">
                        {new Date(customer.lastOrder).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => deleteCustomerOrders(customer.phone)}
                          className="inline-flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg transition-colors duration-200 border border-red-500/30"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Phone,
  Table,
  AlertCircle,
  CarTaxiFront,
  ShoppingCart,
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders");
      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Approved controlling
  const approveOrder = async (id: string) => {
    // 1. Current order पत्ता लगाउने (status checking)
    const targetOrder = orders.find((o) => o._id === id);
    const currentStatus = targetOrder?.status || targetOrder?.orderStatus;

    // Control Check 1: Paid अर्डर Approve गर्न नदिने (Syntax Fix: } यहाँ मिलाइएको छ)
    if (targetOrder?.paymentStatus === "paid") {
      window.alert("Cannot approve an order that has already been paid.");
      return;
    }

    // Control Check 2: Cancelled वा Rejected अर्डर Approve गर्न नदिने
    if (currentStatus === "cancelled" || currentStatus === "rejected") {
      window.alert(
        `Cannot approve order because it is already ${currentStatus}.`
      );
      return;
    }

    try {
      const { data } = await api.put(`/api/orders/approve/${id}`);

      if (!data.success && data.canceled) {
        window.alert(data.message || "Order canceled due to missing stock.");
      }

      fetchOrders();
    } catch (error: any) {
      window.alert(
        error?.response?.data?.message || "Unable to approve order."
      );
      console.log(error);
    }
  };

  // Reject controlling
  const rejectOrder = async (id: string) => {
    // 1. Current order पत्ता लगाउने
    const targetOrder = orders.find((o) => o._id === id);
    const currentStatus = targetOrder?.status || targetOrder?.orderStatus;

    // 2. Control Check 1: Paid अर्डर Reject गर्न नदिने
    if (targetOrder?.paymentStatus === "paid") {
      window.alert("Cannot reject an order that has already been paid.");
      return;
    }

    // 3. Control Check 2: Approved, Cancelled वा Rejected भइसकेको अर्डर Reject गर्न नदिने
    if (
      currentStatus === "approved" ||
      currentStatus === "cancelled" ||
      currentStatus === "rejected"
    ) {
      window.alert(
        `Cannot reject order because it is already ${currentStatus}.`
      );
      return;
    }

    try {
      await api.put(`/api/orders/reject/${id}`);
      fetchOrders();
    } catch (error: any) {
      window.alert(error?.response?.data?.message || "Unable to reject order.");
      console.log(error);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { data } = await api.put(`/api/orders/${id}/status`, { status });

      if (!data.success && data.canceled) {
        window.alert(data.message || "Order canceled due to missing stock.");
      }

      fetchOrders();
    } catch (error: any) {
      window.alert(
        error?.response?.data?.message || "Unable to update order status."
      );
      console.log(error);
    }
  };

  const deleteOrder = async (id: string) => {
    const ok = window.confirm("Delete this order?");

    if (!ok) return;

    try {
      await api.delete(`/api/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-4 md:p-8 md:pt-6 md:ml-72">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Orders</h1>
          <p className="text-gray-200">Manage and track all customer orders</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6 rounded-xl hover:border-blue-500/40 transition-all duration-300">
            <p className="text-blue-300 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold mt-2">{orders.length}</p>
          </div>

          {/* Approved */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 p-6 rounded-xl hover:border-green-500/40 transition-all duration-300">
            <p className="text-green-300 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold mt-2">
              {
                orders.filter((o) => (o.status || o.orderStatus) === "approved")
                  .length
              }
            </p>
          </div>

          {/* Pending */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 p-6 rounded-xl hover:border-yellow-500/40 transition-all duration-300">
            <p className="text-yellow-300 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold mt-2">
              {
                orders.filter((o) => (o.status || o.orderStatus) === "pending")
                  .length
              }
            </p>
          </div>

          {/* Paid */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 p-6 rounded-xl hover:border-purple-500/40 transition-all duration-300">
            <p className="text-purple-300 text-sm font-medium">Paid</p>
            <p className="text-3xl font-bold mt-2">
              {orders.filter((o) => o.paymentStatus === "paid").length}
            </p>
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold">Orders List</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Bill No
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Table
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Items
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    // 1. Status extraction
                    const status = order.status || order.orderStatus;

                    // 2. Button Control Variables
                    const isCancelledOrRejected =
                      status === "cancelled" || status === "rejected";
                    const isApproved = status === "approved";
                    const isPaid = order.paymentStatus === "paid";

                    // Update: Paid हुँदा पनि Approve बटन Disable हुने बनाइयो
                    const isApproveDisabled = isCancelledOrRejected || isPaid;
                    const isRejectDisabled =
                      isPaid || isApproved || isCancelledOrRejected;

                    return (
                      <tr
                        key={order._id}
                        className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 font-medium text-green-400">
                          #{order.billNo}
                        </td>

                        <td className="px-6 py-4 font-medium">
                          {order.customerName}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Phone size={16} className="text-blue-400" />
                            <a
                              href={`tel:${order.phone}`}
                              className="hover:text-blue-400 transition-colors"
                            >
                              {order.phone}
                            </a>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 text-gray-300">
                            <Table size={16} className="text-orange-400" />
                            {order.number}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300">
                            {order.items
                              ?.slice(0, 10)
                              .map((item: any, index: number) => (
                                <div key={index}>
                                  {item.title} (×{item.quantity})
                                </div>
                              ))}
                            {order.items?.length > 10 && (
                              <div className="text-gray-400">
                                +{order.items.length - 10} more
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center font-semibold text-green-400">
                          Rs {order.total}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                              status === "approved"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : status === "rejected"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            }`}
                          >
                            {status
                              ? status.charAt(0).toUpperCase() + status.slice(1)
                              : "Pending"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                              order.paymentStatus === "paid"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                            }`}
                          >
                            {order.paymentStatus
                              ? order.paymentStatus.charAt(0).toUpperCase() +
                                order.paymentStatus.slice(1)
                              : "Unpaid"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center">
                            {/* Approve Button */}
                            <button
                              onClick={() => approveOrder(order._id)}
                              disabled={isApproveDisabled}
                              className={`p-2 rounded-lg transition-colors border ${
                                isApproveDisabled
                                  ? "bg-gray-500/10 text-gray-500 border-gray-500/20 cursor-not-allowed opacity-50"
                                  : "bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                              }`}
                              title={
                                isPaid
                                  ? "Cannot approve paid order"
                                  : isCancelledOrRejected
                                    ? `Cannot approve ${status} orders`
                                    : "Approve"
                              }
                            >
                              <CheckCircle size={18} />
                            </button>

                            {/* Reject Button */}
                            <button
                              onClick={() => rejectOrder(order._id)}
                              disabled={isRejectDisabled}
                              className={`p-2 rounded-lg transition-colors border ${
                                isRejectDisabled
                                  ? "bg-gray-500/10 text-gray-500 border-gray-500/20 cursor-not-allowed opacity-50"
                                  : "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-500/30"
                              }`}
                              title={
                                isCancelledOrRejected
                                  ? `Cannot reject ${status} orders`
                                  : isPaid
                                    ? "Cannot reject paid orders"
                                    : isApproved
                                      ? "Cannot reject approved orders"
                                      : "Reject"
                              }
                            >
                              <XCircle size={18} />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => deleteOrder(order._id)}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-colors border border-red-500/30"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
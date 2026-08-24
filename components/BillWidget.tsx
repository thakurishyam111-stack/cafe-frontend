"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";

export default function BillWidget({ isOpen, onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paying, setPaying] = useState(false);

  // ======================
  // FETCH ALL BILLS FOR CUSTOMER
  // ======================
  const fetchBill = async () => {
    if (!customerName || !phone) {
      setMessage("Please enter both Name and Phone Number");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setOrdersList([]);

      const res = await api.get("/api/orders");
      const allOrders = res.data.orders || [];

      const inputName = customerName.trim().toLowerCase();
      const inputPhone = phone.trim();

      // १. पहिले नै 'paid' भइसकेका बिलहरूलाई कुनै पनि हालतमा नदेखाउने
      const matchedOrders = allOrders.filter((ord) => {
        const dbName = ord.customerName
          ? ord.customerName.trim().toLowerCase()
          : "";
        const dbPhone = ord.phone ? ord.phone.toString().trim() : "";

        return (
          dbName === inputName &&
          dbPhone === inputPhone &&
          ord.paymentStatus !== "paid"
        );
      });

      if (matchedOrders.length > 0) {
        setOrdersList(matchedOrders);
      } else {
        setMessage("No active unpaid bills found for this user");
      }
    } catch (error) {
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const visibleBillStatuses = new Set([
    "approved",
    "preparing",
    "ready_to_serve",
    "served",
  ]);

  const unpaidBills = ordersList.filter((ord) => {
    const orderStatus = String(ord.status || "")
      .trim()
      .toLowerCase();
    return ord.paymentStatus !== "paid" && visibleBillStatuses.has(orderStatus);
  });

  // सबै Unpaid बिलहरूको कुल जम्मा रकम (Grand Total)
  const grandTotal = unpaidBills.reduce(
    (sum, ord) => sum + (Number(ord.total) || 0),
    0,
  );

  // ======================
  // BULK PAYMENT (CASH / ESEWA / KHALTI)
  // ======================
  const handleBulkPayment = async (method) => {
    if (unpaidBills.length === 0) return;

    // --- CASE A: CASH PAYMENT ---
    if (method === "Cash") {
      //
      alert("Plese go to Caher Depart for Cash payment...");
      //
    }

    // --- CASE B: ONLINE PAYMENT (eSewa / Khalti) ---
    const appUrls = {
      eSewa: "https://esewa.com.np/#/home",
      Khalti: "https://web.khalti.com/",
    };

    const appUrl = appUrls[method];
    if (appUrl) {
      // १. युजरलाई पेमेन्ट गेटवेको नयाँ ट्याबमा पठाउने
      window.open(appUrl, "_blank");

      // २. गेटवेमा रिडाइरेक्ट हुने बित्तिकै लोकल लिस्टबाट बिलहरू तुरुन्तै गायब बनाउने
      // यसले गर्दा eSewa थिचेर ब्याक आउँदा वा फेरि सर्च गर्दा यो बिल यहाँ अनपेइड अवस्थामा अड्किदैन
      setOrdersList([]);

      alert(
        `Redirecting to ${method}. Processing payment for ${unpaidBills.length} bill(s)...`,
      );
    } else {
      alert("Payment method not supported.");
    }
  };
  //cancle the order before approved
  const handleCancel = async (orderId) => {
    try {
      const res = await api.put(`/api/orders/${orderId}/cancel`)

      alert("Order cancelled successfully");

      // Order list फेरि refresh गर्ने
      await fetchBill();
      
    } catch (error) {
      console.log(error)
      console.error("Cancel error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      {/* १. ब्याकड्रप ओभरले */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/60  transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* २. साइड नोटीफिकेसन बार */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-slate-400 text-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* हेडर सेक्सन */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div>
            <h2 className="text-base font-bold text-amber-400 tracking-wide font-serif italic text-xl">
              Mero Deurali Cafe
            </h2>
            <p className=" text-slate-200">pay your Bills</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-xl"
          >
            ✕
          </button>
        </div>

        {/* स्क्रोल हुने कन्टेन्ट बडी */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* सर्च इन्पुट बक्स */}
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800/80">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={fetchBill}
              disabled={loading}
              className="w-full mt-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold p-2.5 rounded-xl text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              {loading ? "Searching..." : "Search My Bills"}
            </button>

            {message && (
              <p className="text-red-400 text-xs mt-2.5 text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                {message}
              </p>
            )}
          </div>

          {/* छुट्टाछुट्टै बिल कार्डहरू */}
          {ordersList.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] text-slate-400 font-medium px-1">
                Active Bills ({ordersList.length}):
              </p>

              {ordersList.map((order) => {
                const orderStatus = String(order.status || "")
                  .trim()
                  .toLowerCase();
                const isVisibleStatus = visibleBillStatuses.has(orderStatus);

                return (
                  <div
                    key={order._id}
                    className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-bold text-slate-200">
                          Table: {order.number}
                        </h3>
                        <p className="text-amber-500/90 text-[10px] font-mono mt-0.5">
                          Bill No: {order.billNo}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider ${
                            orderStatus === "approved"
                              ? "bg-green-600/20 text-green-400 border border-green-500/20"
                              : orderStatus === "preparing"
                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                                : orderStatus === "ready_to_serve"
                                  ? "bg-orange-600/20 text-orange-300 border border-orange-500/20"
                                  : orderStatus === "served"
                                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/20"
                                    : "bg-yellow-600/20 text-yellow-400 border border-yellow-500/20"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider bg-red-600/20 text-red-400 border border-red-500/20">
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <hr className="my-2.5 border-slate-700/60" />

                   {orderStatus === "pending" && ( <button
                      onClick={() => handleCancel(order._id)}
                      disabled={order.status !== "pending"}
                      className="bg-red-400 rounded-xl w-full my-5 text-white h-8 text-lg text-bold "
                    >
                      Cancle Order
                    </button>)}

                    {isVisibleStatus ? (
                      <>
                        <div className="space-y-1.5">
                          {order.items?.map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-xs text-slate-300"
                            >
                              <span>
                                {item.title}{" "}
                                <span className="text-slate-500 font-mono">
                                  ×{item.quantity}
                                </span>
                              </span>
                              <span className="font-semibold text-slate-200">
                                Rs. {item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                        <hr className="my-2.5 border-slate-700/60" />
                        <div className="flex justify-between font-bold text-xs text-green-400">
                          <span>Bill Total</span>
                          <span>Rs. {order.total}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-xs text-yellow-400/80 py-1 font-medium">
                        This bill is not ready to show yet.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {unpaidBills.length > 0 && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 rounded-t-2xl shadow-inner">
            <div className="flex justify-between items-center mb-3.5 px-1">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Total Unpaid ({unpaidBills.length} Bills)
                </p>
                <h3 className="text-sm font-bold text-slate-200">
                  Grand Total Amount
                </h3>
              </div>
              <span className="text-lg font-black text-green-400">
                Rs. {grandTotal}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleBulkPayment("Cash")}
                disabled={paying}
                className="text-[11px] font-bold text-slate-900 bg-white hover:bg-slate-100 py-2.5 px-1 rounded-xl transition-all disabled:opacity-50 cursor-pointer text-center"
              >
                {paying ? "Paying..." : "💵 Cash All"}
              </button>
              <button
                onClick={() => handleBulkPayment("eSewa")}
                disabled={paying}
                className="text-[11px] font-bold text-green-400 bg-green-950/40 border border-green-900/40 hover:bg-green-900/30 py-2.5 px-1 rounded-xl transition-all cursor-pointer text-center"
              >
                💚 eSewa
              </button>
              <button
                onClick={() => handleBulkPayment("Khalti")}
                disabled={paying}
                className="text-[11px] font-bold text-purple-400 bg-purple-950/40 border border-purple-900/40 hover:bg-purple-900/30 py-2.5 px-1 rounded-xl transition-all cursor-pointer text-center"
              >
                💜 Khalti
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

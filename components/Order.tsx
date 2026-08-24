"use client";

import React from "react";
import { Trash2, X } from "lucide-react";

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummaryProps {
  activeCartItems: CartItem[];
  totalAmount: number;
  name: string;
  phone: string;
  tableNumber: string;
  submitting: boolean;
  setName: (val: string) => void;
  setPhone: (val: string) => void;
  setTableNumber: (val: string) => void;
  updateQuantity: (id: string | number, delta: number) => void;
  removeItem: (id: string | number) => void;
  clearCart: () => void;
  handleOrderSubmit: (e: React.FormEvent) => void;
}

export default function OrderSummary({
  activeCartItems,
  totalAmount,
  name,
  phone,
  tableNumber,
  submitting,
  setName,
  setPhone,
  setTableNumber,
  updateQuantity,
  removeItem,
  clearCart,
  handleOrderSubmit,
}: OrderSummaryProps) {
  return (
    <aside className="bg-slate-950 border border-slate-800 text-white rounded-[2.5rem] p-6 h-fit sticky top-6 shadow-2xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
              <span>🛒</span> Your Order
            </h2>
            <p className="text-slate-400 text-xs mt-1">Review your instant choice</p>
          </div>
          {activeCartItems.length > 0 && (
            <button
              onClick={clearCart}
              type="button"
              className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1"
            >
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>

        {/* Selected Items List */}
        <div className="mt-5 space-y-3 max-h-[340px] overflow-y-auto pr-1">
          {activeCartItems.length > 0 ? (
            activeCartItems.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800/60 rounded-2xl p-3">
                <div className="flex gap-3">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm text-slate-200 truncate">{item.name}</h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        type="button"
                        className="text-slate-500 hover:text-red-400 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5 font-medium">Rs. {item.price}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          type="button"
                          className="text-slate-400 hover:text-white font-bold px-1"
                        >
                          −
                        </button>
                        <span className="text-xs font-black px-1 text-orange-400">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          type="button"
                          className="text-slate-400 hover:text-white font-bold px-1"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-xs text-orange-300">
                        Rs. {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
              <p className="text-slate-400 text-sm font-medium">Cart Empty</p>
              <p className="text-slate-500 text-xs mt-1">Choose any fresh items to checkout</p>
            </div>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="mt-5 bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <span className="text-slate-400 text-xs block font-medium">Total Amount</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">Rs. {totalAmount}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-300 bg-slate-800 border border-slate-700/50 px-2.5 py-1 rounded-lg text-xs font-bold">
              {activeCartItems.length} Items Selected
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleOrderSubmit} className="mt-5 space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:border-orange-500 transition"
        />
        <input
          type="tel"
          placeholder="Phone Number (e.g., 98xxxxxxxx)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:border-orange-500 transition"
        />
        <input
          type="number"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          required
          className="w-full rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:border-orange-500 transition"
        />
        <button
          type="submit"
          disabled={submitting || activeCartItems.length === 0}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl transition text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Processing..." : "Confirm Secure Order"}
        </button>
      </form>
    </aside>
  );
}
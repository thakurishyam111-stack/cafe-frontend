"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


type MenuItem = {
  _id?: string | number;
  id?: string | number;
  category?: string;
  price?: number;
  quantity?: number;
  image?: string;
  title?: string;
  name?: string;
  description?: string;
};

type TableItem = {
  _id?: string;
  status?: string;
  tableNo?: string | number;
};

export default function OrderPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [number, setNumber] = useState("");
  const [billNo, setBillNo] = useState("");
  const [table, setTable] = useState<TableItem | null>(null);
  const qrToken = typeof window === "undefined"
    ? ""
    : new URLSearchParams(window.location.search).get("qrToken") || window.localStorage.getItem("tableQrToken") || "";
  const [tableVerified, setTableVerified] = useState(false);
  const [tableMessage, setTableMessage] = useState<string | null>(
    qrToken ? null : "Please scan the table QR code to confirm your table before ordering."
  );
  const [showTableSuccess, setShowTableSuccess] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Fetch Menu
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const { data } = await api.get("/api/menus");

        const items = (data?.menus || []) as MenuItem[];

        setMenus(items);

        const cartItems: MenuItem[] = items.map((item: MenuItem) => ({
          ...item,
          quantity: 0,
        }));

        setCart(cartItems);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const token = qrToken;

    if (token && typeof window !== "undefined") {
      window.localStorage.setItem("tableQrToken", token);
    }

    fetchMenus();
  }, [qrToken]);

  useEffect(() => {
    if (!qrToken) return;

    const verify = async () => {
      try {
        const { data } = await api.get(`/api/orders/qr/${encodeURIComponent(qrToken)}/active`);

        if (data?.success && data.table) {
          setTable({
            _id: data.table.id,
            tableNo: data.table.tableNo,
            status: data.table.status,
          });
          setTableVerified(true);
          setTableMessage(`Table ${data.table.tableNo} verified successfully.`);
          setShowTableSuccess(true);
        } else {
          setTableVerified(false);
          setTableMessage(data?.message || "Invalid or expired table QR code.");
        }
      } catch (error: unknown) {
        console.error(error);
        setTableVerified(false);
        setTableMessage("Unable to verify table QR code. Please try again.");
      }
    };

    verify();
  }, [qrToken]);

  // Categories
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(menus.map((item: MenuItem) => item.category).filter(Boolean) as string[]),
    ) as string[];

    return ["All", ...unique];
  }, [menus]);

  // Filter
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return cart;

    return cart.filter((item: MenuItem) => item.category === selectedCategory);
  }, [cart, selectedCategory]);

  // Update Quantity
  const updateQuantity = (id: string | number, delta: number) => {
    setCart((prev) =>
      prev.map((item: MenuItem) =>
        item._id === id || item.id === id
          ? {
              ...item,
              quantity: Math.max((item.quantity ?? 0) + delta, 0),
            }
          : item,
      ),
    );
  };

  // Remove Item
  const removeItem = (id: string | number) => {
    setCart((prev) =>
      prev.map((item: MenuItem) =>
        item._id === id || item.id === id
          ? {
              ...item,
              quantity: 0,
            }
          : item,
      ),
    );
  };

    // Clear Cart
  const clearCart = () => {
    setCart((prev: MenuItem[]) =>
      prev.map((item: MenuItem) => ({
        ...item,
        quantity: 0,
      }))
    );

    setName("");
    setPhone("");
  };

  // Total
  const total = useMemo(() => {
    return cart.reduce(
      (sum: number, item: MenuItem) => sum + (item.price ?? 0) * (item.quantity ?? 0),
      0,
    );
  }, [cart]);

  // Submit Order
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const phoneRegex = /^(97|98)\d{8}$/;

    if (!phoneRegex.test(phone)) {
      setMessage("Please enter a valid phone number.");
      return;
    }

    if (!qrToken || !tableVerified || !table) {
      setMessage("Please confirm your table QR code before placing the order.");
      return;
    }

    const selectedItems = cart.filter((item: MenuItem) => (item.quantity ?? 0) > 0);

    if (selectedItems.length === 0) {
      setMessage("Please add at least one item to the cart.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload: {
        customerName: string;
        phone: string;
        items: MenuItem[];
        total: number;
        qrToken?: string;
      } = {
        customerName: name,
        phone: phone,
        items: selectedItems,
        total: total,
      };

      if (qrToken) {
        payload.qrToken = qrToken;
      }

      const { data } = await api.post("/api/orders/create", payload);

      if (data.success) {
        setSubmitted(true);
        setBillNo(data.order.billNo);
        setNumber(data.order.number);
        setMessage(data.message || "Order placed successfully.");
      } else {
        setMessage(data.message || "Unable to place the order.");
      }
    } catch (error: unknown) {
      console.log("ORDER ERROR:", error);
      const serverMessage =
        typeof error === "object" && error !== null && "response" in error
          ? ((error as any).response?.data?.message || (error as any).response?.data?.error)
          : error instanceof Error
          ? error.message
          : "Order failed. Please try again.";
      setMessage(serverMessage || "Order failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <h1 className="text-3xl font-bold animate-pulse">Loading Menu...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-400">
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-black">
            🍽 Mero Deurali cafe
          </h1>

          <p className="text-black mt-3">Order your favorite delicious foods</p>
        </div>

        {/* Categories */}
        <div className="flex justify-center flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full transition text-black font-semibold ${
                selectedCategory === cat
                  ? "bg-amber-500 text-white"
                  : "bg-white border hover:bg-gray-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[1.5fr_0.7fr] gap-8">
          {/* LEFT */}
          <div className="max-h-[78vh] overflow-y-auto pr-2">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id || item.id}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                >
                  {/* Image */}
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    className="w-full h-56 object-cover transition duration-500 group-hover:scale-110"
                  />

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-slate-900">
                        {item.title}
                      </h2>

                      <span className="font-bold text-green-600">
                        Rs .{item.price}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 text-l mt-2 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Category */}
                    <div className="mt-4">
                      <span className="bg-slate-100 px-3 py-1 rounded-full text-l text-gray-700">
                        {item.category}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center text-gray-800 justify-between mt-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item._id ?? item.id ?? "", -1)
                          }
                          className="w-10 h-10 rounded-full bg-green-400 hover:bg-slate-300 text-xl"
                        >
                          −
                        </button>

                        <span className="font-bold text-lg w-6 text-center">
                          {item.quantity ?? 0}
                        </span>

                        <button
                          onClick={() => updateQuantity(item._id ?? item.id ?? "", 1)}
                          className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xl"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => updateQuantity(item._id ?? item.id ?? "", 1)}
                        className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT ORDER SECTION */}
          <aside className="bg-gradient-to-b bg-gray-700   text-white rounded-[2rem] p-6 h-fit  shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl text-center font-bold">
                  🛒 Your Order
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Review your selected items
                </p>
              </div>

              {cart.some((item) => (item.quantity ?? 0) > 0) && (
                <button
                  onClick={clearCart}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Items */}
            <div className="mt-6 space-y-4 overflow-y-auto pr-1 max-h-[55vh]">
              {cart.filter((item) => (item.quantity ?? 0) > 0).length > 0 ? (
                cart
                  .filter((item) => (item.quantity ?? 0) > 0)
                  .map((item) => (
                    <div
                      key={item._id || item.id}
                      className="bg-slate-800 rounded-3xl p-4"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.title}
                          className="w-20 h-20 rounded-2xl object-cover"
                        />

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-bold text-lg">{item.title}</h3>

                            <button
                              onClick={() => removeItem(item._id ?? item.id ?? "")}
                              className="text-red-400 hover:text-red-500 text-sm"
                            >
                              ✕
                            </button>
                          </div>

                          <p className="text-slate-400 text-sm">
                            Rs {item.price}
                          </p>

                          {/* Quantity */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item._id ?? item.id ?? "", -1)
                                }
                                className="w-8 h-8 rounded-full bg-slate-700"
                              >
                                −
                              </button>

                              <span className="font-bold">{item.quantity ?? 0}</span>

                              <button
                                onClick={() =>
                                  updateQuantity(item._id ?? item.id ?? "", 1)
                                }
                                className="w-8 h-8 rounded-full bg-amber-500"
                              >
                                +
                              </button>
                            </div>

                            <span className="font-bold text-amber-400">
                              Rs {((item.price ?? 0) * (item.quantity ?? 0))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="bg-slate-800 rounded-3xl p-8 text-center">
                  <div className="text-5xl mb-3"></div>

                  <h3 className="text-xl font-bold">Cart Empty</h3>

                  <p className="text-slate-400 mt-2">
                    Add some delicious foods
                  </p>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mt-6 bg-white/10 rounded-3xl p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-m text-white">
                    Total Amount
                  </p>

                  <h2 className="text-4xl font-bold text-amber-400 mt-1">
                    Rs .{total}
                  </h2>
                </div>

                <div className="text-right text-xl  text-white">
                  <p>{cart.filter((item) => (item.quantity ?? 0) > 0).length} Items</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {message && (
                <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                  {message}
                </div>
              )}

              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl bg-white text-black px-4 py-3 outline-none"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-2xl bg-white text-black px-4 py-3 outline-none"
              />

              <div className="rounded-2xl border border-white/20 bg-white/90 p-4 text-black">
                <p className="font-semibold">Table Confirmation</p>
                <p className="text-sm mt-2">
                  {tableVerified && table
                    ? `Table ${table.tableNo} confirmed via QR code.`
                    : tableMessage || "Please scan your table QR code first."}
                </p>
                {showTableSuccess && table && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-2 text-emerald-900 text-sm font-semibold">
                    ✅ Table {table.tableNo} verified
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 py-4 rounded-2xl font-bold text-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Placing Order..." : "Order"}
              </button>

            </form>
          </aside>
        </div>
      </main>

      {/* SUCCESS POPUP */}
      {submitted && (
        <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl relative">
            <button
              onClick={() => {
                setSubmitted(false);

                clearCart();

                setName("");
                setPhone("");
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-100 hover:bg-red-500 hover:text-white transition text-xl font-bold text-red-500"
            >
              ✕
            </button>
            {/* Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-5xl">✅</span>
            </div>

            {/* Text */}
            <h2 className="text-3xl font-bold text-slate-900 mt-5">
              Order Successful!
            </h2>

            <p className="text-slate-600 mt-3">
              Thank you <span className="font-bold text-gray-800">{name}</span>{" "}
              🎉
            </p>

            <p className="text-slate-500 mt-2 text-sm">
              Your delicious order is being prepared.
            </p>

            {/* Summary */}
            <div className="bg-slate-100 rounded-2xl p-4 mt-5 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Phone</span>

                <span className="font-semibold text-black">{phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-green-500">Total</span>

                <span className="font-bold text-amber-600">Rs .{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">Table Number</span>

                <span className="font-bold text-green-600">{number}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-black">Bill Number</span>

                <span className="font-bold text-green-600">{billNo}</span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => {
                setSubmitted(false);

                clearCart();

                setName("");
                setPhone("");
                setNumber("");
              }}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

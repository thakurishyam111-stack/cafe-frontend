// casher/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeDollarSign,
  CircleDollarSign,
  Receipt,
  Smartphone,
  Sparkles,
  UserRound,
  Search,
  Loader2,
  LogOut,
} from "lucide-react";
import {
  CasherUser,
  OrderData,
  fetchUnpaidOrders,
  submitOrderPayment,
} from "./casher";

const formatCurrency = (value: number) => `Rs. ${value.toLocaleString()}`;

const Page = () => {
  const router = useRouter();

  // Cashier Details State
  const [casher, setCasher] = useState<CasherUser>({
    fullName: "Cashier",
    email: "No email available",
    phone: "No phone available",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Search Inputs
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // API Data & Loading States
  const [ordersList, setOrdersList] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");

  // Payment Input States
  const [cashGiven, setCashGiven] = useState("0");
  const [discountPercent, setDiscountPercent] = useState("0");

  // १. पेज लोड हुँदा LocalStorage बाट क्यासियरको विवरण तान्ने
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem("token");
    const storedUser = window.localStorage.getItem("casherUser");

    if (!token || !storedUser) {
      router.replace("/Casher/Login");
      setAuthChecked(true);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser) as CasherUser;
      setCasher({
        id: parsed.id,
        fullName: parsed.fullName || parsed.name || "Cashier",
        email: parsed.email || "No email available",
        phone: parsed.phone || "No phone available",
      });

      console.log(parsed?.phone);
      setIsAuthenticated(true);
    } catch {
      window.localStorage.removeItem("casherUser");
      window.localStorage.removeItem("token");
      router.replace("/Casher/Login");
    } finally {
      setAuthChecked(true);
    }
  }, [router]);

  // २. अर्डरहरू खोज्ने ह्यान्डलर
  const handleFindOrder = async () => {
    try {
      setLoading(true);
      setMessage("");
      setOrdersList([]); // पुराना खोजिएका लटहरू सफा गर्ने
      const nameRegex = /^[A-Za-z\s]+$/;

      if (!nameRegex.test(customerName)) {
        setMessage("Enter Customer Name only letter");
        return;
      }

      const phoneRegex = /^(97|98)\d{8}$/;

      if (!phoneRegex.test(customerPhone)) {
        setMessage(
          "Please enter a valid phone number like 98/97 and length 10  .",
        );
        return;
      }

      const matchedOrders = await fetchUnpaidOrders(
        customerName,
        customerPhone,
      );

      if (matchedOrders.length > 0) {
        setOrdersList(matchedOrders);
      } else {
        setMessage("No active unpaid bills found for this customer.");
      }
    } catch (error: any) {
      setMessage(
        error.message || "Error connecting to server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // 'approved' भएका बिलहरू मात्र छुट्ट्याउने
  const unpaidBills = useMemo(() => {
    return ordersList.filter((ord) => ord.status === "approved");
  }, [ordersList]);

  // ३. वित्तीय हिसाब-किताब (Calculations)
  const subtotal = useMemo(
    () =>
      unpaidBills.reduce((sum, ord) => sum + (ord.subtotal || ord.total), 0),
    [unpaidBills],
  );
  const vatAmount = useMemo(
    () => unpaidBills.reduce((sum, ord) => sum + (ord.vat || 0), 0),
    [unpaidBills],
  );
  const rawGrandTotal = useMemo(
    () => unpaidBills.reduce((sum, ord) => sum + ord.total, 0),
    [unpaidBills],
  );

  const discount = (rawGrandTotal * Number(discountPercent || 0)) / 100;
  const payableAmount = rawGrandTotal - discount;
  const receivedAmount = Number(cashGiven || 0);
  const returnAmount = receivedAmount - payableAmount;

  // ४. भुक्तानी बुझाउने र डाटाहरू क्लियर गर्ने कार्य
  const handleSubmitPayment = async (method: "Cash" | "eSewa" | "Khalti") => {
    if (unpaidBills.length === 0) return;

    // --- CASH PAYMENT ---
    if (method === "Cash") {
      if (receivedAmount < payableAmount) {
        setMessage("Insufficient cash given by customer!");
        return;
      }

      try {
        setPaying(true);

        // ब्याकेन्डमा भुक्तानी पठाउने
        const paymentPromises = unpaidBills.map((ord) =>
          submitOrderPayment(ord._id, {
            method,
            cashierId: casher?.id,
            discountPercent: Number(discountPercent),
          }),
        );

        await Promise.all(paymentPromises);
        setMessage(`All ${unpaidBills.length} bill(s) paid successfully via Cash!`);

        // डाटा क्लियर गर्ने (Local States Clear)
        handleClearState();
      } catch (error) {
        setMessage("Bill payment failed. Please try again.");
      } finally {
        setPaying(false);
      }
      return;
    }

    // --- ONLINE PAYMENT (eSewa / Khalti) ---
    const appUrls = {
      eSewa: "https://esewa.com.np/#/home",
      Khalti: "https://web.khalti.com/",
    };

    const appUrl = appUrls[method];
    if (appUrl) {
      window.open(appUrl, "_blank");

      // अनलाइन गेटवेमा जाने बित्तिकै फ्रन्टइन्ड स्क्रिनलाई क्लियर गर्ने
      handleClearState();
      alert(`Redirecting to ${method} for ${unpaidBills.length} bill(s)...`);
    } else {
      alert("Payment method not supported.");
    }
  };

  // डाटाहरू सुरुवाती अवस्थामा फर्काउने साझो फङ्सन
  const handleClearState = () => {
    setOrdersList([]);
    setCustomerName("");
    setCustomerPhone("");
    setCashGiven("0");
    setDiscountPercent("0");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("casherUser");
      window.localStorage.removeItem("rememberedEmail");
    }
    setIsAuthenticated(false);
    router.replace("/Casher/Login");
  };

  if (!authChecked || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-800">
            Redirecting to cashier login...
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Please sign in to access the cashier dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Header Section */}
        <header className="mb-6 overflow-hidden rounded-[28px] bg-slate-800 text-white shadow-2xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <h1 className="text-3xl font-semibold md:text-4xl">
                Welcome back, {casher.fullName}
              </h1>
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                Search active orders via customer info, process payments
                securely, and refresh workflow in real-time.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <UserRound className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{casher.fullName}</p>
                  <p className="text-sm text-slate-300">{casher.email}</p>
                  <p className="text-sm text-slate-300">{casher.phone}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Grid */}
        <main className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          {/* Left Side: Search & Items Panel */}
          <section className="space-y-6">
            {/* Search Section */}
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 text-center">
                    Find Customer Orders
                  </h2>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Customer Name
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                  Phone Number
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </label>
              </div>

              <button
                onClick={handleFindOrder}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" /> [ Find Order ]
                  </>
                )}
              </button>

              {message && (
                <div className="mt-3 text-center text-sm font-medium text-red-500 bg-red-50 p-3 rounded-xl">
                  {message}
                </div>
              )}
            </div>

            {/* Display Found Items Section */}
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Order Items
                  </h3>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {unpaidBills.length} Bill(s) Matched
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {unpaidBills.length > 0 ? (
                  unpaidBills.map((ord) =>
                    ord.items?.map((item, index) => (
                      <div
                        key={`${ord._id}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-300"
                      >
                        {/* बायाँ साइड: ग्राहकको नाम र आइटमको विवरण */}
                        <div className="space-y-1">
                          {/* Customer Name सानो र फिक्का अक्षरमा थपिएको */}
                          <p className="text-xs font-medium uppercase tracking-wider text-green-600">
                            Welcome: {ord.customerName}
                          </p>
                          {/* Item Name */}
                          <p className="font-semibold text-slate-900 text-base p-2">
                            {item.title}
                          </p>
                          <p>{item.billNo || ""}</p>
                          {/* Quantity */}
                          <p className="text-sm text-slate-500">
                            Qty {item.quantity}
                          </p>
                        </div>

                        {/* दायाँ साइड: कुल रकम */}
                        <div className="text-right flex flex-col justify-center">
                          <p className="font-bold text-slate-900 text-base">
                            {formatCurrency(item.quantity * item.price)}
                          </p>
                        </div>
                      </div>
                    )),
                  )
                ) : (
                  <p className="text-center text-sm py-6 text-slate-400">
                    No live items to display. Use the search block above.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Right Side: Calculation & Actions Panel */}
          <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6 h-fit">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-semibold text-slate-900">
                Order payment summary
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Cash given
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="0"
                    disabled={unpaidBills.length === 0}
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white disabled:opacity-60"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Discount %
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    disabled={unpaidBills.length === 0}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white disabled:opacity-60"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    %
                  </span>
                </div>
              </label>

              {/* Financial Summary Box */}
              <div className="rounded-2xl bg-slate-950 p-4 text-white">
                <div className="flex items-center justify-between py-2 text-sm text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-sm text-slate-300">
                  <span>VAT Amount</span>
                  <span>{formatCurrency(vatAmount)}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-sm text-slate-300">
                  <span>Discount</span>
                  <span>{formatCurrency(discount)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 py-3 text-base font-semibold">
                  <span>Total payable</span>
                  <span>{formatCurrency(payableAmount)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-xl bg-white/10 px-3 py-3 text-sm">
                  <span className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-emerald-300" />
                    Return cash
                  </span>
                  <span
                    className={`font-semibold ${returnAmount >= 0 ? "text-emerald-300" : "text-rose-300"}`}
                  >
                    {formatCurrency(
                      unpaidBills.length > 0 && returnAmount > 0
                        ? returnAmount
                        : 0,
                    )}
                  </span>
                </div>
              </div>
            </div>

            {unpaidBills.length > 0 && (
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
                <div className="flex items-center gap-2 font-semibold">
                  <BadgeDollarSign className="h-4 w-4" />
                  Payment status
                </div>
                <p className="mt-2">
                  {returnAmount >= 0
                    ? "Payment is ready to complete."
                    : "Customer cash is short by " +
                      formatCurrency(Math.abs(returnAmount)) +
                      "."}
                </p>
              </div>
            )}
            <p className="mt-4 text-sm text-center text-red-500 p-2 rounded-xl">
              {message}
            </p>

            {/* Action Buttons Group */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => handleSubmitPayment("Cash")}
                disabled={unpaidBills.length === 0 || paying}
                className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {paying ? "Processing..." : "[ Submit Cash Payment ]"}
              </button>

              {unpaidBills.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSubmitPayment("eSewa")}
                    className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Pay via eSewa
                  </button>
                  <button
                    onClick={() => handleSubmitPayment("Khalti")}
                    className="rounded-2xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
                  >
                    Pay via Khalti
                  </button>
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default Page;

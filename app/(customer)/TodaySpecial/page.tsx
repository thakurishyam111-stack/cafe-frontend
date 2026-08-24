"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Sparkles, Star, Clock3, Heart, ShoppingCart, Trash2, X, CheckCircle, AlertTriangle } from "lucide-react";
import Footer from "@/components/Footer";


interface MenuItem {
  id: string | number;
  _id?: string;
  title: string;
  name?: string;
  description?: string;
  price: number;
  image?: string;
  rating?: number;
  time?: string;
  quantity: number;
  isCombo?: boolean;
}

export default function TodaySpecialPage() {
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [billNo, setBillNo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTodaySpecial();
  }, []);

  const fetchTodaySpecial = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/Today");
      const data = response.data;
      const fetchedItems = Array.isArray(data) ? data : data?.today || [];
      
      // Upgrade 1: Fallback Normalization mapping for item/combo items
      const initializedCart = fetchedItems.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        title: item.title || item.name || "Untitled Selection", 
        quantity: 0,
      }));
      
      setCart(initializedCart);
    } catch (err: any) {
      console.error("INGRESS NETWORK EXCEPTION:", err);
      setError("Unable to process the today specials registry. Please verify connection bounds.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id: string | number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity + delta, 0) } : item
      )
    );
  };

  const removeItem = (id: string | number) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: 0 } : item)));
  };

  const clearCart = () => {
    setCart((prev) => prev.map((item) => ({ ...item, quantity: 0 })));
  };

  const activeCartItems = useMemo(() => cart.filter((item) => item.quantity > 0), [cart]);
  const totalAmount = useMemo(() => {
    return activeCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [activeCartItems]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneRegex = /^(97|98)\d{8}$/;
    if (!phoneRegex.test(phone)) {
      alert("Invalid Nepalese phone format. Must start with 97 or 98 and be exactly 10 digits long.");
      return;
    }

    if (activeCartItems.length === 0) {
      alert("Your operational checkout basket is empty.");
      return;
    }

    try {
      setSubmitting(true);
      
      // Upgrade 2: Explicit Title DB Mapping inside payload
      const payloadItems = activeCartItems.map(item => ({
        itemId: item.id,
        title: item.title, 
        price: item.price,
        quantity: item.quantity,
        isCombo: item.isCombo || false
      }));

      const { data } = await api.post("/api/orders/create", {
        customerName: name.trim(),
        phone: phone.trim(),
        tableNumber: tableNumber,
        items: payloadItems,
        total: totalAmount,
      });

      if (data.success || data.order) {
        setBillNo(data.order?.billNo || Math.floor(1000 + Math.random() * 9000).toString());
        setSubmitted(true);
      } else {
        alert("Server responded with a validation layout rejection.");
      }
    } catch (err: any) {
      console.error("DISPATCH PAYLOAD ERROR:", err);
      alert("Database persistence dispatch pipeline broke down. Please re-verify parameters.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetFormState = () => {
    setSubmitted(false);
    clearCart();
    setName("");
    setPhone("");
    setTableNumber("");
    setBillNo("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-500/20">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <section className="relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-slate-950 text-white shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-amber-950/40 pointer-events-none select-none" />
          <div className="relative z-10 px-6 py-12 text-center sm:py-20">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles size={14} className="animate-spin-slow" />
              Today’s Fresh Curations
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Discover Today's Best Flavors
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-slate-400">
              Freshly prepared artisanal meals and curated breakfast combo specials directly from our kitchen tier. ☕
            </p>
          </div>
        </section>

        {error && (
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 max-w-md mx-auto">
            <AlertTriangle size={18} className="shrink-0 text-rose-500" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="mt-20 text-center space-y-3">
            <div className="h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Syncing live menu streams...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="mt-20 text-center rounded-2xl border border-dashed border-slate-200 p-12 max-w-sm mx-auto bg-white">
            <p className="text-sm font-bold text-slate-500">No Specials Running Today</p>
            <p className="text-xs text-slate-400 mt-1">Check back shortly for upcoming kitchen items.</p>
          </div>
        ) : (
          /* Upgrade 3: Fluid Grid Matrix Columns configuration */
          <div className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
            
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-102"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                      <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md ${
                        item.isCombo ? 'bg-indigo-600' : 'bg-amber-600'
                      }`}>
                        {item.isCombo ? "Value Combo" : "Daily Special"}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug truncate">
                          {item.title}
                        </h3>
                        <span className="shrink-0 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-black text-white">
                          Rs. {item.price}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description || "Made using local ingredients, hand-seasoned by our house chefs daily."}
                      </p>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-[11px] font-medium text-slate-600">
                        <div className="flex items-center gap-1">
                          <Star size={13} className="text-amber-500 fill-amber-500" />
                          <span>{item.rating || 4.7}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock3 size={13} className="text-slate-400" />
                          <span>{item.time || "12 mins"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 mt-auto flex items-center justify-between gap-3">
                    {item.quantity > 0 ? (
                      <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl w-full justify-between shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center justify-center text-xs"
                          aria-label="Decrease Quantity"
                        >
                          −
                        </button>
                        <span className="font-bold text-xs text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center justify-center text-xs"
                          aria-label="Increase Quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-bold hover:bg-slate-800 w-full transition shadow"
                      >
                        <ShoppingCart size={13} /> Add to Order
                      </button>
                    )}
                    <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-rose-600 transition-colors">
                      <Heart size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-2xl border border-slate-400 bg-white p-5 shadow-xl lg:col-span-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Your Checkout Basket</h2>
                  <p className="text-[10px] text-slate-900 mt-0.5 font-medium">Verify your selections before submittal</p>
                </div>
                {activeCartItems.length > 0 && (
                  <button 
                    onClick={clearCart} 
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {activeCartItems.length > 0 ? (
                  activeCartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between gap-3 p-2 bg-slate-50 border border-slate-200/50 rounded-xl"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Rs. {item.price} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold text-slate-700">
                          Rs. {item.price * item.quantity}
                        </span>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    No meals or combo offers selected yet
                  </div>
                )}
              </div>

              <div className="mt-4 bg-slate-900 rounded-xl p-3.5 text-white flex justify-between items-center shadow-inner">
                <span className="text-xs text-slate-400 font-medium">Grand Total Amount:</span>
                <span className="text-base font-black text-amber-400">Rs. {totalAmount}</span>
              </div>

              <form onSubmit={handleOrderSubmit} className="mt-4 space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-slate-50 outline-none focus:border-slate-900 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Mobile Contact Number</label>
                  <input
                    type="tel"
                    placeholder="98......"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-slate-50 outline-none focus:border-slate-900 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Assigned Table Number</label>
                  <input
                    type="number"
                    placeholder=".."
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs bg-slate-50 outline-none focus:border-slate-900 focus:bg-white transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || activeCartItems.length === 0}
                  className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? "Processing Pipeline..." : "Confirm Secure Order"}
                </button>
              </form>
            </aside>

          </div>
        )}
      </main>

      {submitted && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative border border-slate-100 animate-scaleUp">
            <button
              onClick={resetFormState}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 transition flex items-center justify-center text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>

            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
              <CheckCircle size={32} className="stroke-[2.5]" />
            </div>

            <h2 className="text-xl font-black text-slate-900 mt-4 tracking-tight">Order Registered!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Thank you, your selection parameters have been committed to the kitchen loop.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Customer Ident</span>
                <span className="font-bold text-slate-800">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Table Assignment</span>
                <span className="font-bold text-slate-900">Table {tableNumber}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-900 font-semibold">Aggregate Settlement</span>
                <span className="font-black text-amber-700">Rs. {totalAmount}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-200 pt-2">
                <span className="text-slate-900 font-bold">Generated Bill Token</span>
                <span className="font-mono font-black text-blue-600 text-sm">#{billNo}</span>
              </div>
            </div>

            <button
              onClick={resetFormState}
              className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
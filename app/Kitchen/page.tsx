"use client";
import { api } from "@/lib/api";
import { useEffect, useState, useRef } from "react";

// TypeScript Interface mirroring exact dynamic item-level state schema updates
interface OrderItem {
  _id: string; // Dynamic DB document reference ID
  menuId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  // ITEM-LEVEL CONTROL FIELDS ADDED
  status: "Pending" | "Preparing" | "Ready" | "Served";
  estimatedTime: number; // minutes per specific item
}

interface Order {
  _id: string;
  billNo: string;
  customerName: string;
  phone: string;
  number: number;
  items: OrderItem[];
  total: number;
  status: string; // Main aggregate status
  kitchenNote?: string;
  createdAt: string;
}

const ItemLevelKitchenKDS = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const previousOrdersCount = useRef<number>(0);

  // Sound Notification trigger when a brand new order arrives
  const playAlertSound = () => {
    try {
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5 Note
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.log("Audio feedback prevented.");
    }
  };

  const getOrders = async () => {
    try {
      const res = await api.get("/api/orders/kitchen");
      const fetchedOrders: Order[] = res.data.orders || res.data;

      

      // const kitchenOrder = fetchedOrders.filter(
      //   (order) =>
      //     (order.status === "pending" || order.status === "approved") &&
      //     order.paymentStatus !== "paid",
      // );

      // Default fallback handles state safely if items database object lack nested fields
      const normalizedOrders = fetchedOrders.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          status: item.status || "Pending",
          estimatedTime:
            item.estimatedTime !== undefined 
            ? item.estimatedTime 
            : 15,
        })),
      }));

      

      if (
        normalizedOrders.length > previousOrdersCount.current &&
        previousOrdersCount.current !== 0
      ) {
        playAlertSound();
      }

      previousOrdersCount.current = normalizedOrders.length;
      setOrders(normalizedOrders);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch fresh live data from Order API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();

    const interval = setInterval(getOrders, 10000); // Live poll sync every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // UPDATE SPECIFIC ITEM STATUS INSIDE AN ORDER
  const updateItemStatus = async (
    orderId: string,
    itemId: string,
    newStatus: any,
  ) => {
    try {
      // Optimistic state updates for smooth instant rendering feedback
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id !== orderId) return order;

          const updatedItems = order.items.map((item) =>
            item._id === itemId ? { ...item, status: newStatus } : item,
          );

          // Standard logic: check if all individual items are ready.
          // If so, update main parent order status immediately to "Ready".
          const allReady = updatedItems.every((i) => i.status === "Ready");
          const parentStatus = allReady ? "Ready" : "Preparing";

          return { ...order, items: updatedItems, status: parentStatus };
        }),
      );

      // Backend API call target: updates specific index object properties safely
      await api.put(
        `/api/orders/${orderId}/items/${itemId}`,
        {
          status: newStatus,
        },
      );
    } catch (err) {

      console.error("Failed to update dynamic item-level status status", err);
      getOrders(); // Rollback to actual database values in case of crash
    }
  };

  // UPDATE ESTIMATED PREP TIME FOR INDIVIDUAL ITEM
  const updateItemPrepTime = async (
    orderId: string,
    itemId: string,
    newTime: number,
  ) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id !== orderId) return order;
          return {
            ...order,
            items: order.items.map((item) =>
              item._id === itemId ? { ...item, estimatedTime: newTime } : item,
            ),
          };
        }),
      );

      // Backend API call payload triggers subdocument parameter dynamic changes
      await api.put(
        `/api/orders/${orderId}/items/${itemId}`,
        {
          estimatedTime: newTime,
        },
      );
    } catch (err) {
      console.error(
        "Failed to update dynamic prep time minutes on selected index", 
        err,
      );
      getOrders();
    }
  };

  // Status Style badge class mapping helper
  const getItemStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Preparing":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse";
      case "Ready":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Served":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-300 text-slate-100 flex flex-col font-sans">
      {/* Header Pipeline Area */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-black tracking-wide text-white">
            👨‍🍳 KITCHEN DISPLAY CONTROLLER
          </h1>
          <p className="text-xs text-indigo-400 mt-1">
            Status and prep-timers isolated per-item dashboard
          </p>
        </div>
        <button
          onClick={getOrders}
          className="bg-slate-800 text-xs px-4 py-2 border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all text-slate-200 rounded-lg font-semibold"
        >
          🔄 Force Fetch Sync
        </button>
      </header>

      {/* Main KDS Board Wrapper */}
      <main className="flex-1 p-6">
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 mb-2"></div>
            <p className="text-xs text-slate-400">
              Loading subdocument index parameters...
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-4 text-center max-w-md mx-auto">
            <p className="text-rose-400 text-sm font-semibold">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 border border-slate-800 rounded-2xl bg-slate-900/20 max-w-lg mx-auto">
            <span className="text-4xl block mb-2">🍜</span>
            <h3 className="text-sm font-bold text-slate-300">
              Kitchen Queue Clean
            </h3>
            <p className="text-xs text-slate-500">
              Wait for new incoming orders...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl transition-all"
              >
                {/* Header Information: Customer details & Global aggregate state */}
                <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 bg-slate-900 rounded-xl flex flex-col justify-center items-center border border-slate-800 font-mono">
                      <span className="text-[10px] text-slate-100 font-bold uppercase">
                        Table
                      </span>
                      <span className="text-sm text-amber-300 font-black">
                        {order.number}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                          #{order.billNo}
                        </span>
                        <h2 className="text-sm font-bold text-slate-100">
                          {order.customerName}
                        </h2>
                      </div>
                      <p className="text-xs text-slate-200 mt-0.5 py-2">
                        📞 {order.phone}
                      </p>
                    </div>
                  </div>

                  {/* Right hand layout showing global status and warning flags */}
                  <div className="flex items-center gap-3">
                    {order.kitchenNote && (
                      <div className="bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg text-rose-300 text-xs italic">
                        ⚠️{" "}
                        <span className="font-semibold text-rose-400 not-italic">
                          Chef Note:
                        </span>{" "}
                        {order.kitchenNote}
                      </div>
                    )}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-200 block font-semibold uppercase">
                        Overall Order State
                      </span>
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 mt-1 inline-block">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Controller - Grid Section (Where each item behaves independently) */}
                <div className="p-5 bg-slate-900/30">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
                    Item Cooking & Preparation Stages
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className={`bg-slate-950 p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all ${
                          item.status === "Ready"
                            ? "border-emerald-500/20 bg-emerald-500/[0.01]"
                            : "border-slate-800/80"
                        }`}
                      >
                        {/* Upper Segment: Item info, Category & Quantities */}
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            {item.category && (
                              <span className="text-[9px] uppercase tracking-wider font-extrabold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                {item.category}
                              </span>
                            )}
                            <h4 className="text-sm font-bold text-slate-100 mt-1.5">
                              {item.title}
                            </h4>
                          </div>

                          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-xs font-extrabold text-amber-400">
                            Qty: x{item.quantity}
                          </div>
                        </div>

                        {/* Mid Segment: Independent Item Status Badge and Timer */}
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 flex justify-between items-center gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-slate-500 uppercase font-semibold">
                              Prep Timer
                            </span>
                            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
                              <button
                                onClick={() =>
                                  updateItemPrepTime(
                                    order._id,
                                    item._id,
                                    Math.max(2, item.estimatedTime - 2),
                                  )
                                }
                                className="h-5 w-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono font-bold text-amber-400 w-12 text-center">
                                {item.estimatedTime}m
                              </span>
                              <button
                                onClick={() =>
                                  updateItemPrepTime(
                                    order._id,
                                    item._id,
                                    item.estimatedTime + 2,
                                  )
                                }
                                className="h-5 w-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[9px] text-slate-500 uppercase font-semibold">
                              Item Status
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getItemStatusBadge(item.status)}`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>

                        {/* Lower Segment: Custom Control Select Dropdown */}
                        <div className="pt-2">
                          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">
                            Update Stage
                          </label>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateItemStatus(
                                order._id,
                                item._id,
                                e.target.value as any,
                              )
                            }
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          >
                            <option value="Pending">
                              🕒 Pending (In Queue)
                            </option>
                            <option value="Preparing">
                              🔥 Preparing (Cooking)
                            </option>
                            <option value="Ready">✅ Ready (To Serve)</option>
                            <option value="Served">
                              🍽️ Served (Delivered)
                            </option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ItemLevelKitchenKDS;

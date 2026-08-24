"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Item = {
  _id?: string;
  title: string;
  quantity: number;
  price: number;
  status?: string;
};

type ActiveOrder = {
  billNo?: string;
  total?: number;
  items?: Item[];
};

export default function QROrderPage() {
  const params = useParams();
  const router = useRouter();
  const qrToken = Array.isArray(params?.qrToken)
    ? params.qrToken[0]
    : params?.qrToken || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);

  useEffect(() => {
    if (!qrToken) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/api/orders/qr/${encodeURIComponent(qrToken)}/active`);
        const data = await res.json();

        if (!res.ok || !data?.success || !data?.table) {
          setError(data?.message || "Invalid table QR code");
        } else {
          setActiveOrder(data.activeOrder);
          const destination = `/Order?qrToken=${encodeURIComponent(qrToken)}`;
          router.push(destination);
        }
      } catch {
        setError("Unable to contact backend API. Check NEXT_PUBLIC_API_URL and server status.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [qrToken, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Verifying Table QR...</h1>
      <p className="text-sm text-slate-500">Redirecting you to the order page for table confirmation.</p>

      <section className="mb-6">
        <h3 className="font-semibold">Current Order</h3>
        {!activeOrder && <p className="text-sm text-gray-500">No active order for this table.</p>}

        {activeOrder && (
          <div className="mt-3 border rounded p-3">
            <div className="mb-2">Bill: {activeOrder.billNo}</div>
            <ul className="space-y-2">
              {activeOrder.items.map((it: Item, idx: number) => (
                <li key={idx} className="flex justify-between">
                  <span>{it.title} x {it.quantity}</span>
                  <span className="text-sm text-gray-500">{it.status || "Pending"}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 font-bold">Total: Rs. {activeOrder.total}</div>
          </div>
        )}
      </section>

      <div className="flex gap-3">
        <button className="px-4 py-2 bg-amber-600 text-white rounded" onClick={() => router.push("/menu")}>Browse Menu</button>
        <button className="px-4 py-2 bg-slate-700 text-white rounded" onClick={() => router.refresh()}>Refresh</button>
      </div>
    </div>
  );
}

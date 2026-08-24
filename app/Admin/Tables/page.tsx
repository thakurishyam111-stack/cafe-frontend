"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import TableQRCode from "../../(customer)/Qr/qr";

type TableItem = {
  _id: string;
  tableNo: number;
  qrToken: string;
  status: string;
};

export default function AdminTablesPage() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const res = await apiFetch("/api/table");
        const data = await res.json();
        if (!res.ok) {
          setError(data?.message || "Failed to load tables");
        } else {
          const tableList = Array.isArray(data.table) ? data.table : [];
          setTables(tableList);
        }
      } catch (err) {
        setError("Unable to contact backend API. Check NEXT_PUBLIC_API_URL and server status.");
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  if (loading) return <div className="p-6">Loading tables...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tables & QR Codes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((t) => (
          <div key={t._id} className="bg-slate-800 p-3 rounded">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm text-slate-300">Table {t.tableNo}</div>
              <div className="text-xs text-slate-400">{t.status}</div>
            </div>
            <TableQRCode tableNo={t.tableNo} qrToken={t.qrToken} />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { Purchase, PurchaseItem } from "../Purchase/purchase";
import AdminSidebar from "@/components/AdminSidebar";

interface StockOption {
  _id: string;
  name?: string;
  unit?: string;
  costPerUnit?: number;
}

interface SupplierOption {
  _id: string;
  supplierName?: string;
  supplierCode?: string;
  name?: string;
}


export default function PurchasePage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stocks, setStocks] = useState<StockOption[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Purchase, "_id">>({
    purchaseNumber: "",
    supplier: "",
    items: [
      { stock: "", quantity: 1, unit: "pcs", purchasePrice: 0, total: 0 },
    ],
    subTotal: 0,
    discount: 0,
    grandTotal: 0,
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    paidAmount: 0,
    dueAmount: 0,
    note: "",
  });

  // Fetch Initial Data (Purchases & Stock Items)
  const fetchData = async () => {
    try {
      setLoading(true);

      const purchaseRes = await apiFetch("/api/purchase");
      const purchaseData = await purchaseRes.json();
      if (purchaseData.success) {
        setPurchases(purchaseData.purchase || purchaseData.data || []);
      }

      const supplierRes = await apiFetch("/api/supplier");
      const supplierData = await supplierRes.json();
      if (supplierData.success) {
        setSuppliers(supplierData.suppliers || supplierData.data || []);
      } else if (Array.isArray(supplierData)) {
        setSuppliers(supplierData);
      }

      const stockRes = await apiFetch("/api/stocks");
      const stockData = await stockRes.json();
      if (stockData.success) {
        setStocks(stockData.data || stockData.stocks || []);
      } else if (Array.isArray(stockData)) {
        setStocks(stockData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const calculatedTotals = useMemo(() => {
    const sub = formData.items.reduce(
      (acc, item) => acc + item.purchasePrice * item.quantity,
      0,
    );
    const grand = Math.max(0, sub - formData.discount);
    const due = Math.max(0, grand - formData.paidAmount);

    return {
      subTotal: sub,
      grandTotal: grand,
      dueAmount: due,
    };
  }, [formData.items, formData.discount, formData.paidAmount]);

  // Handle Input Changes for Dynamic Rows
  const handleItemChange = (
    index: number,
    field: keyof PurchaseItem,
    value: string | number,
  ) => {
    const updatedItems = [...formData.items];

    // यदि सामान छानियो भने, स्टक रेकर्डबाट त्यसको Unit स्वतः फर्ममा सेट गर्दिने
    if (field === "stock") {
      const selectedStock = stocks.find((s) => s._id === value);
      if (selectedStock) {
        updatedItems[index].unit = selectedStock.unit || "pcs";
        // यदि डिफल्ट कस्ट प्राइज राख्न मन छ भने:
        updatedItems[index].purchasePrice = selectedStock.costPerUnit || 0;
      }
    }

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value as PurchaseItem[keyof PurchaseItem],
    };

    if (
      field === "quantity" ||
      field === "purchasePrice" ||
      field === "stock"
    ) {
      updatedItems[index].total =
        Number(updatedItems[index].quantity) *
        Number(updatedItems[index].purchasePrice);
    }

    setFormData({ ...formData, items: updatedItems });
  };

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { stock: "", quantity: 1, unit: "pcs", purchasePrice: 0, total: 0 },
      ],
    });
  };

  const removeItemRow = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  // Submit Handler (Add / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        subTotal: calculatedTotals.subTotal,
        grandTotal: calculatedTotals.grandTotal,
        dueAmount: calculatedTotals.dueAmount,
      };

      const baseUrl = "/api/purchase";
      const url = editingPurchase
        ? `${baseUrl}/${editingPurchase._id}`
        : `${baseUrl}/add`;
      const method = editingPurchase ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message || "Purchase saved successfully.");
        setIsModalOpen(false);
        setEditingPurchase(null);
        resetForm();
        fetchData(); // टेबल र स्टक परिमाण दुवै रिफ्रेस गर्नका लागि
      } else {
        alert(data.message || "Unable to save purchase.");
      }
    } catch (error) {
      console.error("Error saving purchase:", error);
      alert("Unable to save purchase. Please check the console for details.");
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this purchase?")) {
      try {
        const res = await apiFetch(`/api/purchase/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          alert(data.message);
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting purchase:", error);
      }
    }
  };

  const handleEditClick = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    // मङ्गोडीबी अब्जेक्टबाट सिधै ID हरू मात्र फर्म स्टेटमा म्याप गर्न
    const formattedItems = purchase.items.map((item) => ({
      stock:
        typeof item.stock === "object" && item.stock !== null && "_id" in item.stock
          ? item.stock._id
          : item.stock,
      quantity: item.quantity,
      unit: item.unit,
      purchasePrice: item.purchasePrice,
      total: item.total,
    }));

    setFormData({
      ...purchase,
      supplier:
        typeof purchase.supplier === "object" && purchase.supplier !== null && "_id" in purchase.supplier
          ? purchase.supplier._id
          : purchase.supplier,
      items: formattedItems,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      purchaseNumber: "",
      supplier: "",
      items: [
        { stock: "", quantity: 1, unit: "pcs", purchasePrice: 0, total: 0 },
      ],
      subTotal: 0,
      discount: 0,
      grandTotal: 0,
      paymentMethod: "Cash",
      paymentStatus: "Paid",
      paidAmount: 0,
      dueAmount: 0,
      note: "",
    });
  };

  // स्टक आईडीबाट सामानको नाम पत्ता लगाउने हेल्पर फङ्सन (टेबलमा देखाउन)
  const getStockName = (stockField: string | { name?: string } | null | undefined) => {
    if (typeof stockField === "object" && stockField?.name) {
      return stockField.name;
    }
    const found = stocks.find((s) => s._id === stockField);
    return found?.name || "Unknown Item";
  };

  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 md:pt-6 md:ml-72 transition-all">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Purchase History
            </h1>
            <p className="text-sm text-slate-400">
              Track incoming purchases. Added purchases automatically increment
              stock levels.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingPurchase(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg transition-all"
          >
            + Add Purchase
          </button>
        </div>

        {/* Main Table View */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <th className="p-4 border-r border-slate-700/50">Bill No.</th>
                  <th className="p-4 border-r border-slate-700/50">
                    Supplier Name
                  </th>
                  <th className="p-4 border-r border-slate-700/50">
                    Items Name
                  </th>
                  <th className="p-4 border-r border-slate-700/50 text-center">
                    Quantity
                  </th>
                  <th className="p-4 border-r border-slate-700/50 text-right">
                    Price Per Unit
                  </th>
                  <th className="p-4 border-r border-slate-700/50 text-right">
                    Total
                  </th>
                  <th className="p-4 border-r border-slate-700/50 text-center">
                    Payment Status
                  </th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-slate-500">
                      Processing Database Records...
                    </td>
                  </tr>
                ) : purchases.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-slate-500">
                      No purchases found.
                    </td>
                  </tr>
                ) : (
                  purchases.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4 border-r border-slate-800 font-medium text-white">
                        {p.purchaseNumber}
                      </td>
                      <td className="p-4 border-r border-slate-800 text-slate-400">
                        {typeof p.supplier === "object" && p.supplier !== null && "name" in p.supplier
                          ? p.supplier.name
                          : p.supplier}
                      </td>
                      <td className="p-4 border-r border-slate-800">
                        {p.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-slate-300 block font-medium"
                          >
                            • {getStockName(item.stock)}
                          </div>
                        ))}
                      </td>
                      <td className="p-4 border-r border-slate-800 text-center">
                        {p.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="text-xs block text-slate-400"
                          >
                            {item.quantity} {item.unit}
                          </div>
                        ))}
                      </td>
                      <td className="p-4 border-r border-slate-800 text-right text-xs text-slate-400">
                        {p.items.map((item, idx) => (
                          <div key={idx} className="block">
                            Rs. {item.purchasePrice.toLocaleString()}
                          </div>
                        ))}
                      </td>
                      <td className="p-4 border-r border-slate-800 text-right font-semibold text-white">
                        Rs. {p.grandTotal.toLocaleString()}
                      </td>
                      <td className="p-4 border-r border-slate-800 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            p.paymentStatus === "Paid"
                              ? "bg-green-950/80 text-green-400 border border-green-800"
                              : p.paymentStatus === "Partial"
                                ? "bg-yellow-950/80 text-yellow-400 border border-yellow-800"
                                : "bg-red-950/80 text-red-400 border border-red-800"
                          }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center space-x-3">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="text-blue-400 hover:text-blue-300 font-medium text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id!)}
                          className="text-red-400 hover:text-red-300 font-medium text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal / Form Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl shadow-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-5 border-b border-slate-800 pb-3 text-white">
                {editingPurchase
                  ? "✏️ Edit Purchase Bill"
                  : "📦 Add New Purchase Bill"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Meta Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Purchase Number *</label>
                    <input
                      type="text" required
                      value={formData.purchaseNumber}
                      onChange={(e) => setFormData({ ...formData, purchaseNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 outline-none text-white text-sm"
                      placeholder="bill"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Supplier Name *
                    </label>
                    <select
                      required
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 outline-none text-white text-sm"
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>
                          {supplier.supplierName || supplier.name || supplier.supplierCode}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Payment Method
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value as Purchase["paymentMethod"],
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 outline-none text-white text-sm"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Online">Online</option>
                      <option value="Credit">Credit</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic Items Section */}
                <div className="border border-slate-800 p-4 rounded-xl bg-slate-950/40">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                      Purchase Items
                    </h3>
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="text-xs bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-md font-medium transition-all"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end border border-slate-800 p-3 rounded-lg bg-slate-900/50"
                      >
                        {/* ITEM NAME SELECT DROPDOWN */}
                        <div className="sm:col-span-4">
                          <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                            Item Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={item.stock} // वा यदि ब्याकइन्डमा नाम नै पठाउने हो भने item.itemName वा item.name राख्न सक्नुहुन्छ
                            onChange={(e) =>
                              handleItemChange(index, "stock", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm outline-none focus:border-blue-500 placeholder-slate-500"
                            placeholder="item name"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                Number(e.target.value),
                              )
                            }
                            className="w-full px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded text-white outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                            Unit
                          </label>
                          <input
                            type="text"
                            required
                            value={item.unit}
                            onChange={(e) =>
                              handleItemChange(index, "unit", e.target.value)
                            }
                            className="w-full px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded text-white outline-none focus:border-blue-500 transition-all"
                            placeholder="kg"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
                            Per Unit Price
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={item.purchasePrice}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "purchasePrice",
                                Number(e.target.value),
                              )
                            }
                            className="w-full px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded text-white outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-2 sm:pt-0">
                          <div>
                            <span className="block text-[10px] uppercase font-semibold text-slate-500">
                              Total
                            </span>
                            <span className="text-sm font-bold text-white">
                              Rs. {item.total.toLocaleString()}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItemRow(index)}
                            className="text-red-400 hover:text-red-500 text-xs font-bold p-1 bg-red-500/10 rounded hover:bg-red-500/20 transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Calculation summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Note
                    </label>
                    <textarea
                      rows={4}
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg outline-none text-sm text-white placeholder-slate-500 resize-none focus:border-blue-500"
                      placeholder="Any specific note regarding this purchase bill..."
                    />
                  </div>

                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl text-sm border border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Sub Total:</span>
                      <span className="font-semibold text-white">
                        Rs. {calculatedTotals.subTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Discount:</span>
                      <input
                        type="number"
                        className="w-28 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right text-white focus:border-blue-500 outline-none"
                        value={formData.discount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-between text-base font-bold border-t border-slate-800 pt-2 text-white">
                      <span>Grand Total:</span>
                      <span className="text-blue-400">
                        Rs. {calculatedTotals.grandTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Paid Amount:</span>
                      <input
                        type="number"
                        className="w-28 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right text-white focus:border-blue-500 outline-none"
                        value={formData.paidAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paidAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-between text-red-400 font-semibold">
                      <span>Due Amount:</span>
                      <span>Rs. {calculatedTotals.dueAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-400">
                      <span>Payment Status:</span>
                      <select
                        value={formData.paymentStatus}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentStatus: e.target.value as Purchase["paymentStatus"],
                          })
                        }
                        className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-xs outline-none focus:border-blue-500"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Due">Due</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-md transition-colors"
                  >
                    {editingPurchase ? "Update Bill" : "Save Bill"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

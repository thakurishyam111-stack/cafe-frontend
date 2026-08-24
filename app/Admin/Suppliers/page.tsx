// suppliers/page.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Plus, Edit2, Trash2, Search, Building2, Phone, Mail, 
  MapPin, Hash, UserCheck, ShieldCheck, RefreshCw, X, Loader2 
} from "lucide-react";

import { SupplierData, fetchSuppliers, createSupplier, updateSupplierData, deleteSupplierData } from "./supplier";
import AdminSidebar from "@/components/AdminSidebar";

const initialFormState: SupplierData = {
  supplierCode: "",
  supplierName: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  panNumber: "",
  status: "Active",
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<SupplierData>(initialFormState);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await fetchSuppliers();
      if (Array.isArray(data)) {
        setSuppliers(data);
      } else {
        setSuppliers([]);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to load suppliers";
      showNotification("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const showNotification = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplierCode || !formData.supplierName || !formData.phone) {
      showNotification("error", "Code, Name, and Phone are strictly required!");
      return;
    }

    try {
      setActionLoading(true);
      if (isEditing && formData._id) {
        const msg = await updateSupplierData(formData._id, formData);
        showNotification("success", msg);
      } else {
        const msg = await createSupplier(formData);
        showNotification("success", msg);
      }
      handleCancel();
      loadSuppliers(); 
    } catch (error: any) {
      showNotification("error", error.response?.data?.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete ${name}?`)) return;

    try {
      setLoading(true);
      const msg = await deleteSupplierData(id);
      showNotification("success", msg);
      loadSuppliers();
    } catch (error: any) {
      showNotification("error", error.response?.data?.message || "Failed to delete supplier");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (supplier: SupplierData) => {
    setFormData(supplier);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((sup) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        sup.supplierName?.toLowerCase().includes(searchLower) ||
        sup.supplierCode?.toLowerCase().includes(searchLower) ||
        sup.phone?.includes(searchLower) ||
        (sup.panNumber && sup.panNumber.includes(searchLower))
      );
    });
  }, [suppliers, searchQuery]);

  return (
    <>
      <AdminSidebar />
      {/* ✅ 1. RESPONSIVE SIDEBAR SPACING & BACKGROUND FLUIDITY
        - `ml-0 md:ml-72`: मोबाइलमा फुल-विड्थ, डेस्कटपमा साइडबारको ठाउँ छोड्ने।
        - `min-h-screen`: सानो वा ठूलो जुनसुकै स्क्रिनमा ब्याकग्राउण्ड कभर हुने।
      */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-slate-100 p-4 sm:p-6 lg:p-8 ml-0 md:ml-72 transition-all duration-300">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Toast Notification */}
          {message && (
            <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 text-white shadow-2xl transition-all duration-300 ${
              message.type === "success" ? "bg-emerald-600" : "bg-rose-600"
            }`}>
              <span className="text-sm font-semibold">{message.text}</span>
              <button onClick={() => setMessage(null)} className="rounded-full p-0.5 hover:bg-white/20">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ✅ 2. HEADER BLOCK (SMART SHIFT)
            - मोबाइलमा सेन्टर र कोलम बेस, `sm:` ब्रेकपोइन्टमा रो (Row) र Justify-Between मा सिफ्ट हुने।
          */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-700 pb-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Supplier Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Manage inventory partners, track active profiles, commercial PAN cards, and communication logs.
              </p>
            </div>
            <button 
              onClick={loadSuppliers} 
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-sm backdrop-blur-md transition hover:bg-slate-700/80 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Records
            </button>
          </div>

          {/* ✅ 3. DYNAMIC LAYOUT GRID
            - सानो स्क्रिनमा सिंगल कोलम (`grid-cols-1`), ठूलो स्क्रिनमा डबल कोलम (`lg:grid-cols-[1fr_1.6fr]`)।
          */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1fr_1.6fr]">
            
            {/* LEFT COLUMN: FORM COMPONENT */}
            <div className="h-fit rounded-3xl border border-slate-800 bg-slate-900/40 p-5 shadow-xl backdrop-blur-xl md:p-6">
              <div className="mb-6">
                <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isEditing ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isEditing ? "bg-amber-400" : "bg-blue-400"}`} />
                  {isEditing ? "Update Mode" : "Creation Mode"}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? "Edit Supplier Details" : "Register New Supplier"}
                </h2>
              </div>

              {/* Form Inputs with Fluid Layout */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Supplier Code *</label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        disabled={isEditing}
                        value={formData.supplierCode}
                        onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                        placeholder="e.g. SUP-2026"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:bg-slate-950 disabled:bg-slate-900/50 disabled:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Supplier Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={formData.supplierName}
                        onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                        placeholder="Company or Individual Name"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contact Person</label>
                    <div className="relative">
                      <UserCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={formData.contactPerson || ""}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        placeholder="Representative Name"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +977-98XXXXXXXX"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="partner@domain.com"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">PAN Number</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={formData.panNumber || ""}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                        placeholder="9-digit Commercial PAN"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <textarea
                        rows={2}
                        value={formData.address || ""}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Street, City, State"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-blue-500 focus:bg-slate-950 resize-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Operational Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:bg-slate-950"
                    >
                      <option value="Active" className="bg-slate-900 text-white">Active</option>
                      <option value="Inactive" className="bg-slate-900 text-white">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Fluid Form Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] ${
                      isEditing ? "bg-amber-600 hover:bg-amber-500" : "bg-blue-600 hover:bg-blue-500"
                    } disabled:opacity-50`}
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isEditing ? (
                      "Save Alterations"
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> Register Supplier
                      </>
                    )}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: MODERN TABLE COMPONENT */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 shadow-xl backdrop-blur-xl md:p-6 flex flex-col">
              
              {/* Intelligent Search Box */}
              <div className="mb-5 relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, code, phone, or PAN..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:bg-slate-950 shadow-inner"
                />
              </div>

              {/* ✅ 4. RESPONSIVE TABLE MATRIX
                - `overflow-x-auto` ले साझो मोबाइल स्क्रिनमा लेआउट भत्किन दिँदैन।
                - सबै रो (Row) हरू डार्क मोड थीम अनुकूलित छन्।
              */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800/60">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="p-4">Code / Company</th>
                      <th className="p-4">Primary Contact</th>
                      <th className="p-4">PAN Number</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center text-slate-500">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                          Retrieving secure records...
                        </td>
                      </tr>
                    ) : filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <tr key={supplier._id} className="hover:bg-slate-800/30 transition-colors group">
                          <td className="p-4">
                            <div className="font-semibold text-slate-200 group-hover:text-white transition">
                              {supplier.supplierName}
                            </div>
                            <div className="text-xs font-mono text-slate-500 mt-0.5">
                              {supplier.supplierCode}
                            </div>
                          </td>
                          <td className="p-4 space-y-1">
                            {supplier.contactPerson && (
                              <div className="text-xs font-medium text-slate-300">{supplier.contactPerson}</div>
                            )}
                            <div className="text-xs text-slate-400 flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-slate-500" /> {supplier.phone}
                            </div>
                            {supplier.email && (
                              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                                <Mail className="h-3 w-3 text-slate-500" /> {supplier.email}
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-xs bg-slate-950 text-slate-400 border border-slate-800 px-2 py-1 rounded-md">
                              {supplier.panNumber || "—"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                              supplier.status === "Active" 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                            }`}>
                              {supplier.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => handleEditClick(supplier)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition"
                                title="Edit Record"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => supplier._id && handleDelete(supplier._id, supplier.supplierName)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
                                title="Delete Record"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                          No active records match the current filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
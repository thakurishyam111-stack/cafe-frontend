"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import { Plus, Search } from "lucide-react";


type MenuItem = {
  _id?: string;
  title?: string;
  price?: number;
  category?: string;
  description?: string;
  image?: string;
};

export default function AdminMenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  // ================= FETCH MENUS =================
  const fetchMenus = async () => {
    try {
      const { data } = await api.get("/api/menus");
      setMenus(data.menus || []);
    } catch (err: any) {
      console.log("FETCH ERROR:", err?.response?.data || err?.message || err);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const total = menus.length;
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(menus.map((item) => item.category).filter(Boolean) as string[]),
    ] as string[];

    return ["All", ...uniqueCategories];
  }, [menus]);

  const filteredMenus = useMemo(() => {
  return menus.filter((item) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesCategory =
      selectedCategory === "All" ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      item.title?.toLowerCase().includes(searchTerm) ||
      item.category?.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });
}, [menus, search, selectedCategory]);
  // ================= FILTER =================
  // const filteredMenus = useMemo(() => {
  //   return menus.filter((m) =>
  //     (m.title || "").toLowerCase().includes(search.toLowerCase()),
  //   );
  // }, [menus, search]);

  // const total = menus.length;

  // ================= OPEN ADD =================
  const openAdd = () => {
    setEditId(null);
    setForm({
      title: "",
      price: "",
      category: "",
      description: "",
      image: "",
    });
    setShowModal(true);
  };

  // ================= OPEN EDIT =================
  const openEdit = (menu: MenuItem) => {
    setEditId(menu._id || null);

    setForm({
      title: menu.title || "",
      price: menu.price?.toString() || "",
      category: menu.category || "",
      description: menu.description || "",
      image: menu.image || "",
    });

    setShowModal(true);
  };

  // ================= SAVE (ADD / UPDATE) =================
  const handleSave = async () => {
    if (!form.title || !form.price) {
      alert("Title and Price required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price), // IMPORTANT FIX
      };

      if (editId) {
        await api.put(`/api/menus/${editId}`, payload);
      } else {
        // ✅ FIXED ROUTE (your backend uses /add)
        await api.post("/api/menus/add", payload);
      }

      setShowModal(false);
      fetchMenus();
    } catch (err: any) {
      console.log("SAVE ERROR:", err?.response?.data || err?.message || err);
      alert(
        err?.response?.data?.message ||
          "Save failed! Check backend or API route.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteMenu = async (id: string) => {
    if (!confirm("Delete this menu?")) return;

    try {
      await api.delete(`/api/menus/${id}`);
      fetchMenus();
    } catch (err: any) {
      console.log("DELETE ERROR:", err?.response?.data || err?.message || err);
    }
  };

  return (
    <>
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-4 md:p-8 md:pt-6 md:ml-72">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">🍽 Menu Management</h1>
            <p className="text-gray-400">
              Add, edit, or manage cafe menu items
            </p>
          </div>

          <button
            onClick={openAdd}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-green-500/30"
          >
            <Plus size={20} />
            Add Menu
          </button>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat || "All")}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-amber-500 text-white shadow-lg"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:border-amber-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-6 rounded-xl hover:border-orange-500/40 transition-all duration-300">
            <p className="text-orange-300 text-sm font-medium">Total Items</p>
            <h2 className="text-3xl font-bold mt-2">{total}</h2>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6 rounded-xl hover:border-blue-500/40 transition-all duration-300">
            <p className="text-blue-300 text-sm font-medium">Categories</p>
            <h2 className="text-3xl font-bold mt-2">
              {new Set(menus.map((m) => m.category)).size}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 p-6 rounded-xl hover:border-green-500/40 transition-all duration-300">
            <p className="text-green-300 text-sm font-medium">Active Items</p>
            <h2 className="text-3xl font-bold mt-2">{total}</h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative mb-8">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 "
            size={20}
          />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
        </div>

        {/* MENU GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No menu items found</p>
            </div>
          ) : (
            filteredMenus.map((item) => (
              <div
                key={item._id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300"
              >
                <div className="h-90 w-full overflow-hidden bg-gray-800">
                  <img
                    src={item.image}
                    className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
                    alt={item.title}
                  />
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h2 className="font-bold text-lg flex-1">{item.title}</h2>
                    <span className="text-green-400 font-bold whitespace-nowrap text-lg">
                      Rs {item.price}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <span className="inline-block mb-4 text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">
                    {item.category}
                  </span>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg transition-colors border border-blue-500/30"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteMenu(item._id)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg transition-colors border border-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-800 w-full max-w-xl p-6 rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">
                {editId ? "Update Menu Item" : "Add New Menu Item"}
              </h2>

              <div className="grid gap-4">
                <input
                  placeholder="Item Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                />

                <input
                  placeholder="Price (Rs)"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                />

                <input
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                />

                <input
                  placeholder="Image URL"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                />

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all duration-200 ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30"
                  }`}
                >
                  {loading ? "Saving..." : "Save Item"}
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

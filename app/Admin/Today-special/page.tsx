"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

const API = "/api/today";

export default function TodayAdmin() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  // FETCH
  const fetchData = async () => {
    try {
      const response = await api.get(API);
      setItems(response.data.today || []);
    } catch (err) {
      console.error("Failed to fetch today specials:", err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // OPEN ADD
  const openAdd = () => {
    setEditId(null);
    setForm({ title: "", price: "", category: "", description: "", image: "" });
    setOpen(true);
  };

  // OPEN EDIT
  const openEdit = (item) => {
    setEditId(item._id);
    setForm(item);
    setOpen(true);
  };

  // SAVE
  const save = async () => {
    if (!form.title || !form.price) return alert("Required fields missing");

    try {
      if (editId) {
        await api.put(`${API}/${editId}`, form);
      } else {
        await api.post(`${API}/add`, form);
      }
      setOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save today special:", err);
      alert("Unable to save item. Check console for details.");
    }
  };

  // DELETE
  const remove = async (id) => {
    if (!confirm("Delete item?")) return;

    try {
      await api.delete(`${API}/${id}`);
      fetchData();
    } catch (err) {
      console.error("Failed to delete today special:", err);
      alert("Unable to delete item. Check console for details.");
    }
  };

  return ( <>
   
    <AdminSidebar/>

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white p-4 md:p-8 md:pt-6 md:ml-72">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">🔥 Today Special Admin</h1>
          <p className="text-gray-400">Manage daily special menu items</p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {items.map((item) => (
          <div
            key={item._id}
            className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-green-500 transition"
          >
            {/* IMAGE */}
            <img
              src={item.image || "https://via.placeholder.com/300"}
              className="h-90 w-fullobject-cover hover:scale-110 transition-transform duration-300"
            />

            {/* CONTENT */}
            <div className="p-4">
              <h2 className="text-xl font-bold">{item.title}</h2>

              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {item.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-green-400 font-bold">
                  Rs {item.price}
                </span>

                <span className="text-xs bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-300">
                  {item.category}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-600/20 text-blue-400 py-2 rounded-lg hover:bg-blue-600/30"
                >
                  <Pencil size={16} /> Edit
                </button>

                <button
                  onClick={() => remove(item._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-600/20 text-red-400 py-2 rounded-lg hover:bg-red-600/30"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-lg p-6 rounded-2xl border border-gray-800">

            <h2 className="text-xl font-bold mb-4">
              {editId ? "Update Item" : "Add Item"}
            </h2>

            <div className="grid gap-3">

              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="p-3 rounded bg-gray-800 border border-gray-700"
              />

              <input
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="p-3 rounded bg-gray-800 border border-gray-700"
              />

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="p-3 rounded bg-gray-800 border border-gray-700"
              />

              <input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
                className="p-3 rounded bg-gray-800 border border-gray-700"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="p-3 rounded bg-gray-800 border border-gray-700"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={save}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold"
              >
                Save
              </button>

              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
    </>
  );
}
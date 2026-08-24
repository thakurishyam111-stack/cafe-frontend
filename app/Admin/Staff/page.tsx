"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Mail, Phone, RefreshCw, User } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { apiFetch } from '@/lib/api';

interface StaffMember {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  salary: number;
  image: string;
  status: string;
}

const StaffManagement = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', role: 'Waiter', salary: '', image: '', status: 'Active'
  });

  const API_URL = "/api/staff";

  const fetchStaff = async () => {
    setFetchLoading(true);
    try {
      const res = await apiFetch(API_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error("Backend server error");
      const result = await res.json();
      
      if (result.success && Array.isArray(result.data)) {
        setStaffList(result.data);
      } else {
        setStaffList([]);
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
      setStaffList([]); 
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const url = editingStaff ? `${API_URL}/update/${editingStaff._id}` : `${API_URL}/add`;
    const method = editingStaff ? 'PUT' : 'POST';

    try {
      const res = await apiFetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Action failed");
      }

      const data = await res.json();

      if (data.success) {
        await fetchStaff(); 
        closeModal();
      } else {
        alert(data.message);
      }
    } catch (err: any) {
      console.error("❌ Form Submission Error:", err);
      alert(`Error: ${err.message || "Cannot connect to server!"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("you want to delete this staff ?")) {
      try {
        const res = await apiFetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Delete failed");
        const data = await res.json();
        if (data.success) {
          fetchStaff();
        }
      } catch (err: any) {
        console.error("Error deleting staff:", err);
        alert(err.message);
      }
    }
  };

  const openModal = (staff: StaffMember | null = null) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData({
        name: staff.name, email: staff.email, phone: staff.phone,
        role: staff.role, salary: String(staff.salary), image: staff.image, status: staff.status
      });
    } else {
      setEditingStaff(null);
      setFormData({ name: '', email: '', phone: '', role: 'Waiter', salary: '', image: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  return (<>
    <AdminSidebar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-400 to-black text-white p-4 md:p-8 md:pt-6 md:ml-72 ">
   
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-100 text-center">Staff Management</h1>
          <p className="text-xs sm:text-sm text-gray-100">Manage your cafe staff members, roles and details</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={fetchStaff}
            className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={fetchLoading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => openModal(null)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-medium transition duration-200 shadow-md text-sm"
          >
            <Plus size={18} /> Add New Staff
          </button>
        </div>
      </div>

      {/* Loading state indicator */}
      {fetchLoading && staffList.length === 0 && (
        <div className="text-center py-10 text-gray-500 font-medium text-sm">Loading staff directory...</div>
      )}

      {/* No Data State */}
      {!fetchLoading && staffList.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 p-6">
          <p className="text-gray-500 text-sm">No staff members found. Add some staff to get started!</p>
        </div>
      )}

      {/* Senior Dev Upgrade: Staff Details Tabular Grid Interface */}
      {staffList.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-[800px] table-auto border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 select-none">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Staff Info</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Contact Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Financial Base</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Control Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-gray-50/50 transition-colors duration-200">
                    {/* Avatar & Ident Data Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={staff.image || "https://via.placeholder.com/150"} 
                          alt={staff.name} 
                          className="w-11 h-11 rounded-full object-cover border border-gray-100 flex-shrink-0 bg-slate-50"
                          onError={(e: any) => { e.target.src = "https://via.placeholder.com/150"; }}
                        />
                        <div className="max-w-[160px]">
                          <p className="font-semibold text-sm text-gray-800 truncate">{staff.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">ID: {staff._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Operational Role Badge Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md font-semibold ${
                        staff.role === 'Admin' || staff.role === 'Manager' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {staff.role}
                      </span>
                    </td>

                    {/* Communication Nodes Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1 text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <Mail size={13} className="text-gray-400 shrink-0" /> 
                          <span className="truncate hover:text-orange-500 transition-colors cursor-pointer">{staff.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="text-gray-400 shrink-0" /> 
                          <a href={`tel:${staff.phone}`} className="hover:text-blue-500 transition-colors font-mono">{staff.phone}</a>
                        </div>
                      </div>
                    </td>

                    {/* Financial Matrix Settlement Cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 font-mono">
                      Rs. {Number(staff.salary).toLocaleString('en-IN')}
                    </td>

                    {/* Availability Metrics Cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        staff.status === 'Active' 
                          ? 'bg-green-50 text-green-700 border border-green-100' 
                          : staff.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>{staff.status}</span>
                    </td>

                    {/* Pipeline Mutator Controllers Cell */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => openModal(staff)}
                          className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-gray-200 shadow-sm hover:border-orange-200 transition-all duration-200"
                          title="Edit Operational Metrics"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(staff._id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-gray-200 shadow-sm hover:border-rose-200 transition-all duration-200"
                          title="Purge Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              {editingStaff ? "Update Staff Details" : "Add New Staff Member"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" required value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                  <input 
                    type="email" required value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone</label>
                  <input 
                    type="text" required value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Role</label>
                  <select 
                    value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
                  >
                    <option value="Waiter">Waiter</option>
                    <option value="Chef">Chef</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Salary (Rs.)</label>
                  <input 
                    type="number" required value={formData.salary} 
                    onChange={(e) => setFormData({...formData, salary: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Image URL</label>
                <input 
                  type="url" required placeholder="https://example.com/photo.jpg" value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                <select 
                  value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button 
                  type="button" onClick={closeModal} 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={loading} 
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium disabled:bg-orange-300 active:scale-95 transition shadow-sm"
                >
                  {loading ? "Saving..." : "Save Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default StaffManagement;
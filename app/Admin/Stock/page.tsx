'use client';

import { Search, Plus, Edit2, Trash2, Download, Filter, ChevronLeft, ChevronRight, AlertTriangle, X } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import useStock from '../Stock/stock';
export default function Page() {
const {
    stocks,
    summary,
    loading,
    error,

    filteredStocks,
    uniqueCategoriesList,

    searchQuery,
    categoryFilter,
    statusFilter,

    setSearchQuery,
    setCategoryFilter,
    setStatusFilter,

    isModalOpen,
    editingItem,
    formData,

    openAddModal,
    openEditModal,
    handleInputChange,
    handleSubmit,
    handleDelete,
    setIsModalOpen,
    formSubmitLoading,

} = useStock();
  
  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 md:pt-6 md:ml-72 transition-all">
   
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 bg-slate-800 p-5 rounded-xl shadow-md border border-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Stock Inventory</h1>
            <p className="text-sm text-slate-400 mt-1">Manage physical products and tracking thresholds</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search SKU or Product..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-600 bg-slate-950 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition placeholder-slate-500"
              />
            </div>
            <button 
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm active:scale-95"
            >
              <Plus className="h-4 w-4" /> Add Stock
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-xl text-sm flex items-center gap-2 animate-pulse">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-rose-400" />
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          {[
            { label: 'Total Items', value: summary.totalItems, color: 'text-white' },
            { label: 'Low Stock Alert', value: summary.lowStockCount, color: summary.lowStockCount > 0 ? 'text-amber-400' : 'text-slate-400' },
            { label: 'Stock Value', value: `Rs. ${summary.totalValue.toLocaleString()}`, color: 'text-emerald-400' },
            { label: 'Categories', value: summary.uniqueCategories, color: 'text-indigo-400' }
          ].map((card, idx) => (
            <div key={idx} className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.label}</span>
              <p className={`text-xl md:text-2xl font-bold mt-2 ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* FILTERS AND CONTROLS */}
        <div className="flex flex-col gap-4 my-6 bg-slate-800 p-4 rounded-xl border border-slate-700 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <div className="flex items-center gap-2 border border-slate-700 rounded-lg px-3 py-1.5 bg-slate-900">
              <span className="text-slate-400">Category:</span>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent focus:outline-none font-semibold text-white cursor-pointer"
              >
                <option value="All" className="bg-slate-800">All Categories</option>
                {uniqueCategoriesList.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 border border-slate-700 rounded-lg px-3 py-1.5 bg-slate-900">
              <span className="text-slate-400">Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent focus:outline-none font-semibold text-white cursor-pointer"
              >
                <option value="All" className="bg-slate-800">All Status</option>
                <option value="active" className="bg-slate-800">Active</option>
                <option value="inactive" className="bg-slate-800">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button className="flex items-center gap-2 border border-slate-700 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-300 transition">
              <Filter className="h-4 w-4" /> Sort
            </button>
            <button className="flex items-center gap-2 border border-slate-700 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-300 transition">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        {/* PRODUCTS TABLE */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-500 text-sm font-semibold text-slate-200 uppercase tracking-wider">
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-6">SKU</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Stock Level</th>
                  <th className="py-4 px-6">Costing Price</th>
                  <th className="py-4 px-6">Selling Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        Processing Database Records...
                      </div>
                    </td>
                  </tr>
                ) : filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                      No matching stocks found.
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((item) => {
                    const displayStock = Number(item.displayStock ?? item.currentStock ?? 0);
                    const displayUnit = item.displayUnit || item.purchaseUnit || item.baseUnit || item.unit || 'pcs';
                    const unitCost = Number(item.costPerBaseUnit ?? item.costPerUnit ?? 0);
                    const isLowStock = Number(item.currentStock ?? 0) <= Number(item.minimumStock ?? 0);
                    
                    return (
                      <tr key={item._id} className="hover:bg-slate-700/40 transition">
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{item.name}</span>
                            <span className="text-xs text-slate-400 line-clamp-1">{item.description || 'No description'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-slate-400 tracking-wider">{item.sku}</td>
                        <td className="py-4 px-6 text-slate-300 font-medium">{item.category}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold text-base ${isLowStock ? 'text-amber-400 animate-pulse' : 'text-white'}`}>
                                {displayStock}
                              </span>
                              <span className="text-xs text-slate-500 font-medium uppercase">{displayUnit}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Min threshold: {item.minimumStock}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-300">Rs. {unitCost.toLocaleString()}</td>
                        <td className="py-4 px-6 font-semibold text-emerald-400">Rs. {item.sellingPrice.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            item.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-400 border border-slate-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition"
                              title="Edit Stock"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(item._id, item.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-md transition"
                              title="Delete Stock"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION LAYOUT */}
          <div className="flex items-center justify-between border-t border-slate-700 px-6 py-4 bg-slate-900 text-sm">
            <button className="flex items-center gap-1 font-medium text-slate-500 cursor-not-allowed" disabled>
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <div className="flex items-center gap-1">
              <span className="px-3 py-1 rounded-md bg-emerald-600 text-white font-medium">1</span>
            </div>
            <button className="flex items-center gap-1 font-medium text-slate-500 cursor-not-allowed" disabled>
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= ADD / EDIT MODAL (RESPONSIVE OVERLAY) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-700 bg-slate-900">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? '✏️ Edit Stock Record' : '📦 Add New Stock Item'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm text-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Product Name *</label>
                  <input 
                    type="text" required name="name" value={formData.name} onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">SKU Code *</label>
                  <input 
                    type="text" required name="sku" value={formData.sku} onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category *</label>
                  <input 
                    type="text" required name="category" value={formData.category} onChange={handleInputChange}
                    placeholder="e.g. Electronics, Food"
                    className="w-full bg-slate-950 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Unit Typology</label>
                  <select 
                    name="unit" value={formData.unit} onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="grm">gram (gra)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="ltr">Liters (ltr)</option>
                    <option value="box">Boxes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Current Stock Qty *</label>
                  <input 
                    type="number" required min="0" name="currentStock" value={formData.currentStock} onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Minimum Alert Qty *</label>
                  <input 
                    type="number" required min="0" name="minimumStock" value={formData.minimumStock} onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Cost Price (per unit) *</label>
                  <input 
                    type="number" required min="0" name="costPerUnit" value={formData.costPerUnit} onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Selling Price *</label>
                  <input 
                    type="number" required min="0" name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">System Status</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" name="status" value="active" checked={formData.status === 'active'} onChange={handleInputChange}
                        className="accent-emerald-500 w-4 h-4" 
                      />
                      <span>Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" name="status" value="inactive" checked={formData.status === 'inactive'} onChange={handleInputChange}
                        className="accent-emerald-500 w-4 h-4" 
                      />
                      <span>Inactive</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                  <textarea 
                    name="description" rows={2} value={formData.description} onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-600 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                </div>

              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 mt-6">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={formSubmitLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-lg transition font-semibold shadow-md flex items-center gap-2"
                >
                  {formSubmitLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : null}
                  {editingItem ? 'Save Changes' : 'Submit Stock'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
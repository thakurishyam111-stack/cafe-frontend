"use client";

import AdminSidebar from "@/components/AdminSidebar";
import useWaste from "../Waste/waste";

export default function WasteManagementDashboard() {
  const {
    wasteData,
    activeTab,
    searchQuery,
    formData,
    filteredData,
    isLoading,
    error,
    isEditMode,
    isDeleteModalOpen,

    setSearchQuery,
    setActiveTab,

    handleInputChange,
    handleFormSubmit,
    handleDeleteConfirm,
    triggerEdit,
    triggerDelete,
    resetForm,
  } = useWaste();

  // Visual UI Pill logic for Reasons
  const getReasonBadgeColor = (reason ) => {
    const maps = {
      Expired: "bg-red-50 text-red-700 border-red-200",
      Damaged: "bg-amber-50 text-amber-700 border-amber-200",
      spolide: "bg-orange-50 text-orange-700 border-orange-200",
      Burnt: "bg-stone-100 text-stone-800 border-stone-300",
      "Customer Return": "bg-blue-50 text-blue-700 border-blue-200",
      "preparation Mistake": "bg-purple-50 text-purple-700 border-purple-200",
      others: "bg-gray-100 text-gray-600 border-gray-200",
    };
    return maps[reason] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <>
      <AdminSidebar />
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-800 to-black text-white p-4 md:p-8 md:pt-6 md:ml-72">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* DASHBOARD HEADER */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 mb-6 border-b border-slate-200 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm">
                  <svg
                    className=" w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </span>
              </h1>
              <h1 className="text-gray-200">Waste Inventory Management</h1>
              <p className="text-md text-slate-100 mt-1 ">
                Track system loss, damages, expired items and custom financial
                metrics.
              </p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold bg-slate-900 text-white px-3 py-1 rounded-full">
                Live Core Cluster
              </span>
            </div>
          </header>

          {/* TABS NAVIGATION */}
          <nav className="flex space-x-2 border-b border-slate-200 mb-6">
            <button
              className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 relative top-[2px] ${activeTab === "view" ? "border-emerald-600 text-emerald-600 font-semibold" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              onClick={() => {
                setActiveTab("view");
                resetForm();
                fetchWastes();
              }}
            >
              All Logs Inventory
            </button>
            <button
              className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 relative top-[2px] ${activeTab === "form" ? "border-emerald-600 text-emerald-600 font-semibold" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              onClick={() => setActiveTab("form")}
            >
              {isEditMode ? "Edit Waste Node" : "Record New Waste"}
            </button>
          </nav>

          {/* MAIN RENDERING ROUTER */}
          <main>
            {activeTab === "view" ? (
              <div className="space-y-4">
                {/* FILTER / ACTION CONTROL BAR */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search by Waste Name or Reason..."
                      className="w-full pl-9 pr-4 py-2 text-sm bg-white text-black border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm self-stretch sm:self-auto text-center">
                    Matched Records:{" "}
                    <span className="text-slate-900 font-bold ml-1">
                      {filteredData.length}
                    </span>
                  </div>
                </div>

                {/* DATA FEEDBACK LAYERS */}
                {isLoading && (
                  <div className="text-center p-16 bg-white border rounded-xl shadow-sm text-slate-400">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mb-3"></div>
                    <p className="text-xs font-medium">
                      Syncing database entries...
                    </p>
                  </div>
                )}
                {error && (
                  <div className="p-4 text-center text-sm font-medium text-red-800 bg-red-50 border border-red-100 rounded-xl">
                    {error}
                  </div>
                )}

                {/* RESPONSIVE SENIOR UI TABLE STRUCTURE */}
                {!isLoading && !error && (
                  <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200">
                            <th className="p-4">Waste Identity</th>
                            <th className="p-4">Reason Trigger</th>
                            <th className="p-4">Quantity Metric</th>
                            <th className="p-4">Total Cost Loss</th>
                            <th className="p-4 text-center">Operations</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredData.map((item) => (
                            <tr
                              key={item._id}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="p-4">
                                <div className="font-semibold text-slate-900">
                                  {item.wasteName}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  Stock Ref: {String(item.stock).slice(-6)}...
                                </div>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getReasonBadgeColor(item.reason)}`}
                                >
                                  {item.reason}
                                </span>
                              </td>
                              <td className="p-4 font-mono text-slate-700 font-medium">
                                {item.quantity}{" "}
                                <span className="text-xs text-slate-400 lowercase font-sans">
                                  {item.unit}
                                </span>
                              </td>
                              <td className="p-4 font-semibold text-rose-600">
                                Rs. {Number(item.cost).toLocaleString()}
                              </td>
                              <td className="p-4 text-center space-x-1">
                                <button
                                  onClick={() => triggerEdit(item)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                  title="Modify Record"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => triggerDelete(item._id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                  title="Purge Record"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* EMPTY STATE DATA MAPPING */}
                    {filteredData.length === 0 && (
                      <div className="text-center p-12 text-slate-400 bg-white">
                        <svg
                          className="w-10 h-10 mx-auto stroke-1 stroke-slate-300 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m16.5 0a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 7.5m16.5 0V4.5A2.25 2.25 0 0018 2.25H6A2.25 2.25 0 003.75 4.5V7.5m16.5 0V9M3.75 7.5V9m16.5 5.25h-16.5"
                          />
                        </svg>
                        <p className="text-xs font-medium">
                          No system metrics located under search conditions.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* CRU DATA INPUT FORMS */
              <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {isEditMode
                      ? "Modify Waste Entry Parameters"
                      : "Log Waste Parameters"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    All configuration nodes execute direct verification
                    constraints inside MongoDB.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Stock Item Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="Ex: Tea Leaves"
                        className="p-2.5 text-sm text-black border border-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Waste Item Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="wasteName"
                        value={formData.wasteName}
                        onChange={handleInputChange}
                        placeholder="Ex: Expired Organic Milk"
                        className="p-2.5 text-sm text-black  border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Unit Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        placeholder="Ex: kg, liters, pcs"
                        className="p-2.5 text-sm text-black  border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Quantity Logged <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="Min: 1"
                        className="p-2.5 text-sm text-black  border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Financial Cost (Loss){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        placeholder="Value in Rs."
                        className="p-2.5 text-sm text-black  border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-gray-900">
                    <label className="text-xs font-semibold text-slate-700">
                      Reason Classification Schema{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="p-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      required
                    >
                      <option value="" disabled>
                        Select valid reason 
                        ...
                      </option>
                      <option value="Expired">Expired</option>
                      <option value="Damaged">Damaged</option>
                      <option value="spolide">spolide</option>
                      <option value="Burnt">Burnt</option>
                      <option value="Customer Return">Customer Return</option>
                      <option value="preparation Mistake">
                        preparation Mistake
                      </option>
                      <option value="others">others</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Supplementary Notes (Optional)
                    </label>
                    <textarea
                      name="note"
                      rows="3"
                      value={formData.note}
                      onChange={handleInputChange}
                      placeholder="Add detailed remarks regarding processing error..."
                      className="p-2.5 text-sm text-black  border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setActiveTab("view");
                      }}
                      className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                    >
                      Commit Transaction
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>

          {/* --- DYNAMIC OVERLAY DIALOGS (MODALS) --- */}

          {/* DELETION CONFIRMATION LAYER */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
                <div className="px-6 py-4 border-b border-slate-100 bg-rose-50/50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-rose-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Confirm Drop Sequence
                  </h3>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                  >
                    &times;
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Are you completely certain you want to erase this database
                    entry index{" "}
                    <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-900 text-[11px]">
                      #{String(activeRecordId).slice(-8)}
                    </span>
                    ? This action overrides active system references.
                  </p>
                  <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Abort
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteConfirm}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      Wipe from MongoDB
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

"use client"
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function useWaste(){
  const [wasteData, setWasteData] = useState([]);
  const [activeTab, setActiveTab] = useState("view");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    stock: "",
    wasteName: "",
    unit: "",
    quantity: "",
    reason: "",
    cost: "",
    note: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeRecordId, setActiveRecordId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

const API_BASE_URL = "/api/waste";
const STOCK_API_BASE_URL = "/api/stocks";

 const fetchWastes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch(API_BASE_URL);
      if (!response.ok) throw new Error('Database server integration failed.');
      const data = await response.json();
      
      // Backend mapping: response returns { success: true, waste: [...] }
      if (data.success && data.waste) {
        setWasteData(data.waste);
      }
    } catch (err) {
      setError('Backend standard pipeline offline. Please check your Node.js port.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
fetchWastes();
}, []);


   // Handle Form Change Helper
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. POST (ADD) & PUT (EDIT) HANDLER
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const stockName = (formData.stock || '').trim();
      const wasteQuantity = Number(formData.quantity);
      const wasteCost = Number(formData.cost);

      if (!stockName) throw new Error('Please enter a stock item name before submitting waste.');
      if (!Number.isFinite(wasteQuantity) || wasteQuantity <= 0) {
        throw new Error('Waste quantity must be a valid number greater than zero.');
      }
      if (!Number.isFinite(wasteCost) || wasteCost < 0) {
        throw new Error('Waste cost must be a valid number.');
      }

      const stockListResponse = await apiFetch(STOCK_API_BASE_URL);
      const stockListData = await stockListResponse.json();

      if (!stockListResponse.ok || !stockListData?.success) {
        throw new Error(stockListData?.message || 'Could not load stock items.');
      }

      const stockItem = (stockListData?.data || []).find((item: any) => {
        const existingName = String(item?.name || '').toLowerCase();
        const searchName = stockName.toLowerCase();
        return existingName === searchName || existingName.includes(searchName);
      });

      if (!stockItem) {
        throw new Error(`No stock item matched "${stockName}".`);
      }

      const stockId = stockItem?._id;
      const currentStock = Number(stockItem?.currentStock ?? 0);

      if (currentStock < wasteQuantity) {
        throw new Error(`Waste quantity exceeds available stock. Current stock is ${currentStock}.`);
      }

      const updatedStock = currentStock - wasteQuantity;
      const stockUpdateResponse = await apiFetch(`${STOCK_API_BASE_URL}/${stockId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStock: updatedStock,
          status: updatedStock <= 0 ? 'inactive' : 'active',
        }),
      });

      const updatedStockData = await stockUpdateResponse.json();
      if (!stockUpdateResponse.ok || !updatedStockData?.success) {
        throw new Error(updatedStockData?.message || 'Stock update failed.');
      }

      const url = isEditMode ? `${API_BASE_URL}/${activeRecordId}` : `${API_BASE_URL}/add`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stock: stockId,
          quantity: String(wasteQuantity),
          cost: wasteCost,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Operation failed');

      // Success Reset
      resetForm();
      await fetchWastes();
      setActiveTab('view');
    } catch (err:any) {
      alert(`Error: ${err.message}`);
    }
  };

  // 3. DELETE HANDLER
  const handleDeleteConfirm = async () => {
    try {
      const response = await apiFetch(`${API_BASE_URL}/${activeRecordId}`, { method: 'DELETE' });
      const data = await response.json();
      
      if (!response.ok || !data.success) throw new Error(data.message || 'Delete failed');
      
      setWasteData(prev => prev.filter(item => item._id !== activeRecordId));
      setIsDeleteModalOpen(false);
      setActiveRecordId(null);
    } catch (err:any) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  // --- ACTION CONTROLS ---
  const triggerEdit = (item) => {
    setIsEditMode(true);
    setActiveRecordId(item._id);
    setFormData({
      stock: item.stock || '',
      wasteName: item.wasteName,
      unit: item.unit,
      quantity: item.quantity,
      reason: item.reason,
      cost: item.cost,
      note: item.note || ''
    });
    setActiveTab('form');
  };

  const triggerDelete = (id) => {
    setActiveRecordId(id);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setIsEditMode(false);
    setActiveRecordId(null);
    setFormData({ stock: '', wasteName: '', unit: '', quantity: '', reason: '', cost: '', note: '' });
  };

  // --- FILTER ENGINE (SEARCH BY NAME OR REASON) ---
  const filteredData = wasteData.filter(item => 
    item.wasteName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    wasteData,
    activeTab,
    searchQuery,
    formData,
    isLoading,
    error,
    isEditMode,
    activeRecordId,
    isDeleteModalOpen,
    filteredData,

    setSearchQuery,
    setActiveTab,
    setIsDeleteModalOpen,

    handleInputChange,
    handleFormSubmit,
    handleDeleteConfirm,
    triggerEdit,
    triggerDelete,
    resetForm,
  };
}

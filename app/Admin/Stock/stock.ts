"use client"
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const normalizeUnit = (value: string = 'pcs') => String(value || 'pcs').trim().toLowerCase();

const normalizeUnitToBase = (value: string = 'pcs') => {
  const unit = normalizeUnit(value);
  if (unit === 'grm' || unit === 'gm') return 'gm';
  if (unit === 'ltr' || unit === 'liter' || unit === 'litre' || unit === 'l' || unit === 'ml') return 'ml';
  return 'pcs';
};

const initialFormState = {
  name: '',
  sku: '',
  category: '',
  currentStock: 0,
  minimumStock: 0,
  costPerUnit: 0,
  sellingPrice: 0,
  unit: 'pcs',
  baseUnit: 'pcs',
  purchaseUnit: 'pcs',
  displayUnit: 'pcs',
  status: 'active',
  description: ''
};

export interface IStock {
  _id: string;
  name: string;
  sku: string;
  category: string;
  unit?: 'kg' | 'grm' | 'ltr' | 'ml' | 'pcs' | 'pack' | string;
  baseUnit?: string;
  purchaseUnit?: string;
  displayUnit?: string;
  currentStock: number;
  minimumStock: number;
  costPerUnit?: number;
  costPerBaseUnit?: number;
  sellingPrice: number;
  displayStock?: number;
  expiryDate?: string | Date;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface StockSummary {
  totalItems: number;
  lowStockCount: number;
  totalValue: number;
  uniqueCategories: number;
}
export default function useStock() {
  const [stocks, setStocks] = useState<IStock[]>([]);
  const [summary, setSummary] = useState<StockSummary>({
    totalItems: 0,
    lowStockCount: 0,
    totalValue: 0,
    uniqueCategories: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Add / Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IStock | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // 1. Fetch Stocks from API
  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch('/api/stocks');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const safeData = Array.isArray(data) ? data : (data?.stocks || data?.data || []);
      const cleanData: IStock[] = Array.isArray(safeData) ? safeData : [];
      setStocks(cleanData);
      updateSummaryCards(cleanData);
    } catch (err) {
      console.error("Backend fetch error:", err);
      setError("Unable to connect to database server. Please check cross-origin (CORS) headers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Summary Update गर्ने common function
  const updateSummaryCards = (data: IStock[]) => {
    const lowStockItems = data.filter(item => Number(item.currentStock || 0) <= Number(item.minimumStock || 0));
    const totalStockValue = data.reduce((acc, item) => acc + (Number(item.currentStock || 0) * Number(item.costPerBaseUnit ?? item.costPerUnit ?? 0)), 0);
    const uniqueCats = new Set(data.map(item => item.category)).size;

    setSummary({
      totalItems: data.length,
      lowStockCount: lowStockItems.length,
      totalValue: totalStockValue/1000,
      uniqueCategories: uniqueCats
    });
  };

  // 2. Add / Edit Form Handling
  const openAddModal = () => {
    setEditingItem(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (item: IStock) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      currentStock: Number(item.displayStock ?? item.currentStock ?? 0),
      minimumStock: Number(item.minimumStock || 0),
      costPerUnit: Number(item.costPerBaseUnit ?? item.costPerUnit ?? 0),
      sellingPrice: Number(item.sellingPrice || 0),
      unit: normalizeUnit(item.displayUnit || item.purchaseUnit || item.baseUnit || item.unit || 'pcs'),
      baseUnit: normalizeUnitToBase(item.baseUnit || item.unit || 'pcs'),
      purchaseUnit: normalizeUnit(item.purchaseUnit || item.unit || 'pcs'),
      displayUnit: normalizeUnit(item.displayUnit || item.purchaseUnit || item.baseUnit || item.unit || 'pcs'),
      status: item.status,
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = ['currentStock', 'minimumStock', 'costPerUnit', 'sellingPrice'].includes(name);
    setFormData(prev => ({
      ...prev,
      [name]: isNumber ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitLoading(true);

    try {
      const url = editingItem
        ? `/api/stocks/${editingItem._id}`
        : '/api/stocks';

      const method = editingItem ? 'PUT' : 'POST';

      // ⚠️ Senior Tip: पठाउनु अघि डेटा Format मिलेको छ कि छैन पक्का गर्ने
      const unit = normalizeUnit(formData.unit);
      const payload = {
        ...formData,
        currentStock: Number(formData.currentStock),
        minimumStock: Number(formData.minimumStock),
        costPerBaseUnit: Number(formData.costPerUnit),
        sellingPrice: Number(formData.sellingPrice),
        baseUnit: normalizeUnitToBase(unit),
        purchaseUnit: unit,
        displayUnit: unit,
      };

      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // यदि Backend ले ४०० वा ५०० एरर पठायो भने त्यसको विवरण निकाल्ने
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Server responded with status ${response.status}`);
      }

      // सफलता पूर्वक सेभ भएपछि
      await fetchStocks();
      setIsModalOpen(false);
      setFormData(initialFormState); // Form Reset गर्ने

    } catch (err: any) {
      console.error("❌ Form Submission Error Details:", err);
      // उपभोक्तालाई स्पष्ट एरर मेसेज देखाउने
      alert(`Error: ${err.message || "Failed to save stock. Please check console for details."}`);
    } finally {
      setFormSubmitLoading(false);
    }
  };
  // 3. Delete Handling
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await apiFetch(`/api/stocks/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error("Failed to delete stock");

        // State update safely
        const updatedStocks = stocks.filter(stock => stock._id !== id);
        setStocks(updatedStocks);
        updateSummaryCards(updatedStocks);
      } catch (err) {
        alert("Could not delete item. Check console logs.");
      }
    }
  };

  // Client-side Search and Filter
  const filteredStocks = stocks.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategoriesList = Array.from(new Set(stocks.map(item => item.category)));



  return {
    // Data
    stocks,
    summary,
    loading,
    error,

    // Search & Filter
    searchQuery,
    categoryFilter,
    statusFilter,
    filteredStocks,
    uniqueCategoriesList,

    // Modal
    isModalOpen,
    editingItem,
    formData,
    formSubmitLoading,

    // Setter
    setSearchQuery,
    setCategoryFilter,
    setStatusFilter,
    setIsModalOpen,
    setFormData,

    // Functions
    fetchStocks,
    openAddModal,
    openEditModal,
    handleInputChange,
    handleSubmit,
    handleDelete,
  };
}
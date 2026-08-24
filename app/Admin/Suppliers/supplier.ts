// supplier.ts
import { api } from "@/lib/api";

export interface SupplierData {
  _id?: string;
  supplierCode: string;
  supplierName: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  panNumber?: string;
  status: "Active" | "Inactive";
  createdAt?: string;
}

// Base path to supplier API endpoints
const API_BASE_URL = "/api/supplier";

/**
 * सबै Suppliers को सूची तान्ने (Get All)
 * GET: /api/supplier
 */
export const fetchSuppliers = async (): Promise<SupplierData[]> => {
  const res = await api.get(`${API_BASE_URL}`);
  return res.data.suppliers || [];
};

/**
 * नयाँ Supplier थप्ने (Create)
 * POST: /api/supplier/add
 * ✅ तपाईंको ब्याकेन्ड रूटको "/add" यहाँ थपिएको छ
 */
export const createSupplier = async (data: SupplierData): Promise<string> => {
  const res = await api.post(`${API_BASE_URL}add`, data);
  return res.data.message || "Supplier created successfully";
};

/**
 * भइरहेको Supplier को विवरण परिमार्जन गर्ने (Update)
 * PUT: /api/supplier/:id
 */
export const updateSupplierData = async (id: string, data: SupplierData): Promise<string> => {
  const res = await api.put(`${API_BASE_URL}${id}`, data);
  return res.data.message || "Supplier updated successfully";
};

/**
 * Supplier हटाउने (Delete)
 * DELETE: /api/supplier/:id
 */
export const deleteSupplierData = async (id: string): Promise<string> => {
  const res = await api.delete(`${API_BASE_URL}${id}`);
  return res.data.message || "Supplier deleted successfully";
};
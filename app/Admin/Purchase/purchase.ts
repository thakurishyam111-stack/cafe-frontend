// types/purchase.ts

export interface PurchaseItem {
  stock: string; // Stock ID
  quantity: number;
  unit: string;
  purchasePrice: number;
  total: number;
}

export interface Purchase {
  _id?: string;
  purchaseNumber: string;
  supplier: string; // Supplier ID
  purchaseDate?: string;
  items: PurchaseItem[];
  subTotal: number;
  discount: number;
  grandTotal: number;
  paymentMethod: "Cash" | "Online" | "Credit";
  paymentStatus: "Paid" | "Partial" | "Due";
  paidAmount: number;
  dueAmount: number;
  note?: string;
  createdAt?: string;
}

export interface Stock {
  _id: string;
  itemName: string; // मानौं स्टक मोडलमा यो फिल्ड छ
  currentStock: number;
}

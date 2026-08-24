// casher.ts
import { api } from "@/lib/api";

export type CasherUser = {
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
};

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type OrderData = {
  _id: string;
  billNo?: string;
  customerName: string;
  phone: string | number;
  items: OrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  paymentStatus?: string;
  status?: string;
};

/**
 * ग्राहकको नाम र फोन नम्बरको आधारमा अनपेइड (Unpaid) अर्डरहरू खोज्ने कार्य
 */
export const fetchUnpaidOrders = async (customerName: string, customerPhone: string): Promise<OrderData[]> => {
  if (!customerName || !customerPhone) {
    throw new Error("Please enter both Customer Name and Phone Number");
  }

  const res = await api.get("/api/orders");
  const allOrders = res.data.orders || [];

  const inputName = customerName.trim().toLowerCase();
  const inputPhone = customerPhone.trim();

  // 'paid' नभएका र विवरण मिल्ने अर्डरहरू फिल्टर गर्ने
  const matchedOrders = allOrders.filter((ord: OrderData) => {
    const dbName = ord.customerName ? ord.customerName.trim().toLowerCase() : "";
    const dbPhone = ord.phone ? ord.phone.toString().trim() : "";
    
    return dbName === inputName && dbPhone === inputPhone && ord.paymentStatus !== "paid";
  });

  return matchedOrders;
};

/**
 * निश्चित अर्डरको लागि भुक्तानी स्थिति ब्याकेन्डमा अपडेट गर्ने कार्य
 */
export const submitOrderPayment = async (orderId: string, payload: { method: string; cashierId?: string; discountPercent: number }) => {
  return await api.put(`/api/orders/payment/${orderId}`, payload);
};

// export const handalTabalStatus= async()
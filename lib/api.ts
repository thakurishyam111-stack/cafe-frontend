import axios from "axios";

const API_BASE_URL_VALUE = (() => {
  const base =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return base.replace(/\/$/, "");
})();

export const API_BASE_URL = API_BASE_URL_VALUE;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiFetch = async (input: string, init?: RequestInit) => {
  const url = input.startsWith("/") ? `${API_BASE_URL}${input}` : input;
  return fetch(url, init);
};

export const CUSTOMER_ORDER_URL = (
  process.env.NEXT_PUBLIC_CUSTOMER_ORDER_URL || ""
).replace(/\/$/, "");

export const getCustomerOrderUrlBase = () => {
  if (CUSTOMER_ORDER_URL) return CUSTOMER_ORDER_URL;
  if (typeof window !== "undefined") return window.location.origin;
  throw new Error(
    "NEXT_PUBLIC_CUSTOMER_ORDER_URL is not configured and window is unavailable",
  );
};

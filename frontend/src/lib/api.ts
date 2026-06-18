const API_URL = import.meta.env.VITE_API_URL || "";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "ADMIN";
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: User }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
      request<{ token: string; user: User }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => request<User>("/api/auth/me"),
  },
  products: {
    list: (params?: { category?: string; search?: string }) => {
      const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
      return request<Product[]>(`/api/products${qs}`);
    },
    get: (id: string) => request<Product>(`/api/products/${id}`),
    create: (data: FormData) =>
      request<Product>("/api/products", { method: "POST", body: data, headers: {} as any }),
    update: (id: string, data: FormData) =>
      request<Product>(`/api/products/${id}`, { method: "PATCH", body: data, headers: {} as any }),
    delete: (id: string) => request(`/api/products/${id}`, { method: "DELETE" }),
  },
  orders: {
    list: () => request<Order[]>("/api/orders"),
    get: (id: string) => request<Order>(`/api/orders/${id}`),
    create: (data: { items: CreateOrderItem[]; shippingName: string; shippingAddress: string; shippingCity: string; shippingState: string; shippingZip: string; paymentMethod?: string; note?: string; isCustomOrder?: boolean; customConfig?: Record<string, unknown> }) =>
      request<Order>("/api/orders", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<Order>(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },
  users: {
    list: () => request<User[]>("/api/users"),
    get: (id: string) => request<User>(`/api/users/${id}`),
    update: (id: string, data: Partial<User>) =>
      request<User>(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/users/${id}`, { method: "DELETE" }),
  },
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  paymentMethod: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  note?: string;
  isCustomOrder: boolean;
  customConfig?: Record<string, unknown>;
  createdAt: string;
  items: OrderItem[];
  user?: { id: string; email: string; firstName: string; lastName: string };
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  name: string;
  productId?: string;
}

export interface CreateOrderItem {
  productId?: string;
  quantity: number;
  price: number;
  name: string;
}

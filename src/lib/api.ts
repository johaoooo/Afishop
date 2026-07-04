// Un seul fichier pour tous les appels au backend.
// Le backend (Node/Express/Prisma) répond toujours sous la forme :
//   succès -> { status: 'ok', ...données }
//   erreur -> { status: 'error', message, errors? }

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  Product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  createdAt: string;
  OrderItem: OrderItem[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

// Petite classe d'erreur pour transporter le message + les erreurs de champ
export class ApiError extends Error {
  fieldErrors?: { field: string; message: string }[];
  constructor(message: string, fieldErrors?: { field: string; message: string }[]) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('afi_token');

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.status === 'error') {
    throw new ApiError(data.message || 'Une erreur est survenue', data.errors);
  }

  return data;
}

// ---- Auth -----------------------------------------------------------
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  me: () => request<{ user: User }>('/auth/me'),
};

// ---- Produits ---------------------------------------------------------
export const productsApi = {
  getAll: (filters?: { category?: string; brand?: string; search?: string }) => {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    return request<{ count: number; products: Product[] }>(`/products${params ? `?${params}` : ''}`);
  },

  getById: (id: number | string) => request<{ product: Product }>(`/products/${id}`),
};

// ---- Commandes ----------------------------------------------------------
export const ordersApi = {
  create: (
    items: { productId: number; quantity: number }[],
    address: { street: string; city: string; postalCode?: string; country: string; phone: string }
  ) =>
    request<{ order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, ...address }),
    }),

  getMine: () => request<{ count: number; orders: Order[] }>('/orders'),

  getById: (id: number | string) => request<{ order: Order }>(`/orders/${id}`),
};

// ---- Paiement (Kkiapay) -------------------------------------------------
export const paymentsApi = {
  verify: (transactionId: string, orderId: number | string) =>
    request<{ order: Order }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ transactionId, orderId }),
    }),
};

// ---- Contact --------------------------------------------------------
export const contactApi = {
  send: (message: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    request<{ message: string }>('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    }),
};

// ---- Formations -------------------------------------------------------
export interface Training {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number;
  modules: string[];
  students: number;
  image: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export const trainingsApi = {
  getAll: () => request<{ count: number; trainings: Training[] }>('/trainings'),
  getById: (id: number | string) => request<{ training: Training }>(`/trainings/${id}`),
};

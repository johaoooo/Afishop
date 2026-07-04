import { apiClient } from '../client';

export const adminApi = {
  // ============================================================
  // STATISTIQUES
  // ============================================================
  getStats: async () => {
    const { data } = await apiClient.get('/admin/stats');
    return data;
  },

  // ============================================================
  // COMMANDES
  // ============================================================
  getAllOrders: async () => {
    const { data } = await apiClient.get('/orders/admin/all');
    return data.orders;
  },
  updateOrderStatus: async (id: number, status: string) => {
    const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
    return data.order;
  },

  // ============================================================
  // PRODUITS
  // ============================================================
  getProducts: async () => {
    const { data } = await apiClient.get('/products');
    return data.products;
  },
  createProduct: async (payload: any) => {
    const { data } = await apiClient.post('/products', payload);
    return data.product;
  },
  updateProduct: async (id: number, payload: any) => {
    const { data } = await apiClient.put(`/products/${id}`, payload);
    return data.product;
  },
  deleteProduct: async (id: number) => {
    await apiClient.delete(`/products/${id}`);
  },

  // ============================================================
  // UTILISATEURS
  // ============================================================
  getUsers: async () => {
    const { data } = await apiClient.get('/admin/users');
    return data.users;
  },
  updateUser: async (id: number, payload: any) => {
    const { data } = await apiClient.put(`/admin/users/${id}`, payload);
    return data.user;
  },
  deleteUser: async (id: number) => {
    await apiClient.delete(`/admin/users/${id}`);
  },

  // ============================================================
  // FORMATIONS
  // ============================================================
  getTrainings: async () => {
    const { data } = await apiClient.get('/trainings');
    return data.trainings;
  },
  createTraining: async (payload: any) => {
    const { data } = await apiClient.post('/trainings', payload);
    return data.training;
  },
  updateTraining: async (id: number, payload: any) => {
    const { data } = await apiClient.put(`/trainings/${id}`, payload);
    return data.training;
  },
  deleteTraining: async (id: number) => {
    await apiClient.delete(`/trainings/${id}`);
  },

  // ============================================================
  // MESSAGES
  // ============================================================
  getMessages: async () => {
    const { data } = await apiClient.get('/messages');
    return data.messages;
  },
  markMessageAsRead: async (id: number) => {
    const { data } = await apiClient.patch(`/messages/${id}/read`);
    return data.message;
  },
  deleteMessage: async (id: number) => {
    await apiClient.delete(`/messages/${id}`);
  },
};

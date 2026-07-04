import { apiClient } from '../client';

export const adminApi = {
  // --- Commandes ---
  getAllOrders: async () => {
    const { data } = await apiClient.get('/orders/admin/all');
    return data.orders;
  },
  updateOrderStatus: async (id: number, status: string) => {
    const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
    return data.order;
  },

  // --- Produits ---
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

  // --- Formations ---
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

  // --- Messages ---
  getMessages: async () => {
    const { data } = await apiClient.get('/messages');
    return data.messages;
  },
  markMessageAsRead: async (id: number) => {
    const { data } = await apiClient.patch(`/messages/${id}/read`);
    return data.message;
  },
};

import { api } from './axiosInstance';

export const listOrders = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
  const { data } = await api.get('/api/orders', { params: cleanParams });
  return data;
};

export const getOrder = async (id) => {
  const { data } = await api.get(`/api/orders/${id}`);
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await api.post('/api/orders', payload);
  return data;
};

export const cancelOrder = async (id) => {
  const { data } = await api.patch(`/api/orders/${id}/cancel`);
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.patch(`/api/orders/${id}/status`, { status });
  return data;
};

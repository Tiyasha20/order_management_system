import { api } from './axiosInstance';

export const signupRequest = async (payload) => {
  const headers = payload.adminKey ? { 'x-admin-key': payload.adminKey } : {};
  const body = { ...payload };
  delete body.adminKey;
  const { data } = await api.post('/api/auth/signup', body, { headers });
  return data;
};

export const loginRequest = async (payload) => {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
};

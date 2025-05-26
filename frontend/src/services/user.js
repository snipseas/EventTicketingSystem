import api from './api';

export const getUserProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await api.put('/users/me', data);
  return response.data;
};

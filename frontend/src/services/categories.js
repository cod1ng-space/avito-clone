import api from './api';

export const categoriesService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};
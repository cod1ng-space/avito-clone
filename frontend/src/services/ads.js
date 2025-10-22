import api from './api';

export const adsService = {
  getAll: async (params = {}) => {
    const response = await api.get('/ads', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/ads/${id}`);
    return response.data;
  },

  getUserAds: async (page = 1, limit = 12) => {
    const response = await api.get('/my-ads', { 
      params: { page, limit } 
    });
    return response.data;
  },

  search: async (query, categoryId, page = 1, limit = 12) => {
      const params = {
          q: query || '',
          page,
          limit
      };
      
      if (categoryId) {
          params.category = categoryId;
      }

      const response = await api.get('/ads', {
          params
      });
      return response.data;
  },

  create: async (adData) => {
    const response = await api.post('/ads', adData);
    return response.data;
  },

  update: async (id, adData) => {
    const response = await api.put(`/ads/${id}`, adData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/ads/${id}`);
    return response.data;
  },

  addImages: async (id, formData) => {
    const response = await api.post(`/ads/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteImage: async (imageId) => {
    const response = await api.delete(`/images/${imageId}`);
    return response.data;
  }
};
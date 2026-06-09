import api from './api';

export const marmitaService = {
  getAll: async () => {
    const response = await api.get('/Marmitas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/Marmitas/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/Marmitas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/Marmitas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/Marmitas/${id}`);
    return response.data;
  },

  uploadImage: async (formData) => {
    const response = await api.post('/Marmitas/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

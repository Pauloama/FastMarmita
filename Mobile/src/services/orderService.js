import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/Pedidos', orderData);
    return response.data;
  },
  
  getOrders: async () => {
    const response = await api.get('/Pedidos');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/Pedidos/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/Pedidos/${id}/status`, status, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
  },

  getReports: async (start, end) => {
    const response = await api.get(`/Pedidos/report?start=${start}&end=${end}`);
    return response.data;
  }
};

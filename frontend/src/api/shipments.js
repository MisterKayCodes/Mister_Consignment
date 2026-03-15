import axios from 'axios';

const api = axios.create({
  baseURL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/')
    : '/api/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const shipmentApi = {
  getShipment: (trackingId) => api.get(`/shipments/${trackingId}`),
  createShipment: (data) => api.post(`/shipments/`, data),
  addHistory: (id, data) => api.post(`/shipments/${id}/history`, null, { params: data }),
  updateHistory: (id, data) => api.put(`/shipments/history/${id}`, null, { params: data }),
  deleteHistory: (id) => api.delete(`/shipments/history/${id}`),
  deleteShipment: (id) => api.delete(`/shipments/${id}`),
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getInvoiceUrl: (trackingId) => `${api.defaults.baseURL}/shipments/${trackingId}/invoice`,
  api: api
};

export const supportApi = {
  createTicket: (data) => api.post('/support/', data),
  getTicket: (id) => api.get(`/support/${id}`),
  addMessage: (id, data) => api.post(`/support/${id}/messages`, data),
  listTickets: () => api.get('/support/'),
  updateStatus: (id, status) => api.patch(`/support/${id}/status`, null, { params: { status } })
};

export default api;

import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Add token to headers if it exists
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const getPortfolioData = () => API.get('/portfolio/data');
export const updateBio = (data) => API.post('/portfolio/bio', data);

// Generic CRUD
export const addItem = (type, data) => API.post(`/portfolio/${type}`, data);
export const updateItem = (type, id, data) => API.put(`/portfolio/${type}/${id}`, data);
export const deleteItem = (type, id) => API.delete(`/portfolio/${type}/${id}`);

// Reorder
export const reorderItems = (type, orders) => API.post(`/portfolio/${type}/reorder`, { orders });

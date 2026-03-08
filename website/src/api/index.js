import axios from 'axios';

const API = axios.create({ 
  baseURL: (import.meta.env.VITE_API_URL || 'https://myportfolio-tn8r.onrender.com/api').replace(/\/$/, '') + '/'
});

export const getPortfolioData = () => API.get('portfolio/data');

export default API;

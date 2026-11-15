import axios from 'axios';

// Backend kaynagi.
// - Gelistirme: bos birakilir, istekler '/api' olarak gider ve package.json'daki
//   proxy ayari bunu http://localhost:8001 adresine yonlendirir.
// - Uretim: Render uzerindeki FastAPI servisi.
// REACT_APP_BACKEND_URL tanimliysa her iki durumda da o kazanir.
const DEFAULT_BACKEND =
  process.env.NODE_ENV === 'production' ? 'https://islamapp2.onrender.com' : '';
const RAW_BACKEND_URL = process.env.REACT_APP_BACKEND_URL ?? DEFAULT_BACKEND;
// Sondaki '/' karakterlerini at, yoksa '//api' gibi cift slash olusur.
const API_URL = RAW_BACKEND_URL.replace(/\/+$/, '');

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Reject HTML responses masquerading as API data (e.g. SPA fallback on hosting)
api.interceptors.response.use((response) => {
  if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
    return Promise.reject(new Error('Received HTML instead of JSON'));
  }
  return response;
});

export default api;

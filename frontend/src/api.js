import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Reject HTML responses masquerading as API data (e.g. SPA fallback on hosting)
api.interceptors.response.use((response) => {
  if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
    return Promise.reject(new Error('Received HTML instead of JSON'));
  }
  return response;
});

export default api;

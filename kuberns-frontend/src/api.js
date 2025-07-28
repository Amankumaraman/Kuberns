import axios from 'axios';

const API_BASE_URL = 'https://kuberns-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for auth if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createWebApp = (data) => api.post('/webapps/', data);
export const getWebApps = () => api.get('/webapps/');
export const deployApp = (data) => api.post('/deployments/', data);
export const getDeploymentLogs = (instanceId) => api.get(`/deployments/${instanceId}/logs/`);

export default api;

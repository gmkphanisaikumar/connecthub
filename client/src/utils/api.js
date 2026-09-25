import axios from 'axios';

// Automatically detect whether we are on localhost or in deployed production
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0');

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  (isLocalhost ? 'http://localhost:5000' : 'https://connecthub-0aqv.onrender.com');

export const API_URL =
  import.meta.env.VITE_API_URL || `${SERVER_URL}/api`;

// Helper: Normalize image URLs from backend
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SERVER_URL}${cleanPath}`;
};

// Create a reusable Axios instance with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Request Interceptor =====
// Automatically attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== Response Interceptor =====
// Handle expired tokens globally without breaking failed login/register error toasts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Token expired or invalid during an authenticated request
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/landing' &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

// Create a reusable Axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Our backend URL
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
// Handle expired tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — log the user out
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';
import { API_BASE_URL as BASE_URL } from './apiPath';

const axiosInstance = axios.create({
  baseURL: BASE_URL,  // e.g. http://localhost:8000/api/v1 or production URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (status === 500) {
        console.error('Server error:', error.response.data);
        alert('Server error. Please try again later.');
      }
    } else if (error.code === 'ECONNABORTED') {
      alert('Request timed out. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Debug log for all requests
axiosInstance.interceptors.request.use(config => {
  console.log("➡️ Axios Request URL:", config.baseURL + config.url);
  return config;
});

export default axiosInstance;

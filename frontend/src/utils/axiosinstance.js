// utils/axiosinstance.js
import axios from 'axios';
import { API_BASE_URL as BASE_URL } from './apiPath';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // optional, 10 seconds timeout
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
        // 🔹 Token invalid or expired — log out user
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // if you store user data
        window.location.href = '/login'; // force redirect
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

export default axiosInstance;

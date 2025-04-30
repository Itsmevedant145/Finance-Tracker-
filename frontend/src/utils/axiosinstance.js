import axios from 'axios';
import { API_BASE_URL as BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // ✅ Corrected to getItem
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;

        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = '/login'; // Redirect to login page
            } else if (error.response.status === 500) {
                alert('Server error. Please try again later.');
            }
        } else if (error.code === 'ECONNABORTED') {
            alert('Request timed out. Please try again.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 
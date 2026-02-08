import axios from 'axios';
import { store } from '../store/store';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Automatically add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Redux store
    const state = store.getState();
    const token = state.auth.token;

    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Error (Unauthenticated) handling
    if (error.response?.status === 401) {
      // Logout or redirect to login page
      console.error('Authentication expired. Please login again.');
      // if needed: store.dispatch(logout());
      // if needed: window.location.href = '/';
    }

    // 403 Error (Forbidden)
    if (error.response?.status === 403) {
      console.error('Access denied.');
    }

    // 500 Error (Server Error)
    if (error.response?.status === 500) {
      console.error('Server error occurred.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
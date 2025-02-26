import axios from 'axios';

// Base URL
const BASE_URL = 'http://localhost:8000';

// Configure axios defaults
axios.defaults.baseURL = BASE_URL;

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    // Don't modify auth URLs which already have /api in them
    if (!config.url.includes('/api/signin') && !config.url.includes('/api/signup')) {
      // Check if this is a relative URL (not an absolute URL with http:// or https://)
      if (!config.url.startsWith('http')) {
        // Check if the URL already has /api prefix
        if (!config.url.startsWith('/api/')) {
          // Remove any leading slash
          const cleanUrl = config.url.replace(/^\/+/, '');
          // Add the /api/ prefix
          config.url = `/api/${cleanUrl}`;
        }
      }
    }
    
    // Add token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
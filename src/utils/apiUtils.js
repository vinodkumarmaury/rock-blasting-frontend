// filepath: /d:/7th sem/BTP/Software/rock-blasting-frontend/src/utils/apiUtils.js
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Implement token refresh logic here if needed
        // const newToken = await refreshToken();
        // localStorage.setItem('token', newToken);
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        localStorage.removeItem('token');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API hooks for common operations
export const useApi = () => {
  const { showNotification } = useNotification();

  const handleError = (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    showNotification(message, 'error');
    throw error;
  };

  return {
    get: async (endpoint, config = {}) => {
      try {
        const response = await api.get(endpoint, config);
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },

    post: async (endpoint, data, config = {}) => {
      try {
        const response = await api.post(endpoint, data, config);
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },

    put: async (endpoint, data, config = {}) => {
      try {
        const response = await api.put(endpoint, data, config);
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },

    delete: async (endpoint, config = {}) => {
      try {
        const response = await api.delete(endpoint, config);
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },

    upload: async (endpoint, file, onProgress) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await api.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress?.(percentCompleted);
          }
        });
        return response.data;
      } catch (error) {
        handleError(error);
      }
    }
  };
};

// API endpoints
export const endpoints = {
  auth: {
    login: '/signin',
    register: '/signup',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    profile: '/profile',
    updateProfile: '/update-profile'
  },
  predictions: {
    create: '/predict',
    list: '/predictions',
    details: (id) => `/predictions/${id}`
  },
  rockData: {
    create: '/rock-data',
    list: '/rock-data',
    details: (id) => `/rock-data/${id}`
  },
  settings: {
    get: '/settings',
    update: '/settings'
  },
  preferences: {
    get: '/preferences',
    update: '/preferences'
  }
};

/**
 * Builds a proper API URL ensuring no duplicate /api/ paths
 */
export const buildApiUrl = (endpoint) => {
  // Clean the endpoint by removing any leading slashes
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  
  // Always use a consistent format
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

/**
 * Makes an API call with authentication
 */
export const callApi = async (method, endpoint, data = null) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const url = buildApiUrl(endpoint);
  console.log(`Making ${method} request to: ${url}`);
  
  const config = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  
  if (data) {
    config.data = data;
  }
  
  try {
    return await axios(config);
  } catch (error) {
    console.error(`Error in ${method} request to ${url}:`, error);
    throw error;
  }
};

export default api;
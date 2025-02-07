// Form validation utilities
export const validators = {
  required: (value) => ({
    isValid: !!value && value.toString().trim().length > 0,
    message: 'This field is required'
  }),

  email: (value) => ({
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  }),

  minLength: (length) => (value) => ({
    isValid: value && value.length >= length,
    message: `Must be at least ${length} characters`
  }),

  maxLength: (length) => (value) => ({
    isValid: value && value.length <= length,
    message: `Must be no more than ${length} characters`
  }),

  numeric: (value) => ({
    isValid: !isNaN(value) && value !== '',
    message: 'Must be a number'
  }),

  range: (min, max) => (value) => ({
    isValid: !isNaN(value) && value >= min && value <= max,
    message: `Must be between ${min} and ${max}`
  }),

  password: (value) => ({
    isValid: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
    message: 'Password must be at least 8 characters and contain both letters and numbers'
  }),

  match: (matchValue, fieldName) => (value) => ({
    isValid: value === matchValue,
    message: `Must match ${fieldName}`
  })
};

export const validateField = (value, validations = []) => {
  for (const validation of validations) {
    const result = validation(value);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true, message: '' };
};

export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const validations = validationRules[field];
    const result = validateField(value, validations);

    if (!result.isValid) {
      errors[field] = result.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};

import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
    login: '/api/signin',
    register: '/api/signup',
    forgotPassword: '/api/forgot-password',
    resetPassword: '/api/reset-password',
    profile: '/api/profile',
    updateProfile: '/api/update-profile'
  },
  predictions: {
    create: '/api/predict',
    list: '/api/predictions',
    details: (id) => `/api/predictions/${id}`
  },
  rockData: {
    create: '/api/rock-data',
    list: '/api/rock-data',
    details: (id) => `/api/rock-data/${id}`
  }
};

export default api;
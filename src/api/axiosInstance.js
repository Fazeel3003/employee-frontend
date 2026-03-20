import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY || 'ems_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't handle 401 here - let AuthContext handle it
    // This prevents duplicate token clearing
    return Promise.reject(error);
  }
);

export default axiosInstance;
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request debugging interceptor (TEMPORARY)
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.baseURL + config.url);
    
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY || 'ems_token');
    console.log("Token found:", !!token);
    console.log("Token value:", token ? token.substring(0, 20) + "..." : "none");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set:", config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.config?.url);
    
    // Don't handle 401 here - let AuthContext handle it
    // This prevents duplicate token clearing
    return Promise.reject(error);
  }
);

export default axiosInstance;
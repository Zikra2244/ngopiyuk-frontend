// frontend/src/services/api.js
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

// Buat instance axios
const api = axios.create({
  baseURL: API_URL,
});
console.log("API baseURL (from VITE):", API_URL);

// Interceptor untuk request → otomatis tambahin token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk response → auto logout kalau 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect ke login
    }
    return Promise.reject(error);
  }
);

export default api;

// lib/api.ts
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030"}/api`;
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

let token: string | null = null;

export const setAuthToken = (authToken: string) => {
  token = authToken;
};

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

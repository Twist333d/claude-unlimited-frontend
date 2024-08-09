import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("supabase.auth.token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, handleApiError);

apiClient.interceptors.response.use((response) => response, handleApiError);

export default apiClient;

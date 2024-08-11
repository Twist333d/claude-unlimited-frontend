// api/client.js
import axios from "axios";
import { handleApiError } from "../utils/errorHandler";
import { logger } from "../utils/logger";
import { supabase } from "../auth/supabaseClient";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession(); // Redundant session fetching
    if (session?.access_token) {
      config.headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    logger.error("Request interceptor error:", error);
    return Promise.reject(handleApiError(error));
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data, error: refreshError } =
          await supabase.auth.refreshSession(); // Redundant session refresh
        if (refreshError) throw refreshError;
        if (data.session) {
          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${data.session.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        logger.error("Token refresh failed:", refreshError);
        return Promise.reject(handleApiError(refreshError));
      }
    }
    logger.error("Response interceptor error:", error);
    return Promise.reject(handleApiError(error));
  },
);
export default apiClient;

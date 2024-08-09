import axios from "axios";
import supabase from "../auth/supabaseClient";
import { handleApiError } from "../utils/errorHandler";
import { logger } from "../utils/logger";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  timeout: 10000,
  timeoutErrorMessage: "Request timeout",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    logger.error(`Request interceptor error: ${error.message}`, error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error(`Response interceptor error: ${error.message}`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
    });
    return handleApiError(error);
  },
);

export default apiClient;

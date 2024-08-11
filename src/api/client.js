import axios from "axios";
import { handleApiError } from "../utils/errorHandler";
import { logger } from "../utils/logger";

const createApiClient = (getToken, refreshSession) => {
  const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  apiClient.interceptors.request.use(
    async (config) => {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
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
          const newSession = await refreshSession();
          if (newSession) {
            originalRequest.headers["Authorization"] =
              `Bearer ${newSession.access_token}`;
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

  return apiClient;
};

export default createApiClient;

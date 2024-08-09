import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";
import { logger } from "../utils/logger";
import { getErrorMessage } from "../utils/errorHandler";

const standardizeResponse = (response) => ({
  success: true,
  data: response.data,
  metadata: {
    status: response.status,
    headers: response.headers,
    // Add any other relevant metadata
  },
  error: null,
});

const handleResponse = (response) => {
  logger.info(`API call successful: ${response.config.url}`);
  return standardizeResponse(response);
};

const handleError = (error) => {
  logger.error(`API call failed: ${error.config?.url || "Unknown URL"}`, error);
  return {
    success: false,
    data: null,
    metadata: null,
    error: getErrorMessage(error),
  };
};

export const apiMethods = {
  // Generic methods
  get: async (url, params) => {
    try {
      const response = await apiClient.get(url, { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  post: async (url, data) => {
    try {
      const response = await apiClient.post(url, data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  put: async (url, data) => {
    try {
      const response = await apiClient.put(url, data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  patch: async (url, data) => {
    try {
      const response = await apiClient.patch(url, data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (url) => {
    try {
      const response = await apiClient.delete(url);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Specific API methods (using generic methods)
  getConversations: () => apiMethods.get(ENDPOINTS.CONVERSATIONS),

  getMessages: (conversationId) =>
    apiMethods.get(ENDPOINTS.MESSAGES(conversationId)),

  sendMessage: (conversationId, message) =>
    apiMethods.post(ENDPOINTS.CHAT, {
      conversation_id: conversationId,
      message,
    }),

  getUsage: (conversationId) =>
    apiMethods.get(ENDPOINTS.USAGE, { conversation_id: conversationId }),

  // Add these methods if your API supports them
  updateConversation: (conversationId, data) =>
    apiMethods.put(ENDPOINTS.CONVERSATIONS + `/${conversationId}`, data),

  deleteConversation: (conversationId) =>
    apiMethods.delete(ENDPOINTS.CONVERSATIONS + `/${conversationId}`),
};

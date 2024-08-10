// methods.js
import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";
import { logger } from "../utils/logger";
import { handleApiError } from "../utils/errorHandler";

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
  const classifiedError = handleApiError(error);
  return {
    success: false,
    data: null,
    metadata: null,
    error: classifiedError,
  };
};

const createApiMethod =
  (method) =>
  async (...args) => {
    try {
      const response = await method(...args);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };

export const apiMethods = {
  // Generic methods
  get: createApiMethod(apiClient.get),
  post: createApiMethod(apiClient.post),
  put: createApiMethod(apiClient.put),
  patch: createApiMethod(apiClient.patch),
  delete: createApiMethod(apiClient.delete),

  // Specific API methods (using generic methods)
  getConversations: () => apiMethods.get(ENDPOINTS.CONVERSATIONS),

  getMessages: (conversationId) =>
    apiMethods.get(ENDPOINTS.MESSAGES(conversationId)),

  sendMessage: (conversationId, message) =>
    apiMethods.post(ENDPOINTS.CHAT, {
      conversation_id: conversationId,
      message,
    }),

  getUsageStats: (conversationId) =>
    apiMethods.get(ENDPOINTS.USAGE, { conversation_id: conversationId }),
  createNewConversation: (title) =>
    apiMethods.post(ENDPOINTS.CONVERSATIONS, { title }),
};

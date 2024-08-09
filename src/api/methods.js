import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";
import { logger } from "../utils/logger";
import { getErrorMessage } from "../utils/errorHandler";

const standardizeResponse = (data) => ({
  success: true,
  data,
  error: null,
});

const handleResponse = (response) => {
  logger.info(`API call successful: ${response.config.url}`);
  return standardizeResponse(response.data);
};

const handleError = (error) => {
  logger.error(`API call failed: ${error.config.url}`, error);
  return {
    success: false,
    data: null,
    error: getErrorMessage(error),
  };
};

export const apiMethods = {
  getConversations: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.CONVERSATIONS);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getMessages: async (conversationId) => {
    try {
      const response = await apiClient.get(ENDPOINTS.MESSAGES(conversationId));
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  sendMessage: async (conversationId, message) => {
    try {
      const response = await apiClient.post(ENDPOINTS.CHAT, {
        conversation_id: conversationId,
        message,
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getUsage: async (conversationId) => {
    try {
      const response = await apiClient.get(
        `${ENDPOINTS.USAGE}?conversation_id=${conversationId}`,
      );
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

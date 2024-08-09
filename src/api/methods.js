import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";
import { logger } from "../utils/logger";

const handleResponse = (response) => {
  logger.info(`API call successful: ${response.config.url}`);
  return response.data;
};

export const apiMethods = {
  getConversations: async () => {
    const response = await apiClient.get(ENDPOINTS.CONVERSATIONS);
    return handleResponse(response);
  },

  getMessages: async (conversationId) => {
    const response = await apiClient.get(ENDPOINTS.MESSAGES(conversationId));
    return handleResponse(response);
  },

  sendMessage: async (conversationId, message) => {
    const response = await apiClient.post(ENDPOINTS.CHAT, {
      conversation_id: conversationId,
      message,
    });
    return handleResponse(response);
  },

  getUsage: async (conversationId) => {
    const response = await apiClient.get(
      `${ENDPOINTS.USAGE}?conversation_id=${conversationId}`,
    );
    return handleResponse(response);
  },
};

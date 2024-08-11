import { ENDPOINTS } from "./endpoints";
import { logger } from "../utils/logger";
import { handleApiError } from "../utils/errorHandler";

const standardizeResponse = (response) => ({
  success: true,
  data: response.data,
  metadata: {
    status: response.status,
    headers: response.headers,
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

const createApiMethods = (apiClient) => {
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

  return {
    // Generic methods
    get: createApiMethod(apiClient.get),
    post: createApiMethod(apiClient.post),
    put: createApiMethod(apiClient.put),
    patch: createApiMethod(apiClient.patch),
    delete: createApiMethod(apiClient.delete),

    // Specific API methods
    getConversations: () =>
      createApiMethod(apiClient.get)(ENDPOINTS.CONVERSATIONS),
    getMessages: (conversationId) =>
      createApiMethod(apiClient.get)(ENDPOINTS.MESSAGES(conversationId)),
    sendMessage: (conversationId, message) =>
      createApiMethod(apiClient.post)(ENDPOINTS.CHAT, {
        conversation_id: conversationId,
        message,
      }),
    getUsageStats: (conversationId) =>
      createApiMethod(apiClient.get)(ENDPOINTS.USAGE, {
        conversation_id: conversationId,
      }),
    createNewConversation: (title) =>
      createApiMethod(apiClient.post)(ENDPOINTS.CONVERSATIONS, { title }),
  };
};

export default createApiMethods;

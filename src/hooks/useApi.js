// hooks/useApi.js
import { useState, useCallback } from "react";
import { apiMethods } from "../api/methods";
import { logger } from "../utils/logger";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (method, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await method(...args);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    } catch (err) {
      setError(err);
      logger.error("API call failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getConversations: () => callApi(apiMethods.getConversations),
    getMessages: (conversationId) =>
      callApi(apiMethods.getMessages, conversationId),
    sendMessage: (conversationId, message) =>
      callApi(apiMethods.sendMessage, conversationId, message),
    // Add other API methods as needed
  };
};

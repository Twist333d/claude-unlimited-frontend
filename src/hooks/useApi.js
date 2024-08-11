import { useState, useCallback, useMemo } from "react";
import { useAuth } from "./useAuth";
import createApiClient from "../api/client";
import createApiMethods from "../api/methods";
import { logger } from "../utils/logger";

export const useApi = () => {
  const { getToken, refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiClient = useMemo(
    () => createApiClient(getToken, refreshSession),
    [getToken, refreshSession],
  );
  const apiMethods = useMemo(() => createApiMethods(apiClient), [apiClient]);

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
    getMessages: (conversationId, page) =>
      callApi(apiMethods.getMessages, conversationId, page),
    sendMessage: (conversationId, message) =>
      callApi(apiMethods.sendMessage, conversationId, message),
    getUsageStats: (conversationId) =>
      callApi(apiMethods.getUsageStats, conversationId),
    createNewConversation: (title) =>
      callApi(apiMethods.createNewConversation, title),
  };
};

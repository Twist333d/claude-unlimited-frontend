// src/hooks/useApi.js
import { useCallback, useMemo } from "react";
import createApiMethods from "../api/methods";
import { logger } from "../utils/logger";
import { useAuth } from "./useAuth";
import createApiClient from "../api/client";

export const useApi = () => {
  const { getToken, refreshSession } = useAuth();

  const apiClient = useMemo(
    () => createApiClient(getToken, refreshSession),
    [getToken, refreshSession],
  );
  const apiMethods = useMemo(() => createApiMethods(apiClient), [apiClient]);

  const callApi = useCallback(async (method, ...args) => {
    try {
      const result = await method(...args);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    } catch (err) {
      logger.error("API call failed:", err);
      throw err;
    }
  }, []);

  return useMemo(
    () => ({
      getConversations: () => callApi(apiMethods.getConversations),
      getMessages: (conversationId, page) =>
        callApi(apiMethods.getMessages, conversationId, page),
      sendMessage: (conversationId, message) =>
        callApi(apiMethods.sendMessage, conversationId, message),
      getUsageStats: (conversationId) =>
        callApi(apiMethods.getUsageStats, conversationId),
      createNewConversation: (title) =>
        callApi(apiMethods.createNewConversation, title),
    }),
    [apiMethods, callApi],
  );
};

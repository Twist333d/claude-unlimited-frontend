import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { useApi } from "./useApi";
import { logger } from "../utils/logger";

export const useConversations = () => {
  const { session, hasSessionChanged } = useAuth();
  const api = useApi();
  const [state, setState] = useState({
    conversations: [],
    currentConversationId: null,
    loading: false,
    error: null,
  });
  const initialFetchDone = useRef(false);

  const getConversations = useCallback(async () => {
    if (!session || initialFetchDone.current) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));
    logger.info("getConversations called", { sessionId: session.user.id });

    try {
      const result = await api.getConversations();
      setState((prev) => ({
        ...prev,
        conversations: result,
        loading: false,
      }));
      initialFetchDone.current = true;
    } catch (error) {
      logger.error("Failed to fetch conversations:", error);
      setState((prev) => ({ ...prev, error: error.message, loading: false }));
    }
  }, [api, session]);

  useEffect(() => {
    if (session && hasSessionChanged(session)) {
      getConversations();
    } else if (!session) {
      setState({
        conversations: [],
        currentConversationId: null,
        loading: false,
        error: null,
      });
      initialFetchDone.current = false;
    }
  }, [session, hasSessionChanged, getConversations]);

  const selectConversation = useCallback((id) => {
    setState((prev) => ({ ...prev, currentConversationId: id }));
  }, []);

  const startNewConversation = useCallback(
    async (title) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await api.createNewConversation(title);
        setState((prev) => ({
          ...prev,
          conversations: [result, ...prev.conversations],
          currentConversationId: result.id,
          loading: false,
        }));
      } catch (error) {
        logger.error("Failed to create new conversation:", error);
        setState((prev) => ({ ...prev, error: error.message, loading: false }));
      }
    },
    [api],
  );

  const updateConversation = useCallback((id, data) => {
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...data } : conv,
      ),
    }));
  }, []);

  return {
    ...state,
    getConversations,
    selectConversation,
    startNewConversation,
    updateConversation,
  };
};

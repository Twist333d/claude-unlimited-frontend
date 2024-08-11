import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { useApi } from "./useApi";
import { logger } from "../utils/logger";

export const useConversations = () => {
  const { session } = useAuth();
  const api = useApi();
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getConversations = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getConversations();
      setConversations(result);
    } catch (error) {
      logger.error("Failed to fetch conversations:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [api, session]);

  useEffect(() => {
    if (session) {
      getConversations();
    }
  }, [session, getConversations]);

  const selectConversation = useCallback((id) => {
    setCurrentConversationId(id);
  }, []);

  const startNewConversation = useCallback(
    async (title) => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.createNewConversation(title);
        setConversations((prevConversations) => [result, ...prevConversations]);
        setCurrentConversationId(result.id);
      } catch (error) {
        logger.error("Failed to create new conversation:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  const updateConversation = useCallback((id, data) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === id ? { ...conv, ...data } : conv,
      ),
    );
  }, []);

  return {
    conversations,
    currentConversationId,
    loading,
    error,
    getConversations,
    selectConversation,
    startNewConversation,
    updateConversation,
  };
};

// hooks/useConversations.js
import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { conversationService } from "../services/conversationService";
import { logger } from "../utils/logger";

export const useConversations = () => {
  const { session } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sessionRef = useRef(session);

  const getConversations = useCallback(async () => {
    console.log("Fetching conversations...");
    setLoading(true);
    setError(null);
    try {
      const result = await conversationService.getConversations();
      console.log("Conversations result:", result);
      if (result.success) {
        setConversations(result.data);
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      logger.error("Failed to fetch conversations:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    if (sessionRef.current) {
      getConversations();
    }
  }, [getConversations]);

  const selectConversation = useCallback((id) => {
    setCurrentConversationId(id);
  }, []);

  const startNewConversation = useCallback(async (title) => {
    setLoading(true);
    setError(null);
    try {
      const result = await conversationService.createNewConversation(title);
      if (result.success) {
        setConversations((prevConversations) => [
          result.data,
          ...prevConversations,
        ]);
        setCurrentConversationId(result.data.id);
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      logger.error("Failed to create new conversation:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

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

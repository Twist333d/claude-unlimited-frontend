// hooks/useMessages.js
import { useState, useEffect, useCallback } from "react";
import { apiMethods } from "../api/methods";
import { chatService } from "../services/chatService";
import { logger } from "../utils/logger";

export const useMessages = (conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await apiMethods.getMessages(conversationId);
      if (result.success) {
        setMessages(result.data.map(chatService.formatMessage));
      } else {
        throw new Error(result.error.message);
      }
    } catch (err) {
      setError(err);
      logger.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(
    async (content) => {
      if (!conversationId) return;

      try {
        const result = await apiMethods.sendMessage(conversationId, content);
        if (result.success) {
          setMessages((prev) => [
            ...prev,
            chatService.formatMessage(result.data),
          ]);
        } else {
          throw new Error(result.error.message);
        }
      } catch (err) {
        logger.error("Failed to send message:", err);
        // Handle error (e.g., show error message to user)
      }
    },
    [conversationId],
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    refreshMessages: fetchMessages,
  };
};

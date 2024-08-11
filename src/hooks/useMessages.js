// hooks/useMessages.js
import { useState, useEffect, useCallback } from "react";
import { logger } from "../utils/logger";
import { useApi } from "./useApi"; // Import useApi hook

export const useMessages = (conversationId) => {
  const { getMessages, sendMessage } = useApi(); // Leverage useApi for standardized API calls
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getMessages(conversationId);
      setMessages(result);
    } catch (err) {
      setError(err);
      logger.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, getMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = useCallback(
    async (content) => {
      try {
        const result = await sendMessage(conversationId, content);
        setMessages((prev) => [
          ...prev,
          { content, role: "user" },
          { content: result.response, role: "assistant" },
        ]);
        return result;
      } catch (err) {
        logger.error("Failed to send message:", err);
      }
    },
    [conversationId, sendMessage],
  );

  return {
    messages,
    loading,
    error,
    sendMessage: handleSendMessage,
    refreshMessages: fetchMessages,
  };
};

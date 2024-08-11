// hooks/useMessages.js
import { useState, useEffect, useCallback } from "react";
import { logger } from "../utils/logger";
import { useApi } from "./useApi"; // Import useApi hook
import { useError } from "../contexts/ErrorContext";

export const useMessages = (conversationId) => {
  const { getMessages, sendMessage } = useApi(); // Leverage useApi for standardized API calls
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [setCurrentConversationId] = useState(null);
  const { showError } = useError();

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getMessages(conversationId);
      setMessages(result);
    } catch (err) {
      setError(err);
      logger.error("Failed to fetch messages:", err);
      showError({
        type: "ERROR",
        message: "Failed to fetch messages. Please try again.",
      });
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
        let result;
        if (!conversationId) {
          // If no conversation exists, send the message without a conversation_id
          // The backend will create a new conversation
          result = await sendMessage(null, content);
          // Update the conversationId with the new one returned from the backend
          setCurrentConversationId(result.conversation_id);
        } else {
          result = await sendMessage(conversationId, content);
        }
        setMessages((prev) => [
          ...prev,
          { content, role: "user" },
          { content: result.response, role: "assistant" },
        ]);
      } catch (err) {
        logger.error("Failed to send message:", err);
        showError({
          type: "ERROR",
          message: "Failed to send message. Please try again.",
        });
        // Consider adding user-facing error handling here
      }
    },
    [conversationId, sendMessage, setCurrentConversationId],
  );

  return {
    messages,
    loading,
    error,
    sendMessage: handleSendMessage, // Rename for consistency
    refreshMessages: fetchMessages,
  };
};

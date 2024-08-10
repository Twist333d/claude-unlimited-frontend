// Keep track of the current conversation
// Provide methods to change the current conversation
// Handle conversation metadata updates

// hooks/useConversations.js
import { useState, useCallback } from "react";
import { conversationService } from "../services/conversationService";
import { logger } from "../utils/logger";

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await conversationService.getConversations();
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

  return { conversations, loading, error, getConversations };
};

// hooks/useConversations.js
import { useState, useCallback, useEffect } from "react";
import { logger } from "../utils/logger";
import { useApi } from "./useApi";

export const useUsage = (session, currentConversationId) => {
  const [usage, setUsage] = useState({ total_tokens: 0, total_cost: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getUsageStats } = useApi();

  const fetchUsage = useCallback(async () => {
    if (!session || !currentConversationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUsageStats(currentConversationId);
      setUsage(data);
    } catch (err) {
      setError(err);
      logger.error("Failed to fetch usage stats:", err);
    } finally {
      setLoading(false);
    }
  }, [session, currentConversationId, getUsageStats]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { usage, loading, error, fetchUsage };
};

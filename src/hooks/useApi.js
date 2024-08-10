export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    // Add other API methods as needed
  };
};
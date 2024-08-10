export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
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

  const selectConversation = useCallback((id) => {
    setCurrentConversationId(id);
  }, []);

  const startNewConversation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await conversationService.createConversation();
      if (result.success) {
        setConversations((prevConversations) => [
          ...prevConversations,
          result.data,
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

import React, { useState, useEffect, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import axios from 'axios';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { colors, spacing, borderRadius, shadows, breakpoints, zIndex, fontSizes, fontWeights, typography } from './styles/designSystem';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import UsageStats from './components/UsageStats';
import GlobalStyle from './styles/globalStyles';

const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  fontSizes,
  fontWeights,
  typography
};

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const Sidebar = styled.div`
  width: ${props => props.$isCollapsed ? '60px' : '250px'};
  background-color: ${props => props.theme.colors.white};
  border-right: 1px solid ${props => props.theme.colors.gray300};
  transition: width 0.3s ease;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  z-index: ${props => props.theme.zIndex.sticky};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: ${props => props.$isCollapsed ? '-60px' : '0'};
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NewConversationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.fountainBlue};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.baliHai};
  }
`;

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState(null);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/conversations');
      setConversations(response.data);
      if (response.data.length > 0 && !currentConversationId) {
        setCurrentConversationId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to fetch conversations. Please try again.');
    }
  }, [currentConversationId]);

  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:5000/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please try again.');
    }
  }, []);

  const fetchUsage = useCallback(async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:5000/usage?conversation_id=${conversationId}`);
      setUsage(response.data);
    } catch (error) {
      console.error('Error fetching usage:', error);
      setError('Failed to fetch usage stats. Please try again.');
    }
  }, []);

  const startNewConversation = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:5000/conversations');
      setCurrentConversationId(response.data.conversation_id);
      setMessages([]);
      fetchConversations();
    } catch (error) {
      console.error('Error starting new conversation:', error);
      setError('Failed to start a new conversation. Please try again.');
    }
  }, [fetchConversations]);

  const handleSend = useCallback(async (input) => {
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        conversation_id: currentConversationId,
        messages: [...messages, userMessage]
      });

      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: response.data.response }
      ]);

      fetchUsage(currentConversationId);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, messages, fetchUsage]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId);
      fetchUsage(currentConversationId);
    }
  }, [currentConversationId, fetchMessages, fetchUsage]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Sidebar $isCollapsed={leftSidebarCollapsed}>
          <ToggleButton onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}>
            {leftSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </ToggleButton>
          <NewConversationButton onClick={startNewConversation}>
            <PlusCircle size={24} style={{ marginRight: spacing.sm }} />
            {!leftSidebarCollapsed && "New Conversation"}
          </NewConversationButton>
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={setCurrentConversationId}
            isCollapsed={leftSidebarCollapsed}
          />
        </Sidebar>
        <MainContent>
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSend={handleSend}
          />
        </MainContent>
        <Sidebar $isCollapsed={rightSidebarCollapsed}>
          <ToggleButton onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}>
            {rightSidebarCollapsed ? <ChevronLeft /> : <ChevronRight />}
          </ToggleButton>
          <UsageStats usage={usage} isCollapsed={rightSidebarCollapsed} />
        </Sidebar>
      </AppContainer>
    </ThemeProvider>
  );
}

export default React.memo(App);
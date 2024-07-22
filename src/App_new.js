import React, { useState, useEffect, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import axios from 'axios';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { colors, spacing, borderRadius, shadows, breakpoints, zIndex, fontSizes, fontWeights, typography } from './styles/designSystem';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import UsageStats from './components/UsageStats';
import GlobalStyle from './styles/globalStyles';
import config from './config';

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
  position: relative;
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const LeftSidebarHoverArea = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 10px;
  z-index: ${props => props.theme.zIndex.sticky + 1};
`;

const LeftSidebar = styled.div`
  position: fixed;
  top: 0;
  left: ${props => (props.$isCollapsed && !props.$hovered) ? '-190px' : '0'};
  width: ${props => props.$isCollapsed ? '60px' : '280px'};
  height: 100vh;
  background-color: ${props => props.theme.colors.white};
  border-right: 1px solid ${props => props.theme.colors.gray300};
  transition: left 0.2s ease, width 0.3s ease;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  z-index: ${props => props.theme.zIndex.sticky};
  &:hover {
    left: 0;
    width: 280px;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  ${props => props.$isLeft ? 'left: 0;' : 'right: 0;'}
  width: ${props => props.$isCollapsed ? '60px' : '280px'}; // Increased from 250px
  height: 100vh;
  background-color: ${props => props.theme.colors.white};
  border-right: 1px solid ${props => props.theme.colors.gray300};
  transition: width 0.3s ease;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.md};
  z-index: ${props => props.theme.zIndex.sticky};
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  margin-left: ${props => props.$leftSidebarWidth};
  margin-right: ${props => props.$rightSidebarWidth};
  overflow-y: auto;
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
  font-family: ${props => props.theme.typography.fontFamily.sansSerif};

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
  const [leftSidebarHovered, setLeftSidebarHovered] = useState(false);

    const fetchConversations = useCallback(async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/conversations`);
      setConversations(response.data);
      if (response.data.length > 0 && !currentConversationId) {
        setCurrentConversationId(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, [currentConversationId]);

  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const response = await axios.get(`${config.apiUrl}/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  const fetchUsage = useCallback(async (conversationId) => {
    try {
      const response = await axios.get(`${config.apiUrl}/usage?conversation_id=${conversationId}`);
      setUsage(response.data);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  }, []);

  const startNewConversation = useCallback(async () => {
    try {
      const response = await axios.post(`${config.apiUrl}/conversations`);
      const newConversationId = response.data.conversation_id;
      setCurrentConversationId(newConversationId);
      setMessages([]);
      setConversations(prevConversations => [
        { id: newConversationId, created_at: new Date().toISOString(), first_message: 'New conversation' },
        ...prevConversations
      ]);
    } catch (error) {
      console.error('Error starting new conversation:', error);
    }
  }, []);

  const handleSend = useCallback(async (input) => {
    if (!input.trim() || isLoading) return;

    const newMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${config.apiUrl}/chat`, {
        conversation_id: currentConversationId,
        messages: [input]
      });

      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: response.data.response }
      ]);

      fetchUsage(currentConversationId);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, isLoading, fetchUsage]);

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
        <LeftSidebarHoverArea
          onMouseEnter={() => setLeftSidebarHovered(true)}
          onMouseLeave={() => setLeftSidebarHovered(false)}
        />
        <LeftSidebar $isCollapsed={leftSidebarCollapsed} $hovered={leftSidebarHovered}>
          <NewConversationButton onClick={startNewConversation}>
            <PlusCircle size={24} style={{ marginRight: spacing.sm }} />
            New Conversation
          </NewConversationButton>
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={setCurrentConversationId}
            isCollapsed={leftSidebarCollapsed}
          />
        </LeftSidebar>
        <MainContent
          $leftSidebarWidth={leftSidebarCollapsed ? '60px' : '280px'}
          $rightSidebarWidth={rightSidebarCollapsed ? '0' : '280px'}
        >
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSend={handleSend}
          />
        </MainContent>
        <Sidebar $isLeft={false} $isCollapsed={rightSidebarCollapsed}>
          <ToggleButton onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}>
            {rightSidebarCollapsed ? <ChevronLeft /> : <ChevronRight />}
          </ToggleButton>
          <UsageStats usage={usage} isCollapsed={rightSidebarCollapsed} />
        </Sidebar>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
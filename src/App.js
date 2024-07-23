import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import UsageStats from './components/UsageStats';
import config from './config';
import './index.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState(null);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [leftSidebarHovered, setLeftSidebarHovered] = useState(false);

  const toggleLeftSidebar = () => {
    setLeftSidebarCollapsed((prevState) => !prevState);
  };

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
  <div className="relative flex h-screen bg-porcelain text-oxford-blue">
    <div
      className={`fixed top-0 left-0 bottom-0 w-10 z-50 ${
        leftSidebarHovered ? 'bg-gray-200' : 'bg-transparent'
      }`}
      onMouseEnter={() => setLeftSidebarHovered(true)}
      onMouseLeave={() => setLeftSidebarHovered(false)}
    >
      <button
        className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition"
        onClick={toggleLeftSidebar}
      >
        {leftSidebarCollapsed ? <ChevronRightIcon className="h-6 w-6" /> : <ChevronLeftIcon className="h-6 w-6" />}
      </button>
    </div>
    <div
      className={`fixed top-0 left-0 h-screen transition-all duration-300 ${
        leftSidebarCollapsed && !leftSidebarHovered
          ? 'w-16 -translate-x-[190px]'
          : 'w-72 translate-x-0 bg-white border-r border-gray-300 shadow-md z-40'
      }`}
    >
      {!leftSidebarCollapsed && (
        <>
          <button
            className="flex items-center justify-center bg-fountain-blue text-white rounded-md px-4 py-2 m-4 transition hover:bg-bali-hai"
            onClick={startNewConversation}
          >
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            New Conversation
          </button>
          <ConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={setCurrentConversationId}
            isCollapsed={leftSidebarCollapsed}
          />
        </>
      )}
    </div>
    <main className={`flex-1 flex justify-center overflow-y-auto ${leftSidebarCollapsed ? 'ml-16' : 'ml-72'} ${rightSidebarCollapsed ? 'mr-0' : 'mr-72'}`}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSend={handleSend}
      />
    </main>
    <div
      className={`fixed top-0 right-0 h-screen transition-all duration-300 ${
        rightSidebarCollapsed ? 'w-0' : 'w-72 bg-white border-l border-gray-300 shadow-md z-40'
      }`}
    >
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
        onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
      >
        {rightSidebarCollapsed ? <ChevronRightIcon className="h-6 w-6" /> : <ChevronLeftIcon className="h-6 w-6" />}
      </button>
      <UsageStats usage={usage} isCollapsed={rightSidebarCollapsed} />
    </div>
  </div>
);
}

export default App;
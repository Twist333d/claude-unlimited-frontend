import React, {useState, useCallback, useEffect} from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import axios from "axios";
import config from './config'; // Import the config object


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [usage, setUsage] = useState({ tokens: 0, cost: 0 });


    const fetchConversations = useCallback(async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, []);

    const updateUsage = useCallback((newTokens, newCost) => {
  setUsage(prev => ({
    tokens: prev.tokens + newTokens,
    cost: prev.cost + newCost
  }));
}, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);


  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const selectConversation = useCallback((id) => {
    setCurrentConversationId(id);
  }, []);


  const startNewConversation = useCallback(async () => {
  try {
    const response = await axios.post(`${config.apiUrl}/conversations`);
    const newConversation = {
      id: response.data.conversation_id,
      first_message: 'New conversation',
      created_at: new Date().toISOString()
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  } catch (error) {
    console.error('Error starting new conversation:', error);
  }
}, []);

const updateConversation = useCallback((conversationId, newMessage, newTokens, newCost) => {
  setConversations(prevConversations =>
    prevConversations.map(conv =>
      conv.id === conversationId
        ? {
            ...conv,
            first_message: conv.first_message || newMessage,
            last_message: newMessage,
            last_message_time: new Date().toISOString()
          }
        : conv
    )
  );
  updateUsage(newTokens, newCost);
}, [updateUsage]);

  return (
      <div className="h-screen flex flex-col bg-gray-50">
              <Header
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        usage={usage}
        setSidebarOpen={setSidebarOpen} // Pass the setSidebarOpen function
      />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              conversations={conversations}
              currentConversationId={currentConversationId}
              setCurrentConversationId={setCurrentConversationId}
              startNewConversation={startNewConversation}
              selectConversation={selectConversation} // Pass the selectConversation function
          />
          <main className="flex-1 overflow-y-auto">
          <ChatArea
              currentConversationId={currentConversationId}
              updateConversation={updateConversation}

          />
          </main>
        </div>
      </div>
  );
}

export default App;
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);


  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const selectConversation = useCallback((id) => {
    setCurrentConversationId(id);
  }, []);

  const startNewConversation = useCallback(() => {
    const newId = Date.now().toString();
    setConversations(prev => [...prev, { id: newId, name: `New Chat ${prev.length + 1}` }]);
    setCurrentConversationId(newId);
  }, []);

  return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              conversations={conversations}
              currentConversationId={currentConversationId}
              setCurrentConversationId={setCurrentConversationId}
              startNewConversation={startNewConversation}
          />
          <main className="flex-1 overflow-y-auto">
          <ChatArea currentConversationId={currentConversationId}/>
          </main>
        </div>
      </div>
  );
}

export default App;
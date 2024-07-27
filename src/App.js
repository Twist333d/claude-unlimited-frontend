import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const startNewConversation = () => {
    const newId = Date.now().toString();
    setConversations([...conversations, { id: newId, name: `New Chat ${conversations.length + 1}` }]);
    setCurrentConversationId(newId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          conversations={conversations}
          currentConversationId={currentConversationId}
          setCurrentConversationId={setCurrentConversationId}
          startNewConversation={startNewConversation}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        <ChatArea currentConversationId={currentConversationId} />
      </div>
    </div>
  );
}

export default App;
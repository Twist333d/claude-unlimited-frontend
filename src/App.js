import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/24/outline";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const SidebarToggle = ({ sidebarOpen, setSidebarOpen }) => (
  <button
    onClick={() => setSidebarOpen(!sidebarOpen)}
    className={`fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-md transition-all duration-300 ${sidebarOpen ? 'translate-x-56' : 'translate-x-0'}`}
  >
    {sidebarOpen ? (
      <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
    ) : (
      <ChevronRightIcon className="h-6 w-6 text-gray-600" />
    )}
  </button>
);

  const startNewConversation = () => {
    const newId = Date.now().toString();
    setConversations([...conversations, { id: newId, name: `New chat ${conversations.length + 1}` }]);
    setCurrentConversationId(newId);
  };

  return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Header/>
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
import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

function Sidebar({ sidebarOpen, conversations, currentConversationId, setCurrentConversationId, startNewConversation }) {
  return (
    <div className={`bg-white shadow-md transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0'} lg:w-64 overflow-hidden`}>
      <div className="h-full flex flex-col">
        <div className="px-4 py-6">
          <button
            onClick={startNewConversation}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            New Chat
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => setCurrentConversationId(conversation.id)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    currentConversationId === conversation.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {conversation.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
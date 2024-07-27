import React, { memo } from 'react';
import { ChatBubbleBottomCenterIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { getRelativeTimeString } from '../utils/timeFormatting';



// With this line
function Sidebar({ sidebarOpen, setSidebarOpen, conversations, currentConversationId, setCurrentConversationId, startNewConversation }) {
    const handleConversationClick = (id) => {
  setCurrentConversationId(id);

  const truncateMessage = (message, maxLength) => {
  if (message.length <= maxLength) return message;
  return `${message.substring(0, maxLength)}...`;
};
};
  return (
    <div className="flex h-full flex-col bg-white rounded-lg shadow-md">
        <div className="items-center bg-slate-200 py-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-full">
                {sidebarOpen ? <ChevronLeftIcon className="h-5 w-5"/> : <ChevronRightIcon className="h-5 w-5"/>}
            </button>
        </div>
        {sidebarOpen && (
            <div className="w-64 overflow-hidden">
          <div className="px-4 py-2">
            <button
              onClick={startNewConversation}
              className="w-full flex items-center justify-left px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ChatBubbleBottomCenterIcon className="h-5 w-5 mr-2" aria-hidden="true"/>
              New conversation
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto scrollbar-mac">
            <ul className="space-y-1 pt-4">
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
                      {sidebarOpen ? (
                          <>
                            <div className="font-medium truncate">{conversation.name}</div>
                            <div className="text-xs text-gray-500 truncate">
                              {conversation.lastMessage
                                  ? formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })
                                  : 'No messages yet...'}
                            </div>
                          </>
                      ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {conversation.name.charAt(0)}
                          </div>
                      )}
                    </button>
                  </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Sidebar;



import React, { useMemo, useCallback } from "react";
import { useConversations } from "../../hooks/useConversations";
import {
  ChatBubbleBottomCenterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { getRelativeTimeString } from "../../utils/timeFormatting";

const ConversationItem = React.memo(({ conversation, isActive, onClick }) => {
  const truncateMessage = (message, maxLength) => {
    if (!message) return "";
    return message.length <= maxLength
      ? message
      : `${message.substring(0, maxLength)}...`;
  };

  return (
    <li className="px-2 rounded-md">
      <button
        onClick={onClick}
        className={`w-full flex items-center py-2 px-2 text-sm rounded-md overflow-hidden transition-colors duration-150 ease-in-out ${
          isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        }`}
      >
        <div className="flex flex-col items-start space-y-0.5">
          <p className="text-sm font-medium truncate">
            {truncateMessage(conversation.title, 40)}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {conversation.last_message_at
              ? `Last message ${getRelativeTimeString(conversation.last_message_at)}`
              : "No messages yet..."}
          </p>
        </div>
      </button>
    </li>
  );
});

function Sidebar({ sidebarOpen, toggleSidebar }) {
  const {
    conversations,
    currentConversationId,
    selectConversation,
    startNewConversation,
  } = useConversations();

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (a.id === null) return -1;
      if (b.id === null) return 1;
      const dateA = a.last_message_at
        ? new Date(a.last_message_at)
        : new Date(0);
      const dateB = b.last_message_at
        ? new Date(b.last_message_at)
        : new Date(0);
      return dateB - dateA;
    });
  }, [conversations]);

  const handleNewConversation = useCallback(() => {
    if (currentConversationId !== null) {
      startNewConversation();
    }
  }, [currentConversationId, startNewConversation]);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ease-in-out transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0`}
    >
      <div className="items-center py-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-slate-200 border-0"
        >
          {sidebarOpen ? (
            <ChevronLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      {sidebarOpen && (
        <div className="w-64 bg-white overflow-hidden rounded-lg shadow-md">
          <div className="px-4 py-2">
            <button
              onClick={handleNewConversation}
              className="w-full flex items-center justify-left px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ChatBubbleBottomCenterIcon
                className="h-5 w-5 mr-2"
                aria-hidden="true"
              />
              New conversation
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 pt-4">
              {sortedConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id || "new"}
                  conversation={conversation}
                  isActive={currentConversationId === conversation.id}
                  onClick={() => selectConversation(conversation.id)}
                />
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default React.memo(Sidebar);

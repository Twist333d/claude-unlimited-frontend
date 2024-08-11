// components/ChatArea.js
import React from "react";
import MessageInput from "./MessageInput";
import Message from "./Message";
import LoadingIndicator from "./common/LoadingIndicator";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import ErrorBoundary from "./common/ErrorBoundary";
import { useMessages } from "../hooks/useMessages";

function ChatArea({ currentConversationId, session }) {
  // Use the useMessages hook to manage messages state and operations
  const { messages, isLoading, sendMessage } = useMessages(
    currentConversationId,
    session,
  );

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      {/* Messages area */}
      <div className="flex-1 overflow-x-auto p-4 space-y-4">
        {messages.length === 0 ? (
          // Display when there are no messages
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ChatBubbleLeftEllipsisIcon className="h-24 w-24 mb-4" />
            <p className="text-xl">No messages yet...</p>
          </div>
        ) : (
          // Display messages
          messages.map((message, index) => (
            <Message
              key={index}
              content={message.content}
              sender={message.sender}
            />
          ))
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="px-4 py-4 flex justify-center">
          <LoadingIndicator />
        </div>
      )}

      {/* Message input area */}
      <ErrorBoundary>
        <MessageInput onSendMessage={sendMessage} isDisabled={isLoading} />
      </ErrorBoundary>
    </div>
  );
}

export default React.memo(ChatArea);

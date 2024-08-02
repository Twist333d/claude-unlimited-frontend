import React, { useState, useEffect, useCallback, useMemo } from "react";
import MessageInput from "./MessageInput";
import Message from "./Message";
import axios from "axios";
import config from "../config"; // Import the config object
import LoadingIndicator from "./LoadingIndicator";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import ErrorBoundary from "./ErrorBoundary";

function ChatArea({ currentConversationId, updateConversation }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use useCallback to memoize the fetchMessages function
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/conversations/${conversationId}/messages`,
      ); // Use config.apiUrl
      setMessages(
        response.data.map((msg) => ({
          content: msg.content,
          sender: msg.role, // Assuming the backend sends 'role' instead of 'sender'
        })),
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []); // Empty dependency array as it doesn't depend on any props or state

  // Use useEffect to fetch messages when currentConversationId changes
  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId);
    } else {
      setMessages([]); // Reset messages when no conversation is selected
    }
  }, [currentConversationId, fetchMessages]);

  // Use useCallback to memoize the addMessage function
  const addMessage = useCallback(
    async (content) => {
      const newMessage = { content, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setIsLoading(true);

      try {
        const response = await axios.post(`${config.apiUrl}/chat`, {
          // Use config.apiUrl
          conversation_id: currentConversationId,
          message: content,
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { content: response.data.response, sender: "assistant" },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversationId, updateConversation],
  ); // Dependency on currentConversationId

  // Use useMemo to memoize the rendered messages
  const memoizedMessages = useMemo(
    () =>
      messages.map((message, index) => (
        <Message
          key={index}
          content={message.content}
          sender={message.sender}
        />
      )),
    [messages],
  );

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex-1 overflow-x-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ChatBubbleLeftEllipsisIcon className="h-24 w-24 mb-4" />
            <p className="text-xl">No messages yet...</p>
          </div>
        ) : (
          memoizedMessages
        )}
      </div>
      {isLoading && (
        <div className="px-4 py-4 flex justify-center">
          {" "}
          {/* Added flex and justify-start */}
          <LoadingIndicator />{" "}
        </div>
      )}
      <ErrorBoundary>
        <MessageInput onSendMessage={addMessage} isDisabled={isLoading} />
      </ErrorBoundary>
    </div>
  );
}

export default ChatArea;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import MessageInput from "./MessageInput";
import Message from "./Message";
import config from "../config"; // Import the config object
import LoadingIndicator from "./LoadingIndicator";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import ErrorBoundary from "./ErrorBoundary";

function ChatArea({
  currentConversationId,
  setCurrentConversationId,
  updateConversation,
  setConversations,
  session,
}) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use useCallback to memoize the fetchMessages function
  const fetchMessages = useCallback(
    async (conversationId) => {
      if (!session) return;
      try {
        const response = await fetch(
          `${config.apiUrl}/conversations/${conversationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setMessages(
          data.map((msg) => ({
            content: msg.content,
            sender: msg.role,
          })),
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [session],
  ); // Empty dependency array as it doesn't depend on any props or state

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
      if (!session) {
        console.error("No active session, cannot send message");
        return;
      }
      const newMessage = { content, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setIsLoading(true);

      try {
        const response = await fetch(`${config.apiUrl}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            conversation_id: currentConversationId,
            message: content,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        const newConversationId = data.conversation_id || currentConversationId;

        if (currentConversationId === null) {
          // This is a new conversation
          setCurrentConversationId(newConversationId);
          setConversations((prevConversations) => [
            {
              id: newConversationId,
              title: data.title,
              last_message_at: new Date().toISOString(),
            },
            ...prevConversations.filter((conv) => conv.id !== null),
          ]);
        } else {
          // Existing conversation
          updateConversation(newConversationId, content);
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          { content: data.response, sender: "assistant" },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentConversationId,
      setCurrentConversationId,
      setConversations,
      updateConversation,
      session,
    ],
  );

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

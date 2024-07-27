import React, { useState, useEffect } from 'react';
import MessageInput from './MessageInput';
import Message from './Message';
import axios from "axios";

function ChatArea({ currentConversationId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Here you would typically fetch messages for the current conversation
    // For now, we'll just reset messages when the conversation changes
    setMessages([]);
  }, [currentConversationId]);

  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId);
    }
  }, [currentConversationId]);

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const addMessage = async (content) => {
    const newMessage = { content, sender: 'user' };
    setMessages([...messages, newMessage]);

    try {
      const response = await axios.post('/api/chat', {
        conversation_id: currentConversationId,
        messages: [content]
      });

      setMessages(prevMessages => [
        ...prevMessages,
        { content: response.data.response, sender: 'assistant' }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto border-x-2 border-sm" >
      <div className="flex-1 overflow-x-auto p-4 space-y-4">
        {messages.map((message) => (
            <Message key={message.id} content={message.content} sender={message.sender} />
        ))}
      </div>
        <MessageInput onSendMessage={addMessage}/>
    </div>
  );
}

export default ChatArea;
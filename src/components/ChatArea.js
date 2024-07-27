import React, { useState, useEffect } from 'react';
import MessageInput from './MessageInput';

function ChatArea({ currentConversationId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Here you would typically fetch messages for the current conversation
    // For now, we'll just reset messages when the conversation changes
    setMessages([]);
  }, [currentConversationId]);

  const addMessage = (content) => {
    const newMessage = { id: Date.now(), content, sender: 'user' };
    setMessages([...messages, newMessage]);
    // Here you would typically send the message to your backend
    // and then add the response to the messages
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
            <div
                key={message.id}
                className={`p-3 rounded-lg font-serif max-w-[70%] break-words ${
                    message.sender === 'user' ? 'bg-gradient-to-r from-indigo-200 to-indigo-100 ml-auto' : 'bg-white'
                }`}
            >
                {message.content}
            </div>
        ))}
      </div>
        <MessageInput onSendMessage={addMessage}/>
    </div>
  );
}

export default ChatArea;
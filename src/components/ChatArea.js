import React, {useState, useEffect, useCallback, useMemo} from 'react';
import MessageInput from './MessageInput';
import Message from './Message';
import axios from "axios";
import config from '../config'; // Import the config object


function ChatArea({ currentConversationId }) {
  const [messages, setMessages] = useState([]);

  // Use useCallback to memoize the fetchMessages function
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const response = await axios.get(`${config.apiUrl}/conversations/${conversationId}/messages`); // Use config.apiUrl
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
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
  const addMessage = useCallback(async (content) => {
    const newMessage = { content, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    try {
      const response = await axios.post(`${config.apiUrl}/chat`, { // Use config.apiUrl
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
  }, [currentConversationId]); // Dependency on currentConversationId

    // Use useMemo to memoize the rendered messages
  const memoizedMessages = useMemo(() =>
  messages.map((message, index) => (
    <Message key={index} content={message.content} sender={message.sender} />
  )),
  [messages]
);

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto" >
      <div className="flex-1 overflow-x-auto p-4 space-y-4">
        {memoizedMessages}
      </div>
        <MessageInput onSendMessage={addMessage}/>
    </div>
  );
}

export default ChatArea;
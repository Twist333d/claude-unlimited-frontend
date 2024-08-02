import React, { useState, useCallback, useEffect, memo } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import axios from "axios";
import config from "./config"; // Import the config object
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [usage, setUsage] = useState({ tokens: 0, cost: 0 });
  const MemoizedSidebar = memo(Sidebar);

  const isDebug = process.env.REACT_APP_VERCEL_ENV !== "production";

  const fetchConversations = useCallback(async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, []);

  const updateUsage = useCallback((newTokens, newCost) => {
    setUsage((prev) => ({
      tokens: prev.tokens + newTokens,
      cost: prev.cost + newCost,
    }));
  }, []);

  // fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // fetch usage on component mount
  const fetchUsage = useCallback(async (conversationId) => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/usage${conversationId ? `?conversation_id=${conversationId}` : ""}`,
      );
      setUsage(response.data);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
    }
  }, []);

  // on load fetch tokens and data
  useEffect(() => {
    if (currentConversationId) {
      fetchUsage(currentConversationId);
    } else {
      setUsage({ tokens: 0, cost: 0 });
    }
  }, [currentConversationId, fetchUsage]);

  useEffect(() => {
    console.log("Updated conversations:", conversations); // Add this log
  }, [conversations]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const selectConversation = useCallback((id) => {
    setCurrentConversationId(id);
  }, []);

  const startNewConversation = useCallback(async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/conversations`,
        { title: "New Conversation" }, // Send a body, even if it's empty
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // TO DO -> when a conversation is created, save the first message as title. This will allow replacing the defaults.
      const newConversation = {
        id: response.data.conversation_id,
        title: "New Conversation",
      };
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
    } catch (error) {
      console.error("Error starting new conversation:", error);
    }
  }, []);

  const updateConversation = useCallback(
    (conversationId, newMessage, newTokens, newCost) => {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                last_message: newMessage,
                last_message_at: new Date().toISOString(),
              }
            : conv,
        ),
      );
      updateUsage(newTokens, newCost);
    },
    [updateUsage],
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        usage={usage}
        setSidebarOpen={setSidebarOpen} // Pass the setSidebarOpen function
      />
      <div className="flex-1 flex overflow-hidden">
        <MemoizedSidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          conversations={conversations}
          currentConversationId={currentConversationId}
          setCurrentConversationId={setCurrentConversationId}
          startNewConversation={startNewConversation}
          selectConversation={selectConversation} // Pass the selectConversation function
        />
        <main className="flex-1 overflow-y-auto">
          <ChatArea
            currentConversationId={currentConversationId}
            updateConversation={updateConversation}
          />
        </main>
      </div>
      <Analytics
        debug={isDebug}
        beforeSend={(event) => {
          if (process.env.REACT_APP_VERCEL_ENV !== "production") {
            console.log("Analytics event (not sent):", event);
            return null; // Don't send events in development or preview
          }
          return event;
        }}
      />
    </div>
  );
}

export default App;

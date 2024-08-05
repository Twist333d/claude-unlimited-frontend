import React, { useState, useCallback, useEffect, memo } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import axios from "axios";
import config from "./config"; // Import the config object
import { Analytics } from "@vercel/analytics/react";
import { supabase } from "./index";

function App(session) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [usage, setUsage] = useState({ total_tokens: 0, total_cost: 0 });
  const MemoizedSidebar = memo(Sidebar);
  const [user, setUser] = useState(session?.user || null);

  useEffect(() => {
    if (session) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const isDebug = process.env.REACT_APP_VERCEL_ENV !== "production";

  const fetchConversations = useCallback(async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const response = await fetch(`${config.apiUrl}/conversations`, {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, []);

  // fetch usage on component mount
  const fetchUsage = useCallback(async (conversationId = null) => {
    if (!conversationId) {
      setUsage({ total_tokens: 0, total_cost: 0 });
      return;
    }
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const response = await fetch(
        `${config.apiUrl}/usage?conversation_id=${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
      setUsage({ total_tokens: 0, total_cost: 0 });
    }
  }, []);

  // fetch conversations & usage stats on component mount
  useEffect(() => {
    fetchConversations();
    fetchUsage(currentConversationId);
  }, [fetchConversations, fetchUsage, currentConversationId]);

  // Update the updateConversation function
  const updateConversation = useCallback(
    (conversationId, newMessage) => {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                title:
                  conv.title === "New Conversation" ? newMessage : conv.title,
                last_message: newMessage,
                last_message_at: new Date().toISOString(),
              }
            : conv,
        ),
      );
      fetchUsage(conversationId); // Fetch updated usage after each message
    },
    [fetchUsage],
  );

  useEffect(() => {
    console.log("Updated conversations:", conversations); // Add this log
  }, [conversations]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const selectConversation = useCallback((id) => {
    setCurrentConversationId(id);
  }, []);

  const startNewConversation = useCallback(() => {
    setCurrentConversationId(null); // we don't have an id just yet
    setConversations((prevConversations) => [
      {
        id: null,
        title: "New Conversation",
        last_message_at: null, // there is no message just yet
      },
      ...prevConversations,
    ]);
  }, []);

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
            setCurrentConversationId={setCurrentConversationId}
            setConversations={setConversations}
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

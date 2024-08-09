import React, { useState, useCallback, useEffect, memo } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import config from "./config"; // Import the config object
import { Analytics } from "@vercel/analytics/react";
import { supabase } from "./index";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { debounce } from "lodash";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [usage, setUsage] = useState({ total_tokens: 0, total_cost: 0 });
  const MemoizedSidebar = memo(Sidebar);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isDebug = process.env.REACT_APP_VERCEL_ENV !== "production";

  const handleTurnstileCallback = useCallback((token) => {
    console.log("Turnstile token:", token);
    // You can use this token when making requests to your backend
  }, []);

  useEffect(() => {
    // Render the Turnstile widget
    if (window.turnstile) {
      window.turnstile.render("#turnstile-container", {
        sitekey: config.turnstileSiteKey,
        callback: handleTurnstileCallback,
      });
    }
  }, [handleTurnstileCallback]);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem("supabase.auth.token");
        if (storedToken) {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser(storedToken);
          if (error) throw error;
          setSession({ access_token: storedToken, user });
          console.log("Restored session from localStorage");
        } else {
          const {
            data: { session: existingSession },
          } = await supabase.auth.getSession();
          if (existingSession) {
            setSession(existingSession);
            localStorage.setItem(
              "supabase.auth.token",
              existingSession.access_token,
            );
            console.log("Restored existing session");
          } else {
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) throw error;
            setSession(data.session);
            localStorage.setItem(
              "supabase.auth.token",
              data.session.access_token,
            );
            console.log("Signed in anonymously:", data.session);
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        setSession(null);
        localStorage.removeItem("supabase.auth.token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (session) {
        setSession(session);
        localStorage.setItem("supabase.auth.token", session.access_token);
      } else {
        setSession(null);
        localStorage.removeItem("supabase.auth.token");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchConversations = useCallback(
    debounce(async (session) => {
      if (!session) {
        console.log("No active session, skipping fetch");
        return;
      }
      try {
        const response = await fetch(`${config.apiUrl}/conversations`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }, 300), // 300ms debounce
    [],
  );

  // fetch usage on component mount
  const fetchUsage = useCallback(
    debounce(async (session, conversationId) => {
      if (!session || !conversationId) {
        setUsage({ total_tokens: 0, total_cost: 0 });
        return;
      }
      try {
        const response = await fetch(
          `${config.apiUrl}/usage?conversation_id=${conversationId}`,
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
        setUsage(data);
      } catch (error) {
        console.error("Error fetching usage stats:", error);
        setUsage({ total_tokens: 0, total_cost: 0 });
      }
    }, 300), // 300ms debounce
    [],
  );

  // fetch conversations & usage stats on component mount
  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session, fetchConversations]);

  useEffect(() => {
    if (session && currentConversationId) {
      fetchUsage(currentConversationId);
    }
  }, [session, currentConversationId, fetchUsage]);

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
      <div id="turnstile-container" className="hidden opacity-0">
        >
      </div>
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
            session={session}
          />
        </main>
      </div>
      <SpeedInsights />
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

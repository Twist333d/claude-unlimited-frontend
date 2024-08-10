import React from "react";
import { useAuth } from "./hooks/useAuth";
import { useConversations } from "./hooks/useConversations";
import { useUsage } from "./hooks/useUsage";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import ChatArea from "./components/ChatArea";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingIndicator from "./components/common/LoadingIndicator";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useTurnstile } from "./hooks/useTurnstile";

function App() {
  // Debug settings
  const isDebug = process.env.REACT_APP_VERCEL_ENV !== "production";

  // Authentication hook
  const { session, loading: authLoading, login, logout } = useAuth();

  // Conversations hook
  const {
    conversations,
    currentConversationId,
    loading: conversationsLoading,
    error: conversationsError,
    selectConversation,
    startNewConversation,
    updateConversation,
  } = useConversations(session);

  // Usage statistics hook
  const {
    usage,
    loading: usageLoading,
    error: usageError,
  } = useUsage(session, currentConversationId);

  // Turnstile integration
  useTurnstile(); // Turnstile integration

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = React.useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Show loading indicator while authentication is in progress
  if (authLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-50">
        <div id="turnstile-container" className="hidden opacity-0"></div>
        <Header
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          usage={usage}
          usageLoading={usageLoading}
          usageError={usageError}
          logout={logout}
        />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            sidebarOpen={sidebarOpen}
            conversations={conversations}
            currentConversationId={currentConversationId}
            loading={conversationsLoading}
            error={conversationsError}
            selectConversation={selectConversation}
            startNewConversation={startNewConversation}
            session={session} // Add this line
          />
          <main className="flex-1 overflow-y-auto">
            <ChatArea
              currentConversationId={currentConversationId}
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
    </ErrorBoundary>
  );
}

export default App;

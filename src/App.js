import React, { useMemo } from "react";
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
import { ErrorProvider } from "./contexts/ErrorContext";
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuth } from "./hooks/useAuth";

function AppContent() {
  // Debug settings
  const isDebug = process.env.REACT_APP_VERCEL_ENV !== "production";

  // Authentication hook
  const { loading: authLoading } = useAuth();

  // Conversations hook
  const {
    conversations,
    currentConversationId,
    startNewConversation,
    selectConversation,
  } = useConversations();

  // Usage statistics hook
  const {
    usage,
    loading: usageLoading,
    error: usageError,
  } = useUsage(currentConversationId);

  // Turnstile integration
  useTurnstile(); // Turnstile integration

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = React.useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Show loading indicator while authentication is in progress
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div id="turnstile-container" className="hidden opacity-0"></div>
      <Header
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        usage={usage}
        usageLoading={usageLoading}
        usageError={usageError}
        currentConversationId={currentConversationId}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          conversations={conversations}
          currentConversationId={currentConversationId}
          selectConversation={selectConversation}
          startNewConversation={startNewConversation}
        />
        <main className="flex-1 overflow-y-auto">
          <ChatArea currentConversationId={currentConversationId} />
        </main>
      </div>
      <SpeedInsights />
      <Analytics
        debug={isDebug}
        beforeSend={(event) => {
          if (process.env.REACT_APP_VERCEL_ENV !== "production") {
            console.log("Analytics event (not sent):", event);
            return null;
          }
          return event;
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
}

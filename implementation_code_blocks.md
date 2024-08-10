# Implementation Code Blocks for Claude Unlimited Frontend

This document contains all the code blocks referenced in our implementation plan. You can use these to update the relevant parts of your application.

## 1. Implement useAuth Hook

```javascript
// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../auth/supabaseClient';

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(currentSession);
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      setSession(data.session);
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { session, loading, login, logout };
};
```

## 2. Refactor App.js

```javascript
// src/App.js
import React, { lazy, Suspense } from 'react';
import { useAuth } from './hooks/useAuth';
import { useConversations } from './hooks/useConversation';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const Sidebar = lazy(() => import('./components/Sidebar'));
const ChatArea = lazy(() => import('./components/ChatArea'));

const App = () => {
  const { session, loading: authLoading, login, logout } = useAuth();
  const { 
    conversations, 
    currentConversationId, 
    loading: conversationsLoading, 
    error: conversationsError,
    fetchConversations,
    selectConversation,
    createNewConversation,
    updateConversation
  } = useConversations();

  useEffect(() => {
    if (session && !conversations.length) {
      fetchConversations();
    }
  }, [session, conversations.length, fetchConversations]);

  const isDebug = process.env.REACT_APP_VERCEL_ENV !== "production";

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-50">
        <Header session={session} logout={logout} />
        <div className="flex-1 flex overflow-hidden">
          <Suspense fallback={<div>Loading...</div>}>
            <Sidebar 
              conversations={conversations}
              currentConversationId={currentConversationId}
              selectConversation={selectConversation}
              createNewConversation={createNewConversation}
              loading={conversationsLoading}
              error={conversationsError}
            />
            <ChatArea 
              currentConversationId={currentConversationId}
              updateConversation={updateConversation}
              session={session}
            />
          </Suspense>
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
};

export default App;
```

## 3. Refactor ChatArea.js

```javascript
// src/components/ChatArea.js
import React, { useCallback, useMemo } from 'react';
import { useMessages } from '../hooks/useMessages';
import MessageInput from './MessageInput';
import Message from './Message';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import ErrorBoundary from './ErrorBoundary';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';

const ChatArea = ({ currentConversationId, updateConversation, session }) => {
  const { 
    messages, 
    loading: messagesLoading, 
    error: messagesError, 
    sendMessage,
    refreshMessages
  } = useMessages(currentConversationId);

  const handleSendMessage = useCallback(async (content) => {
    if (!currentConversationId) {
      console.error("No active conversation, cannot send message");
      return;
    }
    await sendMessage(content);
    updateConversation(currentConversationId, { last_message: content });
  }, [currentConversationId, sendMessage, updateConversation]);

  const MessageRow = useCallback(({ index, style }) => {
    const message = messages[index];
    return (
      <div style={style}>
        <Message
          key={message.id}
          content={message.content}
          sender={message.sender}
        />
      </div>
    );
  }, [messages]);

  const messageList = useMemo(() => {
    if (messagesLoading) {
      return <LoadingIndicator />;
    }

    if (messagesError) {
      return <ErrorMessage message={messagesError} />;
    }

    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <ChatBubbleLeftEllipsisIcon className="h-24 w-24 mb-4" />
          <p className="text-xl">No messages yet...</p>
        </div>
      );
    }

    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={messages.length}
            itemSize={100} // Adjust this based on your message component's average height
            width={width}
          >
            {MessageRow}
          </List>
        )}
      </AutoSizer>
    );
  }, [messages, messagesLoading, messagesError, MessageRow]);

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex-1 overflow-hidden">
        {messageList}
      </div>
      <ErrorBoundary>
        <MessageInput onSendMessage={handleSendMessage} isDisabled={messagesLoading} />
      </ErrorBoundary>
    </div>
  );
};

export default React.memo(ChatArea);
```

## 4. Refactor Sidebar.js

```javascript
// src/components/Sidebar.js
import React, { useCallback, useMemo } from "react";
import {
  ChatBubbleBottomCenterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { getRelativeTimeString } from "../utils/timeFormatting";
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';

const Sidebar = ({
  sidebarOpen,
  toggleSidebar,
  conversations,
  currentConversationId,
  selectConversation,
  createNewConversation,
  loading,
  error
}) => {
  const truncateMessage = useCallback((message, maxLength) => {
    if (!message) return "";
    if (message.length <= maxLength) return message;
    return `${message.substring(0, maxLength)}...`;
  }, []);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      if (a.id === null) return -1;
      if (b.id === null) return 1;
      const dateA = a.last_message_at
        ? new Date(a.last_message_at)
        : new Date(0);
      const dateB = b.last_message_at
        ? new Date(b.last_message_at)
        : new Date(0);
      return dateB - dateA;
    });
  }, [conversations]);

  const conversationList = useMemo(() => {
    if (loading) {
      return <LoadingIndicator />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    return (
      <ul className="space-y-1 pt-4">
        {sortedConversations.map((conversation) => (
          <li key={conversation.id || "new"} className="px-2 rounded-md">
            <button
              onClick={() =>
                conversation.id
                  ? selectConversation(conversation.id)
                  : createNewConversation()
              }
              className={`w-full flex items-center py-2 px-2 text-sm rounded-md overflow-hidden transition-colors duration-150 ease-in-out ${
                currentConversationId === conversation.id ||
                (!currentConversationId && !conversation.id)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              }`}
            >
              <div className="flex flex-col items-start space-y-0.5">
                <p className="text-sm font-medium truncate">
                  {truncateMessage(conversation.title, 40)}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {conversation.last_message_at
                    ? `Last message ${getRelativeTimeString(conversation.last_message_at)}`
                    : "No messages yet..."}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    );
  }, [sortedConversations, loading, error, currentConversationId, selectConversation, createNewConversation, truncateMessage]);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ease-in-out transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0`}
    >
      <div className="items-center py-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-slate-200 border-0"
        >
          {sidebarOpen ? (
            <ChevronLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      {sidebarOpen && (
        <div className="w-64 bg-white overflow-hidden rounded-lg shadow-md">
          <div className="px-4 py-2">
            <button
              onClick={createNewConversation}
              className="w-full flex items-center justify-left px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ChatBubbleBottomCenterIcon
                className="h-5 w-5 mr-2"
                aria-hidden="true"
              />
              New conversation
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {conversationList}
          </nav>
        </div>
      )}
    </div>
  );
};

export default React.memo(Sidebar);
```

## 5. Update MessageInput.js

```javascript
// src/components/MessageInput.js
import React, { useState, useRef, useCallback, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { debounce } from "lodash";
import { useMessages } from "../hooks/useMessages";

const MessageInput = ({ conversationId, isDisabled }) => {
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef(null);
  const { sendMessage } = useMessages(conversationId);

  const debouncedResize = useCallback(
    debounce(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 7 * 24)}px`;
      }
    }, 100),
    []
  );

  useEffect(() => {
    debouncedResize();
  }, [inputText, debouncedResize]);

  const handleInputChange = useCallback((e) => {
    setInputText(e.target.value);
  }, []);

  const handleSend = useCallback(async () => {
    if (inputText.trim() && !isDisabled) {
      await sendMessage(inputText);
      setInputText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [inputText, isDisabled, sendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="message-input-container bg-transparent p-4 sticky bottom-0">
      <div className="message-input-inter-container max-w-3xl mx-auto flex items-end space-x-4 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <textarea
          ref={textareaRef}
          className="message-input-text-area font-serif flex-1 resize-y border-0 bg-transparent p-2 focus:outline-none focus:ring-0 max-h-40 overflow-y-auto"
          placeholder="How can I help you today?"
          rows="2"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <div className="message-input-button sticky top-0">
          <button
            onClick={handleSend}
            disabled={isDisabled || !inputText.trim()}
            className={`send-button text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isDisabled || !inputText.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            <PaperAirplaneIcon
              className="send-button-icon h-5 w-5 transform -rotate-90"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageInput);
```

## 6. Implement Error Handling

### ErrorBoundary Component

```javascript
// src/components/ErrorBoundary.js
import React from 'react';
import ErrorMessage from './ErrorMessage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // You can also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage message={this.state.error.message} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### ErrorMessage Component

```javascript
// src/components/ErrorMessage.js
import React from 'react';

const ErrorMessage = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

export default ErrorMessage;
```

## 7. Enhance Logging

```javascript
// src/utils/logger.js
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const getCurrentLogLevel = () => {
  const envLogLevel = process.env.REACT_APP_LOG_LEVEL;
  return LOG_LEVELS[envLogLevel] || LOG_LEVELS.INFO;
};

const currentLogLevel = getCurrentLogLevel();

const formatMessage = (level, message, ...args) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
};

const sendToExternalService = (level, formattedMessage) => {
  // Implement this function to send logs to an external service
  // For example, you could use a service like Sentry or LogRocket
  console.log(`Sending to external service: ${formattedMessage}`);
};

export const logger = {
  error: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      const formattedMessage = formatMessage('ERROR', message, ...args);
      console.error(formattedMessage, ...args);
      sendToExternalService('ERROR', formattedMessage);
    }
  },

  warn: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      const formattedMessage = formatMessage('WARN', message, ...args);
      console.warn(formattedMessage, ...args);
      sendToExternalService('WARN', formattedMessage);
    }
  },

  info: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      const formattedMessage = formatMessage('INFO', message, ...args);
      console.info(formattedMessage, ...args);
      sendToExternalService('INFO', formattedMessage);
    }
  },

  debug: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      const formattedMessage = formatMessage('DEBUG', message, ...args);
      console.debug(formattedMessage, ...args);
      sendToExternalService('DEBUG', formattedMessage);
    }
  },
};
```

## 8. Testing

### Integration Test

```javascript
// src/__tests__/App.integration.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { useAuth } from '../hooks/useAuth';
import { useConversations } from '../hooks/useConversation';

jest.mock('../hooks/useAuth');
jest.mock('../hooks/useConversation');

describe('App Integration', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      session: { user: { id: 'test-user' } },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    useConversations.mockReturnValue({
      conversations: [
        { id: '1', title: 'Conversation 1' },
        { id: '2', title: 'Conversation 2' },
      ],
      currentConversationId: '1',
      loading: false,
      error: null,
      fetchConversations: jest.fn(),
      selectConversation: jest.fn(),
      createNewConversation: jest.fn(),
      updateConversation: jest.fn(),
    });
  });

  it('renders the app and allows conversation selection', async () => {
    render(<App />);

    // Wait for the app to load
    await waitFor(() => {
      expect(screen.getByText('Conversation 1')).toBeInTheDocument();
    });

    // Click on the second conversation
    userEvent.click(screen.getByText('Conversation 2'));

    // Check if selectConversation was called
    expect(useConversations().selectConversation).toHaveBeenCalledWith('2');
  });

  it('allows creating a new conversation', async () => {
    render(<App />);

    // Wait for the app to load
    await waitFor(() => {
      expect(screen.getByText('New conversation')).toBeInTheDocument();
    });

    // Click on "New conversation" button
    userEvent.click(screen.getByText('New conversation'));

    // Check if createNewConversation was called
    expect(useConversations().createNewConversation).toHaveBeenCalled();
  });
});
```

### Performance Test

```javascript
// src/__tests__/Performance.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { Profiler } from 'react';
import App from '../App';

jest.mock('../hooks/useAuth');
jest.mock('../hooks/useConversation');

describe('Performance Tests', () => {
  it('renders App component within 100ms', () => {
    let renderTime = 0;

    const callback = (id, phase, actualDuration) => {
      renderTime = actualDuration;
    };

    render(
      <Profiler id="App" onRender={callback}>
        <App />
      </Profiler>
    );

    expect(renderTime).toBeLessThan(100);
  });
});
```

### Security Test

```javascript
// src/__tests__/Security.test.js
import { apiMethods } from '../api/methods';

describe('Security Checks', () => {
  it('uses HTTPS for API calls', () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    expect(apiUrl).toMatch(/^https:\/\//);
  });

  it('does not contain hardcoded API keys', () => {
    const appCode = require('fs').readFileSync('src/App.js', 'utf8');
    expect(appCode).not.toMatch(/api[_-]?key/i);
  });
});
```

### Accessibility Test

```javascript
// src/__tests__/Accessibility.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App';

expect.extend(toHaveNoViolations);

describe('Accessibility tests', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

These code blocks correspond to the steps in our implementation plan. You can use them to update the relevant parts of your application.
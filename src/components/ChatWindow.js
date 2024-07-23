import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { ChevronDoubleDownIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import debounce from 'lodash/debounce';

function ChatWindow({ messages, isLoading, onSend, loadMoreMessages }) {
  const [input, setInput] = useState('');
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const messagesEndRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToItem(messages.length - 1);
  }, [messages.length]);

  const handleScroll = useCallback(
    debounce(({ scrollOffset, scrollUpdateWasRequested }) => {
      if (!scrollUpdateWasRequested) {
        setShowScrollDown(scrollOffset < (messages.length * 50) - 500);
      }
    }, 100),
    [messages.length]
  );

  const handleSend = useCallback(() => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      inputRef.current.style.height = 'auto';
    }
  }, [input, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleCopyCode = useCallback((code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const markdownComponents = useMemo(() => ({
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      return !inline && match ? (
        <div className="relative">
          <button
            className="absolute top-2 right-2 bg-white text-fountain-blue border border-fountain-blue rounded p-1 text-sm cursor-pointer opacity-70 hover:opacity-100 transition"
            onClick={() => handleCopyCode(code)}
          >
            <ClipboardDocumentIcon className="h-4 w-4 inline-block mr-1" />
            {copiedCode === code ? 'Copied!' : 'Copy'}
          </button>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="my-4 rounded-md p-4 bg-gray-900 text-gray-300 overflow-auto code-block"
          >
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={`${className} text-gray-600`} {...props}>
          {children}
        </code>
      );
    },
    img({ node, ...props }) {
      return <img className="max-w-full h-auto my-4" {...props} alt="" />;
    },
    table({ node, ...props }) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full divide-y divide-gray-200" {...props} />
        </div>
      );
    },
  }), [handleCopyCode, copiedCode]);

const MessageComponent = useMemo(() => React.memo(({ index, style }) => {
    const message = messages[index];
    if (!message) return null;
    return (
      <div
        style={{
          ...style,
          top: `${parseFloat(style.top) + 16}px`, // Add padding between messages
        }}
        className={`p-4 ${
          message.role === 'user'
            ? 'text-right'
            : 'text-left'
        }`}
      >
        <div
          className={`inline-block max-w-[70%] rounded-lg p-4 ${
            message.role === 'user'
              ? 'bg-user-message-background'
              : 'bg-light-gray'
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
            className="break-words"
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    );
  }), [messages, markdownComponents]);



  const itemCount = messages.length;
  const itemSize = 150; // Increased item size to accommodate padding
  const loadMoreItems = useCallback((startIndex, stopIndex) => {
    return loadMoreMessages(startIndex, stopIndex);
  }, [loadMoreMessages]);

    const isItemLoaded = useCallback(index => index < messages.length, [messages.length]);

      return (
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-6 bg-porcelain text-oxford-blue">
        <div className="flex-1 overflow-hidden w-full">
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={messages.length + 1}
                loadMoreItems={loadMoreMessages}
              >
                {({ onItemsRendered, ref }) => (
                  <List
                    ref={ref}
                    height={height}
                    itemCount={messages.length}
                    itemSize={itemSize}
                    onItemsRendered={onItemsRendered}
                    width={width}
                    onScroll={handleScroll}
                  >
                    {MessageComponent}
                  </List>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        </div>
      {isLoading && (
        <div className="rounded-lg p-4 mb-4 self-start bg-light-gray">
          Thinking...
        </div>
      )}
      <button
        className={`fixed bottom-20 right-8 bg-white text-fountain-blue border-2 border-fountain-blue rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition ${
          showScrollDown ? 'opacity-100 visible' : 'opacity-0 invisible'
        } z-50`}
        onClick={scrollToBottom}
      >
        <ChevronDoubleDownIcon className="h-6 w-6" />
      </button>
      <div className="flex items-center bg-light-gray border border-pale-sky rounded p-2 mt-4 shadow-md w-full max-w-4xl mx-auto"> {/* Increased max-width for input area */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Please write your message here..."
          className="flex-1 border-none focus:outline-none resize-none bg-light-gray text-oxford-blue rounded p-4 h-16 min-h-[60px] max-h-[200px] overflow-y-auto transition-all duration-200"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-fountain-blue text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:bg-pale-sky disabled:cursor-not-allowed ml-2"
        >
          <svg
            className="w-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default React.memo(ChatWindow);
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { ChevronDoubleDownIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

function ChatWindow({ messages, isLoading, onSend }) {
  const [input, setInput] = useState('');
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollDown(scrollTop + clientHeight < scrollHeight - 10);
    }
  }, []);

  const adjustInputHeight = useCallback(() => {
    if (inputRef.current) {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.style.height = 'auto';
          const newHeight = inputRef.current.scrollHeight;
          inputRef.current.style.height = `${newHeight}px`;
          setInputHeight(newHeight);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      const adjustHeight = () => {
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            const newHeight = inputRef.current.scrollHeight;
            inputRef.current.style.height = `${newHeight}px`;
            setInputHeight(newHeight);
          }
        });
      };

      const resizeObserver = new ResizeObserver(adjustHeight);
      resizeObserver.observe(inputRef.current);

      return () => {
        resizeObserver.disconnect();
        cancelAnimationFrame(adjustHeight);
      };
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
    handleScroll();
  }, [messages, scrollToBottom, handleScroll]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleSend = useCallback(() => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      adjustInputHeight();
    }
  }, [input, isLoading, onSend, adjustInputHeight]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = useCallback((code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  }, []);

  return (
    <div className="flex flex-col h-full max-w-screen-xl mx-auto p-6 bg-porcelain text-oxford-blue">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto flex flex-col p-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 mb-4 ${
              message.role === 'user'
                ? 'self-end bg-user-message-background'
                : 'self-start bg-light-gray'
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const code = String(children).replace(/\n$/, '');
                  return !inline && match ? (
                    <div className="relative">
                      <button
                        className="absolute top-2 right-2 bg-white text-fountain-blue border border-fountain-blue rounded p-1 text-sm cursor-pointer opacity-70 transition hover:opacity-100"
                        onClick={() => handleCopyCode(code)}
                      >
                        <ClipboardDocumentIcon className="h-4 w-4" />
                        {copiedCode === code ? 'Copied!' : 'Copy'}
                      </button>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                        customStyle={{
                          margin: '16px 0',
                          borderRadius: '4px',
                          paddingTop: '30px',
                        }}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                img({ node, ...props }) {
                  return (
                    <img
                      style={{ maxWidth: '100%', height: 'auto' }}
                      {...props}
                      alt=""
                    />
                  );
                },
                table({ node, ...props }) {
                  return (
                    <div style={{ overflowX: 'auto', margin: '16px 0' }}>
                      <table {...props} />
                    </div>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ))}
        {isLoading && (
          <div className="rounded-lg p-4 mb-4 self-start bg-light-gray">
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <button
        className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white text-fountain-blue border-2 border-fountain-blue rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition opacity-${
          showScrollDown ? '100' : '0'
        } ${showScrollDown ? 'visible' : 'invisible'} z-50`}
        onClick={scrollToBottom}
      >
        <ChevronDoubleDownIcon className="h-6 w-6" />
      </button>
      <div className="flex items-center bg-light-gray border border-pale-sky rounded p-2 mt-4 ml-[-16px] mr-[-16px] shadow-md">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustInputHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Please write your message here..."
          rows={1}
          className="flex-1 border-none focus:outline-none resize-none bg-light-gray text-oxford-blue rounded p-4 h-16 min-h-[60px] max-h-[200px] overflow-y-auto transition-height duration-200"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-fountain-blue text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:bg-pale-sky disabled:cursor-not-allowed"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 19V5M12 5L5 12M12 5L19 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default React.memo(ChatWindow);
import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { ChevronDoubleDownIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import debounce from 'lodash/debounce'; // Import the debounce function from Lodash

function ChatWindow({ messages, isLoading, onSend }) {
  const [input, setInput] = useState('');
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

    const handleScroll = useCallback(
      debounce(() => {
        if (messagesContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
          setShowScrollDown(scrollTop + clientHeight < scrollHeight - 10);
        }
      }, 120),
      []
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
        handleScroll();
      }, [messages, scrollToBottom, handleScroll]);

      useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
          container.addEventListener('scroll', handleScroll);
          return () => container.removeEventListener('scroll', handleScroll);
        }
      }, [handleScroll]);

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
    }), []);

    const MessageComponent = React.memo(({ index, data }) => {
      const message = data[index];
      return (
        <div
          className={`rounded-lg p-4 mb-4 max-w-[70%] ${
            message.role === 'user'
              ? 'self-end bg-user-message-background'
              : 'self-start bg-light-gray'
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
      );
    }, [markdownComponents]);

    const memoizedMessageComponent = useMemo(() => MessageComponent, [MessageComponent]);

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
                  components={markdownComponents}
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
            className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white text-fountain-blue border-2 border-fountain-blue rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition ${
              showScrollDown ? 'opacity-100 visible' : 'opacity-0 invisible'
            } z-50`}
            onClick={scrollToBottom}
          >
            <ChevronDoubleDownIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center bg-light-gray border border-pale-sky rounded p-2 mt-4 shadow-md">
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
              className="bg-fountain-blue text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer disabled:bg-pale-sky disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6"
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
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import debounce from 'lodash/debounce';

const ChatContainer = styled.div`
  width: 60%;
  max-width: 1000px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.porcelain};
  font-family: ${props => props.theme.typography.fontFamily.serif};
  position: relative;
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 80%;
    padding: ${props => props.theme.spacing.md};
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  margin: ${props => props.theme.spacing.xs} 0;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.$isUser ? props.theme.colors.userMessageBackground : props.theme.colors.lightGray};
  color: ${props => props.theme.colors.oxfordBlue};
  align-self: ${props => (props.$isUser ? 'flex-end' : 'flex-start')};
  border: 0.5px solid ${props => props.theme.colors.paleSky};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-family: ${props => props.theme.typography.fontFamily.serif};
  font-size: ${props => props.theme.typography.fontSize.base};
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    max-width: 85%;
  }
`;

const InputContainer = styled.div`
    display: flex;
    width: calc(100% + ${props => props.theme.spacing.xl});
    border: 0.5px solid ${props => props.theme.colors.lightGray};
    align-items: center;
    border: 0.5px solid ${props => props.theme.colors.paleSky};
    background-color: ${props => props.theme.colors.lightGray};
    border-radius: 12px;
    padding: ${props => props.theme.spacing.sm};
    margin-top: ${props => props.theme.spacing.md};
    margin-left: -${props => props.theme.spacing.md};
    margin-right: -${props => props.theme.spacing.md};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    `;

const Input = styled.textarea`
  flex: 1;
  border: none;
  font-family: ${props => props.theme.typography.fontFamily.serif};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  padding: ${props => props.theme.spacing.md};
  margin-right: ${props => props.theme.spacing.md};
  resize: none;
  background-color: ${props => props.theme.colors.lightGray};
  color: ${props => props.theme.colors.oxfordBlue};
  border-radius: 12px;
  min-height: 60px; // Increased from 40px
  max-height: 200px;
  overflow-y: auto;
  transition: height 0.2s ease;
  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.fountainBlue};
  color: ${props => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  &:disabled {
    background-color: ${props => props.theme.colors.paleSky};
    cursor: not-allowed;
  }
`;

const ScrollDownButton = styled.button`
  position: absolute;
  bottom: ${props => `calc(${props.$inputHeight}px + ${props.theme.spacing.md})`}; 
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.fountainBlue};
  border: 2px solid ${props => props.theme.colors.fountainBlue};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => (props.$show ? '1' : '0')};
  visibility: ${props => (props.$show ? 'visible' : 'hidden')};
  z-index: ${props => props.theme.zIndex.sticky};

  &:hover {
    background-color: ${props => props.theme.colors.fountainBlue};
    color: ${props => props.theme.colors.white};
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.fountainBlue};
  border: 1px solid ${props => props.theme.colors.fountainBlue};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.small};
  font-family: ${props => props.theme.typography.fontFamily.sansSerif};
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const CodeBlockWrapper = styled.div`
  position: relative;
`;

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MemoizedMessageBubble = React.memo(({ message }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = useCallback((code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  }, []);

  return (
    <MessageBubble $isUser={message.role === 'user'}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '');
            return !inline && match ? (
              <CodeBlockWrapper>
                <CopyButton onClick={() => handleCopyCode(code)}>
                  {copiedCode === code ? 'Copied!' : 'Copy'}
                </CopyButton>
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
              </CodeBlockWrapper>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img({ node, ...props }) {
            return <img style={{ maxWidth: '100%', height: 'auto' }} {...props} alt="" />;
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
    </MessageBubble>
  );
});

function ChatWindow({ messages, isLoading, onSend }) {
  const [input, setInput] = useState('');
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(0);


  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      if (inputRef.current) {  // Additional null check
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
        if (inputRef.current) {  // Additional null check
          inputRef.current.style.height = 'auto';
          const newHeight = inputRef.current.scrollHeight;
          inputRef.current.style.height = `${newHeight}px`;
          setInputHeight(newHeight);
        }
      });
    };

    const resizeObserver = new ResizeObserver(adjustHeight);
    resizeObserver.observe(inputRef.current);

    // Initial adjustment
    adjustHeight();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(adjustHeight);  // Cancel any pending animation frames
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

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <ChatContainer>
      <MessagesContainer ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <MemoizedMessageBubble key={index} message={message} />
        ))}
        {isLoading && <MessageBubble $isUser={false}>Thinking...</MessageBubble>}
        <div ref={messagesEndRef} />
      </MessagesContainer>
        <ScrollDownButton onClick={scrollToBottom} $show={showScrollDown} $inputHeight={inputHeight}>
            <ChevronDown size={24} />
        </ScrollDownButton>
      <InputContainer>
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustInputHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Please write your message here..."
          rows={1}
        />
        <SendButton onClick={handleSend} disabled={isLoading}>
          <SendIcon />
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default React.memo(ChatWindow);
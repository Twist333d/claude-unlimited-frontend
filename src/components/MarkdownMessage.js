// In MarkdownMessage.js
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const colors = ["red", "yellow", "green", "blue", "indigo", "purple", "pink"];

const getColorForTag = (tag) => {
  const index = tag.charCodeAt(0) % colors.length;
  return colors[index];
};

const XMLTag = ({ children }) => {
  const tagName = children[0].props.children[0];
  const color = getColorForTag(tagName);
  return (
    <span
      className={`inline-flex items-center rounded-md bg-${color}-50 px-2 py-1 text-xs font-medium text-${color}-700 ring-1 ring-inset ring-${color}-600/20`}
    >
      {children}
    </span>
  );
};

const MarkdownMessage = React.memo(function MarkdownMessage({ content }) {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (!inline && match) {
            return (
              <div className="code-block rounded-lg">
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              </div>
            );
          }
          if (inline && /<\/?[a-z][\s\S]*>/i.test(String(children))) {
            return <XMLTag>{children}</XMLTag>;
          }
          return (
            <code className="inline-code" {...props}>
              {children}
            </code>
          );
        },
        p: ({ node, children, ...props }) => {
          if (
            typeof children === "string" &&
            /<\/?[a-z][\s\S]*>/i.test(children)
          ) {
            return <XMLTag>{children}</XMLTag>;
          }
          return <p {...props}>{children}</p>;
        },
        // Custom renderers for potentially problematic elements
        div: ({ node, ...props }) => <div {...props} />,
        span: ({ node, ...props }) => <span {...props} />,
        // Add more custom renderers as needed
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

export default MarkdownMessage;

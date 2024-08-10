import React from "react";
import MarkdownMessage from "./MarkdownMessage";
import ErrorBoundary from "./common/ErrorBoundary";

const Message = React.memo(function Message({ content, sender }) {
  const messageClass =
    sender === "user"
      ? "bg-white ml-auto border-0 border-slate-900"
      : "bg-white border-1 border-gray-500 mr-auto";

  return (
    <div
      className={`p-2 rounded-lg font-serif break-words shadow-md ${messageClass} ${
        content.length < 20 ? "max-w-fit" : "max-w-[80%]"
      }`}
    >
      <ErrorBoundary>
        <MarkdownMessage
          content={
            typeof content === "string" ? content : JSON.stringify(content)
          }
        />
      </ErrorBoundary>
    </div>
  );
});

export default Message;

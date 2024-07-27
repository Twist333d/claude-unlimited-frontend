import React from 'react';
import MarkdownMessage from './MarkdownMessage';


const Message = React.memo(function Message({ content, sender }) {
  return (
    <div
      className={`p-2 rounded-lg font-serif max-w-[80%] break-words ${
        sender === 'user' 
          ? 'bg-white ml-auto border-0 border-slate-900 shadow-md' 
          : 'bg-white border-1 border-gray-500 mr-auto'
      }`}
    >
        <MarkdownMessage content={content} />
    </div>
  );
});

export default Message;
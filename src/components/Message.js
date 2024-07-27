import React from 'react';

const Message = React.memo(function Message({ content, sender }) {
  return (
    <div
      className={`p-2 rounded-lg font-serif max-w-[80%] break-words ${
        sender === 'user' 
          ? 'bg-blue-100 ml-auto border-2 border-black' 
          : 'bg-blue-200 mr-auto'
      }`}
    >
      {content}
    </div>
  );
});

export default Message;
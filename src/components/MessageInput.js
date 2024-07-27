import React, {useEffect, useRef, useState, useCallback} from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { debounce } from 'lodash';


function MessageInput({ onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  const debouncedResize = useCallback(
    debounce(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 7 * 24)}px`;
      }
    }, 100),
    []
  );

  const handleInputChange = useCallback((e) => {
    setInputText(e.target.value);
    debouncedResize();
  }, [debouncedResize]);

  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [inputText, onSendMessage]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-transparent p-4 sticky bottom-0">
      <div className="max-w-4xl mx-auto flex items-end space-x-4 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <textarea
          ref={textareaRef}
          className="font-serif flex-1 resize-none border-0 bg-transparent p-2 focus:outline-none focus:ring-0  max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          placeholder="How can I help you today?"
          rows="2"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <div className= "sticky top-0">
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        </div>
      </div>
    </div>
  );
}
export default React.memo(MessageInput);


import React, {useEffect, useRef, useState, useCallback} from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { debounce } from 'lodash';


function MessageInput({ onSendMessage, isDisabled }) {
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

  useEffect(() => {
  console.log('MessageInput rendered', textareaRef.current);
}, []);

  const handleInputChange = useCallback((e) => {
    setInputText(e.target.value);
    debouncedResize();
  }, [debouncedResize]);

  const handleSend = useCallback(() => {
    if (inputText.trim() && !isDisabled) {
      onSendMessage(inputText);
      setInputText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [inputText, onSendMessage, isDisabled]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
        <div className= "message-input-button sticky top-0">
        <button
          onClick={handleSend}
          disabled={isDisabled || !inputText.trim()}
          className={`send-button text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isDisabled || !inputText.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          <PaperAirplaneIcon className="send-button-icon h-5 w-5 transform -rotate-90" aria-hidden="true" />
        </button>
        </div>
      </div>
    </div>
  );
}
export default React.memo(MessageInput);


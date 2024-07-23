import React from 'react';
import { getRelativeTimeString } from '../utils/timeFormatting';

function ConversationList({ conversations, currentConversationId, onSelectConversation, isCollapsed }) {
  if (isCollapsed) {
    return null; // Don't render anything when collapsed
  }

  return (
    <div>
      <ol role="list" className="divide-y divide-gray-100 pl-4">
        {conversations.map((conv, index) => (
          <li
            key={conv.id}
            className={`flex justify-between gap-x-6 py-5 cursor-pointer pl-4 ${
              conv.id === currentConversationId ? 'bg-gray-100' : ''
            }`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {(conv.first_message || 'No messages yet').split('\n')[0].substring(0, 50)}
                {(conv.first_message || '').length > 50 ? '...' : ''}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                Last message {getRelativeTimeString(conv.created_at)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default React.memo(ConversationList);
import React from 'react';
import styled from 'styled-components';
import { MessageSquare } from 'lucide-react';
import { getRelativeTimeString } from '../utils/timeFormatting';


const ListContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  background-color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.typography.fontFamily.sansSerif};
`;

const Timestamp = styled.span`
  font-family: ${props => props.theme.typography.fontFamily.sansSerif};
  font-size: ${props => props.theme.typography.fontSize.small};
  color: ${props => props.theme.colors.paleSky};
`;



const ConversationItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background-color: ${props => props.$active ? props.theme.colors.lightGray : props.theme.colors.white};
  color: ${props => props.theme.colors.oxfordBlue};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$active ? props.theme.colors.lightGray : props.theme.colors.porcelain};
  }
`;
const LastMessageTime = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.paleSky};
  margin-top: ${props => props.theme.spacing.xs};
  font-size: 11px;
`;

const ConversationTitle = styled.div`
  font-family: ${props => props.theme.typography.fontFamily.sansSerif};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ConversationPreview = styled.div`
  font-family: ${props => props.theme.typography.fontFamily.sansSerif};
  font-size: 12px;
  color: ${props => props.theme.colors.paleSky};
  line-height: 1.2;

`;

function ConversationList({ conversations, currentConversationId, onSelectConversation, isCollapsed }) {
  if (isCollapsed) {
    return (
      <ListContainer>
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            $active={conv.id === currentConversationId}
            onClick={() => onSelectConversation(conv.id)}
          >
            <MessageSquare size={24} />
          </ConversationItem>
        ))}
      </ListContainer>
    );
  }

return (
    <ListContainer>
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          $active={conv.id === currentConversationId}
          onClick={() => onSelectConversation(conv.id)}
        >
          <ConversationTitle>
            {(conv.first_message || 'New conversation').split('\n')[0].substring(0, 50)}
            {(conv.first_message || '').length > 50 ? '...' : ''}
          </ConversationTitle>
          <LastMessageTime>
            Last message {getRelativeTimeString(conv.created_at)}
          </LastMessageTime>
        </ConversationItem>
      ))}
    </ListContainer>
  );
}

export default React.memo(ConversationList);
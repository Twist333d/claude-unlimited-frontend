export const ENDPOINTS = {
  CONVERSATIONS: "/conversations",
  MESSAGES: (conversationId) => `/conversations/${conversationId}/messages`,
  CHAT: "/chat",
  USAGE: "/usage",
};

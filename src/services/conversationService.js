// services/conversationService.js
import { apiMethods } from "../api/methods";
import { logger } from "../utils/logger";
import { ENDPOINTS } from "../api/endpoints";

export const conversationService = {
  createNewConversation: (title) => {
    logger.info("Creating new conversation:", title);
    return apiMethods.post(ENDPOINTS.CONVERSATIONS, { title });
  },
};

// services/userService.js
import { apiMethods } from "../api/methods";
import { logger } from "../utils/logger";
import { ENDPOINTS } from "../api/endpoints";

export const userService = {
  getUsage: (conversationId) => {
    logger.info("Fetching usage for conversation:", conversationId);
    return apiMethods.get(ENDPOINTS.USAGE, { conversation_id: conversationId });
  },
};

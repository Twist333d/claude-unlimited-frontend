// services/chatService.js
import { logger } from "../utils/logger";

export const chatService = {
  formatMessage: (message) => {
    // Add any necessary formatting logic
    return message;
  },

  handleSystemMessage: (message) => {
    logger.info("System message:", message);
    // Add any special handling for system messages
    return {
      content: message,
      sender: "system",
    };
  },

  handleErrorMessage: (error) => {
    logger.error("Chat error:", error);
    return {
      content: `An error occurred: ${error.message}`,
      sender: "error",
    };
  },
};

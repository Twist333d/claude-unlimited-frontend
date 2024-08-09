import { logger } from "./logger";

export const handleApiError = (error) => {
  if (error.response) {
    logger.error(
      `API Error: ${error.response.status} - ${error.response.data.message}`,
    );
  } else if (error.request) {
    logger.error("API Error: No response received");
  } else {
    logger.error(`API Error: ${error.message}`);
  }
  throw error;
};

export const getErrorMessage = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Unauthorized. Please log in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 500:
        return "An internal server error occurred. Please try again later.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }
  return "Unable to connect to the server. Please check your internet connection.";
};

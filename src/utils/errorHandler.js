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
      case 405:
        return "Method not allowed. Please check the API documentation.";
      case 408:
        return "Request timeout. Please try again.";
      case 409:
        return "Conflict with the current state of the resource.";
      case 413:
        return "Payload too large. Please reduce the amount of data sent.";
      case 422:
        return "Unprocessable entity. The request was well-formed but contains semantic errors.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "An internal server error occurred. Please try again later.";
      case 502:
        return "Bad gateway. The server received an invalid response from the upstream server.";
      case 503:
        return "Service unavailable. The server is currently unable to handle the request.";
      case 504:
        return "Gateway timeout. The upstream server failed to send a request in time.";
      default:
        return `An unexpected error occurred (Status ${error.response.status}). Please try again.`;
    }
  } else if (error.request) {
    return "No response received from the server. Please check your internet connection.";
  } else if (error.message) {
    return `Error: ${error.message}`;
  }
  return "An unknown error occurred. Please try again.";
};

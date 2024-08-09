import { logger } from "./logger";

export const ERROR_TYPES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  AUTH_ERROR: "AUTH_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CLIENT_ERROR: "CLIENT_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

export const classifyError = (error) => {
  if (error.isAxiosError && !error.response) {
    return {
      type: ERROR_TYPES.NETWORK_ERROR,
      message:
        "No response received from the server. Please check your internet connection.",
    };
  }

  if (error.response) {
    const status = error.response.status;
    let message = "";
    let type = ERROR_TYPES.UNKNOWN_ERROR;

    switch (status) {
      case 400:
        type = ERROR_TYPES.VALIDATION_ERROR;
        message = "Invalid request. Please check your input.";
        break;
      case 401:
        type = ERROR_TYPES.AUTH_ERROR;
        message = "Unauthorized. Please log in again.";
        break;
      case 403:
        type = ERROR_TYPES.AUTH_ERROR;
        message = "You do not have permission to perform this action.";
        break;
      case 404:
        type = ERROR_TYPES.CLIENT_ERROR;
        message = "The requested resource was not found.";
        break;
      case 405:
        type = ERROR_TYPES.CLIENT_ERROR;
        message = "Method not allowed. Please check the API documentation.";
        break;
      case 408:
        type = ERROR_TYPES.NETWORK_ERROR;
        message = "Request timeout. Please try again.";
        break;
      case 409:
        type = ERROR_TYPES.CLIENT_ERROR;
        message = "Conflict with the current state of the resource.";
        break;
      case 413:
        type = ERROR_TYPES.CLIENT_ERROR;
        message = "Payload too large. Please reduce the amount of data sent.";
        break;
      case 422:
        type = ERROR_TYPES.VALIDATION_ERROR;
        message =
          "Unprocessable entity. The request was well-formed but contains semantic errors.";
        break;
      case 429:
        type = ERROR_TYPES.CLIENT_ERROR;
        message = "Too many requests. Please try again later.";
        break;
      case 500:
        type = ERROR_TYPES.SERVER_ERROR;
        message = "An internal server error occurred. Please try again later.";
        break;
      case 502:
        type = ERROR_TYPES.SERVER_ERROR;
        message =
          "Bad gateway. The server received an invalid response from the upstream server.";
        break;
      case 503:
        type = ERROR_TYPES.SERVER_ERROR;
        message =
          "Service unavailable. The server is currently unable to handle the request.";
        break;
      case 504:
        type = ERROR_TYPES.SERVER_ERROR;
        message =
          "Gateway timeout. The upstream server failed to send a request in time.";
        break;
      default:
        message = `An unexpected error occurred (Status ${status}). Please try again.`;
    }

    return { type, message };
  }

  return {
    type: ERROR_TYPES.UNKNOWN_ERROR,
    message: error.message || "An unknown error occurred. Please try again.",
  };
};

export const handleApiError = (error) => {
  const classifiedError = classifyError(error);
  logger.error(`${classifiedError.type}: ${classifiedError.message}`, error);
  return classifiedError;
};

export const getErrorMessage = (error) => {
  const classifiedError = classifyError(error);
  return classifiedError.message;
};

// hooks/useErrorHandler.js
import { useCallback } from "react";
import { useError } from "../contexts/ErrorContext";
import { ERROR_TYPES } from "../utils/errorHandler";

export const useErrorHandler = () => {
  const { showError } = useError();

  const handleError = useCallback(
    (error) => {
      let errorConfig = {
        type: ERROR_TYPES.UNKNOWN_ERROR,
        message: "An unexpected error occurred.",
      };

      if (typeof error === "string") {
        errorConfig.message = error;
      } else if (error.type && error.message) {
        errorConfig = error;
      } else if (error.response) {
        // Handle API errors
        errorConfig = {
          type: ERROR_TYPES.API_ERROR,
          message:
            error.response.data.error ||
            "An error occurred while processing your request.",
        };
      }

      showError(errorConfig);
    },
    [showError],
  );

  return handleError;
};

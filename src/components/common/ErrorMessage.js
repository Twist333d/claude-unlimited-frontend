import React from "react";
import { ERROR_TYPES } from "../../utils/errorHandler";

const ErrorMessage = ({ error }) => {
  const getErrorStyle = (errorType) => {
    switch (errorType) {
      case ERROR_TYPES.NETWORK_ERROR:
        return "bg-red-100 border-red-500 text-red-700";
      case ERROR_TYPES.SERVER_ERROR:
        return "bg-orange-100 border-orange-500 text-orange-700";
      case ERROR_TYPES.AUTH_ERROR:
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case ERROR_TYPES.VALIDATION_ERROR:
        return "bg-blue-100 border-blue-500 text-blue-700";
      default:
        return "bg-gray-100 border-gray-500 text-gray-700";
    }
  };

  return (
    <div className={`border-l-4 p-4 ${getErrorStyle(error.type)}`}>
      <p className="font-bold">{error.type}</p>
      <p>{error.message}</p>
    </div>
  );
};

export default ErrorMessage;

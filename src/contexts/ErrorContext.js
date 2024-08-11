// src/contexts/ErrorContext.js
import React, { createContext, useState, useContext } from "react";
import ErrorToast from "../components/common/ErrorToast";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = (errorData) => {
    setError(errorData);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      {error && <ErrorToast error={error} onClose={clearError} />}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);

// src/contexts/ErrorContext.js
import React, { createContext, useState, useContext } from "react";
import ErrorToast from "../components/common/ErrorToast";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [globalError, setGlobalError] = useState(null);

  const showGlobalError = (error) => {
    setGlobalError(error);
  };

  const clearGlobalError = () => {
    setGlobalError(null);
  };

  return (
    <ErrorContext.Provider value={{ showGlobalError, clearGlobalError }}>
      {children}
      {globalError && (
        <ErrorToast error={globalError} onClose={clearGlobalError} />
      )}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);

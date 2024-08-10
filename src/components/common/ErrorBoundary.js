// components/common/ErrorBoundary.js
import React from "react";
import ErrorMessage from "./ErrorMessage";
import { logError } from "../../utils/errorLogger";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage
          error={{
            type: "BOUNDARY_ERROR",
            message: "An unexpected error occurred. Please try again later.",
          }}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

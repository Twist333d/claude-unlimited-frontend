// hooks/useTurnstile.js
import { useEffect, useCallback, useRef } from "react";
import config from "../config";

export const useTurnstile = () => {
  const widgetId = useRef(null);

  const handleTurnstileCallback = useCallback((token) => {
    console.log("Turnstile token:", token);
    // You can use this token when making requests to your backend
  }, []);

  useEffect(() => {
    const renderTurnstile = () => {
      if (window.turnstile && !widgetId.current) {
        const container = document.getElementById("turnstile-container");
        if (container) {
          try {
            widgetId.current = window.turnstile.render(container, {
              sitekey: config.turnstileSiteKey,
              callback: handleTurnstileCallback,
              "refresh-expired": "auto",
            });
          } catch (error) {
            console.error("Error rendering Turnstile:", error);
          }
        } else {
          console.error("Turnstile container element not found");
        }
      }
    };

    if (document.readyState === "complete") {
      renderTurnstile();
    } else {
      window.addEventListener("load", renderTurnstile);
      return () => window.removeEventListener("load", renderTurnstile);
    }

    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
    };
  }, [handleTurnstileCallback]);

  return null;
};

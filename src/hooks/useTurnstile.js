// hooks/useTurnstile.js
import { useEffect, useCallback, useRef } from "react";
import config from "../config";
import { logger } from "../utils/logger";

export const useTurnstile = () => {
  const widgetId = useRef(null);

  const handleTurnstileCallback = useCallback((token) => {
    logger.debug("Turnstile token:", token);
  }, []);

  useEffect(() => {
    const renderTurnstile = () => {
      if (window.turnstile && !widgetId.current) {
        const container = document.getElementById("turnstile-container");
        if (container) {
          if (!config.turnstileSiteKey) {
            logger.error(
              "Turnstile sitekey is undefined. Check your environment variables.",
            );
            return;
          }
          try {
            widgetId.current = window.turnstile.render(container, {
              sitekey: config.turnstileSiteKey,
              callback: handleTurnstileCallback,
              "refresh-expired": "auto",
            });
          } catch (error) {
            logger.error("Error rendering Turnstile:", error);
          }
        } else {
          logger.error("Turnstile container element not found");
        }
      }
    };

    renderTurnstile();

    return () => {
      if (widgetId.current) {
        window.turnstile.remove(widgetId.current);
      }
    };
  }, [handleTurnstileCallback]);

  return null;
};

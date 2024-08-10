// hooks/useTurnstile.js
import { useEffect, useCallback, useRef } from "react";
import config from "../config";

export const useTurnstile = () => {
  const turnstileRendered = useRef(false);

  const handleTurnstileCallback = useCallback((token) => {
    console.log("Turnstile token:", token);
    // You can use this token when making requests to your backend
  }, []);

  useEffect(() => {
    if (window.turnstile && !turnstileRendered.current) {
      window.turnstile.render("#turnstile-container", {
        sitekey: config.turnstileSiteKey,
        callback: handleTurnstileCallback,
      });
      turnstileRendered.current = true;
    }
  }, [handleTurnstileCallback]);

  return null;
};

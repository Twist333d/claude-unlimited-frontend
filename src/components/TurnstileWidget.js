import React, { useEffect, useRef } from "react";
import config from "../config"; // Import the config

const TurnstileWidget = ({ onVerify }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (window.turnstile && widgetRef.current) {
      window.turnstile.render(widgetRef.current, {
        sitekey: config.turnstileSiteKey, // Use the sitekey from config
        callback: onVerify,
      });
    }
  }, [onVerify]);

  return <div ref={widgetRef} />;
};

export default TurnstileWidget;

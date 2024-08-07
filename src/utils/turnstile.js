let turnstileWidget = null;

export const initializeTurnstile = (siteKey) => {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      console.log("Turnstile already loaded. Initializing...");
      renderTurnstileWidget(siteKey, resolve, reject);
    } else {
      console.log("Loading Turnstile script...");
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.onload = () => {
        console.log("Turnstile script loaded successfully");
        renderTurnstileWidget(siteKey, resolve, reject);
      };
      script.onerror = (error) => {
        console.error("Failed to load Turnstile script:", error);
        reject(new Error("Failed to load Turnstile script"));
      };
      document.head.appendChild(script);
    }
  });
};

const renderTurnstileWidget = (siteKey, resolve, reject) => {
  try {
    console.log("Rendering Turnstile widget...");
    turnstileWidget = window.turnstile.render("#turnstile-container", {
      sitekey: siteKey,
      callback: function (token) {
        console.log("Turnstile challenge completed successfully");
        resolve(token);
      },
      "error-callback": function () {
        console.error("Turnstile challenge failed");
        reject(new Error("Turnstile challenge failed"));
      },
    });
    console.log("Turnstile widget rendered:", turnstileWidget);
  } catch (error) {
    console.error("Error rendering Turnstile widget:", error);
    reject(error);
  }
};

export const getTurnstileToken = () => {
  return new Promise((resolve, reject) => {
    if (!turnstileWidget) {
      console.error("Turnstile widget not initialized");
      reject(new Error("Turnstile widget not initialized"));
      return;
    }

    console.log("Requesting Turnstile token...");
    window.turnstile.ready(() => {
      window.turnstile.reset(turnstileWidget, {
        callback: (token) => {
          console.log("New Turnstile token obtained");
          resolve(token);
        },
        "error-callback": () => {
          console.error("Failed to obtain new Turnstile token");
          reject(new Error("Failed to obtain new Turnstile token"));
        },
      });
    });
  });
};

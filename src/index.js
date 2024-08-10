import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tailwind.css";
import App from "./App";
import { verifyEnvVars } from "./config";
import { logger } from "./utils/logger";
import reportWebVitals from "./reportWebVitals";
import { Analytics } from "@vercel/analytics/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
);

if (!verifyEnvVars()) {
  logger.error("Application cannot start due to missing environment variables");
} else {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
      <Analytics />
    </React.StrictMode>,
  );
}

reportWebVitals();

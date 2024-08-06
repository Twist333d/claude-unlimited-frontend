import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tailwind.css"; // Update this line
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Analytics } from "@vercel/analytics/react";
import { createClient } from "@supabase/supabase-js";
import config from "./config";

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
);

reportWebVitals();

// Export supabase client for use in other files
export { supabase };

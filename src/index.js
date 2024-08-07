import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tailwind.css"; // Update this line
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Analytics } from "@vercel/analytics/react";
import { createClient } from "@supabase/supabase-js";
import config from "./config";

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
console.log("API URL:", process.env.REACT_APP_API_URL);
console.log("Supabase URL:", process.env.REACT_APP_SUPABASE_URL);

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

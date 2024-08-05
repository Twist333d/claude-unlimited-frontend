import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/tailwind.css"; // Update this line
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Analytics } from "@vercel/analytics/react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

// Create a new file named config.js in the src folder and import it
import config from "./config";

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

function AuthWrapper() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return <App session={session} />;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthWrapper />
    <Analytics />
  </React.StrictMode>,
);

reportWebVitals();

// Export supabase client for use in other files
export { supabase };

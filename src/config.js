const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
  supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  turnstileSiteKey: process.env.REACT_APP_TURNSTILE_SITE_KEY,
  logLevl: process.env.REACT_APP_LOG_LEVEL,
};

// Remove any trailing slash from apiUrl
if (config.apiUrl && config.apiUrl.endsWith("/")) {
  config.apiUrl = config.apiUrl.slice(0, -1);
}

export default config;

const requiredEnvVars = [
  "REACT_APP_API_URL",
  "REACT_APP_SUPABASE_URL",
  "REACT_APP_SUPABASE_ANON_KEY",
  "REACT_APP_TURNSTILE_SITE_KEY",
];

const verifyEnvVars = () => {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );
  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
    return false;
  }
  return true;
};

const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
  supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  turnstileSiteKey: process.env.REACT_APP_TURNSTILE_SITE_KEY,
  logLevel:
    process.env.REACT_APP_LOG_LEVEL ||
    (process.env.REACT_APP_VERCEL_ENV === "production"
      ? "ERROR"
      : process.env.REACT_APP_VERCEL_ENV === "development"
        ? "WARN"
        : "DEBUG"),
};

// Remove any trailing slash from apiUrl
if (config.apiUrl && config.apiUrl.endsWith("/")) {
  config.apiUrl = config.apiUrl.slice(0, -1);
}

export { verifyEnvVars };
export default config;

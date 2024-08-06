const config = {
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:5000",
  supabaseUrl: process.env.SUPABASE_URL || "http://127.0.0.1:54321",
  supabaseAnonKey:
    process.env.SUPABASE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
};

// Remove any trailing slash
if (config.apiUrl.endsWith("/")) {
  config.apiUrl = config.apiUrl.slice(0, -1);
}

export default config;

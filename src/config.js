const config = {
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:5001",
};

// Remove any trailing slash
if (config.apiUrl.endsWith("/")) {
  config.apiUrl = config.apiUrl.slice(0, -1);
}

export default config;

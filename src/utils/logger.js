const logger = {
  info: (message) => console.log(`[FRONTEND] INFO: ${message}`),
  warn: (message) => console.warn(`[FRONTEND] WARN: ${message}`),
  error: (message) => console.error(`[FRONTEND] ERROR: ${message}`),
  debug: (message) => console.debug(`[FRONTEND] DEBUG: ${message}`),
};

export default logger;
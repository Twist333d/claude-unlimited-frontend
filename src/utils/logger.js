import config from "../config";

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLogLevel = LOG_LEVELS[config.logLevel];

const formatMessage = (level, message, ...args) => {
  const timestamp = new Date().toISOString();
  const formattedArgs = args
    .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
    .join(" ");
  return `[${timestamp}] ${level}: ${message} ${formattedArgs}`;
};

export const logger = {
  error: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      console.error(formatMessage("ERROR", message, ...args));
    }
  },
  warn: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(formatMessage("WARN", message, ...args));
    }
  },
  info: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.info(formatMessage("INFO", message, ...args));
    }
  },
  debug: (message, ...args) => {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.debug(formatMessage("DEBUG", message, ...args));
    }
  },
};

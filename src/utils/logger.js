const logLevel = process.env.REACT_APP_LOG_LEVEL || "info";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const log = (level, ...args) => {
  if (levels[level] <= levels[logLevel]) {
    console[level](...args);
  }
};

export const logger = {
  error: (...args) => log("error", ...args),
  warn: (...args) => log("warn", ...args),
  info: (...args) => log("info", ...args),
  debug: (...args) => log("debug", ...args),
};

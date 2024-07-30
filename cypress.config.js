const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      if (process.env.CI) {
        config.baseUrl = 'http://localhost:3000'; // Keep this for CI
      }
      return config;
    },
  },
});
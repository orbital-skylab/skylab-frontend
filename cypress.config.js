import { defineConfig } from "cypress";

module.exports = defineConfig({
  video: false,
  // watchForFileChanges: false,
  e2e: {
    baseUrl: "http://localhost:4000/api",
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));

      // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config;
    },
    testIsolation: false,
  },
});

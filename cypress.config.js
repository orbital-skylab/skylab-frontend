import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  watchForFileChanges: false,
  e2e: {
    baseUrl: "http://localhost:4000/api/",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    testIsolation: false,
  },
});

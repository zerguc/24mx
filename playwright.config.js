import { defineConfig, devices } from "@playwright/test";

let retr = parseInt(process.env.numberOfRetries)
let work = parseInt(process.env.numberOfWorkers)

export default defineConfig({
  retries: retr,
  workers: work,
  timeout: 300000,
  use: {
    launchOptions: {
      slowMo: 50,
    },
    screenshot: "only-on-failure",
    ignoreHTTPSErrors: true,
    headless: false,
    // hasTouch: true,
    // trace: "on",
  },
  fullyParallel: process.env.parallelization,
  reporter: "html",
  projects: [
    // { name: "setup", testMatch: /.*\.setup\.js/ },

    // {
    //   name: "chromium",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //   },
    //   dependencies: ["setup"],
    // },
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //   },
    //   dependencies: ["setup"],
    // },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
      // dependencies: ["setup"],
    },
    // {
    //   name: "Google Chrome",
    //   use: { ...devices["Desktop Chrome"], channel: "chrome" },
    //   dependencies: ["setup"], // or 'chrome-beta'
    // },
  ],
});

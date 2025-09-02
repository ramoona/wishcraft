import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./__tests__/e2e",
  fullyParallel: true,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], isMobile: false },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"], isMobile: true },
    },
  ],

  webServer: {
    command: "pnpm e2e-tests:dev-server",
    url: "http://localhost:3000",
    reuseExistingServer: false,
  },
});

import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./__tests__/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  expect: {
    timeout: process.env.CI ? 10_000 : 30_000,
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
    command: process.env.CI ? "pnpm start" : "pnpm e2e-tests:dev-server",
    url: "http://localhost:3000",
    reuseExistingServer: false,
  },
});

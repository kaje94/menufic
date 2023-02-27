import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

/** See https://playwright.dev/docs/test-configuration. */
export default defineConfig({
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000,
    },
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Configure projects for major browsers */
    projects: [{ name: "firefox", use: { ...devices["Desktop Firefox"] } }],
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: "list",
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    testDir: "./tests",
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
    },
    webServer: {
        command: "npm run dev",
        reuseExistingServer: !process.env.CI,
        timeout: 60 * 1000,
        url: "http://localhost:3000",
    },
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
});

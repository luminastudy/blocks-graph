import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for visual regression testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/visual',

  // Snapshots directory
  snapshotDir: './tests/visual/snapshots',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: Boolean(process.env.CI),

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter to use
  reporter: 'html',

  // Shared settings for all projects
  use: {
    // Base URL for testing
    baseURL: 'http://localhost:8080',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot settings
    screenshot: 'only-on-failure',

    // Browser launch options for sandboxed environments
    launchOptions: {
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
      ],
    },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local server for test pages
  webServer: {
    command: 'npx http-server tests/visual/test-pages -p 8080 --cors -s',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000,
  },
});

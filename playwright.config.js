import { defineConfig, devices } from '@playwright/test';
import { config, qaseConfig } from '@config';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html',{ outputFile: 'test-results/results.html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['playwright-qase-reporter', {
      debug: false,
      mode: 'testops',
      environment: qaseConfig.environmentId,
      testops: {
        api: {
          token: qaseConfig.apiKey,
        },
        project: qaseConfig.projectCode,
        uploadAttachments: true,
        run: {
          id: undefined,
          title: "Test run as a example",
          description: "Test run as a example to present the results in the Qase TestOps",
          complete: true,
        },
      },
    }],
  ],
  use: {
    baseURL: config.baseURL,

    trace: 'on-failure',
    screenshot: 'on',
    video: 'on',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1512, height: 982 },
        deviceScaleFactor: 2,
        launchOptions: {
          args: ['--window-size=1512,982'],
        },
      },
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1512, height: 982 },
    //     deviceScaleFactor: 2,
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1512, height: 982 },
    //     deviceScaleFactor: 2,
    //   },
    // },
  ],
});

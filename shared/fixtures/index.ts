import { test as base, expect, chromium, Page } from '@playwright/test';
import { createLicense, deleteLicense } from '@clients/aidbox-rpc-client';
import { parseSetCookie } from '@utils/cookies';
import { startInstance, stopInstance } from '@utils/docker';
import { loginAsAdmin } from '@utils/auth';
import { config } from '@config';
import { FormTemplatesPage } from '@pom/formTemplatesPage';

export interface AidboxInstance {
  url: string;
  jwt: string;
  adminPassword: string;
  licenseId: string;
}

export const test = base.extend<
  {
    authenticatedPage: { page: Page };
  },
  {
    aidboxInstance: AidboxInstance;
  }
>({
  aidboxInstance: [
    async ({}, use) => {
      const { license } = await createLicense();
      if (!license) throw new Error('No license returned');

      try {
        await startInstance(license.id, config.baseURL!);

        const instance: AidboxInstance = {
          url: config.baseURL!,
          licenseId: license.id,
          jwt: license.jwt,
          adminPassword: license.adminPassword,
        };

        await use(instance);
      } finally {
        await stopInstance();
        await deleteLicense(license.id);
      }
    },
    { scope: 'worker' },
  ],

  authenticatedPage: async ({ aidboxInstance, baseURL }, use) => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await test.step('Login as admin', async () => {
      const cookies = await loginAsAdmin(page, context, baseURL!, aidboxInstance.adminPassword);
      await context.addCookies(cookies.map(raw => parseSetCookie(raw, baseURL!)));
      await page.goto(new FormTemplatesPage(page).path);
    });

    await use({ page });
  },
});

export { expect };

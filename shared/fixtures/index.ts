import { test as base, expect, Page, BrowserContext, chromium } from '@playwright/test';
import { createLicense, deleteLicense } from '@clients/aidbox-rpc-client';
import { parseSetCookie } from '@utils/cookies';
import { startInstance, stopInstance } from '@utils/docker';
import { loginAsAdmin } from '@utils/auth';
import { config } from '@config';
import { FormTemplatesPage } from '@pom/formTemplatesPage';
import { BasicAuthorization, Client } from '@aidbox/sdk-r4';
import { createTestClientWithPolicy } from '@utils/aidbox-test-client';

export interface AidboxInstance {
  url: string;
  jwt: string;
  adminPassword: string;
  licenseId: string;
}

export type ClientCredentials = { id: string; secret: string };

export const test = base.extend<
  {
    authenticatedPage: { page: Page };
    adminSession: { cookieHeader: string; cookies: string[] };
    clientCredentials: ClientCredentials;
    aidBoxClient: Client<BasicAuthorization>;
  },
  {
    aidboxInstance: AidboxInstance;
  }
>({
  // Поднимаем Aidbox инстанс
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

  // Один раз логинимся админом, получаем cookies
  adminSession: async ({ aidboxInstance, page, context }, use) => {
    const cookies = await loginAsAdmin(
      page,
      context,
      aidboxInstance.url,
      aidboxInstance.adminPassword
    );

    const cookieHeader = cookies.map((c) => c.split(';')[0]).join('; ');
    const cookieObjects = cookies.map((raw) => parseSetCookie(raw, aidboxInstance.url));
    await context.addCookies(cookieObjects);

    await use({ cookieHeader, cookies });
  },

  // Авторизованная страница
  authenticatedPage: async ({ page, context, adminSession, aidboxInstance }, use) => {
    await context.addCookies(
      adminSession.cookies.map((raw) => parseSetCookie(raw, aidboxInstance.url))
    );
    await page.goto(new FormTemplatesPage(page).path);

    await use({ page });
  },
  // Создание временного клиента через API
  clientCredentials: async ({ aidboxInstance, adminSession }, use) => {
    const creds = await createTestClientWithPolicy(aidboxInstance, adminSession.cookieHeader);
    await use(creds);
  },

  // SDK клиент
  aidBoxClient: async ({ aidboxInstance, clientCredentials }, use) => {
    const client = new Client<BasicAuthorization>(aidboxInstance.url, {
      auth: {
        method: 'basic',
        credentials: { username: clientCredentials.id, password: clientCredentials.secret },
      },
    });
    await use(client);
  },
});

export { expect };

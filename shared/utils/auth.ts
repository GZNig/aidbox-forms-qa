import { BrowserContext, Page } from '@playwright/test';
import { getAuthCookies } from '@utils/cookies';

export async function loginAsAdmin(
  page: Page,
  context: BrowserContext,
  baseURL: string,
  adminPassword: string
) {
  await page.goto(`${baseURL}/auth/login`);
  const csrf = await page.locator('input[name="_csrf"]').inputValue();
  const cookieLoginString = (await context.cookies()).map((c) => `${c.name}=${c.value}`).join('; ');
  return getAuthCookies(baseURL, csrf, adminPassword, cookieLoginString);
}

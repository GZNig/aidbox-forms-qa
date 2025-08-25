import { Page, test } from '@playwright/test';

export abstract class BasePage {
  public readonly page: Page;
  protected abstract path: string;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    test.step(`Open '${this.path}' page`, async () => {
      await this.page.goto(this.path);
      await this.page.waitForLoadState('networkidle');
    });
  }

  async isOpen(path?: string): Promise<boolean> {
    const expectedPath = path || this.path;
    return await test.step(`Ensure '${expectedPath}' page is open`, async () => {
      await this.page.waitForLoadState('networkidle');

      if (this.page.url().includes(expectedPath)) return true;
      await this.page.waitForURL(`**${expectedPath}**`, { timeout: 10000 });
      return this.page.url().includes(expectedPath);
    });
  }
}

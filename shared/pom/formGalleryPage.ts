import { Page, Locator, test } from '@playwright/test';
import { QuestionnairesTabs } from './tabsComponent';
import { BasePage } from './basePage';

export class FormGalleryPage extends BasePage {
  path = '/ui/sdc#/library';
  readonly searchInput: Locator;
  readonly cards: Locator;
  readonly tabs: QuestionnairesTabs;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('[data-test-id="questionnaire-library-grid__search-input"]');
    this.cards = page.locator('[data-test-id="questionnaire-library-grid__select-form-button"]');
    this.tabs = new QuestionnairesTabs(page);
  }

  /** вернуть все карточки на странице */
  async getAllFormCards(): Promise<FormCard[]> {
    return Promise.all(
      Array.from({ length: await this.cards.count() }, async (_, i) => {
        return new FormCard(this.cards.nth(i));
      })
    );
  }

  /** найти карточку по имени */
  async getFormCardByName(name: string): Promise<FormCard> {
    const cards = await this.getAllFormCards();
    const card = cards.find(async card => (await card.getTitle()) === name);
    if (!card) {
      throw new Error(`FormCard with name "${name}" not found`);
    }
    return card;
  }

  async getCardTitles(): Promise<string[]> {
    const cards = await this.getAllFormCards();
    return Promise.all(cards.map(c => c.getTitle()));
  }

  async importForm(name: string): Promise<void> {
    await test.step(`Import form: ${name}`, async () => {
      const card = await this.getFormCardByName(name);
      await card.importBtn.click();
    });
  }
  async filterByText(text: string): Promise<void> {
    await test.step(`Filter by text: ${text}`, async () => {
      await this.searchInput.fill(text);
    });
  }
}

export class FormCard {
  readonly root: Locator;
  readonly text: Locator;
  readonly url: Locator;
  readonly previewBtn: Locator;
  readonly importBtn: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.text = root.locator('> div:nth-child(1) > div');
    this.url = root.locator('span');
    this.previewBtn = root.locator('[data-test-id="questionnaire-library-grid__preview-button"]');
    this.importBtn = root.locator('[data-test-id="questionnaire-library-grid__import-button"]');
  }

  async getTitle(): Promise<string> {
    return await this.text.evaluate(el => (el.childNodes[0]?.textContent || '').trim());
  }
}

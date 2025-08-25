import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './basePage';
import { QuestionnairesTabs } from './tabsComponent';

export class FormTemplatesPage extends BasePage {
  path = '/ui/sdc#/';
  readonly searchInput: Locator;
  readonly createTemplateBtn: Locator;
  readonly createInUiBuilderBtn: Locator;
  readonly importQuestionnaireBtn: Locator;
  readonly emptyState: Locator;
  readonly tabs: QuestionnairesTabs;
  readonly cards: Locator;

  constructor(page: Page) {
    super(page);

    this.searchInput = page.locator('[data-test-id="questionnaire-grid__search-input"]');
    this.createTemplateBtn = page.locator(
      '[data-test-id="questionnaire-grid__create-template-button"]'
    );
    this.createInUiBuilderBtn = page.locator(
      '[data-test-id="questionnaire-grid__create-into-ui-builder-button"]'
    );
    this.importQuestionnaireBtn = page.locator(
      '[data-test-id="questionnaire-grid__import-questionnaire-button"]'
    );
    this.emptyState = page.getByText('No forms found.');
    this.tabs = new QuestionnairesTabs(page);
    this.cards = page.locator('[data-test-id="questionnaire-grid__select-form-button"]');
  }

  async filter(query: string) {
    await test.step(`Filter by text: '${query}'`, async () => {
      await this.searchInput.fill(query);
    });
  }

  async getAllCards(): Promise<FormCard[]> {
    const count = await this.cards.count();
    const result: FormCard[] = [];
    for (let i = 0; i < count; i++) {
      result.push(new FormCard(this.cards.nth(i)));
    }
    return result;
  }

  async getCardByName(name: string): Promise<FormCard> {
    const card = this.cards.filter({ hasText: name }).first();
    if (!card) {
      throw new Error(`FormCard with name "${name}" not found`);
    }
    return new FormCard(card);
  }

  async createTemplate(): Promise<void> {
    await test.step('Click Create template button', async () => {
      await this.createTemplateBtn.click();
    });
  }

  async createInUiBuilder(): Promise<void> {
    await test.step('Click Create in UI Builder button', async () => {
      await this.createInUiBuilderBtn.click();
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
  readonly name: Locator;
  readonly url: Locator;
  readonly status: Locator;
  readonly version: Locator;
  readonly previewBtn: Locator;
  readonly shareBtn: Locator;
  readonly menuBtn: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.name = root.locator('[data-test-id="questionnaire-grid__form-name-text"]');
    this.url = root.locator('[data-test-id="questionnaire-grid__form-url-text"]');
    this.status = root.locator('[data-test-id="questionnaire-grid__form-status-text"]');
    this.version = root.locator('[data-test-id="questionnaire-grid__form-version-text"]');
    this.previewBtn = root.locator('[data-test-id="questionnaire-grid__preview-button"]');
    this.shareBtn = root.locator('[data-test-id="questionnaire-grid__share-button"]');
    this.menuBtn = root.locator('[data-test-id="questionnaire-grid__form-menu-button"]');
  }
}

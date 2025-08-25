import { Locator, Page, test } from '@playwright/test';

export class QuestionnairesTabs {
  readonly tabQuestionnaires: Locator;
  readonly tabResponses: Locator;
  readonly tabLibrary: Locator;

  constructor(page: Page) {
    this.tabQuestionnaires = page.locator(
      '[data-test-id="questionnaires-grids__questionnaires-grid-tab"]'
    );
    this.tabResponses = page.locator(
      '[data-test-id="questionnaires-grids__questionnaire-response-grid-tab"]'
    );
    this.tabLibrary = page.locator(
      '[data-test-id="questionnaires-grids__questionnaire-library-grid-tab"]'
    );
  }

  async click(tab: 'questionnaires' | 'responses' | 'library') {
    await test.step(`Click '${tab}' tab`, async () => {
      switch (tab) {
        case 'questionnaires':
          await this.tabQuestionnaires.click();
          break;
        case 'responses':
          await this.tabResponses.click();
          break;
        case 'library':
          await this.tabLibrary.click();
          break;
      }
    });
  }
}

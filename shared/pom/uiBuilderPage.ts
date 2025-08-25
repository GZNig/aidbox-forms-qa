import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './basePage';

export class UiBuilderPage extends BasePage {
  path = '/ui/sdc#/forms/builder';

  readonly backButton: Locator;
  readonly formTitleButton: Locator;
  readonly addNewItemButton: Locator;

  readonly idInput: Locator;
  readonly titleInput: Locator;
  readonly urlInput: Locator;
  readonly versionInput: Locator;
  readonly statusDropdown: Locator;
  readonly defaultLanguageDropdown: Locator;

  readonly showOutlineCheckbox: Locator;
  readonly populationButton: Locator;
  readonly populationPatientCheckbox: Locator;
  readonly populationEncounterCheckbox: Locator;
  readonly populationLocationCheckbox: Locator;
  readonly populationStudyCheckbox: Locator;
  readonly populationUserCheckbox: Locator;

  readonly addNamedExpressionButton: Locator;

  readonly previewButton: Locator;
  readonly saveButton: Locator;

  // Селектор компонентов
  readonly reusableContextSelector: Locator;
  readonly reusableContextOptions: Locator;
  readonly componentLabel: Locator;

  constructor(page: Page) {
    super(page);

    this.backButton = page.locator('[data-test-id="outline-header__back-button"]');
    this.formTitleButton = page.locator('[data-test-id="outline-header__form-title-button"]');
    this.addNewItemButton = page.locator('[data-test-id="outline__add-new-item-button"]');

    this.idInput = page.locator('[data-test-id="properties-form__id-input"]');
    this.titleInput = page.locator('[data-test-id="properties-form__title-input"]');
    this.urlInput = page.locator('[data-test-id="properties-form__url-input"]');
    this.versionInput = page.locator('[data-test-id="properties-form__version-input"]');
    this.statusDropdown = page.locator('[data-test-id="properties-form__status-dropdown"]');
    this.defaultLanguageDropdown = page.locator(
      '[data-test-id="properties-form__default-language-dropdown"]'
    );

    this.showOutlineCheckbox = page.locator(
      '[data-test-id="properties-form__show-outline-button"]'
    );
    this.populationButton = page.locator('[data-test-id="properties-form__population-button"]');
    this.populationPatientCheckbox = page.locator(
      '[data-test-id="properties-form__population-patient-button"]'
    );
    this.populationEncounterCheckbox = page.locator(
      '[data-test-id="properties-form__population-encounter-button"]'
    );
    this.populationLocationCheckbox = page.locator(
      '[data-test-id="properties-form__population-location-button"]'
    );
    this.populationStudyCheckbox = page.locator(
      '[data-test-id="properties-form__population-study-button"]'
    );
    this.populationUserCheckbox = page.locator(
      '[data-test-id="properties-form__population-user-button"]'
    );

    this.addNamedExpressionButton = page.locator(
      '[data-test-id="properties-form__add-named-expression-button"]'
    );

    this.previewButton = page.locator('[data-test-id="toolbar__preview-button"]');
    this.saveButton = page.locator('[data-test-id="toolbar__save-button"]');

    // Селектор компонентов
    this.reusableContextSelector = page.locator(
      '[data-test-id="properties-form__reusable-context-dropdown"]'
    );
    this.reusableContextOptions = page.locator(
      '[data-test-id="properties-form__reusable-context-options"]'
    );
    this.componentLabel = page.locator('[data-test-id="properties-form__reusable-context-label"]');
  }

  async setTitle(title: string) {
    await test.step(`Fill title input with: ${title}`, async () => {
      await this.titleInput.fill(title);
    });
  }

  async setUrl(url: string) {
    await test.step(`Fill url input with: ${url}`, async () => {
      await this.urlInput.fill(url);
    });
  }

  async setVersion(version: string) {
    await test.step(`Fill version input with: ${version}`, async () => {
      await this.versionInput.fill(version);
    });
  }

  async toggleShowOutline() {
    await test.step('Click show outline checkbox', async () => {
      await this.showOutlineCheckbox.click();
    });
  }

  async expandPopulation() {
    await test.step('Click population button', async () => {
      await this.populationButton.click();
    });
  }

  async enablePopulation(type: 'patient' | 'encounter' | 'location' | 'study' | 'user') {
    await test.step(`Enable ${type} population`, async () => {
      switch (type) {
        case 'patient':
          await this.populationPatientCheckbox.check();
          break;
        case 'encounter':
          await this.populationEncounterCheckbox.check();
          break;
        case 'location':
          await this.populationLocationCheckbox.check();
          break;
        case 'study':
          await this.populationStudyCheckbox.check();
          break;
        case 'user':
          await this.populationUserCheckbox.check();
          break;
      }
    });
  }

  async save() {
    await test.step('Click save button', async () => {
      await this.saveButton.click();
    });
  }

  async preview() {
    await test.step('Click preview button', async () => {
      await this.previewButton.click();
    });
  }

  async selectReusableContext(option: string) {
    await test.step('Click reusable context selector', async () => {
      await this.reusableContextSelector.click();
    });
    await test.step(`Select reusable context option: ${option}`, async () => {
      const optionLocator = this.page.getByRole('option', { name: option, exact: true });
      await expect(optionLocator).toBeVisible();
      await optionLocator.click();
    });
  }
}

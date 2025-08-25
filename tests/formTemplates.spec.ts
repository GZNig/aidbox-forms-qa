import { expect, test } from '@fixtures/index';
import { FormTemplatesPage } from '@pom/formTemplatesPage';
import { UiBuilderPage } from '@pom/uiBuilderPage';
import { qase } from 'playwright-qase-reporter';

test.describe('Aidbox - Questionnaires (Form Templates)', () => {
  let formTemplatesPage: FormTemplatesPage;
  let uiBuilderPage: UiBuilderPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    const { page } = authenticatedPage;

    formTemplatesPage = new FormTemplatesPage(page);
    uiBuilderPage = new UiBuilderPage(page);

    await formTemplatesPage.open();
    expect(await formTemplatesPage.isOpen()).toBe(true);
  });

  test(qase(130, 'Redirect to UI Builder when click Create button in Form Templates'), async () => {
    await formTemplatesPage.createTemplate();
    await formTemplatesPage.createInUiBuilder();

    expect(await uiBuilderPage.isOpen()).toBe(true);
  });

  test(
    qase(
      131,
      'No forms found is displayed when filter by text if there are no forms or components with this text'
    ),
    async () => {
      const nonexistentText = `__nonexistent_${Date.now().toString()}__`;
      await formTemplatesPage.filterByText(nonexistentText);

      await test.step('Ensure the list of cards is empty', async () => {
        await expect(formTemplatesPage.cards).toHaveCount(0);
        await expect(formTemplatesPage.emptyState).toBeVisible();
      });
    }
  );
});

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
  test(qase(7, 'Component is deleted when click "Delete" if it has "draft" status'), async ({ aidBoxClient }) => {
    const created = await test.step('Create a new questionnaire', async () => {
      return await aidBoxClient.resource.create('Questionnaire', {
        resourceType: 'Questionnaire',
        title: `API Test Form ${Date.now()}`,
        status: 'draft',
        extension: [{ url: 'random-extension', valueString: 'independent-child' }],
        item: [{ linkId: 'q1', text: 'Question', type: 'string', required: true }],
      });
    });

    await test.step('Ensure the card is visible', async () => {
      await formTemplatesPage.page.reload();
      await expect(formTemplatesPage.cards).toContainText(created.title!);
    });

    await formTemplatesPage.deleteCard(created.title!);
    await test.step('Ensure the card is deleted', async () => {
      expect(formTemplatesPage.cards).not.toContainText(created.title!);
    });
  });
});
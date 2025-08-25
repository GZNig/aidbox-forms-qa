import { expect, test } from '@fixtures/index';
import { FormTemplatesPage } from '@pom/formTemplatesPage';
import { UiBuilderPage } from '@pom/uiBuilderPage';
import { qase } from 'playwright-qase-reporter';

test.describe('Aidbox - Questionnaires (UI Builder)', () => {
  let formTemplatesPage: FormTemplatesPage;
  let uiBuilderPage: UiBuilderPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    const { page } = authenticatedPage;

    formTemplatesPage = new FormTemplatesPage(page);
    uiBuilderPage = new UiBuilderPage(page);

    await uiBuilderPage.open();
    expect(await uiBuilderPage.isOpen()).toBe(true);
  });

  [
    { type: 'Form', qaseId: 125 },
    { type: 'Component', qaseId: 126 },
    { type: 'Reusable form', qaseId: 127 },
  ].forEach(({ type, qaseId }) => {
    test(qase(qaseId, `New empty ${type} is created when save ${type} in UI Builder`), async () => {
      await uiBuilderPage.setTitle(`New Test ${type}`);
      await uiBuilderPage.setUrl(`new-test-${type.toLowerCase()}`);
      await uiBuilderPage.selectReusableContext(type);

      const savePromise = uiBuilderPage.page.waitForResponse(
        response =>
          response.url().includes('/Questionnaire/$save') &&
          response.request().method() === 'POST' &&
          response.status() === 200
      );
      await uiBuilderPage.save();
      await savePromise;

      await formTemplatesPage.open();
      expect(await formTemplatesPage.isOpen()).toBe(true);

      await test.step('Ensure the card is displayed', async () => {
        expect(await formTemplatesPage.getCardByName(`New Test ${type}`)).toBeDefined();
      });
    });
  });
});

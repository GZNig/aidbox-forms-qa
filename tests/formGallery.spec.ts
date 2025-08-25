import { expect, test } from '@fixtures/index';
import { FormGalleryPage } from '@pom/formGalleryPage';
import { UiBuilderPage } from '@pom/uiBuilderPage';
import { qase } from 'playwright-qase-reporter';

test.describe('Aidbox - Questionnaires (Form Gallery)', () => {
  let galleryPage: FormGalleryPage;
  let uiBuilderPage: UiBuilderPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    const { page } = authenticatedPage;

    galleryPage = new FormGalleryPage(page);
    uiBuilderPage = new UiBuilderPage(page);

    await galleryPage.open();
    expect(await galleryPage.isOpen()).toBe(true);
  });

  test(qase(128, 'Redirect to UI Builder when import questionnaire from gallery'), async () => {
    const [firstTitle] = await galleryPage.getCardTitles();
    await galleryPage.importForm(firstTitle);

    expect(await uiBuilderPage.isOpen()).toBe(true);
  });

  test(qase(129, 'Shows only specific questionnaires when filter by title'), async () => {
    const allTitles = await galleryPage.getCardTitles();
    const randomTitle = allTitles[Math.floor(Math.random() * allTitles.length)];

    const expectedTitles = allTitles.filter(t =>
      t.toLowerCase().includes(randomTitle.toLowerCase().trim())
    );

    await galleryPage.filterByText(randomTitle);

    await test.step(`Ensure the number of cards displayed: ${expectedTitles.length}`, async () =>
      await expect(galleryPage.cards).toHaveCount(expectedTitles.length));
    await test.step(`Ensure cards titles are correct: ${expectedTitles}`, async () =>
      expect(await galleryPage.getCardTitles()).toEqual(expectedTitles));
  });
});

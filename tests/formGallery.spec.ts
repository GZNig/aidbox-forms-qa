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
    const formCard = await galleryPage.getFormCardByName(firstTitle);
    await formCard.importBtn.click();

    expect(await uiBuilderPage.isOpen()).toBe(true);
  });

  test(qase(129, 'Shows only specific questionnaires when filter by title'), async () => {
    const allTitles = await galleryPage.getCardTitles();
    const randomTitle = allTitles[Math.floor(Math.random() * allTitles.length)];

    const expectedTitles = allTitles.filter(t =>
      t.toLowerCase().includes(randomTitle.toLowerCase().trim())
    );

    await galleryPage.searchInput.fill(randomTitle);

    await expect(galleryPage.cards, `Cards count should be ${expectedTitles.length}`).toHaveCount(
      expectedTitles.length
    );
    expect(await galleryPage.getCardTitles(), `Cards titles should be ${expectedTitles}`).toEqual(
      expectedTitles
    );
  });
});

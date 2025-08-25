import { expect, test } from '@fixtures/index';
import { createComponentQuestionnaire, QuestionnaireData } from '@utils/fhir-helpers';

test.describe('Aidbox API Client', () => {
  test('Health check returns status 200', async ({ aidBoxClient }) => {
    const response = await aidBoxClient.HTTPClient().get('health');
    expect(response.response.status).toBe(200);
  });

  test('Creates and retrieves a Questionnaire resource', async ({ aidBoxClient }) => {
    const questionnaireData: QuestionnaireData = {
      resourceType: 'Questionnaire',
      title: `API Test Form ${Date.now()}`,
      status: 'draft',
      item: [{ linkId: 'q1', text: 'Question', type: 'string', required: true }],
    };

    const createdQuestionnaire = await test.step('Create Questionnaire', async () => {
      return aidBoxClient.resource.create('Questionnaire', questionnaireData);
    });

    await test.step('Validate created Questionnaire', async () => {
      expect(createdQuestionnaire).toBeDefined();
      expect(createdQuestionnaire.resourceType).toBe(questionnaireData.resourceType);
      expect(createdQuestionnaire.id).toBeDefined();
      expect(createdQuestionnaire.title).toBe(questionnaireData.title);
      expect(createdQuestionnaire.item).toEqual(questionnaireData.item);
    });
  });

  test('Creates a component questionnaire with items', async ({ aidBoxClient }) => {
    const componentData = createComponentQuestionnaire(`API Test Component ${Date.now()}`);
    const createdComponent = await test.step('Create Component Questionnaire', async () => {
      return aidBoxClient.resource.create('Questionnaire', componentData);
    });

    await test.step('Ensure the component is created', async () => {
      expect(createdComponent).toBeDefined();
      expect(createdComponent.resourceType).toBe(componentData.resourceType);
      expect(createdComponent.id).toBeDefined();
      expect(createdComponent.title).toBe(componentData.title);
      expect(createdComponent.item).toBeDefined();
      expect(createdComponent.item!.length).toBeGreaterThan(0);
      expect(createdComponent.item![0]).toEqual(createdComponent.item![0]);
    });
  });
});

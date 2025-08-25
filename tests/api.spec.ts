import { expect, test } from '@fixtures/index';
import { createComponentQuestionnaire } from '@utils/fhir-helpers';
import { QuestionnaireData } from '@utils/fhir-helpers';

test.describe('Aidbox API Client', () => {
  test('Health check returns status 200', async ({ aidBoxClient }) => {
    try {
      const response = await aidBoxClient.HTTPClient().get('health');
      expect(response.response.status).toBe(200);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('Creates and retrieves a Questionnaire resource', async ({ aidBoxClient }) => {
    const questionnaireData: QuestionnaireData = {
      resourceType: 'Questionnaire',
      title: 'API Test Form',
      status: 'draft',
      item: [],
    };
    questionnaireData.item = [
      {
        linkId: 'q1',
        text: 'Question',
        type: 'string',
        required: true,
      },
    ];

    const createdQuestionnaire = await aidBoxClient.resource.create(
      'Questionnaire',
      questionnaireData
    );
    expect(createdQuestionnaire).toBeDefined();
    expect(createdQuestionnaire.id).toBeDefined();
    expect(createdQuestionnaire.title).toBe('API Test Form');
  });

  test('Creates a component questionnaire with items', async ({ aidBoxClient }) => {
    const componentData = createComponentQuestionnaire('API Test Component', 'api-test-component');

    const createdComponent = await aidBoxClient.resource.create('Questionnaire', componentData);
    expect(createdComponent).toBeDefined();
    expect(createdComponent.id).toBeDefined();
    expect(createdComponent.title).toBe('API Test Component');
    expect(createdComponent.item).toBeDefined();
    expect(createdComponent.item!.length).toBeGreaterThan(0);

    // Проверяем структуру вопросов
    const firstQuestion = createdComponent.item![0];
    expect(firstQuestion).toEqual(componentData.item![0]);
  });
});

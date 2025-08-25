/**
 * Утилиты для работы с FHIR ресурсами
 */

export interface QuestionnaireData {
  title: string;
  url?: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  resourceType: 'Questionnaire';
  item?: QuestionnaireItem[];
}

export interface QuestionnaireItem {
  linkId: string;
  text: string;
  type:
    | 'group'
    | 'display'
    | 'boolean'
    | 'decimal'
    | 'integer'
    | 'date'
    | 'dateTime'
    | 'time'
    | 'string'
    | 'text'
    | 'url'
    | 'choice'
    | 'open-choice'
    | 'attachment'
    | 'reference'
    | 'quantity';
  required?: boolean;
  item?: QuestionnaireItem[];
}

/**
 * Создает вопрос типа "boolean"
 */
export function createBooleanQuestion(
  linkId: string,
  text: string,
  required: boolean = false
): QuestionnaireItem {
  return {
    linkId,
    text,
    type: 'boolean',
    required,
  };
}

/**
 * Создает группу вопросов
 */
export function createQuestionGroup(
  linkId: string,
  text: string,
  items: QuestionnaireItem[] = []
): QuestionnaireItem {
  return {
    linkId,
    text,
    type: 'group',
    item: items,
  };
}

/**
 * Создает анкету компонента
 */
export function createComponentQuestionnaire(
  title: string = 'Test Component',
  url: string = 'test-component'
): QuestionnaireData {
  const questionnaire: QuestionnaireData = {
    resourceType: 'Questionnaire',
    title,
    status: 'draft',
    item: [],
  };

  // Добавляем несколько тестовых вопросов
  questionnaire.item = [
    {
      linkId: 'q1',
      text: 'What is your name?',
      type: 'string',
      required: true,
    },
    createBooleanQuestion('q2', 'Are you over 18?', true),
    createQuestionGroup('group1', 'Personal Information', [
      {
        linkId: 'q3',
        text: 'What is your email?',
        type: 'string',
      },
      {
        linkId: 'q4',
        text: 'What is your phone?',
        type: 'string',
      },
    ]),
  ];

  return questionnaire;
}

export function createQuestionnaire(questionary: QuestionnaireData): QuestionnaireData {
  return questionary;
}



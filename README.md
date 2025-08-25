# Aidbox Forms QA

System тесты для Aidbox Forms на Playwright + TypeScript.

## Как работает

1. **Запуск тестов** → Playwright открывает браузер
2. **Фикстура `aidboxInstance`** → создает лицензию Aidbox, скачивает docker-compose.yml, запускает контейнеры
3. **Фикстура `authenticatedPage`** → логинится в Aidbox как админ
4. **Тесты** → выполняют действия через Page Objects, проверяют результаты
5. **Очистка** → останавливает контейнеры, удаляет лицензию

## Установка

```bash
git clone <repo>
cd aidbox-forms-qa
pnpm install
cp env.example .env
# заполнить .env
```

## Запуск

```bash
pnpm test             # все тесты
pnpm test:ui          # с UI
pnpm test:headed      # видимый браузер
```

## CI/CD

GitHub Actions автоматически запускает:
- **Static Checks** → линтинг, проверка типов, форматирование
- **Tests** → Playwright тесты с PostgreSQL в Docker

### Настройка Secrets

Добавьте в GitHub Secrets:
- `AIDBOX_API_KEY` - API ключ Aidbox
- `AIDBOX_PORTAL_URL` - URL портала Aidbox
- `QASE_API_KEY` - API ключ Qase
- `QASE_PROJECT_CODE` - код проекта в Qase
- `QASE_BASE_URL` - базовый URL Qase API
- `QASE_ENVIRONMENT_ID` - ID окружения в Qase

## Структура

```
shared/
├── pom/              # Page Objects
├── fixtures/         # Playwright фикстуры
├── clients/          # API клиенты
└── utils/            # утилиты
tests/                # тесты
.github/workflows/    # CI/CD
```

## Тесты

- **formGallery.spec.ts** - пара тестов на функционал Form Gallery
- **uiBuilder.spec.ts** - пара тестов на функционал UiBuilder

## Команды

```bash
pnpm lint            # проверка кода
pnpm format          # форматирование
pnpm type-check      # проверка типов
pnpm check           # все проверки
```
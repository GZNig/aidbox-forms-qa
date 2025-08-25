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

## Структура

```
shared/
├── pom/              # Page Objects
├── fixtures/         # Playwright фикстуры
├── clients/          # API клиенты
└── utils/            # утилиты
tests/                # тесты
```

## Тесты

- **formGallery.spec.ts** - пара тестов на функционал Form Gallery
- **fromTemplates.spec.ts** - пара тестов на функционал Form Templates
- **uiBuilder.spec.ts** - пара тестов на функционал UiBuilder

## Команды

```bash
pnpm lint            # проверка кода
pnpm format          # форматирование
pnpm type-check      # проверка типов
```

## Требования

- Node.js 18+
- pnpm 10.13.1+
- Docker Desktop
- Aidbox лицензия

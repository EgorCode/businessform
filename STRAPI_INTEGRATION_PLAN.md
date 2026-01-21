# План интеграции Strapi v5

Этот документ описывает процесс перевода статического контента проекта BizStartMaster на динамическое управление через Strapi v5.

## 🔍 Анализ проекта
**Стек:** Vite + React + TypeScript.
**Цель:** Полная миграция статического контента без потери данных.

### Выявленные компоненты для миграции:
1.  **NewsFeed / NewsPage**: Новости законодательства (3+ шт).
2.  **PracticalFAQ**: Сценарии "Что делать если..." (8 шт).
3.  **KnowledgeCategories / FeaturedArticlesGrid**: База знаний и авторские статьи (14+ шт).
4.  **SelfEmployedCaseStudies**: Кейсы успеха (4 шт).

---

## 🚨 Критические тонкости Strapi v5

1.  **Формат данных:** Ответы приходят в объекте `data` напрямую. Поля `attributes` БОЛЬШЕ НЕТ.
2.  **API:** Используем множественное число (`/news-items`, `/knowledge-articles`). Всегда добавляем `?populate=*`.
3.  **Изображения:** Относительные пути. Используем утилиту `getStrapiMedia`.
4.  **Логирование:** Обязательные логи Raw response и Transformed data для отладки.
5.  **Типы:** Чистые интерфейсы без вложенности `attributes`.

---

## 📋 Пошаговый план выполнения

### Этап 1: Инфраструктура (Выполнено ✅)
- [x] Утилита `client/src/lib/strapi.ts` с методом `fetchAPI`.
- [x] Типы в `client/src/types/strapi.ts`.
- [x] Переменная `VITE_STRAPI_URL` в `.env`.

### Этап 2: Бэкенд на VPS (Выполнено ✅)
- [x] Установка Strapi v5.
- [x] Настройка упрощенного CORS в `config/middlewares.ts`.
- [x] Настройка Host `0.0.0.0` в `config/server.ts`.
- [x] База данных SQLite в `config/database.ts`.

### Этап 3: Создание структур (Admin UI)
Нужно создать следующие Collection Types:
1.  **`news-item`**: `title` (text), `summary` (text), `content` (blocks), `image` (media), `category` (text).
2.  **`faq`**: `question` (text), `situation` (text), `solution` (text), `tips` (json/array), `category` (enum).
3.  **`knowledge-article`**: `title`, `excerpt`, `content` (blocks), `author`, `readTime`, `tags` (json), `category` (enum), `isPopular` (bool).
4.  **`case-study`**: `name`, `role`, `niche`, `problem`, `result`, `subscription` (enum), `taxRate`, `avatar` (media).

### Этап 4: Интеграция компонентов
- [x] **NewsFeed.tsx**: Интеграция с фоллбэком.
- [x] **PracticalFAQ.tsx**: Интеграция с фоллбэком.
- [ ] **KnowledgeCategories.tsx**: Перевод на динамику + детальный просмотр.
- [ ] **FeaturedArticlesGrid.tsx**: Использование того же API `knowledge-articles`.
- [ ] **SelfEmployedCaseStudies.tsx**: Полная замена структуры на данные из Strapi.

### Этап 5: Проверка и Финализация
- [ ] Проверка всех логов в консоли.
- [ ] Тестирование загрузки изображений.
- [ ] Финальный билд и проверка на VPS.

---

## ⚡ Инструкция по проверке этапа
1. Открыть консоль (F12).
2. Найти логи `🔄 [Strapi] Fetching`.
3. Убедиться, что `✅ Raw Response` содержит массив объектов с `documentId`.
4. Убедиться, что нет ошибок `attributes is undefined`.correct settings.

1.  **Installation Scaffolding**
    - User needs to run: `npx create-strapi-app@latest backend --quickstart`.

2.  **CORS Configuration**
    - Edit `config/middlewares.ts` in the Strapi project.
    - **Critical**: Set `origin` to allow `http://localhost:5000` (server) and `http://0.0.0.0:5000` (or whichever port Vite/Express serves).

3.  **Content Types Creation**
    - **NewsItem**: `title` (Text), `summary` (Text), `content` (Rich Text), `publishedAt` (Date), `image` (Media).
    - **FAQ**: `question` (Text), `answer` (Rich Text), `category` (Text).

---

## 🔄 Phase 3: Component Integration
**Goal**: Replace static content with dynamic data.

1.  **Integration Patterns**
    - Use `useEffect` + `useState` logic (or `useQuery` since `tanstack/react-query` is installed).
    - **Rule**: Always handle `loading` and `error` states.
    - **Rule**: Use fallback content if API fails (graceful degradation).

2.  **target: `NewsFeed.tsx`**
    - Fetch from `/news-items`.
    - Map fields: `title` -> `title`, `summary` -> `summary`, `createdAt` -> `date`.

3.  **target: `PracticalFAQ.tsx`**
    - Fetch from `/faqs`.
    - Group by categories dynamically.

---

## ⚡ Phase 4: Verification & Logging
**Goal**: Ensure data flows correctly and errors are visible.

1.  **Connection Test**
    - Create a temporary `StrapiTest` component or use `App.tsx` to log a simple fetch on mount.
    - Verify logs in Console: `🔄 Fetching...`, `✅ Raw response...`.

2.  **Error Handling Check**
    - Simulate offline Strapi server.
    - Verify app doesn't crash but shows "Unable to load content" or cached data.

---

## 📝 Execution Checklist

- [ ] **Step 1**: Create `client/src/types/strapi.ts` (Types).
- [ ] **Step 2**: Create `client/src/lib/strapi.ts` (API Service).
- [ ] **Step 3**: Configure `.env`.
- [ ] **Step 4**: Provide `setup-strapi.md` guide for the user to run backend.
- [ ] **Step 5**: Migrate `NewsFeed.tsx`.

---

## 🚨 Critical V5 Reminders (Self-Correction)
- **NO `attributes`**: Access `item.title`, NOT `item.attributes.title`.
- **Populate**: Always append `?populate=*` to get images/relations.
- **Arrays**: `data` in response is an array for collections.
- **Undefined Checks**: Always check `if (!item) return null;`.

Let's begin!

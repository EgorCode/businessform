# Компоненты поиска

Этот каталог содержит компоненты для реализации функциональности поиска по сайту.

## Структура

- `SearchModal.tsx` - Модальное окно поиска
- `SearchResults.tsx` - Компоненты для отображения результатов поиска
- `search.css` - Стили для компонентов поиска
- `index.ts` - Файл для экспорта всех компонентов
- `README.md` - Документация

## Использование

### Базовое использование

```tsx
import { SearchModal } from '@/components/search';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Открыть поиск
      </button>
      
      <SearchModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </div>
  );
}
```

### Использование хука поиска

```tsx
import { useSearch } from '@/components/search';

function MySearchComponent() {
  const {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    popularQueries,
    clearSearch,
    selectRecentSearch,
    performSearch
  } = useSearch();

  // Использование хука...
}
```

## Компоненты

### SearchModal

Основной компонент модального окна поиска.

**Props:**
- `isOpen: boolean` - Состояние открытости модального окна
- `onClose: () => void` - Функция для закрытия модального окна

### SearchResults

Компонент для отображения результатов поиска.

**Props:**
- `results: SearchResult[]` - Массив результатов поиска
- `query: string` - Текст поискового запроса
- `onSelectResult?: () => void` - Опциональный обработчик выбора результата

### PopularQueries

Компонент для отображения популярных запросов.

**Props:**
- `queries: string[]` - Массив популярных запросов
- `onSelectQuery: (query: string) => void` - Обработчик выбора запроса

### RecentSearches

Компонент для отображения недавних поисков.

**Props:**
- `searches: string[]` - Массив недавних поисков
- `onSelectSearch: (query: string) => void` - Обработчик выбора поиска
- `onClearSearches: () => void` - Обработчик очистки поисков

## Хук useSearch

Хук для управления состоянием поиска.

**Возвращает:**
- `query: string` - Текущий поисковый запрос
- `setQuery: (query: string) => void` - Функция установки запроса
- `results: SearchResult[]` - Результаты поиска
- `isSearching: boolean` - Состояние загрузки
- `recentSearches: string[]` - Недавние поиски
- `popularQueries: string[]` - Популярные запросы
- `clearSearch: () => void` - Очистка поиска
- `selectRecentSearch: (query: string) => void` - Выбор недавнего поиска
- `performSearch: (query: string) => void` - Выполнение поиска

## Типы

### SearchResult

```tsx
interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  type: 'page' | 'component' | 'article' | 'calculator' | 'document';
  keywords?: string[];
}
```

## Расширение функциональности

### Добавление новых элементов в поиск

Чтобы добавить новые элементы в поиск, отредактируйте файл `hooks/useSearch.ts` и добавьте новые элементы в объект `searchDatabase`.

```tsx
const searchDatabase: SearchIndex = {
  // Существующие элементы...
  
  'new-item': {
    id: 'new-item',
    title: 'Новый элемент',
    description: 'Описание нового элемента',
    category: 'Категория',
    url: '/new-url',
    type: 'page',
    keywords: ['ключевое', 'слово', 'поиск']
  }
};
```

### Настройка алгоритма поиска

Алгоритм поиска можно настроить в функции `isRelevant` и `calculateRelevanceScore` в файле `hooks/useSearch.ts`.

### Кастомизация стилей

Стили можно настроить в файле `search.css` или переопределить в глобальных стилях проекта.

## Доступность

Компоненты поиска разработаны с учетом доступности:
- Поддержка навигации с клавиатуры
- ARIA-атрибуты для скринридеров
- Правильная семантическая разметка

## Производительность

Для оптимизации производительности:
- Используется debounce для поисковых запросов
- Ленивая загрузка результатов
- Оптимизированный алгоритм поиска
// Экспорт всех компонентов поиска
export { default as SearchModal } from './SearchModal';
export { SearchResults, PopularQueries, RecentSearches } from './SearchResults';

// Экспорт хука поиска
export { useSearch } from '@/hooks/useSearch';

// Экспорт типов
export type { SearchResult } from '@/hooks/useSearch';
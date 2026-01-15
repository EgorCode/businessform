import React, { useEffect, useRef } from 'react';
import { useSearch } from '@/hooks/useSearch';
import SearchResults, { PopularQueries, RecentSearches } from './SearchResults';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Search,
  ArrowRight,
  Loader2,
  Clock,
  TrendingUp
} from 'lucide-react';
import './search.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    query,
    setQuery,
    results,
    isSearching,
  recentSearches,
  popularQueries,
  clearSearch,
  selectRecentSearch,
  performSearch,
  clearRecentSearches
  } = useSearch();

  // Фокус на поле ввода при открытии модального окна
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Обработка нажатия Escape для закрытия модального окна
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
      onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Обработка выбора результата
  const handleSelectResult = () => {
    console.log('DEBUG: Выбран результат поиска, очищаем');
    onClose();
    clearSearch();
  };

  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        performSearch(query);
      }
    };

  // Очистка недавних поисков
  const handleClearRecentSearches = () => {
    console.log('DEBUG: Нажата кнопка очистки истории поиска');
    console.log('DEBUG: Текущая история поиска:', recentSearches);
    clearRecentSearches();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 border-0 shadow-2xl search-modal-content rounded-lg overflow-hidden">
        {/* Заголовок с полем поиска */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              <Input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по сайту..."
                className="w-full pl-10 pr-10 py-3 border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 search-input"
                autoComplete="off"
              />
            </form>
          </div>
          
        </div>

        {/* Содержимое модального окна */}
        <div className="max-h-[60vh] overflow-y-auto search-results-container search-scrollbar">
          {query ? (
            // Показываем результаты поиска
            <div className="search-result-item">
              <SearchResults
                results={results}
                query={query}
                onSelectResult={handleSelectResult}
              />
            </div>
          ) : (
            // Показываем популярные запросы и недавние поиски
            <div className="py-2 search-result-item">
              <PopularQueries
                queries={popularQueries}
                onSelectQuery={(selectedQuery) => {
                  setQuery(selectedQuery);
                  performSearch(selectedQuery);
                }}
              />
              
              <RecentSearches
                searches={recentSearches}
                onSelectSearch={selectRecentSearch}
                onClearSearches={handleClearRecentSearches}
              />
            </div>
          )}
        </div>

        {/* Подвал с подсказкой и кнопкой очистки */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span>Используйте</span>
      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">↑↓</kbd>
      <span>для навигации</span>
      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Enter</kbd>
      <span>для выбора</span>
      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Esc</kbd>
      <span>для закрытия</span>
    </div>
    
    <div className="flex items-center gap-2">
      {recentSearches.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log('DEBUG: Нажата кнопка "Очистить историю" в подвале модального окна');
            console.log('DEBUG: Текущая история поиска:', recentSearches);
            clearRecentSearches();
          }}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 clear-history-button"
        >
          <Clock className="h-4 w-4" />
          Очистить историю
        </Button>
      )}
    </div>
  </div>
</div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
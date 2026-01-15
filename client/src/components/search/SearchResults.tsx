import React from 'react';
import { SearchResult } from '@/hooks/useSearch';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  FileText,
  Calculator,
  BookOpen,
  FileCheck,
  ArrowRight,
  Clock,
  TrendingUp
} from 'lucide-react';
import './search.css';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onSelectResult?: () => void;
}

// Компонент для отображения иконки типа результата
const ResultTypeIcon = ({ type }: { type: SearchResult['type'] }) => {
  switch (type) {
    case 'page':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'calculator':
      return <Calculator className="h-4 w-4 text-green-500" />;
    case 'article':
      return <BookOpen className="h-4 w-4 text-purple-500" />;
    case 'document':
      return <FileCheck className="h-4 w-4 text-orange-500" />;
    case 'news':
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

// Компонент для отображения метки типа результата
const ResultTypeLabel = ({ type }: { type: SearchResult['type'] }) => {
  const labels: Record<SearchResult['type'], string> = {
    page: 'Страница',
    calculator: 'Калькулятор',
    article: 'Статья',
    document: 'Документ',
    component: 'Компонент',
    news: 'Новость'
  };
  
  return (
    <Badge variant="outline" className="text-xs">
      {labels[type]}
    </Badge>
  );
};

// Компонент для подсветки совпадений в тексте
const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900 rounded px-1">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  onSelectResult
}) => {
  console.log('DEBUG: SearchResults компонент рендерится');
  console.log('DEBUG: Полученные результаты:', results.length);
  console.log('DEBUG: Поисковый запрос в компоненте:', query);
  console.log('DEBUG: Типы результатов:', results.map(r => r.type));
  
  if (results.length === 0) {
    console.log('DEBUG: Результатов нет, показываем пустое состояние');
    return (
      <div className="text-center py-8 empty-state">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ничего не найдено</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          По запросу "{query}" не найдено результатов. Попробуйте изменить запрос или проверить орфографию.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500">
          Найдено результатов: <span className="font-medium text-gray-900">{results.length}</span>
        </span>
      </div>
      
      <div className="max-h-96 overflow-y-auto search-scrollbar">
        {results.map((result) => (
          <Link key={result.id} href={result.url}>
            <Card
              className="mx-2 mb-2 hover:bg-gray-50 transition-colors cursor-pointer border-0 shadow-sm hover:shadow-md search-result-item"
              onClick={onSelectResult}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <ResultTypeIcon type={result.type} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        <HighlightText text={result.title} query={query} />
                      </h3>
                      <ResultTypeLabel type={result.type} />
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      <HighlightText text={result.description} query={query} />
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 result-category">{result.category}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Компонент для отображения популярных запросов
export const PopularQueries: React.FC<{
  queries: string[];
  onSelectQuery: (query: string) => void;
}> = ({ queries, onSelectQuery }) => {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Популярные запросы</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {queries.map((query, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelectQuery(query)}
            className="text-xs h-7 px-3 bg-gray-50 hover:bg-gray-100 border-gray-200 popular-query-button"
          >
            {query}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Компонент для отображения недавних поисков
export const RecentSearches: React.FC<{
  searches: string[];
  onSelectSearch: (query: string) => void;
  onClearSearches: () => void;
}> = ({ searches, onSelectSearch, onClearSearches }) => {
  if (searches.length === 0) return null;
  
  return (
    <div className="px-4 py-3 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Недавние поиски</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log('DEBUG: Нажата кнопка "Очистить" в разделе недавних поисков');
            console.log('DEBUG: Текущая история поиска:', searches);
            onClearSearches();
          }}
          className="text-xs text-gray-500 hover:text-gray-700 h-6 px-2 clear-history-button"
        >
          Очистить
        </Button>
      </div>
      
      <div className="space-y-1">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSelectSearch(search)}
            className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1 px-2 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Clock className="h-3 w-3 text-gray-400" />
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
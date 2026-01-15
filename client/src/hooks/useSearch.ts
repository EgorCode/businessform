import { useState, useEffect, useMemo } from 'react';

// Определяем типы для результатов поиска
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  type: 'page' | 'component' | 'article' | 'calculator' | 'document' | 'news';
  keywords?: string[];
}

// Определяем структуру для индекса поиска
interface SearchIndex {
  [key: string]: SearchResult;
}

// База данных для поиска (в реальном приложении это может приходить с API)
const searchDatabase: SearchIndex = {
  // Страницы
  'home': {
    id: 'home',
    title: 'Главная страница',
    description: 'Начальная страница с обзором всех возможностей платформы',
    category: 'Основное',
    url: '/',
    type: 'page',
    keywords: ['главная', 'начало', 'обзор', 'платформа']
  },
  'wizard': {
    id: 'wizard',
    title: 'Мастер выбора',
    description: 'Помощник в выборе оптимальной формы ведения бизнеса',
    category: 'Инструменты',
    url: '/wizard',
    type: 'page',
    keywords: ['мастер', 'выбор', 'форма', 'бизнес', 'помощник']
  },
  'comparison': {
    id: 'comparison',
    title: 'Сравнение',
    description: 'Сравнение разных форм ведения бизнеса: ИП, ООО, самозанятость',
    category: 'Инструменты',
    url: '/comparison',
    type: 'page',
    keywords: ['сравнение', 'ип', 'ооо', 'самозанятость', 'формы']
  },
  'calculators': {
    id: 'calculators',
    title: 'Калькуляторы',
    description: 'Инструменты для расчета налогов, зарплаты, рентабельности и других бизнес-показателей',
    category: 'Инструменты',
    url: '/calculators',
    type: 'page',
    keywords: ['калькуляторы', 'расчет', 'налоги', 'зарплата', 'рентабельность']
  },
  'knowledge': {
    id: 'knowledge',
    title: 'База знаний',
    description: 'Полезные статьи, гайды и инструкции для ведения бизнеса',
    category: 'Ресурсы',
    url: '/knowledge',
    type: 'page',
    keywords: ['база знаний', 'статьи', 'гайды', 'инструкции', 'бизнес']
  },
  'documents': {
    id: 'documents',
    title: 'Документы',
    description: 'Готовые шаблоны и формы для регистрации и ведения бизнеса',
    category: 'Ресурсы',
    url: '/documents',
    type: 'page',
    keywords: ['документы', 'шаблоны', 'формы', 'регистрация', 'бизнес']
  },
  
  // Калькуляторы
  'tax-calculator': {
    id: 'tax-calculator',
    title: 'Налоговый калькулятор',
    description: 'Расчет налогов для ИП и самозанятых (НПД и УСН)',
    category: 'Калькуляторы',
    url: '/calculators#tax',
    type: 'calculator',
    keywords: ['налоги', 'ип', 'самозанятый', 'нпд', 'усн', 'расчет']
  },
  'salary-calculator': {
    id: 'salary-calculator',
    title: 'Калькулятор зарплаты',
    description: 'Расчет налогов с зарплаты сотрудника и суммы к выплате',
    category: 'Калькуляторы',
    url: '/calculators#salary',
    type: 'calculator',
    keywords: ['зарплата', 'налоги', 'сотрудник', 'выплата', 'расчет']
  },
  'profitability-calculator': {
    id: 'profitability-calculator',
    title: 'Калькулятор рентабельности',
    description: 'Расчет ключевых бизнес-показателей и рентабельности',
    category: 'Калькуляторы',
    url: '/calculators#profitability',
    type: 'calculator',
    keywords: ['рентабельность', 'бизнес', 'показатели', 'расчет']
  },
  'insurance-calculator': {
    id: 'insurance-calculator',
    title: 'Калькулятор страховых взносов',
    description: 'Расчет страховых взносов для ИП и самозанятых',
    category: 'Калькуляторы',
    url: '/calculators#insurance',
    type: 'calculator',
    keywords: ['страховые взносы', 'ип', 'самозанятый', 'расчет']
  },
  'registration-calculator': {
    id: 'registration-calculator',
    title: 'Калькулятор стоимости регистрации',
    description: 'Расчет затрат на регистрацию бизнеса и сопутствующие расходы',
    category: 'Калькуляторы',
    url: '/calculators#registration',
    type: 'calculator',
    keywords: ['регистрация', 'стоимость', 'расходы', 'бизнес', 'ип', 'ооо']
  },
  
  // Статьи и ресурсы
  'starting-business': {
    id: 'starting-business',
    title: 'Начало бизнеса',
    description: 'Все о начале бизнеса: от идеи до первой прибыли',
    category: 'Статьи',
    url: '/knowledge?category=starting',
    type: 'article',
    keywords: ['начало', 'бизнес', 'идея', 'прибыль', 'старт']
  },
  'taxes-accounting': {
    id: 'taxes-accounting',
    title: 'Налоги и бухгалтерия',
    description: 'Системы налогообложения, бухгалтерский учет, отчетность',
    category: 'Статьи',
    url: '/knowledge?category=taxes',
    type: 'article',
    keywords: ['налоги', 'бухгалтерия', 'учет', 'отчетность', 'системы']
  },
  'hr-labor': {
    id: 'hr-labor',
    title: 'Кадры и трудовое право',
    description: 'Найм сотрудников, трудовые договоры, охрана труда',
    category: 'Статьи',
    url: '/knowledge?category=hr',
    type: 'article',
    keywords: ['кадры', 'трудовое право', 'сотрудники', 'договоры', 'охрана труда']
  },
  'marketing-sales': {
    id: 'marketing-sales',
    title: 'Маркетинг и продажи',
    description: 'Продвижение бизнеса, привлечение клиентов, увеличение продаж',
    category: 'Статьи',
    url: '/knowledge?category=marketing',
    type: 'article',
    keywords: ['маркетинг', 'продажи', 'клиенты', 'продвижение', 'реклама']
  },
  'legal-aspects': {
    id: 'legal-aspects',
    title: 'Юридические аспекты',
    description: 'Юридическое сопровождение бизнеса, лицензии, разрешения',
    category: 'Статьи',
    url: '/knowledge?category=legal',
    type: 'article',
    keywords: ['юридические', 'лицензии', 'разрешения', 'сопровождение', 'право']
  },
  'finance-investments': {
    id: 'finance-investments',
    title: 'Финансы и инвестиции',
    description: 'Финансовое планирование, привлечение инвестиций, кредиты',
    category: 'Статьи',
    url: '/knowledge?category=finance',
    type: 'article',
    keywords: ['финансы', 'инвестиции', 'кредиты', 'планирование', 'привлечение']
  },
  
  // Документы
  'registration-docs': {
    id: 'registration-docs',
    title: 'Документы для регистрации',
    description: 'Шаблоны документов для регистрации ИП и ООО',
    category: 'Документы',
    url: '/documents?category=registration',
    type: 'document',
    keywords: ['регистрация', 'документы', 'ип', 'ооо', 'шаблоны']
  },
  'tax-docs': {
    id: 'tax-docs',
    title: 'Налоговые документы',
    description: 'Декларации, уведомления, налоговые документы',
    category: 'Документы',
    url: '/documents?category=tax',
    type: 'document',
    keywords: ['налоги', 'декларации', 'уведомления', 'документы']
  },
  'hr-docs': {
    id: 'hr-docs',
    title: 'Кадровые документы',
    description: 'Трудовые договоры, приказы, кадровые документы',
    category: 'Документы',
    url: '/documents?category=hr',
    type: 'document',
    keywords: ['кадры', 'трудовые договоры', 'приказы', 'документы']
  },
  'contract-docs': {
    id: 'contract-docs',
    title: 'Договоры',
    description: 'Шаблоны договоров для разных видов деятельности',
    category: 'Документы',
    url: '/documents?category=contracts',
    type: 'document',
    keywords: ['договоры', 'шаблоны', 'деятельность', 'контракты']
  },
  'license-docs': {
    id: 'license-docs',
    title: 'Лицензии',
    description: 'Документы для получения лицензий и разрешений',
    category: 'Документы',
    url: '/documents?category=licenses',
    type: 'document',
    keywords: ['лицензии', 'разрешения', 'документы', 'получение']
  }
};

// Функция для загрузки новостей из API
const fetchNewsForSearch = async (): Promise<SearchResult[]> => {
  try {
    console.log('DEBUG: Загружаем новости из API для поиска...');
    const response = await fetch('/api/news?limit=50'); // Загружаем последние 50 новостей
    if (!response.ok) {
      console.error('DEBUG: Ошибка загрузки новостей:', response.status);
      return [];
    }
    
    const data = await response.json();
    console.log('DEBUG: Загружено новостей:', data.news?.length || 0);
    
    if (!data.news || !Array.isArray(data.news)) {
      console.error('DEBUG: Некорректный формат данных новостей');
      return [];
    }
    
    // Преобразуем новости в формат SearchResult
    const newsSearchResults: SearchResult[] = data.news.map((newsItem: any) => ({
      id: `news-${newsItem.id}`,
      title: newsItem.title,
      description: newsItem.summary || newsItem.content?.substring(0, 200) + '...' || '',
      category: newsItem.categoryName || 'Новости',
      url: `/news/${newsItem.id}`,
      type: 'news' as const,
      keywords: [
        ...(newsItem.tags || []),
        ...(newsItem.businessForms || []),
        'новости',
        'законодательство',
        'изменения'
      ]
    }));
    
    console.log('DEBUG: Преобразовано новостей для поиска:', newsSearchResults.length);
    return newsSearchResults;
  } catch (error) {
    console.error('DEBUG: Ошибка при загрузке новостей для поиска:', error);
    return [];
  }
};

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [newsIndex, setNewsIndex] = useState<SearchResult[]>([]);
  const [newsLoaded, setNewsLoaded] = useState(false);

  // Функция для нормализации текста (удаление лишних пробелов, приведение к нижнему регистру)
  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  // Функция для проверки релевантности
  const isRelevant = (item: SearchResult, normalizedQuery: string): boolean => {
    const normalizedTitle = normalizeText(item.title);
    const normalizedDescription = normalizeText(item.description);
    const normalizedKeywords = item.keywords ? item.keywords.map(normalizeText) : [];
    
    // Проверяем точное совпадение в заголовке
    if (normalizedTitle.includes(normalizedQuery)) {
      return true;
    }
    
    // Проверяем точное совпадение в описании
    if (normalizedDescription.includes(normalizedQuery)) {
      return true;
    }
    
    // Проверяем совпадение в ключевых словах
    if (normalizedKeywords.some(keyword => keyword.includes(normalizedQuery))) {
      return true;
    }
    
    // Проверяем частичное совпадение в заголовке (для запросов длиннее 2 символов)
    if (normalizedQuery.length > 2 && normalizedTitle.split(' ').some(word => word.includes(normalizedQuery))) {
      return true;
    }
    
    return false;
  };

  // Функция для расчета релевантности (чем выше score, тем выше в результатах)
  const calculateRelevanceScore = (item: SearchResult, normalizedQuery: string): number => {
    const normalizedTitle = normalizeText(item.title);
    const normalizedDescription = normalizeText(item.description);
    const normalizedKeywords = item.keywords ? item.keywords.map(normalizeText) : [];
    
    let score = 0;
    
    // Точное совпадение в заголовке - самый высокий приоритет
    if (normalizedTitle === normalizedQuery) {
      score += 100;
    } else if (normalizedTitle.includes(normalizedQuery)) {
      score += 50;
    }
    
    // Точное совпадение в описании
    if (normalizedDescription.includes(normalizedQuery)) {
      score += 30;
    }
    
    // Совпадение в ключевых словах
    normalizedKeywords.forEach(keyword => {
      if (keyword === normalizedQuery) {
        score += 40;
      } else if (keyword.includes(normalizedQuery)) {
        score += 20;
      }
    });
    
    // Частичное совпадение слов в заголовке
    normalizedTitle.split(' ').forEach(word => {
      if (word.includes(normalizedQuery) && word !== normalizedQuery) {
        score += 10;
      }
    });
    
    return score;
  };

  // Функция для выполнения поиска
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    const normalizedQuery = normalizeText(searchQuery);
    
    console.log('DEBUG: Поисковый запрос:', searchQuery);
    console.log('DEBUG: Нормализованный запрос:', normalizedQuery);
    console.log('DEBUG: Всего элементов в searchDatabase:', Object.keys(searchDatabase).length);
    console.log('DEBUG: Доступные ID в searchDatabase:', Object.keys(searchDatabase));
    
    // Объединяем статичную базу данных с новостями
    const allSearchItems = [
      ...Object.values(searchDatabase),
      ...newsIndex
    ];
    
    console.log('DEBUG: Всего элементов для поиска (включая новости):', allSearchItems.length);
    console.log('DEBUG: Новостей в индексе:', newsIndex.length);
    
    // Фильтруем релевантные результаты
    const relevantResults = allSearchItems.filter(item =>
      isRelevant(item, normalizedQuery)
    );
    
    console.log('DEBUG: Найдено релевантных результатов:', relevantResults.length);
    console.log('DEBUG: Релевантные результаты:', relevantResults.map(r => ({ id: r.id, title: r.title, type: r.type })));
    
    // Сортируем по релевантности
    const sortedResults = relevantResults
      .map(item => ({
        ...item,
        relevanceScore: calculateRelevanceScore(item, normalizedQuery)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log('DEBUG: Отсортированные результаты:', sortedResults.map(r => ({ id: r.id, title: r.title, type: r.type, score: r.relevanceScore })));
    
    setResults(sortedResults);
    setIsSearching(false);
    
    // Сохраняем в недавние поиски
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      console.log('DEBUG: Сохраняем запрос в историю:', searchQuery);
      console.log('DEBUG: Текущая история до сохранения:', recentSearches);
      console.log('DEBUG: Длина запроса:', searchQuery.length);
      console.log('DEBUG: Запрос уже существует в истории:', recentSearches.includes(searchQuery));
      const newHistory = [searchQuery, ...recentSearches.slice(0, 4)];
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
      console.log('DEBUG: История после сохранения:', newHistory);
      console.log('DEBUG: Новая длина истории:', newHistory.length);
    } else {
      console.log('DEBUG: Запрос не сохранен в историю. Причины:');
      console.log('DEBUG: - Пустой запрос:', !searchQuery.trim());
      console.log('DEBUG: - Уже существует в истории:', recentSearches.includes(searchQuery));
    }
  };

  // Эффект для загрузки новостей при инициализации
  useEffect(() => {
    const loadNews = async () => {
      if (!newsLoaded) {
        console.log('DEBUG: Начинаем загрузку новостей для поиска...');
        const newsData = await fetchNewsForSearch();
        setNewsIndex(newsData);
        setNewsLoaded(true);
        console.log('DEBUG: Новости загружены и добавлены в индекс:', newsData.length);
      }
    };
    
    loadNews();
  }, [newsLoaded]);

  // Эффект для выполнения поиска при изменении запроса
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300); // Задержка для debounce
    
    return () => clearTimeout(timeoutId);
  }, [query, newsIndex]);

  // Функция для очистки поиска
  const clearSearch = () => {
    console.log('DEBUG: Вызвана функция clearSearch');
    console.log('DEBUG: Текущий запрос до очистки:', query);
    console.log('DEBUG: Текущие результаты до очистки:', results.length);
    setQuery('');
    setResults([]);
    console.log('DEBUG: Запрос и результаты очищены');
  };

  // Функция для выбора недавнего поиска
  const selectRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  // Функция для очистки истории поиска
  const clearRecentSearches = () => {
    console.log('DEBUG: Очищаем историю поиска');
    console.log('DEBUG: История до очистки:', recentSearches);
    console.log('DEBUG: Количество элементов в истории:', recentSearches.length);
    console.log('DEBUG: Время очистки:', new Date().toISOString());
    setRecentSearches([]);
    console.log('DEBUG: История после очистки: []');
    console.log('DEBUG: Операция очистки истории завершена успешно');
  };

  // Популярные запросы для отображения при пустом поиске
  const popularQueries = [
    'Как открыть ИП',
    'Налоги для самозанятых',
    'УСН 6%',
    'Трудовой договор',
    'Регистрация ООО'
  ];

  return {
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
  };
};
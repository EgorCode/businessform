# Руководство по настройке системы знаний AI-ассистента

## 📋 Обзор

Система знаний AI-ассистента BizStartMaster использует многоуровневый подход для предоставления точных и релевантных ответов на вопросы пользователей о налогах, формах бизнеса и юридических аспектах ведения бизнеса в России.

## 🏗️ Архитектура системы знаний

### Уровни знаний

#### 1. Базовый уровень (Static Knowledge)
- **Законодательство РФ**: Налоговый кодекс, Гражданский кодекс
- **Официальные лимиты**: Доходы, взносы, пороги
- **Стандартные процедуры**: Регистрация, отчетность, закрытие

#### 2. Расширенный уровень (Dynamic Knowledge)
- **Актуальные ставки**: Ежегодные изменения налогов и взносов
- **Региональные особенности**: Специальные режимы, льготы
- **Судебная практика**: Важные решения и прецеденты

#### 3. Экспертный уровень (Contextual Knowledge)
- **Персонализированные рекомендации**: Адаптация под ситуацию пользователя
- **Сравнительный анализ**: Преимущества и недостатки разных форм
- **Практические примеры**: Реальные кейсы и расчеты

## 🎯 Настройка контекстных ответов

### Системные инструкции для Gemini API

#### Базовая инструкция
```typescript
const SYSTEM_INSTRUCTION = `
Ты — ИИ-помощник, высококвалифицированный виртуальный юрист и налоговый консультант РФ.

Твоя специализация:
- Налоговое законодательство РФ (НПД, ИП, ООО)
- Регистрация и ведение бизнеса
- Страховые взносы и отчетность
- Выбор оптимальной формы бизнеса

Принципы работы:
1. Отвечай емко, структурированно и по делу
2. Используй актуальные данные на 2025 год
3. Приводи конкретные цифры и ссылки на законы
4. Предлагай практические решения
5. Уточняй детали, если вопрос неоднозначен

Формат ответа:
- Краткая суть ответа
- Детальное объяснение с примерами
- Практические рекомендации
- Связанные темы для изучения

Если вопрос требует уточнения, задай уточняющие вопросы.
`;
```

#### Контекстные модификаторы
```typescript
// Для вопросов о регистрации
const REGISTRATION_CONTEXT = `
Фокус на процессе регистрации:
- Необходимые документы
- Сроки и стоимость
- Способы подачи (онлайн/офлайн)
- Типичные ошибки и как их избежать
`;

// Для налоговых расчетов
const TAX_CALCULATION_CONTEXT = `
Фокус на расчетах:
- Актуальные ставки 2025 года
- Лимиты и пороги
- Примеры расчетов
- Сравнение режимов
`;

// Для выбора формы бизнеса
const BUSINESS_FORM_CONTEXT = `
Фокус на выборе формы:
- Критерии выбора (доход, сотрудники, риски)
- Преимущества и недостатки
- Порядок перехода между формами
- Последствия выбора
`;
```

### Адаптивные инструкции

#### Определение типа запроса
```typescript
interface QueryAnalysis {
  category: 'registration' | 'taxes' | 'business-form' | 'accounting' | 'general';
  complexity: 'simple' | 'medium' | 'complex';
  urgency: 'low' | 'medium' | 'high';
  context: string[];
}

const analyzeQuery = (query: string): QueryAnalysis => {
  // Анализ запроса для определения контекста
  const keywords = extractKeywords(query);
  const category = categorizeQuery(keywords);
  const complexity = assessComplexity(query);
  const urgency = detectUrgency(keywords);
  
  return {
    category,
    complexity,
    urgency,
    context: generateContext(keywords, category)
  };
};
```

#### Динамические инструкции
```typescript
const generateContextualInstruction = (analysis: QueryAnalysis): string => {
  let instruction = SYSTEM_INSTRUCTION;
  
  // Добавление контекстных модификаторов
  switch (analysis.category) {
    case 'registration':
      instruction += '\n' + REGISTRATION_CONTEXT;
      break;
    case 'taxes':
      instruction += '\n' + TAX_CALCULATION_CONTEXT;
      break;
    case 'business-form':
      instruction += '\n' + BUSINESS_FORM_CONTEXT;
      break;
  }
  
  // Адапация под сложность
  if (analysis.complexity === 'simple') {
    instruction += '\nДай краткий ответ с основной информацией.';
  } else if (analysis.complexity === 'complex') {
    instruction += '\nПредоставь подробный анализ с несколькими вариантами решения.';
  }
  
  return instruction;
};
```

## 📊 Управление базой знаний

### Структурирование данных

#### Категоризация знаний
```typescript
interface KnowledgeItem {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  content: string;
  examples: string[];
  relatedTopics: string[];
  lastUpdated: Date;
  relevanceScore: number;
}

const knowledgeBase = {
  registration: {
    individual: [/* ИП */],
    legal: [/* ООО */],
    selfEmployed: [/* Самозанятость */]
  },
  taxes: {
    usn: [/* УСН */],
    npd: [/* НПД */],
    psn: [/* ПСН */],
    osno: [/* ОСНО */]
  },
  accounting: {
    reporting: [/* Отчетность */],
    contributions: [/* Взносы */],
    documentation: [/* Документы */]
  }
};
```

#### Взвешивание релевантности
```typescript
const calculateRelevanceScore = (
  query: string, 
  knowledgeItem: KnowledgeItem
): number => {
  let score = 0;
  
  // Точное совпадение ключевых слов
  const queryWords = query.toLowerCase().split(' ');
  const titleWords = knowledgeItem.title.toLowerCase().split(' ');
  
  queryWords.forEach(word => {
    if (titleWords.includes(word)) {
      score += 10;
    }
  });
  
  // Семантическая близость
  const semanticScore = calculateSemanticSimilarity(query, knowledgeItem.content);
  score += semanticScore * 5;
  
  // Актуальность данных
  const daysSinceUpdate = (Date.now() - knowledgeItem.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 30) score += 5;
  else if (daysSinceUpdate < 90) score += 3;
  else if (daysSinceUpdate > 365) score -= 2;
  
  // Популярность темы
  score += knowledgeItem.relevanceScore;
  
  return score;
};
```

### Обновление знаний

#### Автоматическое обновление
```typescript
interface KnowledgeUpdate {
  source: 'government' | 'legal' | 'user_feedback' | 'expert_review';
  type: 'new' | 'update' | 'delete';
  category: string;
  content: any;
  timestamp: Date;
  verified: boolean;
}

const updateKnowledgeBase = async (updates: KnowledgeUpdate[]): Promise<void> => {
  for (const update of updates) {
    if (update.verified) {
      switch (update.type) {
        case 'new':
          await addKnowledgeItem(update);
          break;
        case 'update':
          await updateKnowledgeItem(update);
          break;
        case 'delete':
          await deleteKnowledgeItem(update);
          break;
      }
    }
  }
};
```

#### Валидация знаний
```typescript
const validateKnowledgeItem = (item: KnowledgeItem): boolean => {
  // Проверка полноты данных
  if (!item.title || !item.content || !item.category) {
    return false;
  }
  
  // Проверка актуальности
  const maxAge = 365; // дней
  const age = (Date.now() - item.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
  if (age > maxAge) {
    return false;
  }
  
  // Проверка релевантности
  if (item.relevanceScore < 0.3) {
    return false;
  }
  
  return true;
};
```

## 🎯 Персонализация ответов

### Профили пользователей

#### Типы пользователей
```typescript
interface UserProfile {
  type: 'beginner' | 'experienced' | 'expert';
  businessStage: 'planning' | 'starting' | 'operating' | 'scaling';
  businessForm: 'self-employed' | 'sole-proprietor' | 'llc' | 'none';
  industry: string;
  employees: number;
  annualRevenue: number;
  riskTolerance: 'low' | 'medium' | 'high';
  preferences: {
    detailLevel: 'brief' | 'detailed' | 'comprehensive';
    communicationStyle: 'formal' | 'friendly' | 'professional';
    languageComplexity: 'simple' | 'moderate' | 'technical';
  };
}
```

#### Адапация ответов под профиль
```typescript
const adaptResponseToProfile = (
  baseResponse: string, 
  profile: UserProfile
): string => {
  let adaptedResponse = baseResponse;
  
  // Адапация уровня детализации
  switch (profile.preferences.detailLevel) {
    case 'brief':
      adaptedResponse = summarizeResponse(adaptedResponse);
      break;
    case 'comprehensive':
      adaptedResponse = expandResponse(adaptedResponse);
      break;
  }
  
  // Адапация стиля общения
  switch (profile.preferences.communicationStyle) {
    case 'friendly':
      adaptedResponse = makeFriendly(adaptedResponse);
      break;
    case 'formal':
      adaptedResponse = makeFormal(adaptedResponse);
      break;
  }
  
  // Добавление релевантных примеров
  if (profile.businessForm !== 'none') {
    adaptedResponse = addRelevantExamples(adaptedResponse, profile);
  }
  
  return adaptedResponse;
};
```

### Контекстные рекомендации

#### Генерация связанных тем
```typescript
const generateRelatedTopics = (
  query: string, 
  userProfile: UserProfile
): string[] => {
  const relatedTopics = [];
  
  // Базовые связанные темы
  const baseTopics = findRelatedTopics(query);
  
  // Персонализированные темы
  if (userProfile.businessStage === 'planning') {
    relatedTopics.push('Выбор формы бизнеса', 'Регистрация ИП/ООО');
  }
  
  if (userProfile.employees > 0) {
    relatedTopics.push('Найм сотрудников', 'Страховые взносы');
  }
  
  if (userProfile.annualRevenue > 2400000) {
    relatedTopics.push('Переход с НПД на УСН', 'Налоговое планирование');
  }
  
  return [...new Set([...baseTopics, ...relatedTopics])];
};
```

## 🔄 Обучение и улучшение

### Сбор обратной связи

#### Оценка качества ответов
```typescript
interface FeedbackData {
  queryId: string;
  query: string;
  response: string;
  userRating: number; // 1-5
  userComment?: string;
  helpful: boolean;
  timestamp: Date;
  userProfile: UserProfile;
}

const collectFeedback = (feedback: FeedbackData): void => {
  // Сохранение обратной связи
  saveFeedback(feedback);
  
  // Обновление релевантности знаний
  updateKnowledgeRelevance(feedback);
  
  // Обучение модели
  trainModel(feedback);
};
```

#### Анализ неудачных ответов
```typescript
const analyzeFailedResponses = async (): Promise<void> => {
  const failedResponses = await getFailedResponses();
  
  for (const response of failedResponses) {
    // Анализ причин неудачи
    const failureReason = analyzeFailureReason(response);
    
    // Генерация улучшений
    const improvements = generateImprovements(response, failureReason);
    
    // Обновление базы знаний
    await updateKnowledgeBase(improvements);
  }
};
```

### Автоматическое улучшение

#### Обнаружение пробелов в знаниях
```typescript
const detectKnowledgeGaps = async (): Promise<string[]> => {
  const gaps = [];
  
  // Анализ частых запросов без ответов
  const unansweredQueries = await getUnansweredQueries();
  const commonTopics = extractCommonTopics(unansweredQueries);
  
  // Поиск дублирующихся или противоречивых знаний
  const contradictions = await findContradictions();
  
  // Проверка актуальности данных
  const outdatedInfo = await findOutdatedInfo();
  
  gaps.push(...commonTopics, ...contradictions, ...outdatedInfo);
  
  return gaps;
};
```

#### Генерация новых знаний
```typescript
const generateNewKnowledge = async (topic: string): Promise<KnowledgeItem> => {
  // Анализ существующих знаний
  const existingKnowledge = await findKnowledgeByTopic(topic);
  
  // Поиск актуальной информации
  const currentInfo = await searchCurrentInformation(topic);
  
  // Генерация структурированного знания
  const newKnowledge = {
    id: generateId(),
    category: categorizeTopic(topic),
    title: generateTitle(topic, currentInfo),
    content: generateContent(topic, currentInfo, existingKnowledge),
    examples: generateExamples(topic, currentInfo),
    relatedTopics: findRelatedTopics(topic),
    lastUpdated: new Date(),
    relevanceScore: calculateRelevanceScore(topic)
  };
  
  return newKnowledge;
};
```

## 📊 Метрики качества

### Показатели эффективности

#### Точность ответов
```typescript
interface QualityMetrics {
  accuracy: number;        // Точность фактической информации
  relevance: number;       // Релевантность ответа на вопрос
  completeness: number;    // Полнота ответа
  clarity: number;         // Ясность изложения
  helpfulness: number;     // Полезность для пользователя
  responseTime: number;    // Время ответа
}

const calculateQualityMetrics = async (): Promise<QualityMetrics> => {
  const feedback = await getRecentFeedback();
  
  return {
    accuracy: calculateAverage(feedback, f => f.accuracy),
    relevance: calculateAverage(feedback, f => f.relevance),
    completeness: calculateAverage(feedback, f => f.completeness),
    clarity: calculateAverage(feedback, f => f.clarity),
    helpfulness: calculateAverage(feedback, f => f.helpfulness),
    responseTime: calculateAverageResponseTime()
  };
};
```

#### Мониторинг производительности
```typescript
const monitorPerformance = (): void => {
  // Время ответа API
  const apiResponseTime = measureApiResponseTime();
  
  // Использование кэша
  const cacheHitRate = calculateCacheHitRate();
  
  // Нагрузка на систему
  const systemLoad = measureSystemLoad();
  
  // Логирование метрик
  logMetrics({
    apiResponseTime,
    cacheHitRate,
    systemLoad,
    timestamp: new Date()
  });
};
```

## 🚀 Оптимизация производительности

### Кэширование знаний

#### Многоуровневый кэш
```typescript
interface CacheLevel {
  memory: Map<string, any>;     // Горячие данные
  redis: Map<string, any>;      // Теплые данные
  database: Map<string, any>;    // Холодные данные
}

const getKnowledge = async (key: string): Promise<any> => {
  // Проверка memory кэша
  if (cache.memory.has(key)) {
    return cache.memory.get(key);
  }
  
  // Проверка Redis кэша
  if (cache.redis.has(key)) {
    const data = cache.redis.get(key);
    cache.memory.set(key, data);
    return data;
  }
  
  // Загрузка из базы данных
  const data = await loadFromDatabase(key);
  cache.redis.set(key, data);
  cache.memory.set(key, data);
  
  return data;
};
```

### Предзагрузка контента

#### Прогнозирование запросов
```typescript
const preloadLikelyQueries = async (userProfile: UserProfile): Promise<void> => {
  // Прогнозирование вероятных запросов
  const likelyQueries = predictLikelyQueries(userProfile);
  
  // Предзагрузка знаний
  for (const query of likelyQueries) {
    const knowledge = await findKnowledge(query);
    cache.set(query, knowledge);
  }
};
```

## 📚 Обучение и поддержка

### Документация для разработчиков
- **API документация**: Детальное описание всех эндпоинтов
- **Архитектура**: Объяснение системы знаний
- **Best practices**: Рекомендации по разработке

### Материалы для пользователей
- **Руководство пользователя**: Как эффективно использовать AI-ассистента
- **Примеры запросов**: Типовые вопросы и формулировки
- **FAQ**: Частые вопросы и ответы

---

*Документация обновлена: 22 ноября 2025*
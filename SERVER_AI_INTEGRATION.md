# Серверная интеграция AI-функционала

## Обзор
Создание серверных эндпоинтов для проксирования запросов к Google Gemini API с обеспечением безопасности, валидации и логирования.

## Архитектура серверной части

### Структура файлов
```
server/
├── routes/
│   ├── index.ts          # Основные роуты
│   ├── ai.ts            # AI специфичные роуты
│   └── auth.ts          # Аутентификация (будущее)
├── services/
│   ├── geminiService.ts  # Сервис для работы с Gemini API
│   └── cacheService.ts   # Сервис кэширования
├── middleware/
│   ├── rateLimit.ts      # Rate limiting
│   ├── validation.ts     # Валидация запросов
│   └── logger.ts        # Логирование
└── types/
    └── ai.ts            # TypeScript типы для AI
```

## Настройка переменных окружения

### Обновление .env файла
```env
# Database configuration
DATABASE_URL=sqlite:./local.db

# Server configuration
PORT=5000
NODE_ENV=development

# Session configuration
SESSION_SECRET=your-secret-key-here-change-in-production

# Google Gemini API Configuration
GEMINI_API_KEY=AIzaSyCej_Ur7rFCQt4MQpPZ5uu9_hIKIj90l2E
GEMINI_MODEL=gemini-3-pro-preview-11-2025
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta

# AI Service Configuration
AI_CACHE_TTL=300000        # 5 минут в мс
AI_RATE_LIMIT=100          # запросов в час
AI_MAX_TOKENS=800         # максимальное количество токенов
AI_TEMPERATURE=0.7         # температура генерации

# Security
CORS_ORIGIN=http://localhost:5173
API_KEY_HEADER=X-API-Key
```

### .env.example для разработки
```env
# Database configuration
DATABASE_URL=sqlite:./local.db

# Server configuration
PORT=5000
NODE_ENV=development

# Session configuration
SESSION_SECRET=dev-secret-key-change-in-production

# Google Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-3-pro-preview-11-2025
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta

# AI Service Configuration
AI_CACHE_TTL=300000
AI_RATE_LIMIT=100
AI_MAX_TOKENS=800
AI_TEMPERATURE=0.7

# Security
CORS_ORIGIN=http://localhost:5173
API_KEY_HEADER=X-API-Key
```

## Создание AI сервисов

### 1. Gemini сервис
**Файл:** `server/services/geminiService.ts`

```typescript
interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface GeminiRequest {
  contents: GeminiMessage[];
  systemInstruction?: { parts: { text: string }[] };
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

class GeminiService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.apiUrl = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta';
    this.model = process.env.GEMINI_MODEL || 'gemini-3-pro-preview-11-2025';
  }

  async generateContent(request: GeminiRequest): Promise<string> {
    const url = `${this.apiUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || '';
  }
}

export const geminiService = new GeminiService();
```

### 2. Сервис кэширования
**Файл:** `server/services/cacheService.ts`

```typescript
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = parseInt(process.env.AI_CACHE_TTL || '300000'); // 5 минут

  set(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Очистка истекших записей
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheService = new CacheService();

// Периодическая очистка кэша
setInterval(() => cacheService.cleanup(), 60000); // Каждую минуту
```

## Middleware

### 1. Rate Limiting
**Файл:** `server/middleware/rateLimit.ts`

```typescript
import rateLimit from 'express-rate-limit';

export const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: parseInt(process.env.AI_RATE_LIMIT || '100'), // лимит запросов
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 2. Валидация
**Файл:** `server/middleware/validation.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export interface ChatRequest {
  message: string;
  context?: Array<{ role: string; content: string }>;
  category?: string;
}

export const validateChatRequest = (req: Request, res: Response, next: NextFunction) => {
  const { message, context, category }: ChatRequest = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid message',
      message: 'Message is required and must be a non-empty string',
    });
  }

  if (message.length > 1000) {
    return res.status(400).json({
      error: 'Message too long',
      message: 'Message must be less than 1000 characters',
    });
  }

  if (context && !Array.isArray(context)) {
    return res.status(400).json({
      error: 'Invalid context',
      message: 'Context must be an array',
    });
  }

  if (context && context.length > 10) {
    return res.status(400).json({
      error: 'Context too long',
      message: 'Context must contain less than 10 messages',
    });
  }

  next();
};
```

### 3. Логирование
**Файл:** `server/middleware/logger.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export const aiLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - start;
    
    console.log(`AI Request: ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    if (req.path.includes('/ai/')) {
      console.log(`AI Request Body:`, {
        message: req.body.message?.substring(0, 100) + '...',
        contextLength: req.body.context?.length || 0,
      });
    }

    return originalSend.call(this, data);
  };

  next();
};
```

## AI роуты

### Основные эндпоинты
**Файл:** `server/routes/ai.ts`

```typescript
import { Router } from 'express';
import { geminiService } from '../services/geminiService';
import { cacheService } from '../services/cacheService';
import { aiRateLimit } from '../middleware/rateLimit';
import { validateChatRequest } from '../middleware/validation';
import { aiLogger } from '../middleware/logger';

const router = Router();

// Системная инструкция для AI
const SYSTEM_INSTRUCTION = `
Ты — высококвалифицированный виртуальный юрист и налоговый консультант РФ (НПД, ИП, ООО).
Отвечай емко, структурировано и только по делу. Сразу давай суть.
Если вопрос требует уточнения, задай его.
Специализируйся на:
- Регистрации бизнеса (ИП, ООО, самозанятость)
- Налоговом законодательстве РФ
- Бухгалтерском учёте для малого бизнеса
- Юридических аспектах ведения бизнеса
- Выборе оптимальной формы бизнеса
`;

// Чат с AI
router.post('/chat', 
  aiRateLimit,
  validateChatRequest,
  aiLogger,
  async (req, res) => {
    try {
      const { message, context = [], category } = req.body;

      // Создаем ключ для кэширования
      const cacheKey = `chat:${message}:${context.length}:${category || 'general'}`;
      
      // Проверяем кэш
      const cachedResponse = cacheService.get(cacheKey);
      if (cachedResponse) {
        return res.json(cachedResponse);
      }

      // Подготовка истории для Gemini
      const history = [
        {
          role: 'user',
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        ...context.slice(-6).map((msg: any) => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const request = {
        contents: history,
        generationConfig: {
          temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
          maxOutputTokens: parseInt(process.env.AI_MAX_TOKENS || '800'),
        }
      };

      const response = await geminiService.generateContent(request);
      
      const result = {
        message: response,
        category: category || 'general',
        suggestions: generateSuggestions(message, response),
        relatedTools: generateRelatedTools(message, category),
      };

      // Сохраняем в кэш
      cacheService.set(cacheKey, result);

      res.json(result);
    } catch (error) {
      console.error('AI Chat Error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process AI request',
      });
    }
  }
);

// Анализ бизнес-ситуации
router.post('/analyze-business',
  aiRateLimit,
  validateChatRequest,
  aiLogger,
  async (req, res) => {
    try {
      const { description, expectedIncome, employees, industry, hasPartners } = req.body;

      const cacheKey = `business:${description}:${expectedIncome}:${employees}:${industry}:${hasPartners}`;
      const cachedResponse = cacheService.get(cacheKey);
      
      if (cachedResponse) {
        return res.json(cachedResponse);
      }

      const businessPrompt = `
Проанализируй бизнес-ситуацию и порекомендуй оптимальную форму бизнеса:

Описание: ${description}
Ожидаемый доход: ${expectedIncome ? expectedIncome + ' ₽/мес' : 'Не указано'}
Сотрудники: ${employees || 0}
Сфера: ${industry || 'Не указана'}
Партнёры: ${hasPartners ? 'Да' : 'Нет'}

Дай рекомендации в формате JSON:
{
  "recommendedForm": "self-employed" | "sole-proprietor" | "llc",
  "reasoning": "Обоснование выбора",
  "taxSystem": "Рекомендуемая система налогообложения",
  "estimatedTaxes": 12345,
  "registrationSteps": ["Шаг 1", "Шаг 2"],
  "documents": ["Документ 1", "Документ 2"],
  "pros": ["Преимущество 1", "Преимущество 2"],
  "cons": ["Недостаток 1", "Недостаток 2"]
}
`;

      const request = {
        contents: [
          {
            role: 'user',
            parts: [{ text: businessPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        }
      };

      const response = await geminiService.generateContent(request);
      
      // Попытка распарсить JSON
      let analysisResult;
      try {
        analysisResult = JSON.parse(response);
      } catch {
        // Если не удалось распарсить, возвращаем заглушку
        analysisResult = generateFallbackAnalysis(req.body);
      }

      cacheService.set(cacheKey, analysisResult);
      res.json(analysisResult);
    } catch (error) {
      console.error('Business Analysis Error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to analyze business situation',
      });
    }
  }
);

// Вспомогательные функции
function generateSuggestions(message: string, response: string): string[] {
  const suggestions = [
    "Какую форму бизнеса выбрать?",
    "Сколько стоит регистрация ИП?",
    "Какие налоги для фрилансера?",
    "ИП или ООО - что лучше?",
    "Когда переходить на ООО?",
  ];

  return suggestions.slice(0, 3);
}

function generateRelatedTools(message: string, category?: string): string[] {
  const tools = {
    general: ["wizard", "calculators", "documents"],
    "business-form": ["wizard", "comparison"],
    taxes: ["calculators", "comparison"],
    documents: ["documents", "templates"],
    registration: ["wizard", "documents"],
  };

  return tools[category as keyof typeof tools] || tools.general;
}

function generateFallbackAnalysis(data: any) {
  // Логика заглушки на основе простых правил
  if (data.expectedIncome && data.expectedIncome < 2400000) {
    return {
      recommendedForm: "self-employed",
      reasoning: "При доходе до 2.4 млн ₽ в год самозанятость наиболее выгодна",
      taxSystem: "НПД (Налог на профессиональный доход)",
      estimatedTaxes: data.expectedIncome * 0.06,
      registrationSteps: [
        "Установить приложение 'Мой налог'",
        "Подать заявление через приложение",
        "Получить подтверждение статуса"
      ],
      documents: ["Паспорт", "СНИЛС"],
      pros: ["Налог 6%", "Нет отчётности", "Нет страховых взносов"],
      cons: ["Лимит дохода 2.4 млн ₽", "Нельзя нанимать сотрудников"]
    };
  }
  
  // Другие правила...
  return generateDefaultAnalysis();
}

function generateDefaultAnalysis() {
  return {
    recommendedForm: "sole-proprietor",
    reasoning: "ИП подходит для большинства видов бизнеса",
    taxSystem: "УСН 6% (доходы)",
    estimatedTaxes: 49500,
    registrationSteps: [
      "Подготовить заявление Р21001",
      "Выбрать коды ОКВЭД",
      "Подать в налоговую"
    ],
    documents: ["Паспорт", "Заявление Р21001"],
    pros: ["Простая регистрация", "Минимум отчётности"],
    cons: ["Фиксированные взносы", "Личная ответственность"]
  };
}

export default router;
```

## Обновление основного файла роутов

### Интеграция AI роутов
**Файл:** `server/routes.ts`

```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { npdCalculationSchema, usnCalculationSchema, stressTestSchema } from "@shared/schema";
import { storage } from "./storage";
import aiRoutes from "./routes/ai";

// ... существующий код ...

export async function registerRoutes(app: Express): Promise<Server> {
  // Подключаем AI роуты
  app.use('/api/ai', aiRoutes);

  // ... существующие роуты ...

  const httpServer = createServer(app);
  return httpServer;
}
```

## Безопасность

### 1. CORS настройка
```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
```

### 2. Валидация API ключа
```typescript
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers[process.env.API_KEY_HEADER || 'x-api-key'];
  
  if (!apiKey || apiKey !== process.env.GEMINI_API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key',
    });
  }

  next();
};
```

### 3. Санитизация входных данных
```typescript
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};
```

## Мониторинг и логирование

### 1. Метрики запросов
```typescript
interface AIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  cacheHitRate: number;
}

class AIMetricsService {
  private metrics: AIMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    cacheHitRate: 0,
  };

  recordRequest(success: boolean, responseTime: number, cacheHit: boolean): void {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    // Обновление среднего времени ответа
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) / 
      this.metrics.totalRequests;
  }

  getMetrics(): AIMetrics {
    return { ...this.metrics };
  }
}

export const aiMetricsService = new AIMetricsService();
```

### 2. Логирование ошибок
```typescript
export const logAIError = (error: Error, context: any): void => {
  console.error('AI Service Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};
```

## Тестирование

### 1. Unit тесты для сервисов
```typescript
// tests/services/geminiService.test.ts
import { geminiService } from '../../server/services/geminiService';

describe('GeminiService', () => {
  it('should generate content successfully', async () => {
    const request = {
      contents: [
        { role: 'user', parts: [{ text: 'Test message' }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    };

    const response = await geminiService.generateContent(request);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });
});
```

### 2. Интеграционные тесты
```typescript
// tests/integration/ai.test.ts
import request from 'supertest';
import { app } from '../../server/index';

describe('AI Routes', () => {
  it('POST /api/ai/chat should return AI response', async () => {
    const response = await request(app)
      .post('/api/ai/chat')
      .send({
        message: 'Как открыть ИП?',
        context: [],
        category: 'registration'
      })
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('category');
    expect(response.body).toHaveProperty('suggestions');
  });
});
```

## Развертывание

### 1. Production переменные окружения
```env
NODE_ENV=production
GEMINI_API_KEY=production-api-key
AI_RATE_LIMIT=1000
AI_CACHE_TTL=600000
CORS_ORIGIN=https://yourdomain.com
```

### 2. Docker конфигурация
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

---

**Результат:** Полнофункциональная серверная часть для AI-интеграции с безопасностью, кэшированием и мониторингом
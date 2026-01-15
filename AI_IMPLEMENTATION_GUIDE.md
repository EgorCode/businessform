# Руководство по реализации AI-интеграции для BizStartMaster

## Обзор
Это полное руководство по интеграции Google Gemini API в проект BizStartMaster для замены mock-функций на реальный AI-функционал.

## 🚀 Быстрый старт

### 1. Подготовка окружения
```bash
# Перейти в директорию проекта
cd BizStartMaster

# Установить дополнительные зависимости
npm install express-rate-limit isomorphic-dompurify

# Обновить переменные окружения
cp .env.example .env
```

### 2. Настройка API ключа
Отредактируйте `.env` файл:
```env
# Google Gemini API Configuration
GEMINI_API_KEY=AIzaSyCej_Ur7rFCQt4MQpPZ5uu9_hIKIj90l2E
GEMINI_MODEL=gemini-3-pro-preview-11-2025
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta

# AI Service Configuration
AI_CACHE_TTL=300000
AI_RATE_LIMIT=100
AI_MAX_TOKENS=800
AI_TEMPERATURE=0.7
```

### 3. Запуск проекта
```bash
# Полный запуск с инициализацией БД
npm run start:full

# Или по шагам
npm run db:init
npm run dev
```

## 📁 Структура файлов для создания

### Серверная часть

#### 1. AI сервис
**Файл:** `server/services/geminiService.ts`
```typescript
interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
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

  async generateContent(request: any): Promise<string> {
    const url = `${this.apiUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || '';
  }
}

export const geminiService = new GeminiService();
```

#### 2. Сервис кэширования
**Файл:** `server/services/cacheService.ts`
```typescript
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = parseInt(process.env.AI_CACHE_TTL || '300000');

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
}

export const cacheService = new CacheService();
```

#### 3. AI роуты
**Файл:** `server/routes/ai.ts`
```typescript
import { Router } from 'express';
import { geminiService } from '../services/geminiService';
import { cacheService } from '../services/cacheService';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting
router.use(rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 100, // лимит запросов
}));

// Чат эндпоинт
router.post('/chat', async (req, res) => {
  try {
    const { message, context = [] } = req.body;
    
    const cacheKey = `chat:${message}:${context.length}`;
    const cachedResponse = cacheService.get(cacheKey);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    const history = [
      { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
      ...context.slice(-6).map((msg: any) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const request = {
      contents: history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    };

    const response = await geminiService.generateContent(request);
    
    const result = {
      message: response,
      category: 'general',
      suggestions: ['Какую форму бизнеса выбрать?', 'Сколько стоит регистрация ИП?'],
    };

    cacheService.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

export default router;
```

### Клиентская часть

#### 1. Адаптированный StaticTaxSearch
**Файл:** `client/src/components/StaticTaxSearch.tsx`
```typescript
import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { Search, ArrowRight, Sparkles, CornerDownLeft, Loader2, Trash2, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StaticTaxSearch = memo(({ className }: { className?: string }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, text: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: messages.slice(-6),
          category: 'general'
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.message }]);
    } catch (error) {
      console.error('Search error:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Ошибка сети. Попробуйте позже.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto p-4 font-sans relative z-10", className)}>
      {/* Фоновое свечение */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 blur-3xl -z-10 rounded-full",
        "transition-opacity duration-700",
        isFocused || messages.length > 0 ? "opacity-100" : "opacity-40"
      )} />

      {/* Основной контейнер */}
      <Card className={cn(
        "bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-3xl overflow-hidden",
        "transition-all duration-500 ease-in-out",
        messages.length > 0 ? "min-h-[400px]" : "min-h-[auto]"
      )}>
        <CardContent className="p-2">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            </div>
            
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={messages.length > 0 ? "Задайте уточняющий вопрос..." : "Задайте вопрос по налогам или праву..."}
              className="pl-12 pr-14 py-4 text-lg bg-muted/50 hover:bg-muted focus:bg-background border-2 border-transparent focus:border-primary/20 transition-all duration-300 shadow-inner"
            />

            <Button 
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200"
            >
              {messages.length > 0 ? <CornerDownLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>
        </CardContent>

        {/* Область сообщений */}
        {messages.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto px-6 py-4 border-t border-border">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-6 last:mb-0 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'model' ? (
                  <Card className="inline-block max-w-[95%] rounded-2xl rounded-tl-sm">
                    <CardContent className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ИИ помощник</span>
                      </div>
                      <div className="text-sm leading-relaxed prose prose-slate">
                        {msg.text}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="inline-block bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm shadow-md text-sm font-medium">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
});

StaticTaxSearch.displayName = "StaticTaxSearch";
export default StaticTaxSearch;
```

#### 2. Обновленный AI сервис
**Файл:** `client/src/services/aiService.ts`
```typescript
export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  category?: "general" | "business-form" | "taxes" | "documents" | "registration";
}

class AIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_AI_API_URL || '/api/ai';
  }

  async sendMessage(message: string, context?: AIMessage[]): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: context?.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          category: this.detectMessageCategory(message)
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(message);
    }
  }

  private detectMessageCategory(message: string): AIMessage["category"] {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("налог") || lowerMessage.includes("взнос")) {
      return "taxes";
    } else if (lowerMessage.includes("документ") || lowerMessage.includes("договор")) {
      return "documents";
    } else if (lowerMessage.includes("регистрац")) {
      return "registration";
    } else if (lowerMessage.includes("ип") || lowerMessage.includes("ооо")) {
      return "business-form";
    }
    return "general";
  }

  private getFallbackResponse(message: string): any {
    return {
      message: "Я ИИ-помощник по бизнесу. Расскажите о вашей ситуации!",
      category: "general",
      suggestions: ["Какую форму бизнеса выбрать?", "Сколько стоит регистрация ИП?"]
    };
  }
}

export const aiService = new AIService();
```

## 🔧 Интеграция в существующие компоненты

### 1. Обновление AIHome
**Файл:** `client/src/pages/AIHome.tsx`
```typescript
import StaticTaxSearch from "@/components/StaticTaxSearch";

export default function AIHome() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <AIHeroSection />
        
        {/* Интеграция нового компонента */}
        <section className="py-20 border-b">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">AI-помощник по налогам и праву</h2>
              <p className="text-lg text-muted-foreground">
                Задайте вопрос и получите мгновенный ответ от ИИ
              </p>
            </div>
            <StaticTaxSearch />
          </div>
        </section>

        <IdeaGenerator />
        <BloggerCaseStudy />
        <StressTestSimulator />
      </main>
      <Footer />
      <EnhancedAIAssistant />
    </div>
  );
}
```

### 2. Обновление EnhancedAIAssistant
**Файл:** `client/src/components/EnhancedAIAssistant.tsx`
```typescript
// Обновление handleSend функции
const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage: AIMessage = {
    id: Date.now().toString(),
    role: "user",
    content: input,
    timestamp: new Date(),
  };

  setMessages([...messages, userMessage]);
  setInput("");
  setIsThinking(true);

  try {
    const response = await aiService.sendMessage(input, messages);
    
    const aiMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.message,
      timestamp: new Date(),
      category: response.category
    };
    
    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.error('AI Error:', error);
  } finally {
    setIsThinking(false);
  }
};
```

## 🧪 Тестирование

### 1. Функциональное тестирование
```bash
# Запуск тестов
npm test

# Тестирование AI эндпоинтов
npm run test:ai

# Интеграционные тесты
npm run test:integration
```

### 2. Ручное тестирование
1. **Базовый чат:**
   - Откройте http://localhost:5000
   - Протестируйте StaticTaxSearch компонент
   - Проверьте ответы от AI

2. **Enhanced AI Assistant:**
   - Нажмите на кнопку AI-ассистента
   - Задайте вопрос о бизнесе
   - Проверьте категоризацию ответов

3. **Обработка ошибок:**
   - Отключите интернет
   - Проверьте fallback ответы
   - Проверьте сообщения об ошибках

### 3. Нагрузочное тестирование
```bash
# Установка утилит для тестирования
npm install -g artillery

# Запуск нагрузочного теста
artillery run load-test.yml
```

## 🚀 Развертывание

### 1. Production настройка
```env
NODE_ENV=production
GEMINI_API_KEY=your-production-api-key
AI_RATE_LIMIT=1000
AI_CACHE_TTL=600000
CORS_ORIGIN=https://yourdomain.com
```

### 2. Docker развертывание
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

### 3. Vercel развертывание
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/index.html"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

## 📊 Мониторинг

### 1. Метрики производительности
```typescript
// Добавление в server/routes/ai.ts
router.get('/metrics', (req, res) => {
  const metrics = aiMetricsService.getMetrics();
  res.json(metrics);
});
```

### 2. Логирование
```typescript
// Добавление логирования в AI сервис
console.log(`AI Request: ${message} - ${Date.now()}`);
```

### 3. Health check
```typescript
// Добавление health check эндпоинта
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    gemini: !!process.env.GEMINI_API_KEY 
  });
});
```

## 🔒 Безопасность

### 1. Защита API ключа
- Никогда не exposing API ключ на клиенте
- Используйте переменные окружения
- Валидируйте все входные данные

### 2. Rate limiting
```typescript
// Настройка rate limiting
const rateLimit = require('express-rate-limit');

app.use('/api/ai', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // лимит запросов
  message: 'Too many requests'
}));
```

### 3. CORS настройка
```typescript
// Безопасная CORS настройка
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

## 🐛 Устранение проблем

### Частые проблемы:

1. **API ключ не работает:**
   - Проверьте валидность ключа
   - Убедитесь что ключ имеет доступ к Gemini API
   - Проверьте переменные окружения

2. **Медленные ответы:**
   - Увеличьте кэширование
   - Оптимизируйте промпты
   - Проверьте сетевое соединение

3. **Ошибки валидации:**
   - Проверьте формат запросов
   - Убедитесь что все обязательные поля переданы
   - Проверьте типы данных

4. **Проблемы с UI:**
   - Проверьте адаптивность
   - Убедитесь что все CSS классы применяются
   - Проверьте консоль браузера на ошибки

## 📈 Оптимизация

### 1. Кэширование
- Кэшируйте частые запросы
- Используйте Redis для production
- Настраивайте TTL для разных типов запросов

### 2. Оптимизация промптов
- Используйте более короткие промпты
- Кэшируйте системные инструкции
- Оптимизируйте контекст

### 3. Производительность фронтенда
- Используйте React.memo для компонентов
- Оптимизируйте рендеринг
- Используйте lazy loading

---

## 🎯 Следующие шаги

После базовой интеграции:

1. **Расширение функционала:**
   - Анализ документов
   - Генерация шаблонов
   - Персонализация ответов

2. **Улучшение UX:**
   - Голосовой ввод
   - История диалогов
   - Избранные ответы

3. **Аналитика:**
   - Отслеживание использования
   - Анализ популярных вопросов
   - Метрики качества ответов

4. **Интеграции:**
   - Другие AI модели
   - Внешние сервисы
   - API расширения

---

**Готово к реализации!** 🚀

Все компоненты и сервисы спроектированы и готовы к интеграции. Следуйте пошаговым инструкциям и тестируйте каждый этап.
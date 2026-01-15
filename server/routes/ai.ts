import { Router, Request, Response, NextFunction } from 'express';
import { geminiService } from '../services/geminiService';
import { cacheService } from '../services/cacheService';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting для AI эндпоинтов
const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: parseInt(process.env.AI_RATE_LIMIT || '100'), // лимит запросов
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Системная инструкция для AI
const SYSTEM_INSTRUCTION = `
Ты — высококвалифицированный виртуальный помощник "БизнесФорма", специализирующийся на самозанятости и малом бизнесе в РФ.
Твоя главная цель — помочь пользователю стать самозанятым (НПД) или эффективно вести деятельность в этом статусе.

ПРАВИЛА ОТВЕТОВ:
1. Фокусируйся на самозанятости (НПД) как на самом простом и выгодном старте.
2. Если пользователь спрашивает про ИП или ООО, мягко напомни о преимуществах самозанятости (нет взносов, нет отчётности), если его доход < 2.4 млн и нет сотрудников.
3. Отвечай кратко, структурировано (списки, жирный шрифт).
4. Используй дружелюбный, но профессиональный тон.

ОСОБЕННОСТИ ПОДПИСОК:
- Если уровень подписки "lite": напоминай о важности формирования чеков и сроках уплаты налогов (до 28 числа).
- Если уровень подписки "max": предлагай глубокий анализ рисков, помощь в переходе на ИП при росте и советы по масштабированию.
- Если подписка не указана: кратко упоминай, что в Lite-версии доступны уведомления о налогах.

Если вопрос не касается бизнеса/налогов в РФ, вежливо перенаправь пользователя на тему предпринимательства.
`;

// Валидация запроса чата
const validateChatRequest = (req: Request, res: Response, next: NextFunction) => {
  const { message, context, category, subscriptionTier } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid message',
      message: 'Message is required and must be a non-empty string',
    });
  }

  if (message.length > 1500) {
    return res.status(400).json({
      error: 'Message too long',
      message: 'Message must be less than 1500 characters',
    });
  }

  if (context && !Array.isArray(context)) {
    return res.status(400).json({
      error: 'Invalid context',
      message: 'Context must be an array',
    });
  }

  next();
};

// Чат с AI
router.post('/chat',
  aiRateLimit,
  validateChatRequest,
  async (req, res) => {
    try {
      const { message, context = [], category, subscriptionTier = 'none' } = req.body;

      // Проверяем настроен ли Gemini API
      if (!geminiService.isConfigured()) {
        return res.json(getFallbackResponse(message, category));
      }

      // Создаем ключ для кэширования (включаем уровень подписки)
      const cacheKey = `chat:${message.substring(0, 50)}:${context.length}:${subscriptionTier}`;

      // Проверяем кэш
      const cachedResponse = cacheService.get(cacheKey);
      if (cachedResponse) {
        cacheService.recordRequest(true);
        return res.json(cachedResponse);
      }

      cacheService.recordRequest(false);

      // Подготовка контекста с учетом подписки
      let effectiveSystemPrompt = SYSTEM_INSTRUCTION;
      if (subscriptionTier === 'lite') {
        effectiveSystemPrompt += "\nКонтекст пользователя: Использует LITE-подписку. Делай акцент на базовой поддержке и налогах.";
      } else if (subscriptionTier === 'max') {
        effectiveSystemPrompt += "\nКонтекст пользователя: Использует MAX-подписку. Давай расширенные советы по росту и оптимизации.";
      }

      // Подготовка истории для Gemini
      const history = [
        {
          role: 'user' as const,
          parts: [{ text: effectiveSystemPrompt }]
        },
        ...context.slice(-6).map((msg: any) => ({
          role: (msg.role === 'model' || msg.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
          parts: [{ text: msg.content }]
        })),
        {
          role: 'user' as const,
          parts: [{ text: message }]
        }
      ];

      const request = {
        contents: history,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      };

      const response = await geminiService.generateContent(request);

      const result = {
        message: response,
        category: category || detectMessageCategory(message),
        suggestions: generateSuggestions(message, response),
        relatedTools: generateRelatedTools(message, category),
        subscriptionTier
      };

      // Сохраняем в кэш
      cacheService.set(cacheKey, result);

      res.json(result);
    } catch (error) {
      console.error('AI Chat Error:', error);

      // В случае ошибки API, возвращаем заглушку
      const { message, category } = req.body;
      res.json(getFallbackResponse(message, category));
    }
  }
);

// Анализ бизнес-ситуации
router.post('/analyze-business',
  aiRateLimit,
  validateChatRequest,
  async (req, res) => {
    try {
      const { description, expectedIncome, employees, industry, hasPartners } = req.body;

      // Проверяем настроен ли Gemini API
      if (!geminiService.isConfigured()) {
        return res.json(getFallbackBusinessAnalysis(req.body));
      }

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
            role: 'user' as const,
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
        analysisResult = getFallbackBusinessAnalysis(req.body);
      }

      cacheService.set(cacheKey, analysisResult);
      res.json(analysisResult);
    } catch (error) {
      console.error('Business Analysis Error:', error);
      res.json(getFallbackBusinessAnalysis(req.body));
    }
  }
);

// Health check для AI сервиса
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    gemini: {
      configured: geminiService.isConfigured(),
      apiKey: geminiService.getApiKey() ? 'configured' : 'not configured'
    },
    cache: cacheService.getStats()
  });
});

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

function getFallbackResponse(message: string, inputCategory?: string) {
  const category = detectMessageCategory(message);

  const responses = {
    general: {
      message: "Я ИИ-помощник по бизнесу. Я могу помочь выбрать форму бизнеса, рассчитать налоги и подготовить документы. Расскажите о вашей ситуации!",
      category: "general",
      suggestions: ["Какую форму бизнеса выбрать?", "Сколько стоит регистрация ИП?", "Какие налоги для фрилансера?"]
    },
    "business-form": {
      message: "Для выбора оптимальной формы бизнеса мне нужно знать: планируемый доход, количество сотрудников, сферу деятельности. Расскажите подробнее о вашем проекте?",
      category: "business-form",
      suggestions: ["ИП или ООО для фрилансера?", "Когда переходить с самозанятости на ИП?", "Самозанятость или ИП?"]
    },
    taxes: {
      message: "Я могу помочь рассчитать налоги для разных форм бизнеса. Укажите: форму (ИП, ООО, самозанятость), систему налогообложения и ожидаемый доход.",
      category: "taxes",
      suggestions: ["Налоги ИП на УСН 6%", "НПД для самозанятых", "Налоги ООО"]
    },
    documents: {
      message: "Для регистрации бизнеса потребуются: паспорт, заявление (Р21001 для ИП), устав (для ООО), коды ОКВЭД. Какие документы вас интересуют?",
      category: "documents",
      suggestions: ["Документы для ИП", "Договор с клиентом", "Устав ООО"]
    },
    registration: {
      message: "Регистрация бизнеса занимает 1-3 дня. Можно через Госуслуги (бесплатно) или налоговую/МФЦ (800₽). Какую форму регистрируем?",
      category: "registration",
      suggestions: ["Регистрация ИП онлайн", "Стоимость регистрации ООО", "Госуслуги для бизнеса"]
    }
  };

  return responses[category as keyof typeof responses] || responses.general;
}

function getFallbackBusinessAnalysis(data: any) {
  // Простая логика на основе дохода
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
  } else if (data.employees && data.employees > 0) {
    return {
      recommendedForm: "sole-proprietor",
      reasoning: "ИП позволяет нанимать сотрудников и имеет умеренные налоги",
      taxSystem: "УСН 6% (доходы)",
      estimatedTaxes: Math.max(49500, (data.expectedIncome || 0) * 0.06),
      registrationSteps: [
        "Подготовить заявление Р21001",
        "Выбрать коды ОКВЭД",
        "Подать в налоговую или через Госуслуги",
        "Получить свидетельство"
      ],
      documents: ["Паспорт", "Заявление Р21001", "Коды ОКВЭД"],
      pros: ["Можно нанимать сотрудников", "Простая отчётность", "Доход до 60 млн ₽"],
      cons: ["Фиксированные взносы 49.5 тыс ₽", "Личная ответственность"]
    };
  } else {
    return {
      recommendedForm: "sole-proprietor",
      reasoning: "ИП подходит для большинства видов бизнеса с доходом до 60 млн ₽",
      taxSystem: "УСН 6% (доходы)",
      estimatedTaxes: Math.max(49500, (data.expectedIncome || 0) * 0.06),
      registrationSteps: [
        "Подготовить заявление Р21001",
        "Выбрать коды ОКВЭД",
        "Подать в налоговую или через Госуслуги",
        "Получить свидетельство"
      ],
      documents: ["Паспорт", "Заявление Р21001", "Коды ОКВЭД"],
      pros: ["Простая регистрация", "Минимум отчётности", "Все виды деятельности"],
      cons: ["Фиксированные взносы", "Личная ответственность"]
    };
  }
}

function detectMessageCategory(message: string): 'general' | 'business-form' | 'taxes' | 'documents' | 'registration' {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("налог") || lowerMessage.includes("взнос") || lowerMessage.includes("усн")) {
    return "taxes";
  } else if (lowerMessage.includes("документ") || lowerMessage.includes("договор") || lowerMessage.includes("учёт")) {
    return "documents";
  } else if (lowerMessage.includes("регистрац") || lowerMessage.includes("открыть") || lowerMessage.includes("зарегистрировать")) {
    return "registration";
  } else if (lowerMessage.includes("ип") || lowerMessage.includes("ооо") || lowerMessage.includes("самозанят")) {
    return "business-form";
  }
  return "general";
}

export default router;
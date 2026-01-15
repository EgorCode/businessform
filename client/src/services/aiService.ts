// Сервис для работы с AI API
export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  category?: "general" | "business-form" | "taxes" | "documents" | "registration";
}

export interface AIResponse {
  message: string;
  category: AIMessage["category"];
  suggestions?: string[];
  relatedTools?: string[];
}

export interface BusinessAnalysisRequest {
  description: string;
  expectedIncome?: number;
  employees?: number;
  industry?: string;
  hasPartners?: boolean;
}

export interface BusinessAnalysisResponse {
  recommendedForm: "self-employed" | "sole-proprietor" | "llc";
  reasoning: string;
  taxSystem: string;
  estimatedTaxes: number;
  registrationSteps: string[];
  documents: string[];
  pros: string[];
  cons: string[];
}

export interface TaxCalculationRequest {
  businessForm: "self-employed" | "sole-proprietor" | "llc";
  taxSystem: string;
  income: number;
  expenses?: number;
  employees?: number;
}

export interface TaxCalculationResponse {
  totalTax: number;
  taxBreakdown: {
    incomeTax: number;
    socialContributions: number;
    otherTaxes: number;
  };
  effectiveRate: number;
  quarterlyPayments: number[];
}

class AIService {
  private baseUrl: string;

  constructor() {
    // В реальном приложении эти значения должны быть в .env файле
    this.baseUrl = import.meta.env.VITE_AI_API_URL || '/api/ai';
  }

  // Основной метод для отправки сообщения в AI чат
  async sendMessage(message: string, context?: AIMessage[], subscriptionTier: "none" | "lite" | "max" = "none"): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: context?.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          category: this.detectMessageCategory(message),
          subscriptionTier
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI Service Error:', error);
      // Возвращаем заглушку, если API недоступен
      return this.getFallbackResponse(message);
    }
  }

  // Анализ бизнес-ситуации для рекомендации формы
  async analyzeBusinessSituation(request: BusinessAnalysisRequest): Promise<BusinessAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze-business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Business analysis API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Business Analysis Error:', error);
      return this.getFallbackBusinessAnalysis(request);
    }
  }

  // Расчёт налогов
  async calculateTaxes(request: TaxCalculationRequest): Promise<TaxCalculationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/calculate-taxes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Tax calculation API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Tax Calculation Error:', error);
      return this.getFallbackTaxCalculation(request);
    }
  }

  // Анализ загруженных документов
  async analyzeDocument(file: File): Promise<{ summary: string; insights: string[] }> {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(`${this.baseUrl}/analyze-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Document analysis API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Document Analysis Error:', error);
      return {
        summary: "Не удалось проанализировать документ. Пожалуйста, попробуйте другой формат.",
        insights: ["Проверьте, что документ содержит текстовую информацию", "Убедитесь, что файл не поврежден"]
      };
    }
  }

  // Определение категории сообщения на основе ключевых слов
  private detectMessageCategory(message: string): AIMessage["category"] {
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

  // Заглушки для случаев, когда API недоступен
  private getFallbackResponse(message: string): AIResponse {
    const category = this.detectMessageCategory(message);

    const responses = {
      general: {
        message: "Я ИИ-помощник по бизнесу. Я могу помочь выбрать форму бизнеса, рассчитать налоги и подготовить документы. Расскажите о вашей ситуации!",
        category: "general" as const,
        suggestions: ["Какую форму бизнеса выбрать?", "Сколько стоит регистрация ИП?", "Какие налоги для фрилансера?"]
      },
      "business-form": {
        message: "Для выбора оптимальной формы бизнеса мне нужно знать: планируемый доход, количество сотрудников, сферу деятельности. Расскажите подробнее о вашем проекте?",
        category: "business-form" as const,
        suggestions: ["ИП или ООО для фрилансера?", "Когда переходить на ООО?", "Самозанятость или ИП?"]
      },
      taxes: {
        message: "Я могу помочь рассчитать налоги для разных форм бизнеса. Укажите: форму (ИП, ООО, самозанятость), систему налогообложения и ожидаемый доход.",
        category: "taxes" as const,
        suggestions: ["Налоги ИП на УСН 6%", "НПД для самозанятых", "Налоги ООО"]
      },
      documents: {
        message: "Для регистрации бизнеса потребуются: паспорт, заявление (Р21001 для ИП), устав (для ООО), коды ОКВЭД. Какие документы вас интересуют?",
        category: "documents" as const,
        suggestions: ["Документы для ИП", "Договор с клиентом", "Устав ООО"]
      },
      registration: {
        message: "Регистрация бизнеса занимает 1-3 дня. Можно через Госуслуги (бесплатно) или налоговую/МФЦ (800₽). Какую форму регистрируем?",
        category: "registration" as const,
        suggestions: ["Регистрация ИП онлайн", "Стоимость регистрации ООО", "Госуслуги для бизнеса"]
      }
    };

    return responses[category as keyof typeof responses] || responses.general;
  }

  private getFallbackBusinessAnalysis(request: BusinessAnalysisRequest): BusinessAnalysisResponse {
    // Простая логика на основе дохода
    if (request.expectedIncome && request.expectedIncome < 2400000) {
      return {
        recommendedForm: "self-employed",
        reasoning: "При доходе до 2.4 млн ₽ в год самозанятость наиболее выгодна",
        taxSystem: "НПД (Налог на профессиональный доход)",
        estimatedTaxes: request.expectedIncome * 0.06,
        registrationSteps: [
          "Установить приложение 'Мой налог'",
          "Подать заявление через приложение",
          "Получить подтверждение статуса"
        ],
        documents: ["Паспорт", "СНИЛС"],
        pros: ["Налог 6%", "Нет отчётности", "Нет страховых взносов"],
        cons: ["Лимит дохода 2.4 млн ₽", "Нельзя нанимать сотрудников"]
      };
    } else if (request.employees && request.employees > 0) {
      return {
        recommendedForm: "sole-proprietor",
        reasoning: "ИП позволяет нанимать сотрудников и имеет умеренные налоги",
        taxSystem: "УСН 6% (доходы)",
        estimatedTaxes: Math.max(49500, (request.expectedIncome || 0) * 0.06),
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
        estimatedTaxes: Math.max(49500, (request.expectedIncome || 0) * 0.06),
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

  private getFallbackTaxCalculation(request: TaxCalculationRequest): TaxCalculationResponse {
    const { businessForm, taxSystem, income, expenses = 0 } = request;

    let totalTax = 0;
    let incomeTax = 0;
    let socialContributions = 0;
    let otherTaxes = 0;

    if (businessForm === "self-employed") {
      incomeTax = income * 0.06;
      totalTax = incomeTax;
    } else if (businessForm === "sole-proprietor") {
      socialContributions = 49500; // Фиксированные взносы 2026
      if (taxSystem.includes("6%")) {
        incomeTax = income * 0.06;
      } else if (taxSystem.includes("15%")) {
        incomeTax = Math.max(0, (income - expenses) * 0.15);
      }
      totalTax = incomeTax + socialContributions;
    } else if (businessForm === "llc") {
      if (taxSystem.includes("6%")) {
        incomeTax = income * 0.06;
      } else if (taxSystem.includes("15%")) {
        incomeTax = Math.max(0, (income - expenses) * 0.15);
      }
      totalTax = incomeTax;
    }

    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
    const quarterlyPayments = totalTax > 0 ? [totalTax / 4, totalTax / 4, totalTax / 4, totalTax / 4] : [0, 0, 0, 0];

    return {
      totalTax,
      taxBreakdown: {
        incomeTax,
        socialContributions,
        otherTaxes
      },
      effectiveRate,
      quarterlyPayments
    };
  }
}

export const aiService = new AIService();
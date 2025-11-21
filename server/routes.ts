import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { npdCalculationSchema, usnCalculationSchema, stressTestSchema } from "@shared/schema";
import { storage } from "./storage";

// todo: remove mock functionality - replace with real AI API
const businessIdeas = [
  {
    id: 1,
    title: "Умный дом 'под ключ'",
    description: "Установка и настройка систем автоматизации для квартир. Спрос на комфорт и энергосбережение растет на 20% ежегодно.",
    category: "Услуги B2C",
    recommendedForms: [
      { form: "ИП", confidence: 95, reason: "Идеально для сервисного бизнеса" },
      { form: "ООО", confidence: 70, reason: "При расширении и найме" },
    ],
    trend: "📱 Автоматизация",
    averageRevenue: "200K—500K ₽/мес",
  },
  {
    id: 2,
    title: "Контент-агентство для TikTok/YouTube",
    description: "Создание контента и управление каналами для малых предприятий. Компании ищут экспертов в видеоформате.",
    category: "Услуги B2B",
    recommendedForms: [
      { form: "НПД", confidence: 85, reason: "На старте, до 2.4М/год" },
      { form: "ИП", confidence: 90, reason: "При росте клиентов и команды" },
    ],
    trend: "📹 Видеоконтент",
    averageRevenue: "150K—400K ₽/мес",
  },
  {
    id: 3,
    title: "Бухгалтерское сопровождение через облако",
    description: "Удалённое ведение бухгалтерии для ИП и ООО. Рынок требует доступных и быстрых решений.",
    category: "SaaS/B2B",
    recommendedForms: [
      { form: "ИП", confidence: 80, reason: "Начните с УСН 6%" },
      { form: "ООО", confidence: 85, reason: "Для корпоративных клиентов" },
    ],
    trend: "💼 Финтех",
    averageRevenue: "300K—1M ₽/мес",
  },
  {
    id: 4,
    title: "Онлайн-школа по персональному развитию",
    description: "Курсы по лидерству, переговорам, прокрастинации. Интерес к самосовершенствованию растёт экспоненциально.",
    category: "EdTech",
    recommendedForms: [
      { form: "НПД", confidence: 80, reason: "На первых курсах" },
      { form: "ИП", confidence: 90, reason: "При масштабировании" },
    ],
    trend: "📚 Образование",
    averageRevenue: "100K—500K ₽/мес",
  },
  {
    id: 5,
    title: "Доставка eco-товаров на дом",
    description: "Экологичные продукты, косметика, быт.товары с доставкой в день заказа. Тренд на осознанное потребление.",
    category: "E-commerce",
    recommendedForms: [
      { form: "ИП", confidence: 85, reason: "Товарный бизнес требует ИП" },
      { form: "ООО", confidence: 80, reason: "При расширении и логистике" },
    ],
    trend: "♻️ Эко-бизнес",
    averageRevenue: "250K—1M ₽/мес",
  },
  {
    id: 6,
    title: "Фриланс-платформа для дизайнеров",
    description: "Маркетплейс для взаимодействия дизайнеров и клиентов с комиссией. Конкуренция растёт, но спрос выше.",
    category: "Маркетплейс",
    recommendedForms: [
      { form: "ИП", confidence: 75, reason: "Начните с простой структуры" },
      { form: "ООО", confidence: 90, reason: "При наличии инвесторов" },
    ],
    trend: "🎨 Креатив",
    averageRevenue: "400K—2M ₽/мес",
  },
  {
    id: 7,
    title: "Консультации по экспорту для новичков",
    description: "Помощь малым предприятиям в выходе на международные рынки. Спрос от импортозамещения растёт.",
    category: "B2B Консалтинг",
    recommendedForms: [
      { form: "НПД", confidence: 70, reason: "Для начинающих консультантов" },
      { form: "ИП", confidence: 95, reason: "Оптимально для консалтинга" },
    ],
    trend: "🌍 Интернационал",
    averageRevenue: "200K—800K ₽/мес",
  },
  {
    id: 8,
    title: "AI-помощник для тестирования ПО",
    description: "Автоматизированное тестирование с помощью ИИ для IT-компаний. Экономит время разработки на 40%.",
    category: "SaaS B2B",
    recommendedForms: [
      { form: "ИП", confidence: 80, reason: "Если вы разработчик-фрилансер" },
      { form: "ООО", confidence: 95, reason: "Для корпоративных продаж" },
    ],
    trend: "🤖 AI/ML",
    averageRevenue: "500K—3M ₽/мес",
  },
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Calculate НПД tax
  app.post("/api/calculate/npd", (req, res) => {
    try {
      const data = npdCalculationSchema.parse(req.body);
      const monthlyIncome = data.monthlyIncome;
      const npdTax = monthlyIncome * 0.04; // 4% for individuals, 6% for legal entities
      const annualIncome = monthlyIncome * 12;
      const annualTax = npdTax * 12;

      res.json({
        monthlyIncome,
        annualIncome,
        monthlyTax: npdTax,
        annualTax,
        rate: 0.04,
        netMonthlyIncome: monthlyIncome - npdTax,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Calculate УСН tax (both 6% and 15%)
  app.post("/api/calculate/usn", (req, res) => {
    try {
      const data = usnCalculationSchema.parse(req.body);
      const { yearlyIncome, yearlyExpenses } = data;

      const tax6 = yearlyIncome * 0.06;
      const tax15 = Math.max((yearlyIncome - yearlyExpenses) * 0.15, 0);

      res.json({
        yearlyIncome,
        yearlyExpenses,
        usn6: {
          monthlyTax: tax6 / 12,
          yearlyTax: tax6,
          rate: 0.06,
          netYearlyIncome: yearlyIncome - tax6,
        },
        usn15: {
          monthlyTax: tax15 / 12,
          yearlyTax: tax15,
          rate: 0.15,
          netYearlyIncome: yearlyIncome - yearlyExpenses - tax15,
        },
        optimal: tax6 < tax15 ? "УСН 6%" : "УСН 15%",
        savings: Math.abs(tax6 - tax15),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Stress test simulator - recommend legal form based on parameters
  app.post("/api/simulate", (req, res) => {
    try {
      const data = stressTestSchema.parse(req.body);
      const { monthlyRevenue, monthlyExpenses, employees, partners } = data;
      const annualRevenue = monthlyRevenue * 12;

      // Logic for recommendations
      let recommendation: { form: string; confidence: number; reasons: string[] } =
        { form: "НПД", confidence: 0, reasons: [] };

      // НПД check
      if (
        annualRevenue <= 2400000 &&
        employees === 0 &&
        partners === 1
      ) {
        recommendation = {
          form: "НПД",
          confidence: 95,
          reasons: [
            "Доход в пределах лимита 2.4М ₽/год",
            "Работаете без сотрудников",
            "Минимум отчётности",
            "Самая низкая налоговая ставка (4-6%)",
          ],
        };
        res.json({ recommendation });
        return;
      }

      // ИП check
      if (annualRevenue <= 60000000 && partners === 1) {
        const tax6 = monthlyRevenue * 0.06;
        const tax15 = Math.max((monthlyRevenue - monthlyExpenses) * 0.15, 0);
        const optimalRate = tax6 < tax15 ? "УСН 6%" : "УСН 15%";

        recommendation = {
          form: `ИП ${optimalRate}`,
          confidence: 90,
          reasons: [
            `Оптимальная ставка: ${optimalRate}`,
            employees > 0 ? `Можете нанять до 130 сотрудников` : "Возможность найма сотрудников",
            "Простая регистрация и отчётность",
          ],
        };
        res.json({ recommendation });
        return;
      }

      // ООО (default for large/complex)
      const tax6 = monthlyRevenue * 0.06;
      const tax15 = Math.max((monthlyRevenue - monthlyExpenses) * 0.15, 0);
      const optimalRate = tax6 < tax15 ? "УСН 6%" : "УСН 15%";

      recommendation = {
        form: `ООО ${optimalRate}`,
        confidence: 85,
        reasons: [
          `Рекомендуем ${optimalRate}`,
          "Защита личных активов от бизнес-рисков",
          partners > 1 ? `${partners} учредителей — ООО упрощает управление` : "",
          annualRevenue > 60000000 ? "Доход превышает лимиты УСН для ИП" : "",
        ].filter(Boolean),
      };

      res.json({ recommendation });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get random business idea
  app.get("/api/ideas/random", (_req, res) => {
    const randomIndex = Math.floor(Math.random() * businessIdeas.length);
    res.json(businessIdeas[randomIndex]);
  });

  // Get all ideas
  app.get("/api/ideas", (_req, res) => {
    res.json(businessIdeas);
  });

  const httpServer = createServer(app);

  return httpServer;
}

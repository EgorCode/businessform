import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { npdCalculationSchema, usnCalculationSchema, stressTestSchema, newsQuerySchema, insertNewsSchema, insertNewsCategorySchema } from "@shared/schema";
import { storage } from "./storage";
import { db } from "./db";
import { eq, desc, and, like, or } from "drizzle-orm";
import { news, newsCategories } from "@shared/schema";
import aiRoutes from "./routes/ai";
import adminRoutes from "./routes/admin";
import telegramRoutes from "./routes/telegram";
import { authService } from "./services/authService";

// In-memory visitor tracking
const activeVisitors = new Map<string, number>();
const VISITOR_TIMEOUT = 60000; // 1 minute

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
  // Новые бизнес-идеи для 2025 года
  {
    id: 9,
    title: "Разработка чат-ботов для бизнеса на базе AI",
    description: "Создание интеллектуальных ассистентов для клиентской поддержки и автоматизации бизнес-процессов. Спрос на AI-решения растет на 50% в год.",
    category: "IT/AI",
    recommendedForms: [
      { form: "ИП", confidence: 90, reason: "Идеально для IT-специалистов" },
      { form: "ООО", confidence: 85, reason: "При работе с корпоративными клиентами" },
    ],
    trend: "🤖 AI-автоматизация",
    averageRevenue: "300K—1.5M ₽/мес",
  },
  {
    id: 10,
    title: "Кибербезопасность для малого бизнеса",
    description: "Аудит и защита IT-инфраструктуры компаний от киберугроз. Рост инцидентов на 40% увеличивает спрос на защиту.",
    category: "IT/Безопасность",
    recommendedForms: [
      { form: "ИП", confidence: 95, reason: "Персональные услуги консалтинга" },
      { form: "ООО", confidence: 80, reason: "Для комплексных проектов" },
    ],
    trend: "🔒 Защита данных",
    averageRevenue: "200K—800K ₽/мес",
  },
  {
    id: 11,
    title: "Платформа для удаленной работы с российскими аналогами",
    description: "Рабочее пространство с видеоконференциями, документами и задачами на российских серверах. Тренд на импортозамещение ПО.",
    category: "SaaS/B2B",
    recommendedForms: [
      { form: "ИП", confidence: 75, reason: "Для MVP и первых клиентов" },
      { form: "ООО", confidence: 95, reason: "Для масштабирования и инвестиций" },
    ],
    trend: "💻 Удаленка",
    averageRevenue: "500K—3M ₽/мес",
  },
  {
    id: 12,
    title: "Производство комплектующих для электроники",
    description: "Локализация производства импортных аналогов электронных компонентов. Господдержка и высокий спрос от производителей.",
    category: "Производство",
    recommendedForms: [
      { form: "ИП", confidence: 60, reason: "Для небольшого производства" },
      { form: "ООО", confidence: 95, reason: "Для промышленных масштабов" },
    ],
    trend: "🏭 Импортозамещение",
    averageRevenue: "1M—5M ₽/мес",
  },
  {
    id: 13,
    title: "3D-печать промышленных деталей на заказ",
    description: "Быстрое прототипирование и мелкосерийное производство деталей для промышленности. Сокращает издержки на 60%.",
    category: "Производство/Услуги",
    recommendedForms: [
      { form: "ИП", confidence: 85, reason: "Для услуг и небольших заказов" },
      { form: "ООО", confidence: 80, reason: "При расширении производства" },
    ],
    trend: "🖨️ Аддитивные технологии",
    averageRevenue: "400K—2M ₽/мес",
  },
  {
    id: 14,
    title: "Фабрика по переработке пластика в стройматериалы",
    description: "Экологичное производство стройматериалов из переработанного пластика. Льготы и господдержка экологических проектов.",
    category: "Экология/Производство",
    recommendedForms: [
      { form: "ИП", confidence: 70, reason: "Для небольшого производства" },
      { form: "ООО", confidence: 95, reason: "Для промышленных масштабов и субсидий" },
    ],
    trend: "♻️ Циркулярная экономика",
    averageRevenue: "800K—4M ₽/мес",
  },
  {
    id: 15,
    title: "Онлайн-платформа для изучения языков с AI-преподавателем",
    description: "Персонализированное обучение иностранным языкам с помощью искусственного интеллекта. Рост спроса на онлайн-образование.",
    category: "EdTech/AI",
    recommendedForms: [
      { form: "ИП", confidence: 80, reason: "Для запуска платформы" },
      { form: "ООО", confidence: 85, reason: "При масштабировании и привлечении инвестиций" },
    ],
    trend: "📚 AI-образование",
    averageRevenue: "200K—1M ₽/мес",
  },
  {
    id: 16,
    title: "Мобильный сервис по ремонту бытовой техники",
    description: "Выездные мастера с запчастями для ремонта бытовой техники на дому. Удобство и экономия времени для клиентов.",
    category: "Услуги B2C",
    recommendedForms: [
      { form: "ИП", confidence: 95, reason: "Идеально для сервисного бизнеса" },
      { form: "ООО", confidence: 70, reason: "При расширении и найме мастеров" },
    ],
    trend: "📱 Мобильные сервисы",
    averageRevenue: "150K—600K ₽/мес",
  },
  {
    id: 17,
    title: "Консультации по субсидиям и господдержке бизнеса",
    description: "Помощь в получении льгот, грантов и субсидий для бизнеса. Рост господдержки увеличивает спрос на экспертизу.",
    category: "B2B Консалтинг",
    recommendedForms: [
      { form: "НПД", confidence: 75, reason: "Для начинающих консультантов" },
      { form: "ИП", confidence: 90, reason: "Оптимально для консалтинговых услуг" },
    ],
    trend: "💰 Господдержка",
    averageRevenue: "250K—1M ₽/мес",
  },
  {
    id: 18,
    title: "Маркетплейс российских фермерских продуктов",
    description: "Прямые поставки фермерских продуктов от производителей к потребителям. Тренд на локальные и натуральные продукты.",
    category: "E-commerce/Агро",
    recommendedForms: [
      { form: "ИП", confidence: 80, reason: "Для старта платформы" },
      { form: "ООО", confidence: 90, reason: "При масштабировании и работе с сетями" },
    ],
    trend: "🥬 Локальные продукты",
    averageRevenue: "400K—2M ₽/мес",
  },
  {
    id: 19,
    title: "Сервис подписки на российские косметические бренды",
    description: "Ежемесячная коробка с товарами российских косметических брендов. Рост патриотизма и интереса к локальным производителям.",
    category: "E-commerce/Красота",
    recommendedForms: [
      { form: "ИП", confidence: 85, reason: "Для старта подписочного сервиса" },
      { form: "ООО", confidence: 80, reason: "При расширении ассортимента" },
    ],
    trend: "💄 Подписочные модели",
    averageRevenue: "300K—1.5M ₽/мес",
  },
  {
    id: 20,
    title: "Платформа для организации мероприятий и корпоративов",
    description: "Комплексные решения для организации мероприятий: подбор площадок, кейтеринг, программа. Рост спроса на живые события.",
    category: "Event-сервисы",
    recommendedForms: [
      { form: "ИП", confidence: 75, reason: "Для организации небольших мероприятий" },
      { form: "ООО", confidence: 90, reason: "Для крупных корпоративных клиентов" },
    ],
    trend: "🎉 Event-технологии",
    averageRevenue: "500K—2.5M ₽/мес",
  },
  {
    id: 21,
    title: "Мобильное приложение для домашней диагностики здоровья",
    description: "Интеграция с умными гаджетами для мониторинга здоровья и рекомендаций. Рост интереса к превентивной медицине.",
    category: "HealthTech",
    recommendedForms: [
      { form: "ИП", confidence: 70, reason: "Для разработки MVP" },
      { form: "ООО", confidence: 95, reason: "Для работы с медицинскими данными" },
    ],
    trend: "🏥 Телемедицина",
    averageRevenue: "600K—3M ₽/мес",
  },
  {
    id: 22,
    title: "Онлайн-платформа ментального здоровья с российскими специалистами",
    description: "Психологическая поддержка и консультации онлайн. Рост осознанности и спроса на ментальное здоровье.",
    category: "HealthTech/EdTech",
    recommendedForms: [
      { form: "ИП", confidence: 85, reason: "Для платформы с психологами" },
      { form: "ООО", confidence: 80, reason: "При расширении и привлечении инвестиций" },
    ],
    trend: "🧠 Психологическая поддержка",
    averageRevenue: "200K—1M ₽/мес",
  },
  {
    id: 23,
    title: "Фитнес-студия с VR-тренажерами",
    description: "Инновационные тренировки с использованием виртуальной реальности. Новое поколение фитнеса с технологиями.",
    category: "Фитнес/Технологии",
    recommendedForms: [
      { form: "ИП", confidence: 90, reason: "Для небольшой студии" },
      { form: "ООО", confidence: 75, reason: "При расширении сети" },
    ],
    trend: "🥽 VR/AR фитнес",
    averageRevenue: "300K—1.2M ₽/мес",
  },
  {
    id: 24,
    title: "Сервис по переоборудованию авто на газ",
    description: "Установка ГБО и переоборудование автомобилей для экономии на топливе. Высокая стоимость бензина увеличивает спрос.",
    category: "Автоуслуги",
    recommendedForms: [
      { form: "ИП", confidence: 95, reason: "Идеально для автосервиса" },
      { form: "ООО", confidence: 80, reason: "При расширении и открытии филиалов" },
    ],
    trend: "⛽ Альтернативное топливо",
    averageRevenue: "400K—1.5M ₽/мес",
  },
  {
    id: 25,
    title: "Платформа каршеринга электромобилей",
    description: "Аренда электромобилей по минутам в городе. Экологичный транспорт и развитие зарядной инфраструктуры.",
    category: "Транспорт/Технологии",
    recommendedForms: [
      { form: "ИП", confidence: 60, reason: "Для небольшого парка" },
      { form: "ООО", confidence: 95, reason: "Для крупного парка и инвестиций" },
    ],
    trend: "🚗 Электромобили",
    averageRevenue: "800K—4M ₽/мес",
  },
  {
    id: 26,
    title: "Станция техобслуживания с записью через приложение",
    description: "Современный автосервис с онлайн-записью, отслеживанием ремонта и прозрачным ценообразованием.",
    category: "Автоуслуги/IT",
    recommendedForms: [
      { form: "ИП", confidence: 85, reason: "Для небольшого сервиса" },
      { form: "ООО", confidence: 85, reason: "Для сети автосервисов" },
    ],
    trend: "📲 Цифровизация услуг",
    averageRevenue: "500K—2M ₽/мес",
  },
  {
    id: 27,
    title: "Сервис дизайна интерьеров с AR-визуализацией",
    description: "Виртуальная расстановка мебели и декора в реальном пространстве через дополненную реальность.",
    category: "Дизайн/Технологии",
    recommendedForms: [
      { form: "ИП", confidence: 90, reason: "Для дизайн-услуг" },
      { form: "ООО", confidence: 75, reason: "При создании платформы" },
    ],
    trend: "🏠 AR/VR в недвижимости",
    averageRevenue: "300K—1.5M ₽/мес",
  },
  {
    id: 28,
    title: "Строительство модульных домов под ключ",
    description: "Быстрое возведение загородной недвижимости из готовых модулей. Сокращение сроков строительства на 70%.",
    category: "Строительство",
    recommendedForms: [
      { form: "ИП", confidence: 65, reason: "Для небольших проектов" },
      { form: "ООО", confidence: 95, reason: "Для масштабного строительства" },
    ],
    trend: "🏡 Модульное строительство",
    averageRevenue: "1M—6M ₽/мес",
  },
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Подключаем AI роуты
  app.use('/api/ai', aiRoutes);

  // Подключаем Admin роуты
  app.use('/api/admin', adminRoutes);

  // Подключаем Telegram роуты
  app.use('/api/telegram', telegramRoutes);

  // Инициализируем администратора по умолчанию
  await authService.initializeDefaultAdmin();

  // Visitor Tracking Routes
  app.post("/api/visitor-ping", (req, res) => {
    const visitorId = req.ip + (req.get('user-agent') || '');
    activeVisitors.set(visitorId, Date.now());

    // Clean up stale visitors
    const now = Date.now();
    activeVisitors.forEach((lastSeen, id) => {
      if (now - lastSeen > VISITOR_TIMEOUT) {
        activeVisitors.delete(id);
      }
    });

    res.json({ count: activeVisitors.size });
  });

  app.get("/api/visitor-count", (req, res) => {
    const now = Date.now();
    activeVisitors.forEach((lastSeen, id) => {
      if (now - lastSeen > VISITOR_TIMEOUT) {
        activeVisitors.delete(id);
      }
    });
    res.json({ count: activeVisitors.size });
  });
  // Calculate НПД tax
  app.post("/api/calculate/npd", (req, res) => {
    try {
      const data = npdCalculationSchema.parse(req.body);
      const monthlyIncome = data.monthlyIncome;
      const annualIncome = monthlyIncome * 12;

      // Check if income exceeds NPD limit (2.4M per year)
      const npdLimit = 2400000; // 2.4 million rubles per year
      const monthlyLimit = npdLimit / 12; // 200K per month

      let npdTax;
      let rate;
      let warning = null;

      if (annualIncome > npdLimit) {
        npdTax = 0;
        rate = 0;
        warning = `Доход превышает лимит НПД (${npdLimit.toLocaleString('ru-RU')} ₽ в год). Рассмотрите переход на УСН или ИП.`;
      } else {
        npdTax = monthlyIncome * 0.04; // 4% for individuals, 6% for legal entities
        rate = 0.04;
      }

      const annualTax = npdTax * 12;

      res.json({
        monthlyIncome,
        annualIncome,
        monthlyTax: npdTax,
        annualTax,
        rate,
        netMonthlyIncome: monthlyIncome - npdTax,
        warning,
        limit: {
          annual: npdLimit,
          monthly: monthlyLimit
        },
        info: {
          simplifiedTransition: "С 1 июля 2025 упрощена процедура перехода ИП с УСН на НПД через мобильное приложение «Мой налог»"
        }
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

      // Calculate VAT for USN with income > 60M (2025 changes)
      const vatThreshold = 60000000; // 60 million rubles
      const hasVatObligation = yearlyIncome > vatThreshold;
      let vat5 = 0;
      let vat7 = 0;

      if (hasVatObligation) {
        // Simplified VAT calculation (5% for certain operations, 7% for others)
        vat5 = yearlyIncome * 0.05;
        vat7 = yearlyIncome * 0.07;
      }

      // Check USN limits (increased in 2025)
      const usnIncomeLimit = 300000000; // 300M per year (increased from 150M)
      const usnEmployeeLimit = 130; // 130 employees (increased from 100)

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
        vat: hasVatObligation ? {
          threshold: vatThreshold,
          applicable: true,
          rate5: vat5 / 12,
          rate7: vat7 / 12,
          yearlyVat5: vat5,
          yearlyVat7: vat7,
          info: "С 2025 года введена обязанность уплаты НДС для УСН с годовым доходом свыше 60 млн рублей по пониженным ставкам (5% и 7%)"
        } : {
          threshold: vatThreshold,
          applicable: false,
          info: "НДС не применяется при доходе до 60 млн рублей"
        },
        limits: {
          income: usnIncomeLimit,
          employees: usnEmployeeLimit,
          info: "С 2025 года увеличены лимиты по доходам (до 300 млн ₽) и численности сотрудников (до 130 человек) для применения УСН"
        },
        warnings: yearlyIncome > usnIncomeLimit ? [
          `Доход превышает лимит УСН (${usnIncomeLimit.toLocaleString('ru-RU')} ₽ в год)`
        ] : []
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

  // News API endpoints

  // Get news categories
  app.get("/api/news/categories", async (_req, res) => {
    try {
      const categories = await db.select().from(newsCategories);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching news categories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get news with pagination and filtering
  app.get("/api/news", async (req, res) => {
    try {
      const query = newsQuerySchema.parse(req.query);
      const { page, limit, category, businessForm, search } = query;
      const offset = (page - 1) * limit;

      let whereConditions = [eq(news.isActive, true)];

      if (category) {
        whereConditions.push(eq(news.categoryId, parseInt(category)));
      }

      if (businessForm) {
        whereConditions.push(like(news.businessForms, `%${businessForm}%`));
      }

      if (search) {
        whereConditions.push(
          or(
            like(news.title, `%${search}%`),
            like(news.summary, `%${search}%`),
            like(news.content, `%${search}%`)
          )!
        );
      }

      const newsList = await db
        .select({
          id: news.id,
          title: news.title,
          summary: news.summary,
          imageUrl: news.imageUrl,
          publishedAt: news.publishedAt,
          categoryId: news.categoryId,
          tags: news.tags,
          businessForms: news.businessForms,
          priority: news.priority,
          categoryName: newsCategories.name,
          categorySlug: newsCategories.slug
        })
        .from(news)
        .leftJoin(newsCategories, eq(news.categoryId, newsCategories.id))
        .where(and(...whereConditions))
        .orderBy(desc(news.priority), desc(news.publishedAt))
        .limit(limit)
        .offset(offset);

      // Parse JSON fields
      const parsedNews = newsList.map(item => ({
        ...item,
        tags: item.tags ? JSON.parse(item.tags) : [],
        businessForms: item.businessForms ? JSON.parse(item.businessForms) : []
      }));

      // Get total count for pagination
      const totalCountResult = await db
        .select({ count: news.id })
        .from(news)
        .where(and(...whereConditions));

      const totalCount = totalCountResult.length;
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        news: parsedNews,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error fetching news:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get featured news for homepage
  app.get("/api/news/featured", async (req, res) => {
    try {
      const limitParam = req.query.limit;
      const limit = limitParam ? parseInt(limitParam as string) : 3;

      const featuredNews = await db
        .select({
          id: news.id,
          title: news.title,
          summary: news.summary,
          imageUrl: news.imageUrl,
          publishedAt: news.publishedAt,
          categoryId: news.categoryId,
          tags: news.tags,
          businessForms: news.businessForms,
          categoryName: newsCategories.name,
          categorySlug: newsCategories.slug
        })
        .from(news)
        .leftJoin(newsCategories, eq(news.categoryId, newsCategories.id))
        .where(eq(news.isActive, true))
        .orderBy(desc(news.priority), desc(news.publishedAt))
        .limit(limit);

      // Parse JSON fields
      const parsedNews = featuredNews.map(item => ({
        ...item,
        tags: item.tags ? JSON.parse(item.tags) : [],
        businessForms: item.businessForms ? JSON.parse(item.businessForms) : []
      }));

      res.json(parsedNews);
    } catch (error) {
      console.error("Error fetching featured news:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get single news item by ID
  app.get("/api/news/:id", async (req, res) => {
    try {
      const newsId = parseInt(req.params.id);

      if (isNaN(newsId)) {
        return res.status(400).json({ error: "Invalid news ID" });
      }

      const newsItem = await db
        .select({
          id: news.id,
          title: news.title,
          content: news.content,
          summary: news.summary,
          imageUrl: news.imageUrl,
          publishedAt: news.publishedAt,
          categoryId: news.categoryId,
          tags: news.tags,
          businessForms: news.businessForms,
          categoryName: newsCategories.name,
          categorySlug: newsCategories.slug
        })
        .from(news)
        .leftJoin(newsCategories, eq(news.categoryId, newsCategories.id))
        .where(and(eq(news.id, newsId), eq(news.isActive, true)))
        .limit(1);

      if (newsItem.length === 0) {
        return res.status(404).json({ error: "News not found" });
      }

      // Parse JSON fields
      const parsedNews = {
        ...newsItem[0],
        tags: newsItem[0].tags ? JSON.parse(newsItem[0].tags) : [],
        businessForms: newsItem[0].businessForms ? JSON.parse(newsItem[0].businessForms) : []
      };

      res.json(parsedNews);
    } catch (error) {
      console.error("Error fetching news item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create news item (admin only)
  app.post("/api/news", async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);

      const result = await db.insert(news).values(newsData).returning();

      res.status(201).json(result[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating news:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Update news item (admin only)
  app.put("/api/news/:id", async (req, res) => {
    try {
      const newsId = parseInt(req.params.id);

      if (isNaN(newsId)) {
        return res.status(400).json({ error: "Invalid news ID" });
      }

      const newsData = insertNewsSchema.parse(req.body);

      const result = await db
        .update(news)
        .set(newsData)
        .where(eq(news.id, newsId))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({ error: "News not found" });
      }

      res.json(result[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error updating news:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Delete news item (admin only)
  app.delete("/api/news/:id", async (req, res) => {
    try {
      const newsId = parseInt(req.params.id);

      if (isNaN(newsId)) {
        return res.status(400).json({ error: "Invalid news ID" });
      }

      const result = await db
        .delete(news)
        .where(eq(news.id, newsId))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({ error: "News not found" });
      }

      res.json({ message: "News deleted successfully" });
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

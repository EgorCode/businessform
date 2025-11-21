import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, RefreshCw, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// todo: remove mock functionality
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

export default function IdeaGenerator() {
  const [currentIdea, setCurrentIdea] = useState(businessIdeas[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load initial idea from API
    const loadInitialIdea = async () => {
      try {
        const response = await fetch('/api/ideas/random');
        const data = await response.json();
        setCurrentIdea(data);
      } catch (error) {
        console.error('Error loading initial idea:', error);
      }
    };
    loadInitialIdea();
  }, []);

  const generateIdea = async () => {
    setIsGenerating(true);
    console.log('Generating business idea...');
    
    try {
      const response = await fetch('/api/ideas/random');
      const data = await response.json();
      setCurrentIdea(data);
      console.log('Idea generated:', data);
    } catch (error) {
      console.error('Error generating idea:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFormBadgeColor = (form: string) => {
    if (form === "НПД") return "bg-green-500/20 text-green-700 border-green-500/30";
    if (form === "ИП") return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    return "bg-purple-500/20 text-purple-700 border-purple-500/30";
  };

  return (
    <section id="ideas" className="border-b py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4" data-testid="text-ideas-title">
                Ищете нишу в 2025?
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-ideas-subtitle">
                Рынок меняется. В 2025 году в тренде автоматизация, локальное производство и услуги для комфорта. Нажмите кнопку, чтобы получить случайную бизнес-идею, актуальную для России.
              </p>
            </div>

            <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="gap-1">
                    <span className="text-xs font-bold text-primary">Идея #{currentIdea.id}</span>
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {currentIdea.trend}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{currentIdea.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {currentIdea.description}
                </p>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Рекомендуемые формы бизнеса
                  </div>
                  <div className="space-y-2">
                    {currentIdea.recommendedForms.map((rec, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg border-2 p-3 ${getFormBadgeColor(rec.form)} transition-all hover-elevate`}
                        data-testid={`card-form-recommendation-${rec.form}`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-semibold text-sm">{rec.form}</span>
                          <span className="text-xs font-medium">{rec.confidence}%</span>
                        </div>
                        <p className="text-xs leading-relaxed">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Средний доход/месяц
                  </div>
                  <div className="text-lg font-mono font-semibold text-primary">
                    {currentIdea.averageRevenue}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={generateIdea}
              disabled={isGenerating}
              className="w-full gap-2 text-base"
              data-testid="button-generate-idea"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Генерируем идею...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Сгенерировать другую
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              data-testid="button-start-with-idea"
            >
              Начать с этой идеей
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative h-[450px] rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="text-7xl mb-6">💡</div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                Идея — это только начало
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Важнее всего выбрать правильную форму бизнеса для вашей идеи. Это определит налоги, отчётность и возможности масштабирования.
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  "Лучший способ начать — <br /> перестать говорить и начать делать."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

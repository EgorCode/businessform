import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  MessageCircle, 
  TrendingUp, 
  FileText, 
  Calculator, 
  Users, 
  ArrowRight,
  Zap,
  Target,
  BookOpen
} from "lucide-react";
import { useLocation } from "wouter";

export default function AINavigation() {
  const [, setLocation] = useLocation();

  const aiFeatures = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "AI-чат",
      description: "Интерактивный диалог с ИИ-помощником для получения ответов на вопросы",
      path: "/",
      badge: "Популярное",
      color: "from-blue-500/20 to-blue-600/20 border-blue-500/30"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "AI-анализ бизнеса",
      description: "Умный подбор формы бизнеса на основе вашей ситуации",
      path: "/ai-analysis",
      badge: "Новое",
      color: "from-purple-500/20 to-purple-600/20 border-purple-500/30"
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "AI-калькулятор налогов",
      description: "Точный расчёт налоговой нагрузки для разных форм бизнеса",
      path: "/calculators",
      badge: "Полезно",
      color: "from-green-500/20 to-green-600/20 border-green-500/30"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "AI-анализ документов",
      description: "Анализ договоров и финансовых документов с помощью ИИ",
      path: "/documents",
      badge: "Эксперимент",
      color: "from-orange-500/20 to-orange-600/20 border-orange-500/30"
    }
  ];

  const quickActions = [
    {
      icon: <Zap className="h-4 w-4" />,
      title: "Быстрый старт",
      description: "Начните с AI-помощником прямо сейчас",
      action: () => setLocation('/ai-analysis')
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: "Сравнить формы",
      description: "Детальное сравнение ИП, ООО и самозанятости",
      action: () => setLocation('/comparison')
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      title: "База знаний",
      description: "Статьи и инструкции по ведению бизнеса",
      action: () => setLocation('/knowledge')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            ИИ-помощник - Интеллектуальный помощник
          </CardTitle>
          <CardDescription className="text-base">
            Комплексная система AI-инструментов для выбора формы бизнеса, расчёта налогов и ведения бизнеса в России
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Основные AI-функции */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">AI-инструменты</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {aiFeatures.map((feature, idx) => (
            <Card 
              key={idx} 
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br ${feature.color}`}
              onClick={() => setLocation(feature.path)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary">{feature.badge}</Badge>
                  )}
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-between group">
                  <span>Открыть</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Быстрые действия */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
          <CardDescription>
            Популярные сценарии использования ИИ-помощника
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="h-auto p-4 flex-col gap-2"
                onClick={action.action}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {action.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Статистика использования */}
      <Card>
        <CardHeader>
          <CardTitle>Статистика использования</CardTitle>
          <CardDescription>
            Как пользователи применяют ИИ-помощника в своём бизнесе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">2000+</div>
              <div className="text-sm text-muted-foreground">AI-консультаций</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-sm text-muted-foreground">Точность рекомендаций</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">5 мин</div>
              <div className="text-sm text-muted-foreground">Среднее время анализа</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-muted-foreground">Доступность</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Отзывы пользователей */}
      <Card>
        <CardHeader>
          <CardTitle>Что говорят пользователи</CardTitle>
          <CardDescription>
            Реальные истории использования ИИ-помощника
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                  АК
                </div>
                <div>
                  <div className="font-medium">Александр, фрилансер</div>
                  <div className="text-xs text-muted-foreground">Веб-разработчик</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "ИИ-помощник помог выбрать самозанятость вместо ИП. Экономлю 43 500 ₽ в год на налогах!"
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold">
                  МК
                </div>
                <div>
                  <div className="font-medium">Мария, предприниматель</div>
                  <div className="text-xs text-muted-foreground">Интернет-магазин</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "AI-анализ документов выявил риски в договоре с поставщиком. Сэкономила 200 000 ₽"
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
                  ДП
                </div>
                <div>
                  <div className="font-medium">Дмитрий, стартапер</div>
                  <div className="text-xs text-muted-foreground">IT-проект</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "Регистрация ООО через рекомендации ИИ-помощника заняла 3 дня вместо 2 недель!"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
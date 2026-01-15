import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  MessageCircle, 
  TrendingUp, 
  FileText, 
  Calculator, 
  Users, 
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Clock
} from "lucide-react";
import { useState } from "react";

export default function AIDemo() {
  const [activeDemo, setActiveDemo] = useState("chat");

  const features = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Интерактивный чат",
      description: "Разговор с AI-помощником в реальном времени",
      benefits: ["Мгновенные ответы", "Контекст диалога", "Персонализация"]
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Анализ бизнеса",
      description: "Умный подбор формы бизнеса на основе вашей ситуации",
      benefits: ["Точность 95%", "Учёт всех факторов", "Детальные рекомендации"]
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Расчёт налогов",
      description: "Автоматический расчёт налоговой нагрузки",
      benefits: ["Все системы налогообложения", "Сравнение вариантов", "Квартальные платежи"]
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Анализ документов",
      description: "AI-анализ договоров и финансовых документов",
      benefits: ["Выявление рисков", "Оптимизация условий", "Соответствие закону"]
    }
  ];

  const stats = [
    { label: "Точность рекомендаций", value: "95%", icon: <CheckCircle className="h-4 w-4" /> },
    { label: "Время ответа", value: "< 2 сек", icon: <Zap className="h-4 w-4" /> },
    { label: "Доступность", value: "24/7", icon: <Clock className="h-4 w-4" /> },
    { label: "Надёжность", value: "99.9%", icon: <Shield className="h-4 w-4" /> }
  ];

  const useCases = [
    {
      title: "Фрилансер",
      description: "Выбор между самозанятостью и ИП",
      scenario: "Разработчик с доходом 80 тыс ₽/мес",
      result: "Рекомендована самозанятость (НПД)"
    },
    {
      title: "Магазин",
      description: "Оптимальная форма для розничной торговли",
      scenario: "Онлайн-магазин с доходом 500 тыс ₽/мес",
      result: "Рекомендовано ИП на УСН 6%"
    },
    {
      title: "IT-стартап",
      description: "Выбор формы для команды с инвестициями",
      scenario: "3 основателя, инвестиции 5 млн ₽",
      result: "Рекомендована ООО с УСН 15%"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Заголовок с преимуществами */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            ИИ-помощник по бизнесу
          </CardTitle>
          <CardDescription className="text-base">
            Интеллектуальная система для выбора формы бизнеса, расчёта налогов и подготовки документов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="flex justify-center text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Демонстрация возможностей */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Чат
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Анализ
          </TabsTrigger>
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="h-4 w-4" />
            Калькулятор
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Документы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                AI-чат в действии
              </CardTitle>
              <CardDescription>
                Пример диалога с ИИ-помощником для выбора формы бизнеса
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      В
                    </div>
                    <span className="text-sm font-medium">Вы</span>
                  </div>
                  <p className="text-sm">
                    Планирую начать фриланс-проект, доход около 100 тыс ₽ в месяц. Какую форму бизнеса выбрать?
                  </p>
                </div>

                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      AI
                    </div>
                    <span className="text-sm font-medium">ИИ-помощник</span>
                    <Badge variant="secondary" className="text-xs">Форма бизнеса</Badge>
                  </div>
                  <div className="text-sm space-y-2">
                    <p>💡 Для вашей ситуации рекомендую самозанятость (НПД):</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Налог 6% с доходов</li>
                      <li>• Нет обязательных страховых взносов</li>
                      <li>• Простая регистрация через приложение "Мой налог"</li>
                    </ul>
                    <p>Хотите, чтобы я рассчитал точную налоговую нагрузку?</p>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      В
                    </div>
                    <span className="text-sm font-medium">Вы</span>
                  </div>
                  <p className="text-sm">
                    Да, пожалуйста! Рассчитай для дохода 100 тыс ₽ в месяц
                  </p>
                </div>

                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      AI
                    </div>
                    <span className="text-sm font-medium">ИИ-помощник</span>
                    <Badge variant="secondary" className="text-xs">Налоги</Badge>
                  </div>
                  <div className="text-sm space-y-2">
                    <p>💰 Расчёт налогов для самозанятости:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Ежемесячный налог: 6 000 ₽ (100 000 × 6%)</li>
                      <li>• Годовой налог: 72 000 ₽</li>
                      <li>• Эффективная ставка: 6%</li>
                    </ul>
                    <p>Это значительно выгоднее ИП на УСН 6% (49 500 ₽ взносы + 6% налог).</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                AI-анализ бизнеса
              </CardTitle>
              <CardDescription>
                Умный анализ бизнес-ситуации для рекомендации оптимальной формы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {useCases.map((useCase, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{useCase.title}</h4>
                        <p className="text-sm text-muted-foreground">{useCase.description}</p>
                      </div>
                      <Badge variant="outline">{useCase.result}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Сценарий:</span> {useCase.scenario}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Результат:</span> {useCase.result}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                AI-калькулятор налогов
              </CardTitle>
              <CardDescription>
                Автоматический расчёт налогов для всех форм бизнеса
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-2 border-green-500/20 bg-green-500/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Самозанятость</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Налог 6%</span>
                          <span className="font-medium">6 000 ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Взносы</span>
                          <span className="font-medium">0 ₽</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between font-semibold">
                            <span>Итого</span>
                            <span className="text-green-600">6 000 ₽</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-500/20 bg-blue-500/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">ИП на УСН 6%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Налог 6%</span>
                          <span className="font-medium">6 000 ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Взносы</span>
                          <span className="font-medium">4 125 ₽</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between font-semibold">
                            <span>Итого</span>
                            <span className="text-blue-600">10 125 ₽</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-500/20 bg-purple-500/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">ООО на УСН 6%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Налог 6%</span>
                          <span className="font-medium">6 000 ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Взносы директора</span>
                          <span className="font-medium">4 125 ₽</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between font-semibold">
                            <span>Итого</span>
                            <span className="text-purple-600">10 125 ₽</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                AI-анализ документов
              </CardTitle>
              <CardDescription>
                Умный анализ договоров, выписок и других документов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-dashed border-2">
                    <CardHeader className="text-center">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                      <CardTitle className="text-lg">Загрузите документ</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Поддерживаемые форматы: PDF, JPG, PNG
                      </p>
                      <Button className="gap-2">
                        <FileText className="h-4 w-4" />
                        Выбрать файл
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Результат анализа</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Договор корректен</div>
                            <div className="text-xs text-muted-foreground">
                              Соответствует законодательству РФ
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Выявлены риски</div>
                            <div className="text-xs text-muted-foreground">
                              Рекомендуется добавить пункт об ответственности
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Оптимизация налогов</div>
                            <div className="text-xs text-muted-foreground">
                              Можно применить УСН 6% вместо ОСНО
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Призыв к действию */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Готовы попробовать ИИ-помощник?</CardTitle>
          <CardDescription className="text-base">
            Начните использовать AI-помощника прямо сейчас для вашего бизнеса
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <a href="/ai-analysis">
                <Sparkles className="h-5 w-5" />
                Начать AI-анализ
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <a href="/">
                <MessageCircle className="h-5 w-5" />
                Открыть AI-чат
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
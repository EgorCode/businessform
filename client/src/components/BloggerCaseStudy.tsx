import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Building2, Download, Sparkles, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAIAssistant } from "@/contexts/AIAssistantContext";

const acts = [
  {
    id: 1,
    title: "Акт 1: Старт с НПД",
    period: "0-6 месяцев",
    form: "НПД",
    formColor: "bg-green-500",
    milestones: [
      { label: "Подписчики", from: "5K", to: "50K", icon: Users },
      { label: "Доход/мес", from: "80K ₽", to: "120K ₽", icon: TrendingUp },
      { label: "Источники", value: "Реклама в Stories", icon: Sparkles },
    ],
    decision: "Зарегистрировала НПД через приложение \"Мой налог\" за 1 день",
    aiInsight: "Оптимальный выбор для старта: минимум бюрократии, налог 4-6%",
    trigger: null,
    downloads: ["Чек-лист запуска НПД", "Шаблон договора с рекламодателем"],
  },
  {
    id: 2,
    title: "Акт 2: Масштабирование на ИП",
    period: "6-18 месяцев",
    form: "ИП УСН 6%",
    formColor: "bg-blue-500",
    milestones: [
      { label: "Подписчики", from: "50K", to: "200K", icon: Users },
      { label: "Доход/мес", from: "120K ₽", to: "300K ₽", icon: TrendingUp },
      { label: "Команда", value: "Наняла ассистента", icon: Users },
    ],
    decision: "Перешла на ИП УСН 6% для работы с крупными брендами и найма помощника",
    aiInsight: "Экономия на налогах: 120K ₽/год по сравнению с УСН 15%",
    trigger: {
      text: "Доход превысил лимит НПД (2.4М ₽/год)",
      type: "warning",
    },
    downloads: ["Гайд по регистрации ИП", "Калькулятор УСН 6% vs 15%"],
  },
  {
    id: 3,
    title: "Акт 3: Создание ООО",
    period: "18-36 месяцев",
    form: "ООО",
    formColor: "bg-purple-500",
    milestones: [
      { label: "Подписчики", from: "200K", to: "500K", icon: Users },
      { label: "Доход/мес", from: "300K ₽", to: "2M ₽", icon: TrendingUp },
      { label: "Команда", value: "8 человек", icon: Building2 },
    ],
    decision: "Основала ООО для защиты активов и работы с международными брендами",
    aiInsight: "Защита личных активов: 15М ₽ в контрактах с брендами",
    trigger: {
      text: "Партнёры присоединились к бизнесу + крупные сделки требуют ООО",
      type: "info",
    },
    downloads: ["Устав ООО (образец)", "Договор с соучредителями"],
  },
];

export default function BloggerCaseStudy() {
  const { toggleMinimized } = useAIAssistant();
  return (
    <section className="border-b py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-8">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                ЛК
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold" data-testid="text-case-study-title">
                  Путь блогера Лены
                </h2>
                <Badge variant="outline" className="gap-1 w-fit">
                  <Sparkles className="h-3 w-3" />
                  Реальный кейс
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground" data-testid="text-case-study-subtitle">
                Как lifestyle-блогер прошла путь от НПД до ООО с командой из 8 человек
              </p>
            </div>
            <Button variant="outline" className="gap-2 w-full sm:w-fit" data-testid="button-compare-path">
              Сравнить с моим путём
            </Button>
          </div>

          <div className="grid gap-2 md:grid-cols-3 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-1">36 мес</div>
                <div className="text-sm text-muted-foreground">Длительность пути</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-1">5K → 500K</div>
                <div className="text-sm text-muted-foreground">Рост аудитории</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-1">80K → 2M ₽</div>
                <div className="text-sm text-muted-foreground">Рост дохода/мес</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          {acts.map((act, index) => (
            <Card key={act.id} className="overflow-hidden" data-testid={`card-act-${act.id}`}>
              <div className={`h-2 ${act.formColor}`} />
              
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`${act.formColor} text-white`}>
                        {act.form}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{act.period}</span>
                    </div>
                    <CardTitle className="text-2xl mb-2">{act.title}</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Прогресс этапа</div>
                    <Progress value={100} className="w-32" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {act.trigger && (
                  <div className={`flex items-start gap-3 rounded-lg border-2 p-4 ${
                    act.trigger.type === 'warning' 
                      ? 'border-amber-500/50 bg-amber-500/5' 
                      : 'border-blue-500/50 bg-blue-500/5'
                  }`}>
                    <AlertCircle className={`h-5 w-5 flex-shrink-0 ${
                      act.trigger.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                    }`} />
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide mb-1">
                        Триггер перехода
                      </div>
                      <div className="text-sm font-medium">{act.trigger.text}</div>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                  {act.milestones.map((milestone, idx) => {
                    const Icon = milestone.icon;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon className="h-4 w-4" />
                          <span>{milestone.label}</span>
                        </div>
                        <div className="text-lg font-semibold">
                          {milestone.from && milestone.to 
                            ? `${milestone.from} → ${milestone.to}`
                            : milestone.value}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Решение
                    </div>
                    <p className="text-sm leading-relaxed">{act.decision}</p>
                  </div>

                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                          AI Insight
                        </div>
                        <p className="text-sm leading-relaxed">{act.aiInsight}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {act.downloads.map((doc, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => console.log('Download:', doc)}
                      data-testid={`button-download-act${act.id}-${idx}`}
                    >
                      <Download className="h-3 w-3" />
                      {doc}
                    </Button>
                  ))}
                </div>
              </CardContent>

              {index < acts.length - 1 && (
                <div className="flex justify-center py-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-0.5 bg-border" />
                    <div className="text-xs text-muted-foreground">↓ Переход на следующий этап</div>
                    <div className="h-8 w-0.5 bg-border" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Хотите получить персональный план развития как у Лены?
              </p>
              <Button className="gap-2" data-testid="button-start-journey" onClick={() => {
                // Открываем ИИ-помощника
                toggleMinimized();
              }}>
                <Sparkles className="h-4 w-4" />
                Начать свой путь с AI
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

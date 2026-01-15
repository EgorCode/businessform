import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Palette, Home, Hammer, BookOpen,
  TrendingUp, Users, AlertTriangle, CheckCircle2,
  Sparkles, Calendar, PiggyBank, Bell,
  ArrowRight, Building2, Receipt
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAIAssistant } from "@/contexts/AIAssistantContext";
import { useState } from "react";
import { WizardDialog } from "@/components/WizardDialog";

interface CaseStudy {
  id: string;
  name: string;
  avatar: string;
  avatarGradient: string;
  role: string;
  niche: string;
  icon: any;
  problem: string;
  journey: string[];
  result: string;
  subscription?: "lite" | "max";
  savings?: {
    before: number;
    after: number;
    monthly: number;
  };
  warning?: {
    text: string;
    type: "limit" | "transition";
  };
  features: string[];
  taxRate: "4%" | "6%" | "mixed";
  clientType: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "anna-designer",
    name: "Анна",
    avatar: "АД",
    avatarGradient: "from-purple-500 to-pink-500",
    role: "Графический дизайнер",
    niche: "Творчество и IT",
    icon: Palette,
    problem: "Крупный российский агрегатор предложил контракт, но работают только с юридическими лицами или самозанятыми. Анна боится бумажной волокиты.",
    journey: [
      "Анна заходит на сайт, выбирает карточку «Дизайн»",
      "ИИ-помощник подтверждает: «Для ваших задач идеально подходит Самозанятость. Налог на работу с компаниями — 6%»",
      "Анна изучает инструкцию «Как выставить первый счет через приложение Мой Налог»"
    ],
    result: "Анна оформляет статус за 5 минут. Она использует Lite-подписку, чтобы бот напоминал ей вовремя формировать чеки для агентства.",
    subscription: "lite",
    features: ["Напоминания о чеках", "Уведомления для бухгалтерии заказчика", "Шаблоны договоров"],
    taxRate: "6%",
    clientType: "Юридические лица"
  },
  {
    id: "irina-rental",
    name: "Ирина",
    avatar: "ИГ",
    avatarGradient: "from-blue-500 to-cyan-500",
    role: "Владелица гостевого дома",
    niche: "Аренда",
    icon: Home,
    problem: "Ирина сдает посуточно квартиру в Сочи и платит 13% как физлицо (НДФЛ). При доходе 100 000 ₽ в месяц она отдает 13 000 ₽ налога.",
    journey: [
      "Ирина видит на главной блок «Владельцы квартир»",
      "Сравнительная таблица показывает, что как самозанятая она будет платить всего 4% (4 000 ₽)",
      "Выгода: Экономия 9 000 ₽ в месяц, 108 000 ₽ в год"
    ],
    result: "Ирина регистрируется через портал. Теперь в личном кабинете она видит график своей прибыли.",
    savings: {
      before: 13000,
      after: 4000,
      monthly: 9000
    },
    warning: {
      text: "Ваш доход растет, вы использовали 40% годового лимита",
      type: "limit"
    },
    features: ["График прибыли", "Предупреждения о лимите", "Календарь платежей"],
    taxRate: "4%",
    clientType: "Физические лица"
  },
  {
    id: "alexey-craftsman",
    name: "Алексей",
    avatar: "АМ",
    avatarGradient: "from-amber-500 to-orange-500",
    role: "Мастер мебели",
    niche: "Ремесло и Рост",
    icon: Hammer,
    problem: "Алексей делает столы из эпоксидной смолы. Продажи на Авито выросли. Он нанимает помощника и понимает, что его доход скоро превысит 2.4 млн руб. в год.",
    journey: [
      "Алексей заносит выручку в личном кабинете",
      "Срабатывает алгоритм аппроксимации: за 6 месяцев он заработал 1.8 млн",
      "Выскакивает баннер: «Внимание! При таком темпе лимит самозанятого будет исчерпан через 2 месяца. Рекомендуем переход на ИП»",
      "Алексей нажимает на баннер и попадает на сравнение «ИП на УСН vs Самозанятость»"
    ],
    result: "Алексей покупает Max-подписку. Портал дает ему пошаговый план: как закрыть самозанятость и в тот же день подать на ИП.",
    subscription: "max",
    warning: {
      text: "Лимит будет исчерпан через 2 месяца",
      type: "transition"
    },
    features: ["Прогноз доходов", "План перехода на ИП", "Консультация по закрытию НПД"],
    taxRate: "mixed",
    clientType: "Физические и юридические лица"
  },
  {
    id: "maxim-blogger",
    name: "Максим",
    avatar: "МБ",
    avatarGradient: "from-rose-500 to-red-500",
    role: "Блогер / Эксперт",
    niche: "Курсы и контент",
    icon: BookOpen,
    problem: "Максим ведет блог про ремонт и продает гайды. Много мелких платежей от физлиц (по 500-1000 руб.). Сложно уследить за всеми и не запутаться в налогах.",
    journey: [
      "Максим подключает профиль и видит календарь налогов",
      "Раз в месяц он просто загружает выписку, а сайт строит визуальный график: сколько «грязными», сколько «чистыми»",
      "В разделе «Новости» он читает авторскую заметку о том, как правильно маркировать рекламу самозанятому"
    ],
    result: "Максим спокоен за легальность. Он использует функцию «Календарь взносов в СФР», чтобы добровольно платить за пенсионный стаж.",
    features: ["Календарь налогов", "Визуальный график доходов", "Добровольные взносы в СФР", "Маркировка рекламы"],
    taxRate: "4%",
    clientType: "Физические лица"
  }
];

export default function SelfEmployedCaseStudies() {
  const { toggleMinimized, setSubscriptionTier } = useAIAssistant();
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const toggleCase = (id: string, tier?: "lite" | "max") => {
    setExpandedCase(expandedCase === id ? null : id);
    if (tier) {
      setSubscriptionTier(tier);
    }
  };


  return (
    <section className="border-b py-20" id="case-studies">
      <div className="mx-auto max-w-7xl px-4">
        {/* Заголовок секции */}
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 gap-2 bg-green-500/10 border-green-500/30">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            Реальные истории успеха
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl" data-testid="text-case-studies-title">
            Как самозанятые экономят на налогах
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-case-studies-subtitle">
            Истории людей, которые выбрали НПД и получили выгоду. Узнайте, подходит ли это вам.
          </p>
        </div>

        {/* Статистика */}
        <div className="grid gap-4 md:grid-cols-4 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-1">4%</div>
              <div className="text-sm text-muted-foreground">Налог с физлиц</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">6%</div>
              <div className="text-sm text-muted-foreground">Налог с юрлиц</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-1">0 ₽</div>
              <div className="text-sm text-muted-foreground">Страховые взносы</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-amber-600 mb-1">5 мин</div>
              <div className="text-sm text-muted-foreground">Регистрация</div>
            </CardContent>
          </Card>
        </div>

        {/* Карточки кейсов */}
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((caseItem) => {
            const Icon = caseItem.icon;
            const isExpanded = expandedCase === caseItem.id;

            return (
              <Card
                key={caseItem.id}
                className={`overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-green-500/10 hover:border-green-500/50 ${isExpanded ? 'ring-2 ring-green-500 border-green-500/50' : ''}`}
                onClick={() => toggleCase(caseItem.id, caseItem.subscription)}
                data-testid={`case-card-${caseItem.id}`}
              >
                {/* Градиентная полоса */}
                <div className={`h-2 bg-gradient-to-r ${caseItem.avatarGradient}`} />

                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className={`text-lg bg-gradient-to-br ${caseItem.avatarGradient} text-white`}>
                        {caseItem.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl">{caseItem.name}</CardTitle>
                        {caseItem.subscription && (
                          <Badge variant={caseItem.subscription === "max" ? "default" : "secondary"} className="text-xs">
                            {caseItem.subscription === "max" ? "Max" : "Lite"}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {caseItem.role}
                      </CardDescription>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {caseItem.niche}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <Badge className={`${caseItem.taxRate === "4%" ? "bg-green-500" : caseItem.taxRate === "6%" ? "bg-blue-500" : "bg-purple-500"} text-white`}>
                        {caseItem.taxRate}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {caseItem.clientType}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Проблема */}
                  <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">Проблема</div>
                        <p className="text-sm">{caseItem.problem}</p>
                      </div>
                    </div>
                  </div>

                  {/* Экономия (если есть) */}
                  {caseItem.savings && (
                    <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PiggyBank className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-700">Экономия</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {caseItem.savings.monthly.toLocaleString('ru-RU')} ₽/мес
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {caseItem.savings.before.toLocaleString('ru-RU')} ₽ → {caseItem.savings.after.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Путь (разворачивается) */}
                  {isExpanded && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="rounded-lg bg-muted/50 p-4">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                          Путь на портале
                        </div>
                        <div className="space-y-3">
                          {caseItem.journey.map((step, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground flex-shrink-0">
                                {idx + 1}
                              </div>
                              <p className="text-sm">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Предупреждение о лимите */}
                      {caseItem.warning && (
                        <div className={`rounded-lg p-4 flex items-start gap-3 ${caseItem.warning.type === "limit"
                          ? "bg-amber-500/10 border border-amber-500/30"
                          : "bg-orange-500/10 border border-orange-500/30"
                          }`}>
                          <Bell className={`h-5 w-5 flex-shrink-0 ${caseItem.warning.type === "limit" ? "text-amber-600" : "text-orange-600"
                            }`} />
                          <div>
                            <div className="text-xs font-medium uppercase tracking-wide mb-1">
                              {caseItem.warning.type === "limit" ? "Уведомление системы" : "Рекомендация"}
                            </div>
                            <p className="text-sm font-medium">{caseItem.warning.text}</p>
                          </div>
                        </div>
                      )}

                      {/* Функции подписки */}
                      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <span className="text-xs font-medium text-primary uppercase tracking-wide">
                            {caseItem.subscription ? `Функции ${caseItem.subscription}-подписки` : "Полезные функции"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {caseItem.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Результат */}
                  <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Результат</div>
                        <p className="text-sm">{caseItem.result}</p>
                      </div>
                    </div>
                  </div>

                  {/* Кнопка развернуть/свернуть */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCase(caseItem.id, caseItem.subscription);
                    }}
                  >
                    {isExpanded ? "Свернуть" : "Показать путь на портале"}
                    <ArrowRight className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Призыв к действию */}
        <div className="mt-12 text-center">
          <Card className="inline-block max-w-xl">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Узнайте, подходит ли вам самозанятость</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ответьте на 4 простых вопроса, и ИИ-помощник подскажет оптимальный вариант
              </p>
              <WizardDialog>
                <Button
                  size="lg"
                  className="gap-2"
                  data-testid="button-start-wizard"
                >
                  <Sparkles className="h-4 w-4" />
                  Пройти тест за 2 минуты
                </Button>
              </WizardDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

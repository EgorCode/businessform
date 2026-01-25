import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/strapi";
import { FAQItem, StrapiResponse } from "@/types/strapi";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SubscriptionDialog } from "@/components/shared/SubscriptionDialog";
import { HelpCircle, AlertTriangle, TrendingUp, Users, Clock, DollarSign, FileText, Shield, X } from "lucide-react";

interface FAQScenario {
  id: string;
  category: string;
  question: string;
  situation: string;
  solution: string;
  tips?: string[];
  icon: any;
}

const categoryIcons: Record<string, any> = {
  limits: TrendingUp,
  "zero-income": Clock,
  transition: Users,
  hiring: Users,
  taxes: DollarSign,
  documents: FileText,
  dictionary: HelpCircle,
};



export default function PracticalFAQ() {
  const { settings } = useSiteSettings();
  const [isPricingOpen, setIsPricingOpen] = useState(false);



  const staticScenarios: FAQScenario[] = [
    {
      id: "exceed-npd-limit",
      category: "limits",
      question: "Что делать если превысил лимит НПД 2.4М ₽?",
      situation: "Вы фрилансер-дизайнер на НПД. В ноябре заработали 2.3М ₽ за год, а в декабре получили заказ на 300К ₽. Суммарно выйдет 2.6М ₽ — превышение лимита.",
      solution: "У вас есть 2 варианта:\n\n**Вариант 1: Отказаться от части дохода**\nПримите только 100К ₽ в декабре, чтобы не превысить 2.4М ₽. Остальные 200К ₽ перенесите на январь следующего года. НПД сохраняется.\n\n**Вариант 2: Открыть ИП заранее** (рекомендуем)\nОткройте ИП в ноябре, до превышения лимита. Снимитесь с учёта НПД. Весь декабрьский доход пройдёт уже как ИП по УСН 6%. С января вы уже полноценный ИП.",
      tips: [
        "Приложение 'Мой налог' предупредит за 50К ₽ до лимита",
        "После превышения НПД автоматически закроется с начала месяца",
        "Вам придётся доплатить УСН 6% или НДФЛ 13% на весь доход месяца превышения",
        "Заранее открытый ИП позволяет избежать штрафов"
      ],
      icon: TrendingUp
    },
    {
      id: "zero-income-months",
      category: "zero-income",
      question: "Нет дохода несколько месяцев — нужно ли что-то делать?",
      situation: "Вы репетитор на НПД. Летом (июль-август) нет учеников, доход = 0 ₽. Нужно ли платить налоги или отчитываться?",
      solution: "**Для НПД: ничего не нужно делать**\nНет дохода — нет налога. Вы можете не заходить в приложение месяцами. НПД не закроется автоматически. Чеки формируются только при получении денег.\n\n**Для ИП: взносы платить обязательно**\nЕсли вы ИП, то обязаны платить фиксированные страховые взносы (45 842 ₽ в 2024), даже если дохода нет вообще. Можно платить раз в квартал или год. Декларацию подавать раз в год до 25 апреля.",
      tips: [
        "НПД можно закрыть и заново открыть в любой момент бесплатно",
        "ИП закрывать на лето невыгодно — взносы всё равно начислятся пропорционально",
        "Если ИП без дохода больше года — рассмотрите временное закрытие"
      ],
      icon: Clock
    },
    {
      id: "npd-to-ip-transition",
      category: "transition",
      question: "Как правильно перейти с НПД на ИП?",
      situation: "Вы SMM-специалист на НПД. Доход вырос до 200К ₽/мес, планируете нанять помощника. Пора переходить на ИП, но боитесь потерять клиентов или попасть на двойные налоги.",
      solution: "**Пошаговый план перехода:**\n\n**Шаг 1:** Зарегистрируйте ИП в налоговой (онлайн или лично, 3-5 дней)\n\n**Шаг 2:** Подайте заявление на УСН сразу при регистрации (иначе попадёте на ОСНО)\n\n**Шаг 3:** Снимитесь с учёта НПД в приложении 'Мой налог' после одобрения ИП\n\n**Шаг 4:** Уведомите клиентов об изменении реквизитов (теперь договоры с ИП)\n\n**Важно:** Между датой закрытия НПД и открытием ИП не должно быть перерыва больше 30 дней, иначе придётся ждать следующего года для УСН.",
      tips: [
        "Можно работать на НПД и подавать документы на ИП параллельно",
        "Закрывайте НПД только после одобрения ИП",
        "Предупредите крупных клиентов за 2 недели о смене реквизитов",
        "Первый год ИП можно совмещать с НПД (если разные виды деятельности)"
      ],
      icon: Users
    },
    {
      id: "hiring-first-employee",
      category: "hiring",
      question: "Хочу нанять первого сотрудника — что изменится?",
      situation: "Вы владелец онлайн-магазина на НПД. Заказов стало много, нужен помощник на упаковку и отправку. Как правильно оформить?",
      solution: "**НПД не позволяет нанимать сотрудников.**\nВам нужно сначала открыть ИП или ООО.\n\n**Вариант 1: ИП + сотрудник**\n1. Зарегистрируйте ИП на УСН 6%\n2. Встаньте на учёт как работодатель в ФНС и СФР\n3. Оформите трудовой договор или договор ГПХ\n4. Платите зарплату + 30.2% страховые взносы\n5. Сдавайте ежемесячную отчётность (СЗВ-М, 4-ФСС и др.)\n\n**Вариант 2: Наймите как самозанятого**\nЕсли ваш помощник согласен работать как НПД:\n- Заключаете договор на оказание услуг\n- Он сам платит свой налог 4-6%\n- Вы ничего не платите дополнительно\n- Но контролировать и руководить им нельзя (по закону это должен быть независимый подрядчик)",
      tips: [
        "Первый сотрудник — серьёзный шаг, увеличивающий расходы на ~50% от зарплаты",
        "Рассмотрите найм через агентства или аутстаффинг",
        "Помощник на договоре ГПХ проще в оформлении чем по трудовому договору",
        "Проверьте не проще ли делегировать задачи другим самозанятым"
      ],
      icon: Users
    },
    {
      id: "late-payment-penalty",
      category: "taxes",
      question: "Забыл вовремя оплатить налог — что будет?",
      situation: "Вы фотограф на НПД. Налог за март (12 000 ₽) нужно было оплатить до 28 апреля, но вы забыли. Оплатили только 15 мая. Какие последствия?",
      solution: "**Штрафы за просрочку НПД:**\n\nПри опоздании до 30 дней:\n- Пеня 1/300 ставки ЦБ за каждый день просрочки\n- На сумму 12 000 ₽ при ставке 16%: ~21 ₽/день\n- За 17 дней просрочки: ~357 ₽\n\nПри опоздании более 30 дней:\n- Штраф 20% от неуплаченной суммы (если не умышленно)\n- Штраф 40% если налоговая докажет умысел\n\n**Что делать:**\n1. Оплатите налог как можно скорее\n2. Пеня начислится автоматически — будет в следующем уведомлении\n3. Включите напоминания в приложении 'Мой налог'",
      tips: [
        "Привяжите автоплатёж в банковском приложении",
        "Налоговая обычно лояльна к первой просрочке",
        "Для ИП штрафы строже — до 30% от суммы налога"
      ],
      icon: DollarSign
    },
    {
      id: "retroactive-registration",
      category: "documents",
      question: "Работал без оформления, теперь хочу легализоваться — можно ли задним числом?",
      situation: "Вы копирайтер, полгода получали деньги на карту от клиентов неофициально. Суммарно заработали 400К ₽. Теперь хотите оформить НПД. Можно ли отчитаться за прошлые месяцы?",
      solution: "**Нельзя зарегистрировать НПД 'задним числом'**\n\nДата регистрации = дата с которой вы официально платите налоги. Прошлые доходы НПД не покрывает.\n\n**Что делать с прошлыми доходами:**\n\nВариант 1: Декларировать как физлицо\n- Подайте декларацию 3-НДФЛ за прошлый год\n- Заплатите 13% НДФЛ на все неофициальные доходы\n- Срок: до 30 апреля следующего года\n\nВариант 2: Рискнуть (не рекомендуем)\n- Если налоговая не нашла следы — возможно не заметят\n- Но при проверке будут штрафы 20-40% + пени + НДФЛ 13%\n- Если суммы большие — могут завести уголовное дело\n\n**Рекомендация:** Зарегистрируйте НПД сейчас, а за прошлые доходы подайте декларацию 3-НДФЛ. Налоговая ценит честность.",
      tips: [
        "С момента регистрации НПД выставляйте чеки на ВСЕ доходы",
        "Штраф за невыставление чека — до 20% от суммы",
        "Налоговая видит переводы на карту с пометкой 'за услуги'",
        "Легализация — это инвестиция в спокойствие и репутацию"
      ],
      icon: FileText
    },
    {
      id: "working-with-former-employer",
      category: "documents",
      question: "Могу ли я работать на НПД с бывшим работодателем?",
      situation: "Вас уволили из IT-компании, где вы были разработчиком. Теперь они хотят нанять вас как самозанятого на тот же проект. Законно ли это?",
      solution: "Работать с бывшим работодателем на НПД можно, но есть ограничение:\n\nЗапрещено работать как НПД с бывшим работодателем в течение 2 лет после увольнения.\n\nЕсли прошло меньше 2 лет, то вы не можете оказывать услуги как НПД. Штраф: вся сумма вернётся в виде НДФЛ 13% + страховые взносы. Работодателю тоже грозят штрафы.\n\nЧто делать:\n\nВариант 1: Подождать 2 года. Найдите других клиентов на время, через 2 года можете работать на НПД с бывшим работодателем.\n\nВариант 2: Оформитесь как ИП. ИП может работать с бывшим работодателем сразу, УСН 6% вместо НПД 4-6%.\n\nВариант 3: Трудовой договор или ГПХ через кадры.",
      tips: [
        "Правило 2 лет действует даже если вы сами уволились",
        "Налоговая активно ищет такие схемы обхода налогов",
        "Для безопасности дождитесь истечения 2 лет"
      ],
      icon: Shield
    },
    {
      id: "combining-forms",
      category: "transition",
      question: "Можно ли совмещать НПД и работу по трудовому договору?",
      situation: "Вы работаете программистом в офисе (зарплата 150К ₽), но по вечерам делаете сайты на фрилансе (доп. 60К ₽/мес). Хотите легализовать фриланс через НПД.",
      solution: "Да, совмещать НПД и официальную работу можно!\n\nЭто законно и распространено. Ограничения:\n\n1. Нельзя оказывать услуги текущему работодателю как НПД. Только сторонним клиентам, иначе штрафы.\n\n2. Лимит дохода НПД — 2.4М ₽/год (считается только доход от самозанятости, зарплата не входит).\n\n3. С зарплаты платите НДФЛ 13%, с НПД — 4-6%. Две параллельные налоговые системы, декларации сдавать не нужно.\n\nПример расчёта:\nЗарплата: 150К × 12 = 1.8М ₽/год (НДФЛ 13%)\nФриланс: 60К × 12 = 720К ₽/год (НПД 4%)\nСуммарно: 2.52М ₽/год — НПД лимит не превышен.",
      tips: [
        "НПД идеален для подработок, хобби, фриланса",
        "Убедитесь что трудовой договор не запрещает подработки",
        "Выставляйте чеки НПД только на фриланс-доход",
        "Работодатель не узнает о вашем статусе НПД автоматически"
      ],
      icon: Users
    },
  ];

  // Fetch from Strapi v5
  const { data: strapiResponse, isLoading, error } = useQuery<StrapiResponse<FAQItem[]>>({
    queryKey: ["/faqs"],
    queryFn: () => fetchAPI<StrapiResponse<FAQItem[]>>("/faqs"),
    retry: 1,
  });

  // Handle visibility
  if (settings && settings.showFAQ === false) {
    return null;
  }

  const scenarios = useMemo(() => {
    if (error) return staticScenarios;

    if (strapiResponse?.data && strapiResponse.data.length > 0) {
      const strapiItems = strapiResponse.data.map((item: FAQItem): FAQScenario => {
        let tipsArray: string[] = [];
        if (Array.isArray(item.tips)) {
          tipsArray = item.tips;
        } else if (typeof item.tips === 'string') {
          // Try to split by newline if it's a string
          tipsArray = item.tips.split('\n').filter(t => t.trim().length > 0);
        }

        // Protective check: Ensure strings for split() calls later
        const situationText = typeof item.situation === 'string' ? item.situation : String(item.situation || "Ситуация уточняется...");
        // Handle solution falling back to answer block if needed
        let solutionText = "";
        if (typeof item.solution === 'string') {
          solutionText = item.solution;
        } else if (item.answer && Array.isArray(item.answer)) {
          // Basic block extraction if they used the wrong field
          solutionText = item.answer.map((block: any) => block.children?.map((c: any) => c.text).join('')).join('\n');
        } else {
          solutionText = "Решение изучается нашими экспертами.";
        }

        return {
          id: item.documentId,
          category: item.category || "dictionary",
          question: item.question,
          situation: situationText,
          solution: solutionText,
          tips: tipsArray.length > 0 ? tipsArray : undefined,
          icon: categoryIcons[item.category || "dictionary"] || HelpCircle,
        };
      });

      // Merge Strapi items with static scenarios if Strapi has data
      if (strapiItems.length > 0) {
        console.log(`📦 [FAQ] Merging ${strapiItems.length} Strapi items with static scenarios`);
        return [...strapiItems, ...staticScenarios];
      }
    }

    // Always return staticScenarios if no dynamic data available yet
    return staticScenarios;
  }, [strapiResponse, error, isLoading]);

  const categories = [
    { id: "all", label: "Все сценарии", icon: HelpCircle },
    { id: "limits", label: "Лимиты и превышения", icon: TrendingUp },
    { id: "zero-income", label: "Нулевой доход", icon: Clock },
    { id: "transition", label: "Переход между формами", icon: Users },
    { id: "hiring", label: "Найм сотрудников", icon: Users },
    { id: "taxes", label: "Налоги и штрафы", icon: DollarSign },
    { id: "documents", label: "Документы и легализация", icon: FileText },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredScenarios = selectedCategory === "all"
    ? scenarios
    : scenarios.filter((s: FAQScenario) => s.category === selectedCategory);

  // Removed blocking loading state to show static content immediately

  return (
    <section className="bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 bg-purple-500/10">
            <HelpCircle className="mr-1 h-3 w-3" />
            Практические кейсы
          </Badge>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-faq-title">
            Что делать если...
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-faq-subtitle">
            Реальные жизненные ситуации и конкретные решения для НПД и ИП
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="gap-2"
                data-testid={`button-category-${cat.id}`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {selectedCategory === "all"
                ? `${scenarios.length} типичных ситуаций`
                : `${filteredScenarios.length} сценариев`
              }
            </CardTitle>
            <CardDescription>
              Нажмите на вопрос чтобы увидеть детальный разбор ситуации
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredScenarios.map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <AccordionItem key={scenario.id} value={scenario.id} data-testid={`accordion-item-${scenario.id}`}>
                    <AccordionTrigger className="text-left hover:no-underline" data-testid={`accordion-trigger-${scenario.id}`}>
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0 text-primary" />
                        <span className="font-medium">{scenario.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pl-8">
                        {/* Situation */}
                        <div className="rounded-lg border bg-amber-500/10 p-4">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-200">
                            Ситуация
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {scenario.situation}
                          </p>
                        </div>

                        {/* Solution */}
                        <div className="rounded-lg border bg-green-500/10 p-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-900 dark:text-green-200">
                            Решение
                          </p>
                          <div className="space-y-2 text-sm" data-testid={`solution-${scenario.id}`}>
                            {scenario.solution.split('\n\n').map((paragraph, idx) => {
                              if (!paragraph.trim()) return null;

                              const lines = paragraph.split('\n');
                              return (
                                <div key={idx} className="space-y-1">
                                  {lines.map((line, lineIdx) => {
                                    // Bold headers: **Text**
                                    if (line.match(/^\*\*.*\*\*$/)) {
                                      return (
                                        <p key={lineIdx} className="font-semibold text-foreground">
                                          {line.replace(/\*\*/g, '')}
                                        </p>
                                      );
                                    }
                                    // Inline bold: **Text:** rest
                                    if (line.includes('**')) {
                                      const parts = line.split('**');
                                      return (
                                        <p key={lineIdx} className="text-muted-foreground">
                                          {parts.map((part, partIdx) =>
                                            partIdx % 2 === 1 ? (
                                              <span key={partIdx} className="font-semibold text-foreground">{part}</span>
                                            ) : part
                                          )}
                                        </p>
                                      );
                                    }
                                    return line ? (
                                      <p key={lineIdx} className="text-muted-foreground">{line}</p>
                                    ) : null;
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Tips */}
                        {scenario.tips && scenario.tips.length > 0 && (
                          <div className="rounded-lg border bg-blue-500/10 p-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-900 dark:text-blue-200">
                              Важные детали
                            </p>
                            <ul className="space-y-1.5 text-sm">
                              {scenario.tips.map((tip, idx) => (
                                <li key={idx} className="flex gap-2 text-muted-foreground">
                                  <span className="text-blue-500">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {filteredScenarios.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <HelpCircle className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Нет сценариев в этой категории</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional help CTA */}
        <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center md:flex-row md:justify-between md:text-left">
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-semibold">Не нашли ответ на свой вопрос?</h3>
              <p className="text-muted-foreground">
                Проконсультируйтесь с бухгалтером или налоговым консультантом.
                Первичная консультация обычно бесплатна.
              </p>
            </div>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-10 rounded-md px-8 gap-2 border-primary/30"
              data-testid="button-more-help"
            >
              Получить консультацию
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-help h-4 w-4">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </button>
            <SubscriptionDialog open={isPricingOpen} onOpenChange={setIsPricingOpen} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

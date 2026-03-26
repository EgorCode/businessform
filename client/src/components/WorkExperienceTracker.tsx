import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Calendar, TrendingUp, Shield, ShieldCheck, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubscriptionDialog, PricingPlan } from "@/components/shared/SubscriptionDialog";
import { InfoDialog } from "@/components/shared/InfoDialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TimelineEvent {
  year: number;
  status: "student" | "npd" | "ip" | "ooo";
  label: string;
  pensionContribution: boolean;
}

export default function WorkExperienceTracker() {
  const [monthsAsNPD, setMonthsAsNPD] = useState("12");
  const [monthsAsIP, setMonthsAsIP] = useState("0");
  const [voluntaryContributions, setVoluntaryContributions] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { toast } = useToast();

  const handleTariffSelect = (type: 'base' | 'max') => {
    setIsInfoOpen(true);
    // setIsPricingOpen(false); // Optional: keep pricing open or close it? User didn't specify, but usually one modal replaces another or stacks. Let's keep pricing open behind or close it. Let's close it to focus on info.
    // Actually, stacking might be better if they want to go back, but standard is close.
    // Let's close pricing for now to avoid z-index hell, or better yet, maybe the user wants just a message.
    // "А при выборе любового тарифа при нажатии на кнопки выводить такое сообщение" -> implies a new view/modal.
  };

  const calculateExperience = () => {
    const npd = parseInt(monthsAsNPD) || 0;
    const ip = parseInt(monthsAsIP) || 0;

    // НПД не дает стаж автоматически
    const npdExperience = voluntaryContributions ? npd : 0;
    // ИП на УСН дает стаж автоматически при уплате взносов
    const ipExperience = ip;

    const totalMonths = npdExperience + ipExperience;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return { years, months, totalMonths };
  };

  const experience = calculateExperience();
  const pensionEligibilityYears = 15; // Минимальный стаж для пенсии
  const progressPercent = Math.min((experience.totalMonths / (pensionEligibilityYears * 12)) * 100, 100);

  const exampleTimeline: TimelineEvent[] = [
    { year: 2024, status: "student", label: "Студент 3 курса", pensionContribution: false },
    { year: 2026, status: "npd", label: "НПД + учеба", pensionContribution: false },
    { year: 2026, status: "npd", label: "НПД с взносами", pensionContribution: true },
    { year: 2027, status: "ip", label: "ИП УСН 6%", pensionContribution: true },
    { year: 2028, status: "ooo", label: "ООО + сотрудники", pensionContribution: true },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "student": return "bg-muted text-muted-foreground";
      case "npd": return "bg-green-500/20 text-green-700 border-green-500/30";
      case "ip": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "ooo": return "bg-purple-500/20 text-purple-700 border-purple-500/30";
      default: return "bg-muted";
    }
  };

  return (
    <section className="border-b py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">
            <GraduationCap className="mr-1 h-3 w-3" />
            Для студентов
          </Badge>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-experience-title">
            Трудовой стаж и будущая пенсия
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-experience-subtitle">
            Разбираемся как самозанятость и ИП влияют на пенсионные накопления
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Калькулятор стажа */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Калькулятор трудового стажа
              </CardTitle>
              <CardDescription>
                Посчитайте сколько стажа накопится для пенсии
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="npd-months">Количество месяцев как НПД</Label>
                  <Input
                    id="npd-months"
                    type="number"
                    min="0"
                    value={monthsAsNPD}
                    onChange={(e) => setMonthsAsNPD(e.target.value)}
                    data-testid="input-npd-months"
                  />
                  <p className="text-xs text-muted-foreground">
                    НПД не платит обязательные взносы в пенсионный фонд
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ip-months">Количество месяцев как ИП</Label>
                  <Input
                    id="ip-months"
                    type="number"
                    min="0"
                    value={monthsAsIP}
                    onChange={(e) => setMonthsAsIP(e.target.value)}
                    data-testid="input-ip-months"
                  />
                  <p className="text-xs text-muted-foreground">
                    ИП платит обязательные взносы → стаж идёт автоматически
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Checkbox
                    id="voluntary"
                    checked={voluntaryContributions}
                    onCheckedChange={(checked) => setVoluntaryContributions(checked === true)}
                    data-testid="checkbox-voluntary"
                  />
                  <Label htmlFor="voluntary" className="cursor-pointer text-sm" data-testid="label-voluntary">
                    Плачу добровольные взносы как НПД (СФР)
                  </Label>
                </div>
              </div>

              <div className="space-y-3 rounded-lg border bg-accent/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Накоплено стажа:</span>
                  <span className="text-2xl font-bold" data-testid="text-experience-total">
                    {experience.years} {experience.years === 1 ? "год" : "лет"} {experience.months} мес
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" data-testid="progress-experience" />
                <p className="text-xs text-muted-foreground" data-testid="text-progress-percent">
                  Прогресс: {Math.round(progressPercent)}% из 15 лет для минимальной пенсии
                </p>
              </div>

              {experience.totalMonths === 0 && (
                <div className="flex gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />
                  <p className="text-amber-900 dark:text-amber-200">
                    Без уплаты взносов стаж не накапливается
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Информационная карточка */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Как накапливается стаж
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="npd" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="npd" data-testid="tab-npd-experience">
                    НПД
                  </TabsTrigger>
                  <TabsTrigger value="ip" data-testid="tab-ip-experience">
                    ИП
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="npd" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                      <div>
                        <p className="font-medium">По умолчанию стаж НЕ идёт</p>
                        <p className="text-sm text-muted-foreground">
                          НПД освобождены от обязательных взносов в СФР
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                      <div>
                        <p className="font-medium">Можно платить добровольно</p>
                        <p className="text-sm text-muted-foreground">
                          71 525,52 ₽ за 2026 год = 1 год стажа
                        </p>
                      </div>
                    </div>

                    <div className="rounded-md border bg-muted/50 p-4">
                      <p className="mb-2 text-sm font-medium">Что даёт добровольная уплата:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✓ Трудовой стаж для пенсии</li>
                        <li>✓ Пенсионные баллы</li>
                        <li>✗ Больничные (нужен отдельный взнос в ФСС)</li>
                      </ul>
                    </div>

                    <Button onClick={() => setIsPricingOpen(true)} variant="outline" className="w-full gap-2 border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-300">
                      <ShieldCheck className="h-4 w-4" />
                      Новые больничные 2026
                    </Button>

                    <SubscriptionDialog
                      open={isPricingOpen}
                      onOpenChange={setIsPricingOpen}
                      plans={[
                        {
                          name: "БАЗОВЫЙ",
                          price: "1344",
                          yearlyPrice: "16128",
                          period: "в месяц",
                          features: [
                            "Страховая сумма: 35 000 ₽",
                            "Стаж 6-12 мес: 70% выплаты",
                            "Стаж 12+ мес: 100% выплаты",
                            "Период ожидания: 6 месяцев",
                            "Не включает декретные выплаты"
                          ],
                          description: "Взнос ~1344 ₽/мес",
                          buttonText: "Выбрать базовый",
                          isPopular: false,
                          type: 'base',
                          onClick: (plan) => {
                            if (plan.type) handleTariffSelect(plan.type);
                          }
                        },
                        {
                          name: "МАКСИМУМ",
                          price: "1920",
                          yearlyPrice: "23040",
                          period: "в месяц",
                          features: [
                            "Страховая сумма: 50 000 ₽",
                            "Стаж 6-12 мес: 70% выплаты",
                            "Стаж 12+ мес: 100% выплаты",
                            "Период ожидания: 6 месяцев",
                            "Не включает декретные выплаты"
                          ],
                          description: "Взнос ~1920 ₽/мес",
                          buttonText: "Выбрать максимум",
                          isPopular: true,
                          type: 'max',
                          onClick: (plan) => {
                            if (plan.type) handleTariffSelect(plan.type);
                          }
                        }
                      ] as PricingPlan[]}
                      title="Страхование на случай болезни (2026)"
                      description={`С 2026 года самозанятые могут добровольно страховаться в СФР.\nПраво на выплаты появляется через 6 месяцев непрерывной уплаты взносов.\nОформить можно в приложении «Мой налог» (эксперимент до 2028 года).`}
                      hideToggle={true}
                    />

                    <InfoDialog
                      open={isInfoOpen}
                      onOpenChange={setIsInfoOpen}
                      title="Условия получения больничных для самозанятых"
                    >
                      <p className="text-muted-foreground leading-relaxed">
                        Самозанятые могут получать оплачиваемый больничный, подключившись к эксперименту через приложение «Мой налог» (до 30.09.2027), выбрав страховую базу (35 000 или 50 000 руб.) и регулярно уплачивая 3,84% взносы, что дает право на пособие (от 70% до 100%) после 6 месяцев стажа; оформление происходит через электронный больничный, а заявление подается в СФР через «Мой налог» или Госуслуги.
                      </p>

                      <div className="space-y-4">
                        <div className="space-y-3">
                          <h4 className="font-bold text-lg flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">1</span>
                            Как подключиться (с 2026 года)
                          </h4>
                          <ul className="space-y-2 ml-9">
                            <li className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Подать заявление:</span> Через приложение «Мой налог», портал Госуслуг или в МФЦ до 30 сентября 2027 года.</li>
                            <li className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Выбрать страховую базу:</span> 35 000 руб. (взнос 1344 руб./мес.) или 50 000 руб. (взнос 1920 руб./мес.).</li>
                            <li className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Уплачивать взносы:</span> Ежемесячно или единовременно за год.</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-bold text-lg flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">2</span>
                            Условия получения
                          </h4>
                          <ul className="space-y-2 ml-9">
                            <li className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Стаж:</span> Непрерывная уплата взносов не менее 6 месяцев.</li>
                            <li className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Процесс:</span> Оформить электронный больничный лист у врача.</li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-bold text-lg flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm">3</span>
                            Размер пособия
                          </h4>
                          <ul className="space-y-2 ml-9">
                            <li className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">До 12 месяцев стажа:</span> 70% от выбранной страховой суммы.</li>
                            <li className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">От 12 месяцев стажа:</span> 100% от выбранной страховой суммы.</li>
                          </ul>
                        </div>

                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                          <h4 className="font-bold text-primary mb-1">💡 Бонус за участие</h4>
                          <p className="text-sm text-muted-foreground">
                            За длительное участие в программе без выплат (18 и 24 месяца) предусмотрено снижение взноса на 10% и 30% соответственно.
                          </p>
                        </div>
                      </div>
                    </InfoDialog>
                  </div>
                </TabsContent>

                <TabsContent value="ip" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                      <div>
                        <p className="font-medium">Стаж идёт автоматически</p>
                        <p className="text-sm text-muted-foreground">
                          ИП платит обязательные страховые взносы
                        </p>
                      </div>
                    </div>

                    <div className="rounded-md border bg-green-500/10 p-4">
                      <p className="mb-2 text-sm font-medium text-green-900 dark:text-green-100">
                        Фиксированные взносы в 2026:
                      </p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span>Пенсионное (СФР):</span>
                          <span className="font-mono font-semibold">36 723 ₽</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Медицинское (ФФОМС):</span>
                          <span className="font-mono font-semibold">9 119 ₽</span>
                        </li>
                        <li className="flex justify-between border-t pt-1">
                          <span className="font-medium">Итого:</span>
                          <span className="font-mono font-semibold">71 525,52 ₽/год</span>
                        </li>
                      </ul>
                      <p className="mt-2 text-xs text-muted-foreground">
                        + 1% от дохода свыше 300 000 ₽/год
                      </p>
                    </div>

                    <div className="rounded-md border bg-muted/50 p-4">
                      <p className="mb-2 text-sm font-medium">Что включено:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✓ Трудовой стаж</li>
                        <li>✓ Пенсионные баллы</li>
                        <li>✓ Медицинское страхование</li>
                        <li>✗ Больничные (добровольно через ФСС)</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Timeline визуализация */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Типичная траектория студента
            </CardTitle>
            <CardDescription>
              Пример развития от учёбы к собственному бизнесу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 h-full w-0.5 bg-border" />

              <div className="space-y-6">
                {exampleTimeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className={`relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-4 border-background ${event.pensionContribution ? "bg-green-500" : "bg-muted"
                      }`}>
                      <span className="text-sm font-bold text-white">
                        {event.year}
                      </span>
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(event.status)}>
                          {event.label}
                        </Badge>
                        {event.pensionContribution && (
                          <Badge variant="outline" className="bg-green-500/20 text-green-700">
                            <Shield className="mr-1 h-3 w-3" />
                            Стаж +1 год
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.status === "student" && "Учеба в университете, подработки без оформления"}
                        {event.status === "npd" && !event.pensionContribution && "Фриланс на НПД, стаж не копится"}
                        {event.status === "npd" && event.pensionContribution && "Добровольные взносы в СФР = стаж идёт"}
                        {event.status === "ip" && "Обязательные взносы, полный трудовой стаж"}
                        {event.status === "ooo" && "Директор ООО, зарплата + взносы = максимальный стаж"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-lg border bg-accent/10 p-4">
              <p className="text-sm font-medium">💡 Совет для студентов:</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Если планируете работать на себя долго — начните платить добровольные взносы уже с НПД.
                Каждый год стажа приближает к пенсии и увеличивает её размер. В 2026 году минимум 71 525,52 ₽
                даёт полный год стажа.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

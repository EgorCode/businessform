import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, PiggyBank, Calculator, TrendingUp, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface InsuranceOption {
  type: "pension" | "medical";
  title: string;
  description: string;
  cost2024: number;
  benefits: string[];
  required: boolean;
}

export default function SocialInsuranceGuide() {
  const [monthlyIncome, setMonthlyIncome] = useState("80000");
  const [pensionYears, setPensionYears] = useState("5");
  
  const calculateVoluntaryContributions = () => {
    const income = parseFloat(monthlyIncome) || 0;
    const annualIncome = income * 12;
    
    // Фиксированные взносы 2024
    const fixedPensionSFR = 36723;
    const fixedMedicalFFOMS = 9119;
    const total = fixedPensionSFR + fixedMedicalFFOMS;
    
    // Дополнительный 1% с дохода свыше 300к
    const additional1Percent = annualIncome > 300000 
      ? (annualIncome - 300000) * 0.01 
      : 0;
    
    // ФСС для больничных (добровольно)
    const voluntaryFSS = 5652; // ~471 в месяц
    
    return {
      pensionFixed: fixedPensionSFR,
      medicalFixed: fixedMedicalFFOMS,
      additional: additional1Percent,
      totalMandatory: total + additional1Percent,
      fss: voluntaryFSS,
      totalWithFSS: total + additional1Percent + voluntaryFSS,
      monthlyMandatory: (total + additional1Percent) / 12,
      monthlyWithFSS: (total + additional1Percent + voluntaryFSS) / 12,
    };
  };

  const calculatePensionProjection = () => {
    const years = parseFloat(pensionYears) || 0;
    const contributions = calculateVoluntaryContributions();
    
    // Упрощённый расчёт пенсионных баллов
    // 1 балл ≈ 134.69 ₽ в месяц в 2024
    const ballsPerYear = contributions.pensionFixed / 12000; // Примерно
    const totalBalls = ballsPerYear * years;
    const monthlyPensionBonus = totalBalls * 134.69;
    
    return {
      years,
      totalBalls: Math.round(totalBalls * 10) / 10,
      monthlyBonus: Math.round(monthlyPensionBonus),
      totalContributed: Math.round(contributions.pensionFixed * years)
    };
  };

  const contributions = calculateVoluntaryContributions();
  const pensionProjection = calculatePensionProjection();

  const insuranceOptions: InsuranceOption[] = [
    {
      type: "pension",
      title: "Пенсионное (СФР)",
      description: "Обязательные взносы для трудового стажа и будущей пенсии",
      cost2024: 36723,
      benefits: [
        "1 год трудового стажа",
        "Пенсионные баллы для расчёта пенсии",
        "Требуется для минимального стажа (15 лет)",
        "Увеличивает размер будущей пенсии"
      ],
      required: true
    },
    {
      type: "medical",
      title: "Медицинское (ФФОМС)",
      description: "Обязательное медицинское страхование",
      cost2024: 9119,
      benefits: [
        "Полис ОМС действителен",
        "Бесплатное медобслуживание в гос. клиниках",
        "Обязательно для всех ИП",
        "Входит в фиксированный платёж"
      ],
      required: true
    }
  ];

  return (
    <section className="border-b bg-gradient-to-br from-background via-blue-500/5 to-background py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 bg-blue-500/10">
            <Heart className="mr-1 h-3 w-3" />
            Социальная защита
          </Badge>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-insurance-title">
            Социальные взносы и страхование
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-insurance-subtitle">
            Разбираемся с пенсией, больничными и медицинским страхованием для НПД и ИП
          </p>
        </div>

        <Tabs defaultValue="calculator" className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2" data-testid="tabs-insurance">
            <TabsTrigger value="calculator" data-testid="tab-insurance-calculator">
              <Calculator className="mr-2 h-4 w-4" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="info" data-testid="tab-insurance-info">
              <Info className="mr-2 h-4 w-4" />
              Подробнее
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-8">
            {/* Калькулятор взносов */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Калькулятор взносов для ИП
                </CardTitle>
                <CardDescription>
                  Рассчитайте обязательные и добровольные страховые взносы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="monthly-income">Ваш месячный доход (₽)</Label>
                    <Input
                      id="monthly-income"
                      type="number"
                      min="0"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      data-testid="input-monthly-income"
                    />
                    <p className="text-xs text-muted-foreground">
                      Годовой доход: {(parseFloat(monthlyIncome) * 12).toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border bg-accent/10 p-6">
                  <h3 className="font-semibold">Обязательные взносы в 2024:</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm">Пенсионное (СФР):</span>
                      <span className="font-mono font-semibold">36 723 ₽</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-sm">Медицинское (ФФОМС):</span>
                      <span className="font-mono font-semibold">9 119 ₽</span>
                    </div>
                    {contributions.additional > 0 && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-sm">Доп. 1% с дохода &gt; 300К:</span>
                        <span className="font-mono font-semibold">
                          {Math.round(contributions.additional).toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 text-lg font-bold">
                      <span>Итого в год:</span>
                      <span className="font-mono text-primary" data-testid="text-total-mandatory">
                        {Math.round(contributions.totalMandatory).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>В месяц:</span>
                      <span className="font-mono">
                        ~{Math.round(contributions.monthlyMandatory).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-6">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Добровольное страхование (ФСС):</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Больничные и декретные:</span>
                      <span className="font-mono font-semibold">5 652 ₽/год</span>
                    </div>
                    <div className="rounded-md bg-background/50 p-3 text-sm">
                      <p className="mb-2 font-medium">Что даёт:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>✓ Больничный лист (100% среднего заработка)</li>
                        <li>✓ Декретные выплаты</li>
                        <li>✓ Выплаты по уходу за ребёнком</li>
                        <li>✓ Начинает действовать через год после уплаты</li>
                      </ul>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-sm">
                      <span>В месяц:</span>
                      <span className="font-mono">~471 ₽</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Всего с больничными:</span>
                    <span className="font-mono text-primary">
                      {Math.round(contributions.totalWithFSS).toLocaleString('ru-RU')} ₽/год
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    ~{Math.round(contributions.monthlyWithFSS).toLocaleString('ru-RU')} ₽ в месяц
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Прогноз пенсии */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-primary" />
                  Прогноз будущей пенсии
                </CardTitle>
                <CardDescription>
                  Посчитайте примерную прибавку к пенсии от взносов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pension-years">Сколько лет планируете работать как ИП?</Label>
                  <Input
                    id="pension-years"
                    type="number"
                    min="1"
                    max="40"
                    value={pensionYears}
                    onChange={(e) => setPensionYears(e.target.value)}
                    data-testid="input-pension-years"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border bg-accent/10 p-4">
                    <div className="mb-1 text-sm text-muted-foreground">Стаж</div>
                    <div className="text-2xl font-bold" data-testid="text-pension-years">
                      {pensionProjection.years} лет
                    </div>
                  </div>
                  <div className="rounded-lg border bg-accent/10 p-4">
                    <div className="mb-1 text-sm text-muted-foreground">Пенс. баллов</div>
                    <div className="text-2xl font-bold" data-testid="text-pension-points">
                      {pensionProjection.totalBalls}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-primary/10 p-4">
                    <div className="mb-1 text-sm text-muted-foreground">Прибавка к пенсии</div>
                    <div className="text-2xl font-bold text-primary" data-testid="text-pension-bonus">
                      +{pensionProjection.monthlyBonus.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-xs text-muted-foreground">в месяц</div>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/50 p-4 text-sm">
                  <p className="font-medium">Всего вложено в пенсию:</p>
                  <p className="mt-1 font-mono text-lg font-bold">
                    {pensionProjection.totalContributed.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Расчёт приблизительный. Реальная пенсия зависит от многих факторов: 
                    индексации, стоимости балла, общего стажа работы.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-8">
            {/* Сравнение НПД и ИП */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>НПД (Самозанятый)</CardTitle>
                  <CardDescription>Минимальные обязательства</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                    <div>
                      <p className="font-medium">Взносы НЕ обязательны</p>
                      <p className="text-sm text-muted-foreground">
                        Платите только налог 4-6%, без страховых взносов
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md border bg-muted/50 p-4">
                    <p className="mb-2 text-sm font-medium">Что получаете по умолчанию:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>✗ Нет трудового стажа</li>
                      <li>✗ Нет пенсионных накоплений</li>
                      <li>✗ Нет больничных</li>
                      <li>✓ ОМС действует (базовое мед. обслуживание)</li>
                    </ul>
                  </div>

                  <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4">
                    <p className="mb-2 text-sm font-medium text-green-900 dark:text-green-100">
                      Можно платить добровольно:
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>• СФР (пенсия): 45 842 ₽/год</li>
                      <li>• ФСС (больничные): 5 652 ₽/год</li>
                      <li className="pt-2 text-xs text-muted-foreground">
                        Итого: ~4 291 ₽/месяц за полный пакет
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>ИП (Индивидуальный предприниматель)</CardTitle>
                  <CardDescription>Полная социальная защита</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <div>
                      <p className="font-medium">Взносы обязательны</p>
                      <p className="text-sm text-muted-foreground">
                        Фиксированный платёж вне зависимости от дохода
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md border bg-green-500/10 p-4">
                    <p className="mb-2 text-sm font-medium text-green-900 dark:text-green-100">
                      Обязательные взносы 2024:
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
                        <span className="font-mono font-semibold">45 842 ₽/год</span>
                      </li>
                      <li className="pt-2 text-xs text-muted-foreground">
                        + 1% от дохода свыше 300 000 ₽/год
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-md border bg-muted/50 p-4">
                    <p className="mb-2 text-sm font-medium">Что получаете:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>✓ Трудовой стаж (каждый год)</li>
                      <li>✓ Пенсионные баллы</li>
                      <li>✓ ОМС (полное медобслуживание)</li>
                      <li>• Больничные — за доп. взнос в ФСС</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Важная информация */}
            <Card className="border-2 border-blue-500/30 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Стратегия для начинающих
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Начинайте с НПД</p>
                      <p className="text-muted-foreground">
                        Пока доход нестабильный (&lt; 100К/мес) — работайте как НПД. 
                        Платите только 4-6% налог без страховых взносов.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Платите добровольно в СФР</p>
                      <p className="text-muted-foreground">
                        Если уверены в доходах — начните копить стаж. 
                        45 842 ₽/год = 1 год стажа. Можно платить частями.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Переходите на ИП при росте</p>
                      <p className="text-muted-foreground">
                        Когда доход стабильно &gt; 200К/мес или нужны сотрудники — 
                        открывайте ИП. Взносы станут обязательными, но УСН 6% выгоднее НПД.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Добавьте ФСС при необходимости</p>
                      <p className="text-muted-foreground">
                        Планируете детей или часто болеете? Подключите добровольное 
                        страхование ФСС (5 652 ₽/год) для больничных и декретных.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Важно помнить
                  </p>
                  <p className="mt-2 text-sm">
                    Без уплаты взносов в СФР у вас не будет трудового стажа. 
                    Для получения страховой пенсии в России нужен минимум 15 лет стажа 
                    и 30 пенсионных баллов. Каждый год работы без взносов — потерянный стаж.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

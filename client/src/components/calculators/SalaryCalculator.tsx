import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export default function SalaryCalculator() {
  const [grossSalary, setGrossSalary] = useState("");
  const [region, setRegion] = useState("default");
  const [isMsp, setIsMsp] = useState(true); // По умолчанию считаем, что это малый бизнес
  const [results, setResults] = useState<{
    ndfl: number;
    pension: number;
    medical: number;
    social: number;
    totalContributions: number;
    netSalary: number;
    totalCost: number;
    effectiveNdflRate: number;
  } | null>(null);

  const calculateSalary = () => {
    const salary = parseFloat(grossSalary);
    if (!salary || salary <= 0) return;

    // МРОТ 2026 (прогнозный, для расчета взносов МСП)
    const MROT_2026 = 25435;

    // --- 1. Расчет НДФЛ (Прогрессивная шкала 2025+) ---
    // Считаем годовой доход для определения ставки, затем делим налог на 12
    const annualIncome = salary * 12;
    let annualNdfl = 0;

    if (annualIncome <= 2400000) {
      annualNdfl = annualIncome * 0.13;
    } else if (annualIncome <= 5000000) {
      annualNdfl = 2400000 * 0.13 + (annualIncome - 2400000) * 0.15;
    } else if (annualIncome <= 20000000) {
      annualNdfl = 2400000 * 0.13 + (5000000 - 2400000) * 0.15 + (annualIncome - 5000000) * 0.18;
    } else if (annualIncome <= 50000000) {
      annualNdfl = 2400000 * 0.13 + (5000000 - 2400000) * 0.15 + (20000000 - 5000000) * 0.18 + (annualIncome - 20000000) * 0.20;
    } else {
      annualNdfl = 2400000 * 0.13 + (5000000 - 2400000) * 0.15 + (20000000 - 5000000) * 0.18 + (50000000 - 20000000) * 0.20 + (annualIncome - 50000000) * 0.22;
    }

    const ndfl = annualNdfl / 12;

    // --- 2. Расчет Страховых взносов ---
    let totalContributions = 0;
    let pension = 0;
    let medical = 0;
    let social = 0;

    if (isMsp && salary > MROT_2026) {
      // Льготный тариф МСП (15% с превышения МРОТ)
      const basePart = MROT_2026;
      const excessPart = salary - MROT_2026;

      // С МРОТ платим по общей ставке 30%
      const baseContributions = basePart * 0.30;

      // С превышения платим 15%
      const excessContributions = excessPart * 0.15;

      totalContributions = baseContributions + excessContributions;

      // Приблизительная разбивка для визуализации (пропорционально)
      // В реальности сейчас единый тариф, но для пользователя привычнее видеть структуру
      // Общий тариф: 30% (ПФР~22, ОМС~5.1, ФСС~2.9)
      // Льготный: 15% (ПФР~10, ОМС~5, ФСС~0)

      const pensBase = basePart * 0.22;
      const medBase = basePart * 0.051;
      const socBase = basePart * 0.029;

      const pensExcess = excessPart * 0.10; // 10%
      const medExcess = excessPart * 0.05;  // 5%
      const socExcess = 0;                  // 0%

      pension = pensBase + pensExcess;
      medical = medBase + medExcess;
      social = socBase + socExcess;

    } else {
      // Стандартный тариф 30% (без учета предельной базы для простоты, т.к. она 2.2 млн)
      // Если зарплата очень большая (> 200к), нужно учитывать предельную базу (15.1% свыше).
      // Предельная база 2025 = 2 759 000 руб/год (~230к/мес). На 2026 еще выше (~3 млн).
      // Добавим простую проверку предельной базы (пусть 3 млн на 2026)
      const limitBase2026 = 3000000;
      const monthlyLimit = limitBase2026 / 12;

      if (salary > monthlyLimit) {
        const basePart = monthlyLimit;
        const excessPart = salary - monthlyLimit;
        totalContributions = (basePart * 0.30) + (excessPart * 0.151);
      } else {
        totalContributions = salary * 0.30;
      }

      // Грубая разбивка
      pension = totalContributions * (22 / 30);
      medical = totalContributions * (5.1 / 30);
      social = totalContributions * (2.9 / 30);
    }

    const netSalary = salary - ndfl;
    const totalCost = salary + totalContributions;
    const effectiveNdflRate = (ndfl / salary) * 100;

    setResults({
      ndfl,
      pension,
      medical,
      social,
      totalContributions,
      netSalary,
      totalCost,
      effectiveNdflRate
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercent = (num: number) => {
    return num.toFixed(1) + '%';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Расчет зарплаты сотрудника (2026)</CardTitle>
          <CardDescription>
            Рассчитайте НДФЛ по новой прогрессивной шкале и взносы с учетом льгот МСП
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gross-salary">Полная зарплата (гросс), ₽</Label>
              <Input
                id="gross-salary"
                type="number"
                placeholder="100000"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
              />
            </div>
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-2">
                <Checkbox id="msp" checked={isMsp} onCheckedChange={(checked) => setIsMsp(checked as boolean)} />
                <label
                  htmlFor="msp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Малое/среднее предприятие (МСП)
                  <span className="block text-xs text-muted-foreground mt-1 font-normal">
                    Взносы 15% с суммы выше МРОТ (вместо 30%)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <Button onClick={calculateSalary} className="w-full">
            Рассчитать
          </Button>

          {results && (
            <Tabs defaultValue="employee" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="employee">Сотрудник</TabsTrigger>
                <TabsTrigger value="employer">Работодатель</TabsTrigger>
              </TabsList>

              <TabsContent value="employee" className="mt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Зарплата до вычета НДФЛ</span>
                      <Badge variant="outline">Гросс</Badge>
                    </div>
                    <div className="text-2xl font-mono font-semibold">
                      {formatNumber(parseFloat(grossSalary))}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-red-50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        НДФЛ
                        {results.effectiveNdflRate > 13.1 && (
                          <span className="ml-2 text-xs bg-red-100 px-2 py-0.5 rounded text-red-700">Прогрессивная шкала</span>
                        )}
                      </span>
                      <Badge variant="destructive">
                        ~{formatPercent(results.effectiveNdflRate)}
                      </Badge>
                    </div>
                    <div className="text-2xl font-mono font-semibold text-red-600">
                      -{formatNumber(results.ndfl)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      С 2025 года: 13% до 2.4 млн, 15% до 5 млн, 18% до 20 млн...
                    </div>
                  </div>

                  <div className="rounded-lg border bg-green-50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Зарплата на руки</span>
                      <Badge variant="default">Net</Badge>
                    </div>
                    <div className="text-3xl font-mono font-semibold text-green-600">
                      {formatNumber(results.netSalary)}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="employer" className="mt-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="text-sm text-muted-foreground mb-2">Пенсионные (~{isMsp ? '10-22' : '22'}%)</div>
                      <div className="text-xl font-mono font-semibold">
                        {formatNumber(results.pension)}
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="text-sm text-muted-foreground mb-2">Медицинские (~{isMsp ? '5' : '5.1'}%)</div>
                      <div className="text-xl font-mono font-semibold">
                        {formatNumber(results.medical)}
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="text-sm text-muted-foreground mb-2">Социальные (~{isMsp ? '0-2.9' : '2.9'}%)</div>
                      <div className="text-xl font-mono font-semibold">
                        {formatNumber(results.social)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-blue-50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Страховые взносы</span>
                        {isMsp && <Badge variant="secondary" className="text-xs">Льгота МСП</Badge>}
                      </div>
                      <span className="font-mono text-blue-700 font-medium">
                        {formatPercent((results.totalContributions / parseFloat(grossSalary)) * 100)} от ФОТ
                      </span>
                    </div>
                    <div className="text-2xl font-mono font-semibold text-blue-600">
                      {formatNumber(results.totalContributions)}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-orange-50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Общая стоимость для компании</span>
                      <Badge variant="outline">Всего</Badge>
                    </div>
                    <div className="text-3xl font-mono font-semibold text-orange-600">
                      {formatNumber(results.totalCost)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Сумма ФОТ и взносов
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
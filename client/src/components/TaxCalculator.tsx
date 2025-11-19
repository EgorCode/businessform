import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function TaxCalculator() {
  const [npdIncome, setNpdIncome] = useState("");
  const [npdResult, setNpdResult] = useState<number | null>(null);
  
  const [usnIncome, setUsnIncome] = useState("");
  const [usnExpenses, setUsnExpenses] = useState("");
  const [usnResult, setUsnResult] = useState<{ tax6: number; tax15: number } | null>(null);

  const calculateNPD = () => {
    const income = parseFloat(npdIncome);
    if (!income) return;
    
    // Simplified NPD calculation (4% for individuals, 6% for legal entities)
    const tax = income * 0.04;
    setNpdResult(tax);
    console.log('NPD calculated:', { income, tax });
  };

  const calculateUSN = () => {
    const income = parseFloat(usnIncome);
    const expenses = parseFloat(usnExpenses) || 0;
    if (!income) return;

    const tax6 = income * 0.06;
    const tax15 = Math.max((income - expenses) * 0.15, 0);
    
    setUsnResult({ tax6, tax15 });
    console.log('USN calculated:', { income, expenses, tax6, tax15 });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section id="calculators" className="border-b py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-calculator-title">
            Калькуляторы налогов
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-calculator-subtitle">
            Рассчитайте налоговую нагрузку для разных форм бизнеса
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="npd" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="npd" data-testid="tab-npd">НПД (Самозанятый)</TabsTrigger>
              <TabsTrigger value="usn" data-testid="tab-usn">УСН (ИП/ООО)</TabsTrigger>
            </TabsList>

            <TabsContent value="npd" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Калькулятор НПД</CardTitle>
                  <CardDescription>
                    Рассчитайте налог для самозанятых (4% при работе с физлицами, 6% с юрлицами)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="npd-income">Месячный доход, ₽</Label>
                    <Input
                      id="npd-income"
                      type="number"
                      placeholder="100000"
                      value={npdIncome}
                      onChange={(e) => setNpdIncome(e.target.value)}
                      data-testid="input-npd-income"
                    />
                  </div>

                  <Button onClick={calculateNPD} className="w-full" data-testid="button-calculate-npd">
                    Рассчитать
                  </Button>

                  {npdResult !== null && (
                    <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Налог (4%)</span>
                        <Badge variant="secondary">НПД</Badge>
                      </div>
                      <div className="text-3xl font-mono font-semibold" data-testid="text-npd-result">
                        {formatNumber(npdResult)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Доход после налога: {formatNumber(parseFloat(npdIncome) - npdResult)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usn" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Калькулятор УСН</CardTitle>
                  <CardDescription>
                    Сравните налог по ставке 6% (доходы) и 15% (доходы минус расходы)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="usn-income">Годовой доход, ₽</Label>
                    <Input
                      id="usn-income"
                      type="number"
                      placeholder="5000000"
                      value={usnIncome}
                      onChange={(e) => setUsnIncome(e.target.value)}
                      data-testid="input-usn-income"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usn-expenses">Годовые расходы, ₽ (для УСН 15%)</Label>
                    <Input
                      id="usn-expenses"
                      type="number"
                      placeholder="3000000"
                      value={usnExpenses}
                      onChange={(e) => setUsnExpenses(e.target.value)}
                      data-testid="input-usn-expenses"
                    />
                  </div>

                  <Button onClick={calculateUSN} className="w-full" data-testid="button-calculate-usn">
                    Рассчитать
                  </Button>

                  {usnResult !== null && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">УСН 6%</span>
                          <Badge variant="outline">Доходы</Badge>
                        </div>
                        <div className="text-2xl font-mono font-semibold" data-testid="text-usn-6-result">
                          {formatNumber(usnResult.tax6)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          6% от дохода
                        </div>
                      </div>

                      <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">УСН 15%</span>
                          <Badge variant="outline">Доходы - Расходы</Badge>
                        </div>
                        <div className="text-2xl font-mono font-semibold" data-testid="text-usn-15-result">
                          {formatNumber(usnResult.tax15)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          15% от прибыли
                        </div>
                      </div>

                      <div className="col-span-full rounded-lg bg-primary/10 p-4 text-center">
                        <p className="text-sm font-medium">
                          {usnResult.tax6 < usnResult.tax15 
                            ? "УСН 6% выгоднее в вашем случае" 
                            : "УСН 15% выгоднее в вашем случае"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Экономия: {formatNumber(Math.abs(usnResult.tax6 - usnResult.tax15))}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

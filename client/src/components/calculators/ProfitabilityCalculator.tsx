import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

export default function ProfitabilityCalculator() {
  const [revenue, setRevenue] = useState("");
  const [expenses, setExpenses] = useState("");
  const [assets, setAssets] = useState("");
  const [equity, setEquity] = useState("");
  const [results, setResults] = useState<{
    profit: number;
    profitability: number;
    roa: number;
    roe: number;
    expenseRatio: number;
  } | null>(null);

  const calculateProfitability = () => {
    const rev = parseFloat(revenue);
    const exp = parseFloat(expenses) || 0;
    const ass = parseFloat(assets) || 0;
    const eq = parseFloat(equity) || 0;

    if (!rev || rev <= 0) return;

    const profit = rev - exp;
    const profitability = rev > 0 ? (profit / rev) * 100 : 0;
    const roa = ass > 0 ? (profit / ass) * 100 : 0;
    const roe = eq > 0 ? (profit / eq) * 100 : 0;
    const expenseRatio = rev > 0 ? (exp / rev) * 100 : 0;

    setResults({
      profit,
      profitability,
      roa,
      roe,
      expenseRatio
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
    return `${num.toFixed(2)}%`;
  };

  const getProfitabilityColor = (value: number) => {
    if (value >= 20) return "text-green-600";
    if (value >= 10) return "text-yellow-600";
    if (value >= 0) return "text-orange-600";
    return "text-red-600";
  };

  const getProfitabilityBadge = (value: number) => {
    if (value >= 20) return { variant: "default" as const, text: "Отлично" };
    if (value >= 10) return { variant: "secondary" as const, text: "Хорошо" };
    if (value >= 0) return { variant: "outline" as const, text: "Нормально" };
    return { variant: "destructive" as const, text: "Убыточно" };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Калькулятор рентабельности бизнеса</CardTitle>
          <CardDescription>
            Рассчитайте ключевые финансовые показатели вашего бизнеса
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="revenue">Выручка, ₽</Label>
              <Input
                id="revenue"
                type="number"
                placeholder="1000000"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenses">Расходы, ₽</Label>
              <Input
                id="expenses"
                type="number"
                placeholder="800000"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assets">Активы, ₽</Label>
              <Input
                id="assets"
                type="number"
                placeholder="5000000"
                value={assets}
                onChange={(e) => setAssets(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equity">Собственный капитал, ₽</Label>
              <Input
                id="equity"
                type="number"
                placeholder="2000000"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={calculateProfitability} className="w-full">
            Рассчитать показатели
          </Button>

          {results && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="profitability">Рентабельность</TabsTrigger>
                <TabsTrigger value="analysis">Анализ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border bg-muted/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Прибыль</span>
                      <div className="flex items-center">
                        {results.profit >= 0 ? 
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" /> : 
                          <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        }
                        <Badge variant={results.profit >= 0 ? "default" : "destructive"}>
                          {results.profit >= 0 ? "Прибыль" : "Убыток"}
                        </Badge>
                      </div>
                    </div>
                    <div className={`text-2xl font-mono font-semibold ${results.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatNumber(results.profit)}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Рентабельность продаж</span>
                      <Badge variant={getProfitabilityBadge(results.profitability).variant}>
                        {getProfitabilityBadge(results.profitability).text}
                      </Badge>
                    </div>
                    <div className={`text-2xl font-mono font-semibold ${getProfitabilityColor(results.profitability)}`}>
                      {formatPercent(results.profitability)}
                    </div>
                    <Progress value={Math.min(Math.max(results.profitability, 0), 100)} className="mt-2" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="profitability" className="mt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">ROA (Рентабельность активов)</span>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        <Badge variant="outline">Эффективность</Badge>
                      </div>
                    </div>
                    <div className={`text-2xl font-mono font-semibold ${getProfitabilityColor(results.roa)}`}>
                      {formatPercent(results.roa)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Насколько эффективно используются активы для получения прибыли
                    </div>
                    <Progress value={Math.min(Math.max(results.roa, 0), 100)} className="mt-2" />
                  </div>

                  <div className="rounded-lg border bg-muted/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">ROE (Рентабельность капитала)</span>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <Badge variant="outline">Инвестиции</Badge>
                      </div>
                    </div>
                    <div className={`text-2xl font-mono font-semibold ${getProfitabilityColor(results.roe)}`}>
                      {formatPercent(results.roe)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Доходность вложенного собственного капитала
                    </div>
                    <Progress value={Math.min(Math.max(results.roe, 0), 100)} className="mt-2" />
                  </div>

                  <div className="rounded-lg border bg-muted/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Доля расходов в выручке</span>
                      <Badge variant="secondary">Структура</Badge>
                    </div>
                    <div className="text-2xl font-mono font-semibold">
                      {formatPercent(results.expenseRatio)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Чем ниже этот показатель, тем эффективнее бизнес
                    </div>
                    <Progress value={Math.min(results.expenseRatio, 100)} className="mt-2" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-blue-50 p-6">
                    <h3 className="font-semibold mb-3">Рекомендации по улучшению</h3>
                    <ul className="space-y-2 text-sm">
                      {results.profitability < 10 && (
                        <li>• Рассмотрите возможность оптимизации расходов для повышения рентабельности</li>
                      )}
                      {results.expenseRatio > 80 && (
                        <li>• Высокая доля расходов. Проанализируйте структуру затрат и найдите возможности для сокращения</li>
                      )}
                      {results.roa < 5 && (
                        <li>• Низкая рентабельность активов. Рассмотрите более эффективное использование ресурсов</li>
                      )}
                      {results.roe < 15 && (
                        <li>• ROE ниже рыночного уровня. Возможно, стоит пересмотреть инвестиционную стратегию</li>
                      )}
                      {results.profitability >= 20 && (
                        <li>• Отличные показатели! Поддерживайте текущий уровень эффективности</li>
                      )}
                    </ul>
                  </div>

                  <div className="rounded-lg border bg-green-50 p-6">
                    <h3 className="font-semibold mb-3">Бенчмарки отрасли</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Рентабельность продаж (хорошо):</span>
                        <span className="font-medium">10-20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Рентабельность продаж (отлично):</span>
                        <span className="font-medium">{'>'}20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROA (хорошо):</span>
                        <span className="font-medium">5-10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROE (хорошо):</span>
                        <span className="font-medium">15-20%</span>
                      </div>
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
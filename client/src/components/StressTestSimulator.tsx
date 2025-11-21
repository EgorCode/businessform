import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { useState } from "react";

interface Recommendation {
  form: string;
  confidence: number;
  taxBurden: number;
  reasons: string[];
  warnings: string[];
}

export default function StressTestSimulator() {
  const [revenue, setRevenue] = useState([500000]); // Monthly revenue in rubles
  const [employees, setEmployees] = useState([0]);
  const [partners, setPartners] = useState([1]);
  const [expenses, setExpenses] = useState([200000]); // Monthly expenses
  const [recommendation, setRecommendation] = useState<Recommendation>({
    form: "ИП УСН 6%",
    confidence: 90,
    taxBurden: 30000,
    reasons: ["Оптимальная ставка: УСН 6%", "Возможность найма сотрудников", "Простая регистрация и отчётность"],
    warnings: [],
  });

  const getRecommendation = async (): Promise<Recommendation | null> => {
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyRevenue: revenue[0],
          monthlyExpenses: expenses[0],
          employees: employees[0],
          partners: partners[0],
        }),
      });
      const data = await response.json();
      const rec = data.recommendation;
      
      return {
        form: rec.form,
        confidence: rec.confidence,
        taxBurden: revenue[0] * 0.06, // Simplified for display
        reasons: rec.reasons,
        warnings: [],
      };
    } catch (error) {
      console.error('Simulation error:', error);
      return null;
    }
  };

  const updateRecommendation = async () => {
    const result = await getRecommendation();
    if (result) setRecommendation(result);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getComplexityScore = () => {
    if (recommendation.form.startsWith("НПД")) return 1;
    if (recommendation.form.startsWith("ИП")) return 4;
    return 7;
  };

  const complexityScore = getComplexityScore();

  return (
    <section className="border-b bg-gradient-to-br from-background via-primary/5 to-background py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">
            <TrendingUp className="mr-1 h-3 w-3" />
            Live Stress Test
          </Badge>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-stress-test-title">
            Интерактивный симулятор выбора формы
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-stress-test-subtitle">
            Настройте параметры бизнеса и получите рекомендацию в реальном времени
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="backdrop-blur-sm bg-card/50">
            <CardHeader>
              <CardTitle>Параметры вашего бизнеса</CardTitle>
              <CardDescription>
                Двигайте слайдеры, чтобы увидеть, как меняется рекомендация
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="revenue-slider">Месячный доход</Label>
                  <span className="font-mono text-sm font-semibold" data-testid="text-revenue-value">
                    {formatCurrency(revenue[0])}
                  </span>
                </div>
                <Slider
                  id="revenue-slider"
                  min={0}
                  max={5000000}
                  step={50000}
                  value={revenue}
                  onValueChange={(val) => {
                    setRevenue(val);
                    updateRecommendation();
                  }}
                  data-testid="slider-revenue"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 ₽</span>
                  <span>5M ₽</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="expenses-slider">Месячные расходы</Label>
                  <span className="font-mono text-sm font-semibold" data-testid="text-expenses-value">
                    {formatCurrency(expenses[0])}
                  </span>
                </div>
                <Slider
                  id="expenses-slider"
                  min={0}
                  max={Math.min(revenue[0], 4000000)}
                  step={50000}
                  value={expenses}
                  onValueChange={setExpenses}
                  data-testid="slider-expenses"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 ₽</span>
                  <span>{formatCurrency(Math.min(revenue[0], 4000000))}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="employees-slider">Количество сотрудников</Label>
                  <span className="font-mono text-sm font-semibold" data-testid="text-employees-value">
                    {employees[0]}
                  </span>
                </div>
                <Slider
                  id="employees-slider"
                  min={0}
                  max={50}
                  step={1}
                  value={employees}
                  onValueChange={(val) => {
                    setEmployees(val);
                    updateRecommendation();
                  }}
                  data-testid="slider-employees"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>50</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="partners-slider">Количество учредителей</Label>
                  <span className="font-mono text-sm font-semibold" data-testid="text-partners-value">
                    {partners[0]}
                  </span>
                </div>
                <Slider
                  id="partners-slider"
                  min={1}
                  max={10}
                  step={1}
                  value={partners}
                  onValueChange={setPartners}
                  data-testid="slider-partners"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Рекомендация</CardTitle>
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {recommendation.confidence}% уверенность
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-2 text-sm text-muted-foreground">
                    Оптимальная форма для ваших параметров:
                  </div>
                  <div className="text-4xl font-bold text-primary" data-testid="text-recommendation-form">
                    {recommendation.form}
                  </div>
                </div>

                <div className="rounded-lg bg-background/50 p-4">
                  <div className="mb-2 text-sm font-medium">Налоговая нагрузка</div>
                  <div className="text-3xl font-mono font-bold mb-1" data-testid="text-tax-burden">
                    {formatCurrency(recommendation.taxBurden)}<span className="text-base text-muted-foreground">/мес</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(recommendation.taxBurden * 12)} в год
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Почему эта форма:</div>
                  <ul className="space-y-2">
                    {recommendation.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {recommendation.warnings.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Важно учесть:</div>
                    <ul className="space-y-2">
                      {recommendation.warnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-amber-600">
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Сложность ведения</span>
                    <span className="text-sm text-muted-foreground">{complexityScore}/10</span>
                  </div>
                  <Progress value={complexityScore * 10} />
                  <div className="text-xs text-muted-foreground">
                    {complexityScore <= 3 && "Очень простое ведение и отчётность"}
                    {complexityScore > 3 && complexityScore <= 6 && "Умеренная сложность, 1-2 декларации в год"}
                    {complexityScore > 6 && "Требуется помощь бухгалтера"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

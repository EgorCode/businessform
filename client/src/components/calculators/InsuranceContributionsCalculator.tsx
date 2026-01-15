import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, AlertCircle } from "lucide-react";

export default function InsuranceContributionsCalculator() {
  const [businessType, setBusinessType] = useState("ip");
  const [income, setIncome] = useState("");
  const [employees, setEmployees] = useState("0");
  const [results, setResults] = useState<{
    pensionFixed: number;
    medicalFixed: number;
    totalFixed: number;
    pensionVariable: number;
    medicalVariable: number;
    socialVariable: number;
    totalVariable: number;
    totalContributions: number;
    effectiveRate: number;
  } | null>(null);

  const calculateContributions = () => {
    const inc = parseFloat(income) || 0;
    const emp = parseInt(employees) || 0;
    
    if (!inc || inc <= 0) return;

    // Фиксированные взносы для ИП на 2024 год
    const pensionFixed = 49500; // Фиксированная часть пенсионных взносов
    const medicalFixed = 11730; // Фиксированная часть медицинских взносов
    const totalFixed = pensionFixed + medicalFixed;

    // Переменные взносы (1% с дохода свыше 300000)
    const additionalIncome = Math.max(0, inc - 300000);
    const pensionVariable = additionalIncome * 0.01;

    // Если есть сотрудники
    let socialVariable = 0;
    let employeeContributions = 0;
    
    if (emp > 0) {
      // Расчет для сотрудников (примерная средняя зарплата)
      const avgSalary = Math.min(inc / emp / 12, 100000); // Ограничим для примера
      const monthlyPension = avgSalary * 0.22;
      const monthlyMedical = avgSalary * 0.051;
      const monthlySocial = avgSalary * 0.029;
      
      socialVariable = (monthlyPension + monthlyMedical + monthlySocial) * emp * 12;
      employeeContributions = socialVariable;
    }

    const totalVariable = pensionVariable + employeeContributions;
    const totalContributions = totalFixed + totalVariable;
    const effectiveRate = inc > 0 ? (totalContributions / inc) * 100 : 0;

    setResults({
      pensionFixed,
      medicalFixed,
      totalFixed,
      pensionVariable,
      medicalVariable: 0, // Для ИП нет переменной части медицинских взносов
      socialVariable: employeeContributions,
      totalVariable,
      totalContributions,
      effectiveRate
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Калькулятор страховых взносов</CardTitle>
          <CardDescription>
            Расчет страховых взносов для ИП и самозанятых
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="business-type">Форма бизнеса</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите форму" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ip">Индивидуальный предприниматель</SelectItem>
                  <SelectItem value="selfemployed">Самозанятый (НПД)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="income">Годовой доход, ₽</Label>
              <Input
                id="income"
                type="number"
                placeholder="1000000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">Количество сотрудников</Label>
              <Input
                id="employees"
                type="number"
                placeholder="0"
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={calculateContributions} className="w-full">
            Рассчитать взносы
          </Button>

          {results && (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Итоги</TabsTrigger>
                <TabsTrigger value="fixed">Фиксированные</TabsTrigger>
                <TabsTrigger value="variable">Переменные</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-blue-50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Общая сумма взносов</span>
                      <Badge variant="default">Год</Badge>
                    </div>
                    <div className="text-3xl font-mono font-semibold text-blue-600">
                      {formatNumber(results.totalContributions)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Эффективная ставка: {formatPercent(results.effectiveRate)}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border bg-muted/50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Фиксированные взносы</span>
                        <Badge variant="outline">Обязательно</Badge>
                      </div>
                      <div className="text-2xl font-mono font-semibold">
                        {formatNumber(results.totalFixed)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Даже при нулевом доходе
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Переменные взносы</span>
                        <Badge variant="outline">С дохода</Badge>
                      </div>
                      <div className="text-2xl font-mono font-semibold">
                        {formatNumber(results.totalVariable)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Зависят от дохода и сотрудников
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fixed" className="mt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-orange-50 p-6">
                    <div className="flex items-center mb-4">
                      <Shield className="h-5 w-5 text-orange-600 mr-2" />
                      <h3 className="font-semibold">Фиксированные страховые взносы ИП</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Обязательные ежегодные взносы для всех ИП независимо от дохода
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm">Пенсионные взносы (30%)</span>
                        <span className="font-mono font-semibold">{formatNumber(results.pensionFixed)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded border">
                        <span className="text-sm">Медицинские взносы (8.4%)</span>
                        <span className="font-mono font-semibold">{formatNumber(results.medicalFixed)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-100 rounded border border-orange-200">
                        <span className="font-medium">Итого фиксированных взносов</span>
                        <span className="font-mono font-semibold text-orange-600">{formatNumber(results.totalFixed)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-blue-50 p-6">
                    <div className="flex items-center mb-4">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-semibold">Сроки уплаты</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• До 31 декабря текущего года</li>
                      <li>• Можно разбить на квартальные платежи</li>
                      <li>• При доходе до 300000 ₽ платятся только фиксированные взносы</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="variable" className="mt-6">
                <div className="space-y-4">
                  {results.pensionVariable > 0 && (
                    <div className="rounded-lg border bg-green-50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Дополнительные пенсионные взносы (1%)</span>
                        <Badge variant="secondary">С дохода {'>'}300000₽</Badge>
                      </div>
                      <div className="text-2xl font-mono font-semibold text-green-600">
                        {formatNumber(results.pensionVariable)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        С дохода сверх 300 000 ₽
                      </div>
                    </div>
                  )}

                  {results.socialVariable > 0 && (
                    <div className="rounded-lg border bg-purple-50 p-6">
                      <div className="flex items-center mb-4">
                        <User className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="font-semibold">Взносы за сотрудников</h3>
                      </div>
                      <div className="text-2xl font-mono font-semibold text-purple-600">
                        {formatNumber(results.socialVariable)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Общие взносы за {employees} сотрудника(ов)
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Пенсионные (22%):</span>
                          <span>{formatNumber(results.socialVariable * 0.22 / 0.3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Медицинские (5.1%):</span>
                          <span>{formatNumber(results.socialVariable * 0.051 / 0.3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Социальные (2.9%):</span>
                          <span>{formatNumber(results.socialVariable * 0.029 / 0.3)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border bg-yellow-50 p-6">
                    <div className="flex items-center mb-4">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      <h3 className="font-semibold">Важно знать</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• Самозанятые не платят страховые взносы</li>
                      <li>• ИП без сотрудников платят только за себя</li>
                      <li>• При наличии сотрудников взносы платятся и за ИП, и за сотрудников</li>
                      <li>• Взносы уменьшают налог УСН "Доходы" (но не более 50% от суммы налога)</li>
                    </ul>
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SalaryCalculator() {
  const [grossSalary, setGrossSalary] = useState("");
  const [region, setRegion] = useState("default");
  const [results, setResults] = useState<{
    ndfl: number;
    pension: number;
    medical: number;
    social: number;
    totalContributions: number;
    netSalary: number;
    totalCost: number;
  } | null>(null);

  const calculateSalary = () => {
    const salary = parseFloat(grossSalary);
    if (!salary || salary <= 0) return;

    // НДФЛ 13%
    const ndfl = salary * 0.13;
    
    // Страховые взносы (платит работодатель)
    const pension = salary * 0.22; // Пенсионные
    const medical = salary * 0.051; // Медицинские
    const social = salary * 0.029; // Социальные
    
    const totalContributions = pension + medical + social;
    const netSalary = salary - ndfl;
    const totalCost = salary + totalContributions;

    setResults({
      ndfl,
      pension,
      medical,
      social,
      totalContributions,
      netSalary,
      totalCost
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Расчет зарплаты сотрудника</CardTitle>
          <CardDescription>
            Рассчитайте сумму к выплате на руки и страховые взносы работодателя
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
            <div className="space-y-2">
              <Label htmlFor="region">Регион</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Обычный регион</SelectItem>
                  <SelectItem value="far_north">Крайний Север</SelectItem>
                  <SelectItem value="moscow">Москва</SelectItem>
                  <SelectItem value="petersburg">Санкт-Петербург</SelectItem>
                </SelectContent>
              </Select>
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
                      <span className="text-sm text-muted-foreground">НДФЛ (13%)</span>
                      <Badge variant="destructive">Налог</Badge>
                    </div>
                    <div className="text-2xl font-mono font-semibold text-red-600">
                      -{formatNumber(results.ndfl)}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-green-50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Зарплата на руки</span>
                      <Badge variant="default">Нет</Badge>
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
                      <div className="text-sm text-muted-foreground mb-2">Пенсионные (22%)</div>
                      <div className="text-xl font-mono font-semibold">
                        {formatNumber(results.pension)}
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="text-sm text-muted-foreground mb-2">Медицинские (5.1%)</div>
                      <div className="text-xl font-mono font-semibold">
                        {formatNumber(results.medical)}
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="text-sm text-muted-foreground mb-2">Социальные (2.9%)</div>
                      <div className="text-xl font-mono font-semibold">
                        {formatNumber(results.social)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-blue-50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Общие страховые взносы</span>
                      <Badge variant="secondary">30%</Badge>
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
                      Переплата: {formatNumber(results.totalCost - parseFloat(grossSalary))}
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
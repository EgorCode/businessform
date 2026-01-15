import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Building, User, CreditCard } from "lucide-react";

interface AdditionalService {
  id: string;
  name: string;
  cost: number;
  description: string;
}

export default function RegistrationCostCalculator() {
  const [businessType, setBusinessType] = useState("ip");
  const [taxSystem, setTaxSystem] = useState("usn");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [results, setResults] = useState<{
    baseCost: number;
    additionalCost: number;
    totalCost: number;
    breakdown: {
      stateFee: number;
      notary: number;
      legalAddress: number;
      accounting: number;
      bankAccount: number;
      other: number;
    };
  } | null>(null);

  const additionalServices: AdditionalService[] = [
    {
      id: "legalAddress",
      name: "Юридический адрес",
      cost: 10000,
      description: "Адрес для регистрации на 1 год"
    },
    {
      id: "accounting",
      name: "Бухгалтерское обслуживание",
      cost: 15000,
      description: "Базовый пакет на 1 месяц"
    },
    {
      id: "bankAccount",
      name: "Помощь с открытием счета",
      cost: 3000,
      description: "Сопровождение открытия расчетного счета"
    },
    {
      id: "notary",
      name: "Нотариальные услуги",
      cost: 5000,
      description: "Заверение документов для регистрации"
    },
    {
      id: "stamp",
      name: "Изготовление печати",
      cost: 1500,
      description: "Печать для ООО (необязательно)"
    },
    {
      id: "consultation",
      name: "Юридическая консультация",
      cost: 5000,
      description: "Консультация по выбору формы бизнеса"
    }
  ];

  const calculateCost = () => {
    let stateFee = 0;
    let notaryCost = 0;
    let legalAddressCost = 0;
    let accountingCost = 0;
    let bankAccountCost = 0;
    let otherCost = 0;

    // Базовая стоимость в зависимости от формы бизнеса
    if (businessType === "ip") {
      stateFee = 800; // Госпошлина за регистрацию ИП
      notaryCost = selectedServices.includes("notary") ? 5000 : 0;
    } else if (businessType === "ooo") {
      stateFee = 4000; // Госпошлина за регистрацию ООО
      notaryCost = selectedServices.includes("notary") ? 5000 : 0;
      otherCost = selectedServices.includes("stamp") ? 1500 : 0;
    }

    // Дополнительные услуги
    legalAddressCost = selectedServices.includes("legalAddress") ? 10000 : 0;
    accountingCost = selectedServices.includes("accounting") ? 15000 : 0;
    bankAccountCost = selectedServices.includes("bankAccount") ? 3000 : 0;
    otherCost += selectedServices.includes("consultation") ? 5000 : 0;

    const baseCost = stateFee + notaryCost;
    const additionalCost = legalAddressCost + accountingCost + bankAccountCost + otherCost;
    const totalCost = baseCost + additionalCost;

    setResults({
      baseCost,
      additionalCost,
      totalCost,
      breakdown: {
        stateFee,
        notary: notaryCost,
        legalAddress: legalAddressCost,
        accounting: accountingCost,
        bankAccount: bankAccountCost,
        other: otherCost
      }
    });
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
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
          <CardTitle>Калькулятор стоимости регистрации бизнеса</CardTitle>
          <CardDescription>
            Рассчитайте затраты на регистрацию и сопутствующие услуги
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="business-type">Форма бизнеса</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите форму" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ip">Индивидуальный предприниматель (ИП)</SelectItem>
                  <SelectItem value="ooo">Общество с ограниченной ответственностью (ООО)</SelectItem>
                  <SelectItem value="selfemployed">Самозанятый (НПД)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-system">Система налогообложения</Label>
              <Select value={taxSystem} onValueChange={setTaxSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите систему" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usn">УСН</SelectItem>
                  <SelectItem value="osn">ОСН</SelectItem>
                  <SelectItem value="psn">ПСН (патент)</SelectItem>
                  <SelectItem value="npd">НПД (самозанятость)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Дополнительные услуги</Label>
            <div className="grid gap-3 md:grid-cols-2">
              {additionalServices.map((service) => (
                <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={service.id} className="font-medium cursor-pointer">
                        {service.name}
                      </Label>
                      <span className="text-sm font-mono">{formatNumber(service.cost)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={calculateCost} className="w-full">
            Рассчитать стоимость
          </Button>

          {results && (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Итоги</TabsTrigger>
                <TabsTrigger value="breakdown">Детализация</TabsTrigger>
                <TabsTrigger value="timeline">Сроки</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-blue-50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Общая стоимость регистрации</span>
                      <Badge variant="default">Итого</Badge>
                    </div>
                    <div className="text-3xl font-mono font-semibold text-blue-600">
                      {formatNumber(results.totalCost)}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border bg-muted/50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Обязательные платежи</span>
                        <Badge variant="outline">Гос. пошлина</Badge>
                      </div>
                      <div className="text-2xl font-mono font-semibold">
                        {formatNumber(results.baseCost)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Госпошлина и нотариус
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Дополнительные услуги</span>
                        <Badge variant="outline">По выбору</Badge>
                      </div>
                      <div className="text-2xl font-mono font-semibold">
                        {formatNumber(results.additionalCost)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {selectedServices.length} услуг(и) выбрано
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="breakdown" className="mt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/50 p-6">
                    <h3 className="font-semibold mb-4">Структура расходов</h3>
                    <div className="space-y-3">
                      {results.breakdown.stateFee > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="text-sm">Госпошлина за регистрацию</span>
                          </div>
                          <span className="font-mono font-semibold">{formatNumber(results.breakdown.stateFee)}</span>
                        </div>
                      )}
                      
                      {results.breakdown.notary > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-purple-600" />
                            <span className="text-sm">Нотариальные услуги</span>
                          </div>
                          <span className="font-mono font-semibold">{formatNumber(results.breakdown.notary)}</span>
                        </div>
                      )}
                      
                      {results.breakdown.legalAddress > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-sm">Юридический адрес</span>
                          </div>
                          <span className="font-mono font-semibold">{formatNumber(results.breakdown.legalAddress)}</span>
                        </div>
                      )}
                      
                      {results.breakdown.accounting > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-orange-600" />
                            <span className="text-sm">Бухгалтерское обслуживание</span>
                          </div>
                          <span className="font-mono font-semibold">{formatNumber(results.breakdown.accounting)}</span>
                        </div>
                      )}
                      
                      {results.breakdown.bankAccount > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                          <span className="text-sm">Открытие расчетного счета</span>
                          <span className="font-mono font-semibold">{formatNumber(results.breakdown.bankAccount)}</span>
                        </div>
                      )}
                      
                      {results.breakdown.other > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                          <span className="text-sm">Прочие расходы</span>
                          <span className="font-mono font-semibold">{formatNumber(results.breakdown.other)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border bg-blue-50 p-6">
                    <h3 className="font-semibold mb-4">Сроки регистрации</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Подготовка документов</span>
                        <Badge variant="outline">1-3 дня</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Подача в налоговую</span>
                        <Badge variant="outline">1 день</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Регистрация</span>
                        <Badge variant="outline">3 рабочих дня</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Получение документов</span>
                        <Badge variant="outline">1-2 дня</Badge>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-100 rounded border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">
                        Общий срок: 5-9 рабочих дней
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-green-50 p-6">
                    <h3 className="font-semibold mb-4">Экономия</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Самостоятельная регистрация экономит 10-15 тыс. ₽</li>
                      <li>• Онлайн-регистрация ИП через Госуслуги - бесплатно</li>
                      <li>• Комплексные пакеты услуг могут быть выгоднее</li>
                      <li>• Некоторые регионы предлагают льготы на госпошлину</li>
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
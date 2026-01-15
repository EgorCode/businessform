import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import ComparisonTable from "@/components/ComparisonTable";
import TaxCalculator from "@/components/TaxCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Users, FileText, Shield, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

export default function ComparisonPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageLayout>
      {/* Заголовок страницы с breadcrumbs */}
      <PageHeader 
        title="Сравнение форм бизнеса" 
        description="Подробное сравнение ООО, ИП и самозанятости. Выберите оптимальную форму для вашего бизнеса."
        breadcrumbs={[{ label: "Сравнение форм" }]}
      />

      {/* Основная секция с вкладками */}
      <PageSection size="lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 min-w-max sm:min-w-0">
              <TabsTrigger value="overview" className="whitespace-nowrap text-xs sm:text-sm">Обзор</TabsTrigger>
              <TabsTrigger value="ooo" className="whitespace-nowrap text-xs sm:text-sm">ООО</TabsTrigger>
              <TabsTrigger value="ip" className="whitespace-nowrap text-xs sm:text-sm">ИП</TabsTrigger>
              <TabsTrigger value="self-employed" className="whitespace-nowrap text-xs sm:text-sm">Самозанятый</TabsTrigger>
            </TabsList>
          </div>

          {/* Вкладка Обзор */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-8">
              <ComparisonTable />
              
              {/* Краткие характеристики каждой формы */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">ООО</Badge>
                      <CardTitle className="text-lg">Общество с ограниченной ответственностью</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Юридическое лицо, подходящее для серьезного бизнеса с партнерами и наемными сотрудниками.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Неограниченное количество сотрудников</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Ответственность уставным капиталом</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Сложная отчетность</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">ИП</Badge>
                      <CardTitle className="text-lg">Индивидуальный предприниматель</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Физическое лицо со статусом предпринимателя. Популярный выбор для малого и среднего бизнеса.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm">До 130 сотрудников</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Высокий лимит доходов</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Ответственность всем имуществом</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">НПД</Badge>
                      <CardTitle className="text-lg">Самозанятый (НПД)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Упрощенный статус для фрилансеров и малого бизнеса с минимальной бюрократией.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Минимальные налоги (4-6%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Нет отчетности</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Ограничение по доходу 2.4 млн ₽/год</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Вкладка ООО */}
          <TabsContent value="ooo" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="outline">ООО</Badge>
                      Общество с ограниченной ответственностью
                    </CardTitle>
                    <CardDescription>
                      Юридическое лицо, созданное одним или несколькими учредителями с уставным капиталом, разделенным на доли.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        Преимущества
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Ограниченная ответственность — риски только в пределах уставного капитала</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Высокий уровень доверия у крупных клиентов и партнеров</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Возможность привлекать инвестиции и выпускать акции</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Неограниченное количество наемных сотрудников</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Простая передача долей и смена учредителей</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Нет ограничений по годовому доходу</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <X className="h-5 w-5 text-red-600" />
                        Недостатки
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Сложная процедура регистрации (7-10 дней через нотариуса)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Высокие затраты на регистрацию (от 4000 ₽ + услуги)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Обязательное ведение бухгалтерии и сдача отчетности</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Требуется расчетный счет в банке</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Сложная процедура ликвидации</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Когда подходит ООО</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Планируете работать с крупными клиентами и госзаказами</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Нужна защита личного имущества от бизнес-рисков</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Планируете привлекать инвестиции</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Нанимаете более 10 сотрудников</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Годовой оборот превышает 150 млн ₽</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Налоговые режимы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 rounded-lg border">
                        <div className="font-medium">ОСНО</div>
                        <div className="text-muted-foreground">20% налог на прибыль</div>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <div className="font-medium">УСН 6%</div>
                        <div className="text-muted-foreground">6% от всех доходов</div>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <div className="font-medium">УСН 15%</div>
                        <div className="text-muted-foreground">15% от доходов минус расходы</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Вкладка ИП */}
          <TabsContent value="ip" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="outline">ИП</Badge>
                      Индивидуальный предприниматель
                    </CardTitle>
                    <CardDescription>
                      Физическое лицо, зарегистрированное для ведения предпринимательской деятельности.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        Преимущества
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Простая и быстрая регистрация (3 дня онлайн)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Низкая стоимость регистрации (800 ₽ госпошлина)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Простое ведение учета и минимальная отчетность</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Возможность работать на УСН, патенте</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Можно нанимать до 130 сотрудников</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Высокий лимит доходов (до 200 млн ₽/год на УСН)</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <X className="h-5 w-5 text-red-600" />
                        Недостатки
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Полная ответственность всем личным имуществом</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Обязательные страховые взносы (около 45 000 ₽/год)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Меньший уровень доверия у крупных клиентов</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Сложно привлекать инвестиции</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Требуется расчетный счет при доходах от 100 млн ₽</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Когда подходит ИП</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Малый и средний бизнес с доходом до 150 млн ₽/год</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Работа в сфере услуг, торговли, консалтинга</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Нужно нанять небольшое количество сотрудников</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Желание минимизировать бюрократию и отчетность</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Быстрый старт с минимальными вложениями</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Налоговые режимы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 rounded-lg border">
                        <div className="font-medium">УСН 6%</div>
                        <div className="text-muted-foreground">6% от всех доходов</div>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <div className="font-medium">УСН 15%</div>
                        <div className="text-muted-foreground">15% от доходов минус расходы</div>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <div className="font-medium">Патент</div>
                        <div className="text-muted-foreground">Фиксированный платеж за период</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Вкладка Самозанятый */}
          <TabsContent value="self-employed" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="outline">НПД</Badge>
                      Самозанятый (Налог на профессиональный доход)
                    </CardTitle>
                    <CardDescription>
                      Упрощенный налоговый режим для физических лиц, оказывающих услуги в личном порядке.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        Преимущества
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Минимальные налоговые ставки (4% с физлиц, 6% с юрлиц)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Регистрация за 1 день через мобильное приложение</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Полное отсутствие отчетности и бухгалтерии</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Нет обязательных страховых взносов</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Налог можно платить сразу после получения платежа</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Налоговые вычеты (до 10 000 ₽ в год)</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <X className="h-5 w-5 text-red-600" />
                        Недостатки
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Ограничение по доходу 2.4 млн ₽ в год</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Запрещено нанимать сотрудников по трудовому договору</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Полная ответственность личным имуществом</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Ограниченный перечень видов деятельности</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Низкий уровень доверия у крупных корпоративных клиентов</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Когда подходит самозанятость</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Фриланс, репетиторство, консалтинг</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Ремонтные, клининговые, бытовые услуги</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Доходы до 200 000 ₽ в месяц</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Работа с физическими лицами или небольшими компаниями</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Желание минимизировать налоги и бюрократию</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Налоговые ставки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 rounded-lg border">
                        <div className="font-medium">4%</div>
                        <div className="text-muted-foreground">При работе с физическими лицами</div>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <div className="font-medium">6%</div>
                        <div className="text-muted-foreground">При работе с юридическими лицами и ИП</div>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <div className="font-medium">0%</div>
                        <div className="text-muted-foreground">При доходах до 1 млн ₽/год в некоторых регионах</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PageSection>

      {/* Секция с рекомендациями по выбору формы */}
      <PageSection size="lg" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
            Как выбрать форму бизнеса?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Наши рекомендации помогут определить оптимальную форму для вашей ситуации
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Выбирайте ООО, если:</CardTitle>
            </CardHeader>
              <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Планируете работать с крупными клиентами и госзаказами</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Нужна защита личного имущества от бизнес-рисков</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Планируете привлекать инвестиции или продавать долю</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Нанимаете более 10 сотрудников</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Годовой оборот превышает 150 млн ₽</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Выбирайте ИП, если:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ваш годовой доход до 150 млн ₽</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Нужно нанять до 130 сотрудников</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Хотите баланс между простотой и возможностями</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Работаете в сфере услуг, торговли или консалтинга</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Планируете развивать бизнес до масштабов ООО</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Выбирайте самозанятость, если:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ваш годовой доход не превышает 2.4 млн ₽</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Не планируете нанимать сотрудников</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Работаете в разрешенной сфере деятельности</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Хотите минимизировать налоги и бюрократию</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Фрилансер, репетитор или предоставляете бытовые услуги</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="mx-auto">
            Пройти тест для выбора формы
          </Button>
        </div>
      </PageSection>

      {/* Секция с калькулятором налогов */}
      <PageSection size="lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
            Сравните налоговую нагрузку
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Рассчитайте налоги для разных форм бизнеса и выберите наиболее выгодный вариант
          </p>
        </div>
        <TaxCalculator />
      </PageSection>
    </PageLayout>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SubscriptionDialog, PricingPlan } from "@/components/shared/SubscriptionDialog";

export default function SocialInsuranceGuide() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleTariffSelect = (type: 'base' | 'max') => {
    setIsInfoOpen(true);
  };
  return (
    <section className="border-b py-20">
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

        <div className="space-y-8">
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

                <Button onClick={() => setIsPricingOpen(true)} variant="outline" className="w-full gap-2 hover-elevate active-elevate-2 shadow-xs active:shadow-none border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-300">
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

                <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Условия получения больничных для самозанятых</h3>
                      <p className="text-muted-foreground">
                        Самозанятые могут получать оплачиваемый больничный, подключившись к эксперименту через приложение «Мой налог» (до 30.09.2027), выбрав страховую базу (35 000 или 50 000 руб.) и регулярно уплачивая 3,84% взносы, что дает право на пособие (от 70% до 100%) после 6 месяцев стажа; оформление происходит через электронный больничный, а заявление подается в СФР через «Мой налог» или Госуслуги.
                      </p>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                          Как подключиться (с 2026 года)
                        </h4>
                        <ul className="list-disc pl-10 space-y-1 text-sm text-muted-foreground">
                          <li><span className="font-medium text-foreground">Подать заявление:</span> Через приложение «Мой налог», портал Госуслуг или в МФЦ до 30 сентября 2027 года.</li>
                          <li><span className="font-medium text-foreground">Выбрать страховую базу:</span> 35 000 руб. (взнос 1344 руб./мес.) или 50 000 руб. (взнос 1920 руб./мес.).</li>
                          <li><span className="font-medium text-foreground">Уплачивать взносы:</span> Ежемесячно или единовременно за год, начиная со следующего месяца после подачи заявления.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                          Условия получения
                        </h4>
                        <ul className="list-disc pl-10 space-y-1 text-sm text-muted-foreground">
                          <li><span className="font-medium text-foreground">Стаж:</span> Непрерывная уплата взносов не менее 6 месяцев.</li>
                          <li><span className="font-medium text-foreground">Процесс:</span> Оформить электронный больничный лист у врача.</li>
                          <li><span className="font-medium text-foreground">Заявление в СФР:</span> Подать заявление на выплату через «Мой налог» или Госуслуги в течение 6 месяцев после выздоровления.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                          Размер пособия
                        </h4>
                        <ul className="list-disc pl-10 space-y-1 text-sm text-muted-foreground">
                          <li><span className="font-medium text-foreground">До 12 месяцев стажа:</span> 70% от выбранной страховой суммы.</li>
                          <li><span className="font-medium text-foreground">От 12 месяцев стажа и более:</span> 100% от выбранной страховой суммы.</li>
                          <li><span className="font-medium text-foreground">Выплата:</span> Пособие перечисляется в течение 10 рабочих дней после закрытия больничного.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                          Бонус
                        </h4>
                        <p className="pl-10 text-sm text-muted-foreground">
                          За длительное участие в программе без выплат (18 и 24 месяца) предусмотрено снижение взноса на 10% и 30% соответственно.
                        </p>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <Button onClick={() => setIsInfoOpen(false)}>Понятно</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, CreditCard, FileCheck, ExternalLink, CheckCircle2, Clock, ArrowRight, Building2, Wallet } from "lucide-react";

interface RegistrationStep {
  number: number;
  title: string;
  description: string;
  duration: string;
  icon: any;
  substeps?: string[];
}

interface BankOption {
  name: string;
  icon: any;
  appLink: string;
  features: string[];
  recommended?: boolean;
}

export default function SelfEmploymentRegistration() {
  const registrationSteps: RegistrationStep[] = [
    {
      number: 1,
      title: "Скачайте приложение банка",
      description: "Выберите один из банков с поддержкой НПД",
      duration: "2 минуты",
      icon: Smartphone,
      substeps: [
        "Сбер, Тинькофф, Альфа или приложение 'Мой налог'",
        "Доступно для iOS и Android",
        "Бесплатная регистрация"
      ]
    },
    {
      number: 2,
      title: "Зарегистрируйтесь как самозанятый",
      description: "Потребуется паспорт и ИНН",
      duration: "5 минут",
      icon: FileCheck,
      substeps: [
        "Введите данные паспорта",
        "Подтвердите номер телефона",
        "Сделайте селфи для проверки",
        "Дождитесь одобрения (обычно мгновенно)"
      ]
    },
    {
      number: 3,
      title: "Получите первый доход",
      description: "Выставьте чек клиенту сразу после оплаты",
      duration: "1 минута",
      icon: CreditCard,
      substeps: [
        "Укажите сумму и название услуги",
        "Сформируйте чек в приложении",
        "Отправьте клиенту (email, SMS или QR)",
        "Налог спишется автоматически до 28 числа"
      ]
    }
  ];

  const banks: BankOption[] = [
    {
      name: "Сбербанк",
      icon: Building2,
      appLink: "https://www.sberbank.ru/ru/person/dist_services/selfemployed",
      features: [
        "Интеграция с СберБизнес",
        "Автоматические чеки при переводах",
        "Бесплатные push-уведомления",
        "Поддержка 24/7"
      ],
      recommended: true
    },
    {
      name: "Тинькофф",
      icon: Wallet,
      appLink: "https://www.tinkoff.ru/business/self-employed/",
      features: [
        "Кэшбэк до 30% у партнёров",
        "Бесплатная бизнес-карта",
        "Автоматический учёт доходов",
        "Справка 2-НДФЛ за 1 клик"
      ],
      recommended: true
    },
    {
      name: "Альфа-Банк",
      icon: CreditCard,
      appLink: "https://alfabank.ru/sme/self-employed/",
      features: [
        "Процент на остаток до 7%",
        "Интеграция с 1C",
        "Автовыставление чеков",
        "Консультации бухгалтера"
      ]
    },
    {
      name: "Мой налог (ФНС)",
      icon: FileCheck,
      appLink: "https://npd.nalog.ru/",
      features: [
        "Официальное приложение ФНС",
        "Без привязки к банку",
        "Полный контроль налогов",
        "Отчётность в один клик"
      ]
    }
  ];

  const importantNotes = [
    {
      title: "Кто может стать НПД",
      items: [
        "Граждане РФ старше 14 лет",
        "Иностранцы из ЕАЭС (Беларусь, Казахстан, Армения, Киргизия)",
        "Доход до 2.4М ₽ в год",
        "Без наёмных сотрудников по трудовым договорам"
      ]
    },
    {
      title: "Что нельзя на НПД",
      items: [
        "Нанимать по трудовым договорам (ГПХ можно)",
        "Перепродавать товары (кроме handmade)",
        "Добывать/продавать полезные ископаемые",
        "Работать с текущим или бывшим работодателем (до 2 лет)"
      ]
    },
    {
      title: "Налоговые ставки",
      items: [
        "4% — доходы от физлиц",
        "6% — доходы от юрлиц и ИП",
        "Автоматический расчёт налога",
        "Платёж до 28 числа следующего месяца"
      ]
    }
  ];

  return (
    <section className="border-b bg-gradient-to-br from-background via-green-500/5 to-background py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 bg-green-500/10">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Пошаговая инструкция
          </Badge>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-registration-title">
            Как оформить самозанятость
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-registration-subtitle">
            Регистрация через мобильное приложение банка — просто, быстро, бесплатно
          </p>
        </div>

        {/* Шаги регистрации */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {registrationSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} className="relative border-2 transition-all hover-elevate">
                <div className="absolute -left-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-primary text-xl font-bold text-primary-foreground">
                  {step.number}
                </div>
                <CardHeader className="pt-8">
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <Badge variant="outline" className="text-xs">
                      <Clock className="mr-1 h-3 w-3" />
                      {step.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                {step.substeps && (
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {step.substeps.map((substep, idx) => (
                        <li key={idx} className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                          <span>{substep}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Выбор банка */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Выберите банк для регистрации
            </CardTitle>
            <CardDescription>
              Все банки предлагают бесплатную регистрацию НПД и базовые функции. Выбирайте по удобству и бонусам.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {banks.map((bank) => {
              const BankIcon = bank.icon;
              return (
                <Card key={bank.name} className={`border transition-all hover-elevate ${bank.recommended ? "border-green-500/50 bg-green-500/5" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <BankIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{bank.name}</CardTitle>
                          {bank.recommended && (
                            <Badge variant="outline" className="mt-1 bg-green-500/20 text-xs text-green-700">
                              Рекомендуем
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      {bank.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={bank.recommended ? "default" : "outline"}
                      asChild
                      data-testid={`button-bank-${bank.name.toLowerCase()}`}
                    >
                      <a href={bank.appLink} target="_blank" rel="noopener noreferrer">
                        Перейти на сайт
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        {/* Важная информация */}
        <div className="grid gap-6 md:grid-cols-3">
          {importantNotes.map((note, idx) => (
            <Card key={idx} className="border">
              <CardHeader>
                <CardTitle className="text-lg">{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {note.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex gap-2">
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Призыв к действию */}
        <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <div>
              <h3 className="mb-2 text-2xl font-semibold">Готовы начать?</h3>
              <p className="text-muted-foreground">
                Регистрация занимает 10 минут. Уже завтра сможете легально принимать платежи.
              </p>
            </div>
            <Button size="lg" className="gap-2" data-testid="button-start-registration">
              Выбрать банк и зарегистрироваться
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

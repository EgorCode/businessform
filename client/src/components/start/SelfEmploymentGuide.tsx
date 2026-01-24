import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    CircleCheck,
    Smartphone,
    Clock,
    FileCheck,
    CreditCard,
    Building2,
    Wallet,
    ExternalLink,
    ArrowRight
} from "lucide-react";

export default function SelfEmploymentGuide() {
    return (
        <section id="registration-section" className="py-20 scroll-mt-[100px]">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-12 text-center">
                    <div className="whitespace-nowrap inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border border-border shadow-xs mb-4 bg-green-500/10 text-foreground">
                        <CircleCheck className="mr-1 h-3 w-3" />
                        Пошаговая инструкция
                    </div>
                    <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-registration-title">
                        Как оформить самозанятость
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-registration-subtitle">
                        Регистрация через мобильное приложение банка — просто, быстро, бесплатно
                    </p>
                </div>

                <div className="mb-12 grid gap-6 md:grid-cols-3">
                    {/* Step 1 */}
                    <Card className="rounded-xl border-2 transition-all hover-elevate bg-card/50 backdrop-blur-sm relative overflow-visible">
                        <div className="absolute -left-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-primary text-xl font-bold text-primary-foreground z-10">
                            1
                        </div>
                        <CardHeader className="pt-8">
                            <div className="mb-2 flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-primary" />
                                <div className="whitespace-nowrap inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-colors border border-border shadow-xs text-xs">
                                    <Clock className="mr-1 h-3 w-3" />
                                    2 минуты
                                </div>
                            </div>
                            <div className="font-semibold tracking-tight text-xl">Скачайте приложение банка</div>
                            <div className="text-sm text-muted-foreground">Выберите один из банков с поддержкой НПД</div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Сбер, Тинькофф, Альфа или приложение 'Мой налог'</span>
                                </li>
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Доступно для iOS и Android</span>
                                </li>
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Бесплатная регистрация</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Step 2 */}
                    <Card className="rounded-xl border-2 transition-all hover-elevate bg-card/50 backdrop-blur-sm relative overflow-visible">
                        <div className="absolute -left-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-primary text-xl font-bold text-primary-foreground z-10">
                            2
                        </div>
                        <CardHeader className="pt-8">
                            <div className="mb-2 flex items-center gap-2">
                                <FileCheck className="h-5 w-5 text-primary" />
                                <div className="whitespace-nowrap inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-colors border border-border shadow-xs text-xs">
                                    <Clock className="mr-1 h-3 w-3" />
                                    5 минут
                                </div>
                            </div>
                            <div className="font-semibold tracking-tight text-xl">Зарегистрируйтесь как самозанятый</div>
                            <div className="text-sm text-muted-foreground">Потребуется паспорт и ИНН</div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Введите данные паспорта</span>
                                </li>
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Подтвердите номер телефона</span>
                                </li>
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Сделайте селфи для проверки</span>
                                </li>
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Дождитесь одобрения (обычно мгновенно)</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Step 3 */}
                    <Card className="rounded-xl border-2 transition-all hover-elevate bg-card/50 backdrop-blur-sm relative overflow-visible">
                        <div className="absolute -left-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-primary text-xl font-bold text-primary-foreground z-10">
                            3
                        </div>
                        <CardHeader className="pt-8">
                            <div className="mb-2 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <div className="whitespace-nowrap inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-colors border border-border shadow-xs text-xs">
                                    <Clock className="mr-1 h-3 w-3" />
                                    1 минута
                                </div>
                            </div>
                            <div className="font-semibold tracking-tight text-xl">Получите первый доход</div>
                            <div className="text-sm text-muted-foreground">Выставьте чек клиенту сразу после оплаты</div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Укажите сумму и название услуги</span>
                                </li>
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Сформируйте чек в приложении</span>
                                </li>
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Отправьте клиенту (email, SMS или QR)</span>
                                </li>
                                <li className="flex gap-2">
                                    <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                    <span>Налог спишется автоматически до 28 числа</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Bank Selection */}
                <Card className="rounded-xl border border-card-border mb-12 bg-card/50 backdrop-blur-sm shadow-sm">
                    <CardHeader>
                        <div className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-primary" />
                            Выберите банк для регистрации
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Все банки предлагают бесплатную регистрацию НПД и базовые функции. Выбирайте по удобству и бонусам.
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        {/* Sberbank */}
                        <Card className="rounded-xl border transition-all hover-elevate border-green-500/50 bg-green-500/5 shadow-sm">
                            <CardHeader className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold tracking-tight text-lg">Сбербанк</div>
                                            <div className="whitespace-nowrap inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-colors border border-border shadow-xs mt-1 bg-green-500/20 text-xs text-green-700">
                                                Рекомендуем
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <ul className="space-y-2 text-sm">
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Интеграция с СберБизнес</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Автоматические чеки при переводах</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Бесплатные push-уведомления</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Поддержка 24/7</span>
                                    </li>
                                </ul>
                                <a
                                    href="https://www.sberbank.com/ru/svoedelo/start"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-9 px-4 py-2 w-full shadow-sm"
                                    data-testid="button-bank-сбербанк"
                                >
                                    Перейти на сайт
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </CardContent>
                        </Card>

                        {/* Tinkoff */}
                        <Card className="rounded-xl border transition-all hover-elevate border-green-500/50 bg-green-500/5 shadow-sm">
                            <CardHeader className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <Wallet className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold tracking-tight text-lg">Тинькофф</div>
                                            <div className="whitespace-nowrap inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-colors border border-border shadow-xs mt-1 bg-green-500/20 text-xs text-green-700">
                                                Рекомендуем
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <ul className="space-y-2 text-sm">
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Кэшбэк до 30% у партнёров</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Бесплатная бизнес-карта</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Автоматический учёт доходов</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Справка 2-НДФЛ за 1 клик</span>
                                    </li>
                                </ul>
                                <a
                                    href="https://www.tbank.ru/cards/debit-cards/tinkoff-black/selfemployed"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-9 px-4 py-2 w-full shadow-sm"
                                    data-testid="button-bank-тинькофф"
                                >
                                    Перейти на сайт
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </CardContent>
                        </Card>

                        {/* Alfa-Bank */}
                        <Card className="rounded-xl border transition-all hover-elevate border-gray-200 bg-card/50 backdrop-blur-sm shadow-sm">
                            <CardHeader className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold tracking-tight text-lg">Альфа-Банк</div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <ul className="space-y-2 text-sm">
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Процент на остаток до 7%</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Интеграция с 1C</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Автовыставление чеков</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Консультации бухгалтера</span>
                                    </li>
                                </ul>
                                <a
                                    href="https://alfabank.ru/selfemployed/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-input shadow-sm active:shadow-none min-h-9 px-4 py-2 w-full bg-background hover:bg-accent hover:text-accent-foreground"
                                    data-testid="button-bank-альфа-банк"
                                >
                                    Перейти на сайт
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </CardContent>
                        </Card>

                        {/* My Tax */}
                        <Card className="rounded-xl border transition-all hover-elevate border-gray-200 bg-card/50 backdrop-blur-sm shadow-sm">
                            <CardHeader className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <FileCheck className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="font-semibold tracking-tight text-lg">Мой налог (ФНС)</div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <ul className="space-y-2 text-sm">
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Официальное приложение ФНС</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Без привязки к банку</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Полный контроль налогов</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <CircleCheck className="h-4 w-4 flex-shrink-0 text-green-500" />
                                        <span className="text-muted-foreground">Отчётность в один клик</span>
                                    </li>
                                </ul>
                                <a
                                    href="https://npd.nalog.ru/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-input shadow-sm active:shadow-none min-h-9 px-4 py-2 w-full bg-background hover:bg-accent hover:text-accent-foreground"
                                    data-testid="button-bank-мой налог (фнс)"
                                >
                                    Перейти на сайт
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                {/* Info Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Who can be NPD */}
                    <Card className="rounded-xl border border-card-border bg-card/50 backdrop-blur-sm shadow-sm">
                        <CardHeader className="p-6">
                            <div className="font-semibold tracking-tight text-lg">Кто может стать НПД</div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <ul className="space-y-2 text-sm">
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">Граждане РФ старше 14 лет</span>
                                </li>
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">Иностранцы из ЕАЭС (Беларусь, Казахстан, Армения, Киргизия)</span>
                                </li>
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">Доход до 2.4М ₽ в год</span>
                                </li>
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">Без наёмных сотрудников по трудовым договорам</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Forbidden on NPD */}
                    <Card className="rounded-xl border border-card-border bg-card/50 backdrop-blur-sm shadow-sm">
                        <CardHeader className="p-6">
                            <div className="font-semibold tracking-tight text-lg">Что нельзя на НПД</div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <ul className="space-y-2 text-sm">
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">Нанимать по трудовым договорам (ГПХ можно)</span>
                                </li>
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">Перепродавать товары (кроме handmade)</span>
                                </li>
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">Добывать/продавать полезные ископаемые</span>
                                </li>
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">Работать с текущим или бывшим работодателем (до 2 лет)</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Tax Rates */}
                    <Card className="rounded-xl border border-card-border bg-card/50 backdrop-blur-sm shadow-sm">
                        <CardHeader className="p-6">
                            <div className="font-semibold tracking-tight text-lg">Налоговые ставки</div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <ul className="space-y-2 text-sm">
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">4% — доходы от физлиц</span>
                                </li>
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">6% — доходы от юрлиц и ИП</span>
                                </li>
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">Автоматический расчёт налога</span>
                                </li>
                                <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
                                    <span className="text-muted-foreground">Платёж до 28 числа следующего месяца</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

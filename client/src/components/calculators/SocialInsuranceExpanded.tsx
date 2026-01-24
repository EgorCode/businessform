import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, PiggyBank, Calculator } from "lucide-react";
import { useState } from "react";

export default function SocialInsuranceExpanded() {
    const [monthlyIncome, setMonthlyIncome] = useState("80000");
    const [pensionYears, setPensionYears] = useState("5");

    const calculateVoluntaryContributions = () => {
        const income = parseFloat(monthlyIncome) || 0;
        const annualIncome = income * 12;

        // Фиксированные взносы 2026 (ст. 430 НК РФ)
        const fixedContributions2026 = 57390;

        // Дополнительный 1% с дохода свыше 300к (Максимум 321 818 руб на 2026 год)
        const additionalBase = Math.max(0, annualIncome - 300000);
        let additional1Percent = additionalBase * 0.01;
        const maxAdditional = 321818;

        if (additional1Percent > maxAdditional) {
            additional1Percent = maxAdditional;
        }

        // ФСС для больничных (добровольно)
        // МРОТ 2026 (прогноз ~25 435) * 2.9% * 12
        const mrot2026 = 25435;
        const voluntaryFSS = Math.round(mrot2026 * 0.029 * 12); // ~8851

        return {
            fixedContributions: fixedContributions2026,
            additional: additional1Percent,
            totalMandatory: fixedContributions2026 + additional1Percent,
            fss: voluntaryFSS,
            totalWithFSS: fixedContributions2026 + additional1Percent + voluntaryFSS,
            monthlyMandatory: (fixedContributions2026 + additional1Percent) / 12,
            monthlyWithFSS: (fixedContributions2026 + additional1Percent + voluntaryFSS) / 12,
        };
    };

    const calculatePensionProjection = () => {
        const years = parseFloat(pensionYears) || 0;
        const contributions = calculateVoluntaryContributions();

        // Упрощённый расчёт пенсионных баллов (ИПК)
        // Максимальный взнос (фикс + доп) дает определенное кол-во баллов.
        // Приблизительная оценка: Взнос / Стоимость балла (не совсем верно, но для грубой оценки пойдет)
        // Стоимость балла 2026 прогноз ~150 руб.
        // Но лучше через страховую часть. 
        // Грубая формула: (Взносы * 16% / 22%) / Стоимость_коэффицента? 
        // Используем старую эвристику с поправкой на инфляцию: 1 балл ≈ 50-60к взносов?
        // В 2024 макс балл (10) стоит ~320к взносов. Значит 32к = 1 балл.

        const estimatedPointsPerYear = contributions.totalMandatory / 45000; // Очень грубая оценка
        const totalBalls = estimatedPointsPerYear * years;
        const costPerBall2026 = 150; // Прогноз
        const monthlyPensionBonus = totalBalls * costPerBall2026;

        return {
            years,
            totalBalls: Math.round(totalBalls * 10) / 10,
            monthlyBonus: Math.round(monthlyPensionBonus),
            totalContributed: Math.round(contributions.totalMandatory * years)
        };
    };

    const contributions = calculateVoluntaryContributions();
    const pensionProjection = calculatePensionProjection();

    return (
        <div className="space-y-8">
            <div className="mb-8">

                <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                    Калькулятор социальных взносов
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    Рассчитайте обязательные взносы, больничные и будущую пенсию для ИП.
                    Этот инструмент поможет спланировать бюджет и понять, сколько вы инвестируете в своё будущее.
                </p>
            </div>

            <div className="space-y-8">
                {/* Калькулятор взносов */}
                <Card className="border-2 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-primary" />
                            Калькулятор взносов для ИП
                        </CardTitle>
                        <CardDescription>
                            Рассчитайте обязательные и добровольные страховые взносы
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="monthly-income">Ваш месячный доход (₽)</Label>
                                <Input
                                    id="monthly-income"
                                    type="number"
                                    min="0"
                                    value={monthlyIncome}
                                    onChange={(e) => setMonthlyIncome(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Годовой доход: {(parseFloat(monthlyIncome) * 12).toLocaleString('ru-RU')} ₽
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border bg-accent/10 p-6">
                            <h3 className="font-semibold">Обязательные взносы в 2026:</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-sm">Единый фиксированный взнос:</span>
                                    <span className="font-mono font-semibold">57 390 ₽</span>
                                </div>
                                {contributions.additional > 0 && (
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-sm">Доп. 1% с дохода &gt; 300К:</span>
                                        <span className="font-mono font-semibold">
                                            {Math.round(contributions.additional).toLocaleString('ru-RU')} ₽
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 text-lg font-bold">
                                    <span>Итого в год:</span>
                                    <span className="font-mono text-primary">
                                        {Math.round(contributions.totalMandatory).toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>В месяц:</span>
                                    <span className="font-mono">
                                        ~{Math.round(contributions.monthlyMandatory).toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-6">
                            <div className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold">Добровольное страхование (ФСС):</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">Больничные и декретные:</span>
                                    <span className="font-mono font-semibold">{Math.round(contributions.fss).toLocaleString('ru-RU')} ₽/год</span>
                                </div>
                                <div className="rounded-md bg-background/50 p-3 text-sm">
                                    <p className="mb-2 font-medium">Что даёт:</p>
                                    <ul className="space-y-1 text-muted-foreground">
                                        <li>✓ Больничный лист (100% среднего заработка)</li>
                                        <li>✓ Декретные выплаты</li>
                                        <li>✓ Выплаты по уходу за ребёнком</li>
                                        <li>✓ Начинает действовать через год после уплаты</li>
                                    </ul>
                                </div>
                                <div className="flex justify-between border-t pt-2 text-sm">
                                    <span>В месяц (примерно):</span>
                                    <span className="font-mono">~{Math.round(contributions.fss / 12).toLocaleString('ru-RU')} ₽</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Всего с больничными:</span>
                                <span className="font-mono text-primary">
                                    {Math.round(contributions.totalWithFSS).toLocaleString('ru-RU')} ₽/год
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                ~{Math.round(contributions.monthlyWithFSS).toLocaleString('ru-RU')} ₽ в месяц
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Прогноз пенсии */}
                <Card className="border-2 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PiggyBank className="h-5 w-5 text-primary" />
                            Прогноз будущей пенсии
                        </CardTitle>
                        <CardDescription>
                            Посчитайте примерную прибавку к пенсии от взносов
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="pension-years">Сколько лет планируете работать как ИП?</Label>
                            <Input
                                id="pension-years"
                                type="number"
                                min="1"
                                max="40"
                                value={pensionYears}
                                onChange={(e) => setPensionYears(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg border bg-accent/10 p-4">
                                <div className="mb-1 text-sm text-muted-foreground">Стаж</div>
                                <div className="text-2xl font-bold">
                                    {pensionProjection.years} лет
                                </div>
                            </div>
                            <div className="rounded-lg border bg-accent/10 p-4">
                                <div className="mb-1 text-sm text-muted-foreground">Пенс. баллов</div>
                                <div className="text-2xl font-bold">
                                    {pensionProjection.totalBalls}
                                </div>
                            </div>
                            <div className="rounded-lg border bg-primary/10 p-4">
                                <div className="mb-1 text-sm text-muted-foreground">Прибавка к пенсии</div>
                                <div className="text-2xl font-bold text-primary">
                                    +{pensionProjection.monthlyBonus.toLocaleString('ru-RU')} ₽
                                </div>
                                <div className="text-xs text-muted-foreground">в месяц</div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-muted/50 p-4 text-sm">
                            <p className="font-medium">Всего вложено в пенсию:</p>
                            <p className="mt-1 font-mono text-lg font-bold">
                                {pensionProjection.totalContributed.toLocaleString('ru-RU')} ₽
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Расчёт приблизительный. Реальная пенсия зависит от многих факторов:
                                индексации, стоимости балла, общего стажа работы.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

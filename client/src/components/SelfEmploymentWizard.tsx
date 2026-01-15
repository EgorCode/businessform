import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Briefcase, Home, Package, ShoppingCart, HelpCircle,
    Users, User, TrendingUp, AlertTriangle,
    Building2, UserCheck, ArrowRight, ArrowLeft,
    CheckCircle2, XCircle, Sparkles, Calculator
} from "lucide-react";

export interface WizardAnswer {
    step: number;
    questionId: string;
    answerId: string;
    answerText: string;
}

export interface WizardResult {
    isEligible: boolean;
    taxRate: "4%" | "6%" | "mixed";
    clientType: string;
    recommendation: string;
    details: string[];
    nextSteps: string[];
    warning?: string;
}

interface WizardOption {
    id: string;
    label: string;
    description?: string;
    icon: any;
    disqualifies?: boolean;
    disqualifyReason?: string;
}

interface WizardStep {
    id: string;
    question: string;
    description: string;
    options: WizardOption[];
}

const wizardSteps: WizardStep[] = [
    {
        id: "activity",
        question: "Чем именно вы планируете заниматься?",
        description: "Выберите основной вид вашей деятельности",
        options: [
            {
                id: "services",
                label: "Продаю свои услуги",
                description: "Дизайн, ремонт, перевозки, консультации",
                icon: Briefcase
            },
            {
                id: "rental",
                label: "Сдаю жилье",
                description: "Посуточно или на долгий срок",
                icon: Home
            },
            {
                id: "handmade",
                label: "Продаю товары собственного производства",
                description: "Хендмейд, ремесло, творчество",
                icon: Package
            },
            {
                id: "resale",
                label: "Перепродаю чужие товары",
                description: "Закупаю оптом — продаю в розницу",
                icon: ShoppingCart,
                disqualifies: true,
                disqualifyReason: "По закону РФ перепродажа товаров не подходит для самозанятости. Для этой деятельности нужно оформить ИП."
            },
            {
                id: "other",
                label: "Другое",
                description: "Расскажите подробнее в чате",
                icon: HelpCircle
            }
        ]
    },
    {
        id: "employees",
        question: "Планируете ли вы нанимать сотрудников по трудовому договору?",
        description: "Самозанятые не могут иметь наёмных работников",
        options: [
            {
                id: "solo",
                label: "Нет, работаю один/одна",
                description: "Или привлекаю подрядчиков по ГПХ",
                icon: User
            },
            {
                id: "employees",
                label: "Да, мне нужны помощники в штат",
                description: "Хочу нанять сотрудников официально",
                icon: Users,
                disqualifies: true,
                disqualifyReason: "Самозанятые не могут нанимать сотрудников по трудовому договору. Рассмотрите оформление ИП на УСН или Патенте."
            }
        ]
    },
    {
        id: "income",
        question: "Какой примерный доход вы ожидаете в год?",
        description: "Лимит для самозанятых — 2.4 млн рублей в год",
        options: [
            {
                id: "under_limit",
                label: "До 2.4 млн рублей",
                description: "До 200 тыс. рублей в месяц",
                icon: TrendingUp
            },
            {
                id: "over_limit",
                label: "Больше 2.4 млн рублей",
                description: "Планирую зарабатывать больше",
                icon: AlertTriangle,
                disqualifies: true,
                disqualifyReason: "При доходе выше 2.4 млн рублей в год самозанятость (НПД) не подходит. Рекомендуем ИП на УСН 6%."
            }
        ]
    },
    {
        id: "clients",
        question: "Кто ваши основные клиенты?",
        description: "Это влияет на налоговую ставку: 4% для физлиц, 6% для компаний",
        options: [
            {
                id: "individuals",
                label: "Обычные люди (физлица)",
                description: "Частные клиенты, заказчики",
                icon: UserCheck
            },
            {
                id: "companies",
                label: "Компании и предприниматели",
                description: "Юридические лица и ИП",
                icon: Building2
            },
            {
                id: "both",
                label: "И те, и другие",
                description: "Работаю со всеми типами клиентов",
                icon: Users
            }
        ]
    }
];

interface SelfEmploymentWizardProps {
    onComplete?: (result: WizardResult, answers: WizardAnswer[]) => void;
    onClose?: () => void;
    isCompact?: boolean;
    className?: string;
    embedded?: boolean;
}

export default function SelfEmploymentWizard({ onComplete, onClose, isCompact = false, className, embedded = false }: SelfEmploymentWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<WizardAnswer[]>([]);
    const [disqualified, setDisqualified] = useState<{ reason: string } | null>(null);
    const [result, setResult] = useState<WizardResult | null>(null);

    const progress = ((currentStep + 1) / wizardSteps.length) * 100;
    const currentStepData = wizardSteps[currentStep];

    const handleOptionSelect = useCallback((option: WizardOption) => {
        const answer: WizardAnswer = {
            step: currentStep,
            questionId: currentStepData.id,
            answerId: option.id,
            answerText: option.label
        };

        const newAnswers = [...answers.filter(a => a.step !== currentStep), answer];
        setAnswers(newAnswers);

        // Проверяем, дисквалифицирует ли ответ
        if (option.disqualifies) {
            setDisqualified({ reason: option.disqualifyReason || "Этот вариант не подходит для самозанятости" });
            return;
        }

        // Переходим к следующему шагу или показываем результат
        if (currentStep < wizardSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Генерируем результат
            const wizardResult = generateResult(newAnswers);
            setResult(wizardResult);
            onComplete?.(wizardResult, newAnswers);
        }
    }, [currentStep, currentStepData, answers, onComplete]);

    const handleBack = () => {
        if (disqualified) {
            setDisqualified(null);
            return;
        }
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setAnswers([]);
        setDisqualified(null);
        setResult(null);
    };

    const generateResult = (finalAnswers: WizardAnswer[]): WizardResult => {
        const clientAnswer = finalAnswers.find(a => a.questionId === "clients");
        const activityAnswer = finalAnswers.find(a => a.questionId === "activity");

        let taxRate: "4%" | "6%" | "mixed" = "mixed";
        let clientType = "Физические и юридические лица";

        if (clientAnswer?.answerId === "individuals") {
            taxRate = "4%";
            clientType = "Физические лица";
        } else if (clientAnswer?.answerId === "companies") {
            taxRate = "6%";
            clientType = "Юридические лица";
        }

        const activityLabels: Record<string, string> = {
            services: "оказания услуг",
            rental: "сдачи жилья в аренду",
            handmade: "продажи товаров собственного производства",
            other: "вашей деятельности"
        };

        const activityLabel = activityLabels[activityAnswer?.answerId || "other"];

        return {
            isEligible: true,
            taxRate,
            clientType,
            recommendation: `Самозанятость (НПД) отлично подходит для ${activityLabel}!`,
            details: [
                `Налоговая ставка: ${taxRate} (${clientType.toLowerCase()})`,
                "Без обязательных страховых взносов",
                "Регистрация за 5 минут через «Мой Налог»",
                "Никакой бухгалтерской отчётности",
                "Лимит дохода: 2.4 млн ₽ в год"
            ],
            nextSteps: [
                "Скачайте приложение «Мой Налог» или используйте банковское приложение",
                "Зарегистрируйтесь как самозанятый (нужен паспорт)",
                "Начните получать доход и формировать чеки",
                "Налог списывается автоматически до 28 числа"
            ]
        };
    };

    // Экран дисквалификации
    if (disqualified) {
        const content = (
            <>
                <div className={`${isCompact ? "pb-2" : "pb-4"} text-center`}>
                    <div className={`flex justify-center ${isCompact ? "mb-2" : "mb-4"}`}>
                        <div className={`flex ${isCompact ? "h-10 w-10" : "h-16 w-16"} items-center justify-center rounded-full bg-orange-100`}>
                            <AlertTriangle className={`${isCompact ? "h-5 w-5" : "h-8 w-8"} text-orange-600`} />
                        </div>
                    </div>
                    <h3 className={`${isCompact ? "text-lg" : "text-xl"} font-semibold`}>Самозанятость не подходит</h3>
                    <p className={`text-slate-500 ${isCompact ? "text-xs mt-1" : "text-base mt-2"}`}>
                        {disqualified.reason}
                    </p>
                </div>
                <div className={`${isCompact ? "space-y-3" : "space-y-4"}`}>
                    <div className={`rounded-lg bg-blue-50 border border-blue-200 ${isCompact ? "p-3" : "p-4"}`}>
                        <div className="flex items-start gap-3">
                            <Building2 className={`${isCompact ? "h-4 w-4" : "h-5 w-5"} text-blue-600 flex-shrink-0 mt-0.5`} />
                            <div>
                                <div className={`font-medium text-blue-800 ${isCompact ? "text-xs" : "mb-1"}`}>Альтернатива: ИП на УСН</div>
                                <p className={`${isCompact ? "text-[10px]" : "text-sm"} text-blue-700`}>
                                    Индивидуальный предприниматель подходит для вашей ситуации.
                                    Налог 6%, возможность нанять сотрудников.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleBack} className={`flex-1 ${isCompact ? "h-8 text-xs" : ""}`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Назад
                        </Button>
                        <Button variant="outline" onClick={handleReset} className={`flex-1 ${isCompact ? "h-8 text-xs" : ""}`}>
                            Заново
                        </Button>
                    </div>

                    <Button
                        className={`w-full gap-2 ${isCompact ? "h-9 text-xs" : ""}`}
                        onClick={() => window.location.href = '/comparison?form=ip'}
                    >
                        Подробнее об ИП
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </>
        );

        if (isCompact) return <div className="p-0">{content}</div>;

        return (
            <Card className="w-full max-w-lg mx-auto">
                <CardContent className="pt-6">
                    {content}
                </CardContent>
            </Card>
        );
    }

    // Экран результата
    if (result) {
        const content = (
            <>
                <div className={`${isCompact ? "pb-2" : "pb-4"} text-center`}>
                    <div className={`flex justify-center ${isCompact ? "mb-2" : "mb-4"}`}>
                        <div className={`flex ${isCompact ? "h-10 w-10" : "h-16 w-16"} items-center justify-center rounded-full bg-green-100`}>
                            <CheckCircle2 className={`${isCompact ? "h-5 w-5" : "h-8 w-8"} text-green-600`} />
                        </div>
                    </div>
                    {!isCompact && (
                        <Badge className="mx-auto mb-3 bg-green-500 text-white">
                            Налог {result.taxRate}
                        </Badge>
                    )}
                    <h3 className={`${isCompact ? "text-lg" : "text-xl"} font-semibold`}>
                        {isCompact ? `Налог ${result.taxRate}` : result.recommendation}
                    </h3>
                </div>
                <div className={`${isCompact ? "space-y-3" : "space-y-4"}`}>
                    {/* Преимущества */}
                    <div className={`${isCompact ? "space-y-1" : "space-y-2"}`}>
                        {result.details.slice(0, isCompact ? 3 : 5).map((detail, idx) => (
                            <div key={idx} className={`flex items-center gap-2 ${isCompact ? "text-xs" : "text-sm"}`}>
                                <CheckCircle2 className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-green-500 flex-shrink-0`} />
                                <span>{detail}</span>
                            </div>
                        ))}
                    </div>

                    {/* Следующие шаги */}
                    <div className={`rounded-lg bg-primary/5 border border-primary/20 ${isCompact ? "p-3" : "p-4"}`}>
                        <div className={`flex items-center gap-2 ${isCompact ? "mb-1" : "mb-3"}`}>
                            <Sparkles className={`${isCompact ? "h-3 w-3" : "h-5 w-5"} text-primary`} />
                            <span className={`font-medium ${isCompact ? "text-xs" : ""}`}>Как начать?</span>
                        </div>
                        <div className={`${isCompact ? "space-y-1" : "space-y-2"}`}>
                            {result.nextSteps.slice(0, isCompact ? 2 : 4).map((step, idx) => (
                                <div key={idx} className={`flex gap-2 ${isCompact ? "text-[10px]" : "text-sm"}`}>
                                    <div className={`flex ${isCompact ? "h-4 w-4" : "h-5 w-5"} items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex-shrink-0`}>
                                        {idx + 1}
                                    </div>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleReset} className={`flex-1 ${isCompact ? "h-8 text-xs" : ""}`}>
                            Заново
                        </Button>
                        <Button
                            className={`flex-1 gap-2 ${isCompact ? "h-8 text-xs" : ""}`}
                            onClick={() => window.location.href = '/start?form=self-employed'}
                        >
                            Регистрация
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </>
        );

        if (isCompact) return <div className="p-0">{content}</div>;

        return (
            <Card className="w-full max-w-lg mx-auto">
                <CardContent className="pt-6">
                    {content}
                </CardContent>
            </Card>
        );
    }

    // Основной экран с вопросами
    const wizardContent = (
        <>
            <div className={`${isCompact ? "mb-1.5" : "mb-6"}`}>
                <div className="flex items-center justify-between mb-0.5">
                    <Badge variant="outline" className={isCompact ? "text-[9px] px-1 h-4 border-none opacity-70" : ""}>
                        {currentStep + 1}/{wizardSteps.length}
                    </Badge>
                </div>
                <Progress value={progress} className={`${isCompact ? "h-1" : "h-2"} mb-1.5`} />
                <h3 className={`font-semibold ${isCompact ? "text-[13px] leading-tight" : "text-lg"}`}>{currentStepData.question}</h3>
                {!isCompact && <p className="text-slate-500 text-sm mt-1">{currentStepData.description}</p>}
            </div>

            <div className={`${isCompact ? "space-y-1" : "space-y-3"}`}>
                {currentStepData.options.map((option) => {
                    const Icon = option.icon;
                    const isSelected = answers.find(a => a.step === currentStep)?.answerId === option.id;

                    return (
                        <Button
                            key={option.id}
                            variant={isSelected ? "default" : "outline"}
                            className={`w-full h-auto ${isCompact ? "py-1 px-2" : "p-4"} justify-start text-left ${option.disqualifies ? "border-orange-200 hover:border-orange-300" : ""
                                }`}
                            onClick={() => handleOptionSelect(option)}
                            data-testid={`wizard-option-${option.id}`}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <div className={`flex ${isCompact ? "h-5 w-5" : "h-10 w-10"} items-center justify-center rounded flex-shrink-0 ${isSelected ? "bg-primary-foreground/20" : "bg-muted"
                                    }`}>
                                    <Icon className={isCompact ? "h-3 w-3" : "h-5 w-5"} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`font-medium ${isCompact ? "text-[11px] leading-tight" : ""}`}>{option.label}</div>
                                </div>
                            </div>
                        </Button>
                    );
                })}

                {currentStep > 0 && (
                    <Button variant="ghost" onClick={handleBack} className={`w-full ${isCompact ? "h-6 text-[9px] mt-0" : "mt-4"}`}>
                        <ArrowLeft className="h-2.5 w-2.5 mr-1" />
                        Назад
                    </Button>
                )}
            </div>
        </>
    );

    const content = isCompact ? wizardContent : embedded ? (
        <div className={`h-full flex flex-col overflow-hidden ${className || ''}`}>
            <div className="pb-2 flex-shrink-0 px-4 pt-4">
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Шаг {currentStep + 1} из {wizardSteps.length}</Badge>
                    {onClose && (
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <XCircle className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <Progress value={progress} className="h-2 mb-2" />
                <h3 className="text-lg font-semibold leading-none tracking-tight">{currentStepData.question}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{currentStepData.description}</p>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="space-y-2 flex-1 px-4 pb-4 overflow-y-auto dialog-scrollbar-hidden">
                    {currentStepData.options.map((option) => {
                        const Icon = option.icon;
                        const isSelected = answers.find(a => a.step === currentStep)?.answerId === option.id;

                        return (
                            <Button
                                key={option.id}
                                variant={isSelected ? "default" : "outline"}
                                className={`w-full h-auto p-3 justify-start text-left ${option.disqualifies ? "border-orange-300 hover:border-orange-400" : ""
                                    }`}
                                onClick={() => handleOptionSelect(option)}
                                data-testid={`wizard-option-${option.id}`}
                            >
                                <div className="flex items-start gap-3 w-full">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${isSelected ? "bg-primary-foreground/20" : "bg-muted"
                                        }`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium">{option.label}</div>
                                        {option.description && (
                                            <div className={`text-xs mt-1 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                                {option.description}
                                            </div>
                                        )}
                                    </div>
                                    {option.disqualifies && (
                                        <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                    )}
                                </div>
                            </Button>
                        );
                    })}

                    {currentStep > 0 && (
                        <Button variant="ghost" onClick={handleBack} className="w-full mt-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Вернуться назад
                        </Button>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <Card className="w-full max-w-lg mx-auto h-full flex flex-col">
            <CardHeader className="pb-4 flex-shrink-0">
                {/* В обычном режиме заголовок рендерится внутри CardHeader */}
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Шаг {currentStep + 1} из {wizardSteps.length}</Badge>
                    {onClose && (
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <XCircle className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <Progress value={progress} className="h-2 mb-4" />
                <CardTitle className="text-lg">{currentStepData.question}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 overflow-y-auto">
                {currentStepData.options.map((option) => {
                    const Icon = option.icon;
                    const isSelected = answers.find(a => a.step === currentStep)?.answerId === option.id;

                    return (
                        <Button
                            key={option.id}
                            variant={isSelected ? "default" : "outline"}
                            className={`w-full h-auto p-4 justify-start text-left ${option.disqualifies ? "border-orange-300 hover:border-orange-400" : ""
                                }`}
                            onClick={() => handleOptionSelect(option)}
                            data-testid={`wizard-option-${option.id}`}
                        >
                            <div className="flex items-start gap-3 w-full">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${isSelected ? "bg-primary-foreground/20" : "bg-muted"
                                    }`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium">{option.label}</div>
                                    {option.description && (
                                        <div className={`text-xs mt-1 ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                            {option.description}
                                        </div>
                                    )}
                                </div>
                                {option.disqualifies && (
                                    <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                )}
                            </div>
                        </Button>
                    );
                })}

                {currentStep > 0 && (
                    <Button variant="ghost" onClick={handleBack} className="w-full mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Вернуться назад
                    </Button>
                )}
            </CardContent>
        </Card>
    );

    if (isCompact) {
        return <div className={`p-0 ${className || ''}`}>{wizardContent}</div>;
    }

    return content;
}

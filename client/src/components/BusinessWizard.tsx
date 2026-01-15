import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WizardQuestion {
  id: number;
  question: string;
  explanation: string;
  options: {
    value: string;
    label: string;
  }[];
}

const questions: WizardQuestion[] = [
  {
    id: 1,
    question: "Каков планируемый годовой доход?",
    explanation: "Для НПД лимит — 2,4 млн руб./год. ИП и ООО могут работать с любыми оборотами, но нужно учитывать налоговые режимы.",
    options: [
      { value: "under2.4m", label: "До 2.4 млн ₽" },
      { value: "over2.4m", label: "Более 2.4 млн ₽" },
    ],
  },
  {
    id: 2,
    question: "Будете ли вы нанимать сотрудников по трудовым договорам?",
    explanation: "НПД: запрещено (можно только подрядчиков по ГПХ). ИП и ООО: разрешено, но с обязательствами по взносам и отчётности.",
    options: [
      { value: "no", label: "Нет, работаю один" },
      { value: "contractors", label: "Только подрядчиков (ГПХ)" },
      { value: "employees", label: "Да, нужны сотрудники в штат" },
    ],
  },
  {
    id: 3,
    question: "С кем планируете работать?",
    explanation: "Все формы допускают работу с физлицами. Для крупных юрлиц ООО и ИП выглядят надёжнее. НПД возможен с юрлицами, но налог — 6%.",
    options: [
      { value: "individuals", label: "В основном с физлицами" },
      { value: "mixed", label: "И с физлицами, и с компаниями" },
      { value: "companies", label: "Преимущественно с крупными компаниями" },
    ],
  },
  {
    id: 4,
    question: "Нужна ли вам лицензия для деятельности?",
    explanation: "Лицензия (медицина, образование, перевозки) доступна только для ИП и ООО. НПД не даёт права на лицензируемые виды.",
    options: [
      { value: "no", label: "Нет, лицензия не требуется" },
      { value: "yes", label: "Да, деятельность лицензируется" },
    ],
  },
  {
    id: 5,
    question: "Готовы ли вы отвечать по обязательствам бизнеса личным имуществом?",
    explanation: "ИП: полная ответственность. ООО: ограничена уставным капиталом. НПД: личная ответственность.",
    options: [
      { value: "personal", label: "Да, готов(а) нести личную ответственность" },
      { value: "limited", label: "Нет, хочу ограничить риски (только капиталом компании)" },
    ],
  },
  {
    id: 6,
    question: "Планируете ли привлекать инвестиции или партнёров?",
    explanation: "ООО позволяет оформлять доли и привлекать инвесторов. ИП и НПД — это единоличное владение.",
    options: [
      { value: "no", label: "Нет, только свои средства" },
      { value: "partners", label: "Да, будут партнёры или инвесторы" },
    ],
  },
  {
    id: 7,
    question: "Насколько важна простота регистрации и закрытия?",
    explanation: "НПД: 10 мин через приложение. ИП: 3-5 дней. ООО: сложная процедура, уставной капитал, трудная ликвидация.",
    options: [
      { value: "maximum", label: "Критично: хочу всё делать онлайн за минуты" },
      { value: "medium", label: "Важна, но готов подождать пару дней" },
      { value: "low", label: "Не важна, главное — структура бизнеса" },
    ],
  },
  {
    id: 8,
    question: "Нужен ли вам расчётный счёт для бизнеса?",
    explanation: "ООО: обязателен. ИП: по желанию. НПД: можно использовать личную карту.",
    options: [
      { value: "personal_card", label: "Хватит личной карты" },
      { value: "business_account", label: "Нужен отдельный счёт для бизнеса" },
    ],
  },
  {
    id: 9,
    question: "Хотите ли вы выбирать налоговый режим?",
    explanation: "ИП и ООО могут выбирать (УСН, патент). НПД жёстко фиксирован (4%/6%).",
    options: [
      { value: "fixed", label: "Меня устраивает фиксированная ставка НПД" },
      { value: "choice", label: "Хочу выбрать (УСН, Патент, ОСНО)" },
    ],
  },
  {
    id: 10,
    question: "Планируете ли масштабировать бизнес (филиалы, новые направления)?",
    explanation: "ООО: оптимально для роста. ИП: ограничения по видам. НПД: лимиты сдерживают расширение.",
    options: [
      { value: "micro", label: "Нет, останусь микро-бизнесом/фрилансером" },
      { value: "medium", label: "Возможен умеренный рост" },
      { value: "scale", label: "Да, планирую большую сеть или филиалы" },
    ],
  },
];

export default function BusinessWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [questions[currentStep].id]: value });
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  const getRecommendation = () => {
    // Scoring Logic
    let scores = { npd: 0, ip: 0, ooo: 0 };
    let disqualifiers = { npd: [], ip: [] };

    // 1. Income
    if (answers[1] === "under2.4m") { scores.npd += 2; scores.ip += 1; }
    else { scores.npd -= 100; disqualifiers.npd.push("Доход выше 2.4 млн ₽"); scores.ip += 2; scores.ooo += 2; }

    // 2. Employees
    if (answers[2] === "employees") { scores.npd -= 100; disqualifiers.npd.push("Наличие штатных сотрудников"); scores.ip += 2; scores.ooo += 2; }
    else { scores.npd += 2; }

    // 3. Clients
    if (answers[3] === "companies") { scores.ooo += 2; scores.ip += 1; }
    else if (answers[3] === "individuals") { scores.npd += 2; scores.ip += 1; }

    // 4. License
    if (answers[4] === "yes") { scores.npd -= 100; disqualifiers.npd.push("Необходимость лицензии"); scores.ip += 2; scores.ooo += 2; }

    // 5. Liability
    if (answers[5] === "limited") { scores.ooo += 3; scores.ip -= 1; scores.npd -= 1; }
    else { scores.ip += 1; scores.npd += 1; }

    // 6. Partners
    if (answers[6] === "partners") { scores.ooo += 10; scores.ip -= 2; scores.npd -= 2; } // Strongest signal for OOO

    // 7. Simplicity
    if (answers[7] === "maximum") { scores.npd += 3; scores.ooo -= 2; }
    else if (answers[7] === "medium") { scores.ip += 2; }

    // 8. Bank Account
    if (answers[8] === "personal_card") { scores.npd += 2; }
    else { scores.ooo += 1; scores.ip += 1; }

    // 9. Tax Regime
    if (answers[9] === "choice") { scores.ip += 2; scores.ooo += 2; }
    else { scores.npd += 2; }

    // 10. Scale
    if (answers[10] === "scale") { scores.ooo += 3; scores.npd -= 2; }
    else if (answers[10] === "micro") { scores.npd += 3; }

    // Determine Winner
    if (scores.ooo > scores.ip && scores.ooo > scores.npd) {
      return {
        title: "ООО (Общество с ограниченной ответственностью)",
        description: "Ваш выбор — бизнес с полноценной структурой. Вам важно разделять личную ответственность и риски бизнеса, привлекать инвестиции или работать с партнёрами.",
        reasons: [
          "Позволяет привлекать партнёров и инвесторов (долевое участие)",
          "Ответственность ограничена уставным капиталом (личные активы защищены)",
          "Идеально для масштабирования и работы с крупными заказчиками",
          "Обязательно, если нужны сотрудники и сложные лицензии"
        ]
      };
    } else if (scores.npd > scores.ip && scores.npd > -50) { // Check disqualifiers implicit via score
      return {
        title: "Самозанятость (НПД)",
        description: "Идеальный старт. У вас нет сотрудников, партнёров и сверхдоходов, а бюрократия вам не нужна. Это самый простой и выгодный режим.",
        reasons: [
          "Регистрация за 10 минут, нет отчётности",
          "Самая низкая налоговая ставка (4% / 6%)",
          "Можно работать без расчётного счёта",
          "Идеально для фриланса и тестирования ниши"
        ]
      };
    } else {
      return {
        title: "ИП (Индивидуальный предприниматель)",
        description: "Золотая середина. Вы планируете нанимать людей, возможно, масштабироваться, но не хотите усложнять жизнь отчётностью ООО.",
        reasons: [
          "Простая регистрация и распоряжение деньгами",
          "Можно нанимать сотрудников и выбирать налоговые режимы (УСН, Патент)",
          "Подходит для большинства видов деятельности",
          "Юридически проще и дешевле обслуживания ООО"
        ]
      };
    }
  };

  if (showResults) {
    const result = getRecommendation();

    return (
      <Card className="mx-auto max-w-3xl" data-testid="card-wizard-results">
        <CardHeader>
          <CardTitle className="text-3xl">Рекомендация готова!</CardTitle>
          <CardDescription className="text-base">
            На основе ваших ответов мы подобрали оптимальную форму:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border-2 border-primary bg-primary/5 p-8">
            <h3 className="mb-2 text-3xl font-bold text-primary">{result.title}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {result.description}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Почему это ваш вариант:</h4>
            <ul className="grid gap-3 sm:grid-cols-2">
              {result.reasons.map((reason, idx) => (
                <li key={idx} className="flex gap-3 rounded-md border p-3 bg-card">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                  <span className="text-sm">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => {
              setShowResults(false);
              setCurrentStep(0);
              setAnswers({});
            }}
            data-testid="button-restart"
          >
            Пройти заново
          </Button>
          <Button data-testid="button-download-report">Скачать подробный план</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl" data-testid="card-wizard">
      <CardHeader>
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Вопрос {currentStep + 1} из {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-wizard" />
        </div>
        <CardTitle className="text-2xl leading-tight">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Explanation Block */}
        <Alert className="bg-muted/50 border-none">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="mb-2 font-medium">Справка</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            {currentQuestion.explanation}
          </AlertDescription>
        </Alert>

        <RadioGroup
          value={answers[currentQuestion.id] || ""}
          onValueChange={handleAnswerChange}
        >
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all hover:bg-muted/50 ${answers[currentQuestion.id] === option.value ? "border-primary bg-primary/5" : "border-transparent bg-muted/20"
                  }`}
                data-testid={`radio-option-${option.value}`}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="flex-1">
                  <Label htmlFor={option.value} className="cursor-pointer text-base font-medium">
                    {option.label}
                  </Label>
                </div>
              </label>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          data-testid="button-back"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          data-testid="button-next"
          size="lg"
          className="px-8"
        >
          {currentStep === questions.length - 1 ? "Узнать результат" : "Следующий вопрос"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

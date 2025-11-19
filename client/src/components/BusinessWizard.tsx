import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

// todo: remove mock functionality
const questions = [
  {
    id: 1,
    question: "Какой планируемый годовой доход?",
    options: [
      { value: "under2.4m", label: "До 2.4 млн ₽ в год" },
      { value: "2.4m-60m", label: "От 2.4 до 60 млн ₽" },
      { value: "60m-200m", label: "От 60 до 200 млн ₽" },
      { value: "over200m", label: "Более 200 млн ₽" },
    ],
  },
  {
    id: 2,
    question: "Сколько будет учредителей?",
    options: [
      { value: "solo", label: "Только я" },
      { value: "2-3", label: "2-3 партнёра" },
      { value: "4-5", label: "4-5 партнёров" },
      { value: "more", label: "Более 5 партнёров" },
    ],
  },
  {
    id: 3,
    question: "Будете ли нанимать сотрудников?",
    options: [
      { value: "no", label: "Нет, буду работать сам" },
      { value: "1-5", label: "Да, 1-5 человек" },
      { value: "6-15", label: "Да, 6-15 человек" },
      { value: "more15", label: "Более 15 человек" },
    ],
  },
  {
    id: 4,
    question: "Планируете ли участвовать в тендерах или работать с крупными компаниями?",
    options: [
      { value: "no", label: "Нет" },
      { value: "maybe", label: "Возможно в будущем" },
      { value: "yes", label: "Да, это важно" },
    ],
  },
  {
    id: 5,
    question: "Какой вид деятельности планируете?",
    options: [
      { value: "services", label: "Услуги (консалтинг, дизайн, IT)" },
      { value: "retail", label: "Розничная торговля" },
      { value: "production", label: "Производство товаров" },
      { value: "other", label: "Другое" },
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
      console.log('Wizard completed with answers:', answers);
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

  if (showResults) {
    return (
      <Card className="mx-auto max-w-3xl" data-testid="card-wizard-results">
        <CardHeader>
          <CardTitle className="text-3xl">Рекомендация готова!</CardTitle>
          <CardDescription className="text-base">
            На основе ваших ответов мы рекомендуем следующую форму бизнеса
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border-2 border-primary bg-primary/5 p-8">
            <h3 className="mb-2 text-2xl font-bold text-primary">ИП на УСН 6%</h3>
            <p className="text-muted-foreground">
              Индивидуальный предприниматель с упрощённой системой налогообложения 6% от доходов
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Почему эта форма подходит вам:</h4>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Простая регистрация и минимум отчётности</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Оптимальная налоговая нагрузка для ваших доходов</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Возможность нанимать сотрудников</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span>Подходит для вашего вида деятельности</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
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
          <Button data-testid="button-download-report">Скачать подробный отчёт</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl" data-testid="card-wizard">
      <CardHeader>
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Вопрос {currentStep + 1} из {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} data-testid="progress-wizard" />
        </div>
        <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={answers[currentQuestion.id] || ""}
          onValueChange={handleAnswerChange}
        >
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 hover-elevate active-elevate-2"
                data-testid={`radio-option-${option.value}`}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer text-base">
                  {option.label}
                </Label>
              </label>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          data-testid="button-next"
        >
          {currentStep === questions.length - 1 ? "Получить результат" : "Далее"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

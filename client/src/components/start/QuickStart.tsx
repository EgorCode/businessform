import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, Play, Lightbulb, Target, Zap } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
  action?: string;
  link?: string;
}

export default function QuickStart() {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Определите идею бизнеса",
      description: "Выберите сферу деятельности и определите основные продукты или услуги",
      completed: false,
      icon: <Lightbulb className="h-5 w-5" />,
      action: "Выбрать идею",
      link: "/#ideas"
    },
    {
      id: 2,
      title: "Выберите форму регистрации",
      description: "Определите оптимальную организационно-правовую форму (ИП, ООО, самозанятый)",
      completed: false,
      icon: <Target className="h-5 w-5" />,
      action: "Сравнить формы",
      link: "/comparison"
    },
    {
      id: 3,
      title: "Рассчитайте начальные затраты",
      description: "Оцените стоимость регистрации и первоначальные вложения",
      completed: false,
      icon: <Zap className="h-5 w-5" />,
      action: "Рассчитать",
      link: "/calculators"
    },
    {
      id: 4,
      title: "Подготовьте документы",
      description: "Соберите необходимые документы для регистрации",
      completed: false,
      icon: <Play className="h-5 w-5" />,
      action: "Подготовить",
      link: "/documents"
    },
    {
      id: 5,
      title: "Зарегистрируйте бизнес",
      description: "Подайте документы и получите статус предпринимателя",
      completed: false,
      icon: <CheckCircle className="h-5 w-5" />,
      action: "Начать регистрацию",
      link: "/start?form=self-employed"
    }
  ]);

  const toggleStep = (stepId: number) => {
    setSteps(prev =>
      prev.map(step =>
        step.id === stepId
          ? { ...step, completed: !step.completed }
          : step
      )
    );
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const getProgressStatus = () => {
    if (progressPercentage === 0) return { text: "Начните свой путь в бизнес", color: "text-muted-foreground" };
    if (progressPercentage < 50) return { text: "Хороший старт! Продолжайте в том же духе", color: "text-blue-600" };
    if (progressPercentage < 100) return { text: "Отлично! Вы почти у цели", color: "text-green-600" };
    return { text: "Поздравляем! Вы готовы к запуску бизнеса", color: "text-green-700 font-semibold" };
  };

  const progressStatus = getProgressStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Быстрый старт
            </CardTitle>
            <CardDescription>
              Пошаговый план для запуска вашего бизнеса
            </CardDescription>
          </div>
          <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
            {completedSteps}/{steps.length} шагов
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Прогресс-бар */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Ваш прогресс</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className={`text-sm ${progressStatus.color}`}>{progressStatus.text}</p>
        </div>

        {/* Список шагов */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${step.completed
                ? "bg-green-50 border-green-200"
                : "bg-muted/30 border-border hover:bg-muted/50"
                }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <button
                  onClick={() => toggleStep(step.id)}
                  className="transition-colors"
                >
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  )}
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-medium ${step.completed ? "text-green-800" : ""}`}>
                    Шаг {index + 1}. {step.title}
                  </h4>
                  <div className="flex items-center gap-1 text-primary">
                    {step.icon}
                  </div>
                </div>
                <p className={`text-sm mb-2 ${step.completed ? "text-green-700" : "text-muted-foreground"}`}>
                  {step.description}
                </p>
                {step.action && step.link && (
                  <Button
                    variant={step.completed ? "outline" : "default"}
                    size="sm"
                    className="text-xs"
                    asChild
                  >
                    <a href={step.link}>
                      {step.action}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Призыв к действию */}
        {progressPercentage > 0 && progressPercentage < 100 && (
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-800">Совет</h4>
            </div>
            <p className="text-sm text-blue-700">
              Вы уже выполнили {completedSteps} шаг(ов)! Продолжайте двигаться вперед, и скоро ваш бизнес будет запущен.
            </p>
          </div>
        )}

        {progressPercentage === 100 && (
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-green-800">Поздравляем!</h4>
            </div>
            <p className="text-sm text-green-700 mb-3">
              Вы прошли все основные шаги для запуска бизнеса. Теперь вы готовы к официальной регистрации!
            </p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
              <a href="/start?form=self-employed">
                Перейти к регистрации
                <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
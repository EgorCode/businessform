import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, TrendingUp, Users, FileText, Calculator, ArrowRight, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { aiService, BusinessAnalysisRequest, BusinessAnalysisResponse } from "@/services/aiService";

interface AIBusinessAnalyzerProps {
  onAnalysisComplete?: (result: BusinessAnalysisResponse) => void;
}

export default function AIBusinessAnalyzer({ onAnalysisComplete }: AIBusinessAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<BusinessAnalysisResponse | null>(null);
  
  // Форма данных
  const [formData, setFormData] = useState<BusinessAnalysisRequest>({
    description: "",
    expectedIncome: undefined,
    employees: undefined,
    industry: "",
    hasPartners: false
  });

  const industries = [
    "IT и разработка",
    "Консалтинг и услуги",
    "Торговля",
    "Производство",
    "Образование",
    "Медицина",
    "Строительство",
    "Транспорт и логистика",
    "Реклама и маркетинг",
    "Фриланс и творчество",
    "Другое"
  ];

  const steps = [
    { title: "Описание бизнеса", icon: <FileText className="h-4 w-4" /> },
    { title: "Финансовые показатели", icon: <Calculator className="h-4 w-4" /> },
    { title: "Команда и партнёры", icon: <Users className="h-4 w-4" /> },
    { title: "AI-анализ", icon: <Sparkles className="h-4 w-4" /> }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setCurrentStep(3); // Переходим к шагу анализа

    try {
      const result = await aiService.analyzeBusinessSituation(formData);
      setAnalysisResult(result);
      onAnalysisComplete?.(result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="description" className="text-base font-medium">Опишите ваш бизнес</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Расскажите, чем вы планируете заниматься, какие услуги предоставлять или товары продавать
              </p>
              <textarea
                id="description"
                className="w-full min-h-[120px] p-3 border rounded-md resize-none"
                placeholder="Например: Разработка мобильных приложений для малого бизнеса..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="industry" className="text-base font-medium">Сфера деятельности</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите сферу деятельности" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="income" className="text-base font-medium">Планируемый доход в месяц</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Это поможет определить оптимальную систему налогообложения
              </p>
              <Input
                id="income"
                type="number"
                placeholder="100000"
                value={formData.expectedIncome || ""}
                onChange={(e) => setFormData({ ...formData, expectedIncome: parseInt(e.target.value) || undefined })}
              />
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="cursor-pointer" onClick={() => setFormData({ ...formData, expectedIncome: 50000 })}>
                  50 тыс ₽
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => setFormData({ ...formData, expectedIncome: 100000 })}>
                  100 тыс ₽
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => setFormData({ ...formData, expectedIncome: 200000 })}>
                  200 тыс ₽
                </Badge>
                <Badge variant="outline" className="cursor-pointer" onClick={() => setFormData({ ...formData, expectedIncome: 500000 })}>
                  500 тыс ₽
                </Badge>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="employees" className="text-base font-medium">Количество сотрудников</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Включая вас, если вы планируете работать в команде
              </p>
              <Select value={formData.employees?.toString()} onValueChange={(value) => setFormData({ ...formData, employees: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите количество сотрудников" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Только я (фрилансер)</SelectItem>
                  <SelectItem value="1">1-2 сотрудника</SelectItem>
                  <SelectItem value="3">3-5 сотрудников</SelectItem>
                  <SelectItem value="6">6-10 сотрудников</SelectItem>
                  <SelectItem value="11">Более 10 сотрудников</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Планируете ли работать с партнёрами?</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Совместное владение бизнесом или привлечение инвесторов
              </p>
              <div className="flex gap-4">
                <Button
                  variant={formData.hasPartners ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, hasPartners: true })}
                >
                  Да, будут партнёры
                </Button>
                <Button
                  variant={!formData.hasPartners ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, hasPartners: false })}
                >
                  Нет, буду один
                </Button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold">AI анализирует вашу ситуацию</h3>
                <p className="text-muted-foreground">
                  ИИ-помощник подбирает оптимальную форму бизнеса на основе ваших данных
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Анализ формы бизнеса...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Расчёт налоговой нагрузки...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500 animate-spin" />
                    <span className="text-sm">Подготовка рекомендаций...</span>
                  </div>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Анализ завершён
                  </div>
                </div>

                <Card className="border-2 border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Рекомендуемая форма: {getFormName(analysisResult.recommendedForm)}
                    </CardTitle>
                    <CardDescription>{analysisResult.reasoning}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Преимущества</h4>
                        <ul className="space-y-1">
                          {analysisResult.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Недостатки</h4>
                        <ul className="space-y-1">
                          {analysisResult.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Налоговая система</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{analysisResult.taxSystem}</p>
                      <p className="text-2xl font-bold text-primary mt-2">
                        ~{Math.round(analysisResult.estimatedTaxes).toLocaleString('ru-RU')} ₽/мес
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Шаги регистрации</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResult.registrationSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium flex-shrink-0">
                              {idx + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  const getFormName = (form: string) => {
    switch (form) {
      case "self-employed": return "Самозанятость (НПД)";
      case "sole-proprietor": return "ИП";
      case "llc": return "ООО";
      default: return form;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.description.trim() !== "" && formData.industry !== "";
      case 1:
        return formData.expectedIncome !== undefined && formData.expectedIncome > 0;
      case 2:
        return formData.employees !== undefined;
      default:
        return true;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">AI-анализ бизнеса</CardTitle>
            <Badge variant="outline" className="gap-2">
              <Sparkles className="h-3 w-3" />
              ИИ-помощник
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Шаг {currentStep + 1} из {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="flex justify-between">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 text-xs ${
                  idx <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                  idx < currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : idx === currentStep
                    ? "border-primary text-primary"
                    : "border-muted-foreground text-muted-foreground"
                }`}>
                  {idx < currentStep ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderStepContent()}

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isAnalyzing}
          >
            Назад
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Далее
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !isStepValid()}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Анализирую...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Запустить AI-анализ
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

// Тип для бизнес-идеи
interface BusinessIdea {
  id: number;
  title: string;
  description: string;
  category: string;
  recommendedForms: {
    form: string;
    confidence: number;
    reason: string;
  }[];
  trend: string;
  averageRevenue: string;
}

export default function IdeaGenerator() {
  const [currentIdea, setCurrentIdea] = useState<BusinessIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial idea from API
    const loadInitialIdea = async () => {
      try {
        const response = await fetch('/api/ideas/random');
        const data = await response.json();
        setCurrentIdea(data);
      } catch (error) {
        console.error('Error loading initial idea:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialIdea();
  }, []);

  const generateIdea = async () => {
    setIsGenerating(true);
    console.log('Generating business idea...');

    try {
      const response = await fetch('/api/ideas/random');
      const data = await response.json();
      setCurrentIdea(data);
      console.log('Idea generated:', data);
    } catch (error) {
      console.error('Error generating idea:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFormBadgeColor = (form: string) => {
    if (form === "НПД") return "bg-green-500/20 text-green-700 border-green-500/30";
    if (form === "ИП") return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    return "bg-purple-500/20 text-purple-700 border-purple-500/30";
  };

  return (
    <section id="ideas" className="border-b py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4" data-testid="text-ideas-title">
                Идеи для бизнеса в 2026
              </h2>
              <p className="text-lg text-muted-foreground" data-testid="text-ideas-subtitle">
                Рынок меняется. Мы обновили базу идей на основе статистики за 2025 год: в тренде ремонт, автосферы, IT и информационные услуги. Нажмите кнопку, чтобы получить актуальную бизнес-идею.
              </p>
            </div>

            {isLoading ? (
              <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Загружаем бизнес-идею...</p>
                  </div>
                </CardContent>
              </Card>
            ) : currentIdea ? (
              <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="gap-1">
                      <span className="text-xs font-bold text-primary">Идея #{currentIdea.id}</span>
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {currentIdea.trend}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{currentIdea.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {currentIdea.description}
                  </p>

                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Рекомендуемые формы бизнеса
                    </div>
                    <div className="space-y-2">
                      {currentIdea.recommendedForms.map((rec, idx) => (
                        <div
                          key={idx}
                          className={`rounded-lg border-2 p-3 ${getFormBadgeColor(rec.form)} transition-all hover-elevate`}
                          data-testid={`card-form-recommendation-${rec.form}`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className="font-semibold text-sm">{rec.form}</span>
                            <span className="text-xs font-medium">{rec.confidence}%</span>
                          </div>
                          <p className="text-xs leading-relaxed">{rec.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Средний доход/месяц
                    </div>
                    <div className="text-lg font-mono font-semibold text-primary">
                      {currentIdea.averageRevenue}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50 to-background">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <p className="text-red-600">Не удалось загрузить бизнес-идею</p>
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                      Попробовать снова
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={generateIdea}
              disabled={isGenerating || isLoading}
              className="w-full gap-2 text-base"
              data-testid="button-generate-idea"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Генерируем идею...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Сгенерировать другую
                </>
              )}
            </Button>


          </div>

          <div className="relative h-[450px] rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="text-7xl mb-6">💡</div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">
                Идея — это только начало
              </h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Важнее всего выбрать правильную форму бизнеса для вашей идеи. Это определит налоги, отчётность и возможности масштабирования.
              </p>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">
                  "Лучший способ начать — <br /> перестать говорить и начать делать."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

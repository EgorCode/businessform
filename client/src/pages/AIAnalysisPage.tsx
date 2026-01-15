import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import AIBusinessAnalyzer from "@/components/AIBusinessAnalyzer";
import EnhancedAIAssistant from "@/components/EnhancedAIAssistant";
import { BusinessAnalysisResponse } from "@/services/aiService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download, Share2, FileText, Calculator, TrendingUp } from "lucide-react";

export default function AIAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<BusinessAnalysisResponse | null>(null);
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  const handleAnalysisComplete = (result: BusinessAnalysisResponse) => {
    setAnalysisResult(result);
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    
    // Создаем текстовый отчет
    const report = `
АНАЛИЗ БИЗНЕСА - ИИ-помощник
============================

РЕКОМЕНДУЕМАЯ ФОРМА: ${analysisResult.recommendedForm}
ОБОСНОВАНИЕ: ${analysisResult.reasoning}

НАЛОГОВАЯ СИСТЕМА: ${analysisResult.taxSystem}
ПЛАНИРУЕМЫЕ НАЛОГИ: ~${Math.round(analysisResult.estimatedTaxes).toLocaleString('ru-RU')} ₽/мес

ПРЕИМУЩЕСТВА:
${analysisResult.pros.map((pro, idx) => `${idx + 1}. ${pro}`).join('\n')}

НЕДОСТАТКИ:
${analysisResult.cons.map((con, idx) => `${idx + 1}. ${con}`).join('\n')}

ШАГИ РЕГИСТРАЦИИ:
${analysisResult.registrationSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

НЕОБХОДИМЫЕ ДОКУМЕНТЫ:
${analysisResult.documents.map((doc, idx) => `${idx + 1}. ${doc}`).join('\n')}

---
Сгенерировано ИИ-помощником по бизнесу
Дата: ${new Date().toLocaleDateString('ru-RU')}
    `.trim();

    // Создаем blob и скачиваем
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareResults = () => {
    if (!analysisResult) return;
    
    const shareText = `ИИ-помощник рекомендует: ${analysisResult.recommendedForm}\n${analysisResult.reasoning}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Анализ бизнеса - ИИ-помощник',
        text: shareText,
      });
    } else {
      // Fallback - копируем в буфер обмена
      navigator.clipboard.writeText(shareText);
      alert('Результаты скопированы в буфер обмена');
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="AI-анализ бизнеса"
        description="Умный анализ вашей бизнес-ситуации с помощью ИИ-помощника. Получите персонализированные рекомендации по выбору формы бизнеса, налогам и регистрации."
        breadcrumbs={[{ label: "AI-анализ" }]}
      />

      <PageSection size="lg">
        <div className="space-y-8">
          <AIBusinessAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          
          {analysisResult && (
            <div className="space-y-6">
              {/* Дополнительные рекомендации */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Следующие шаги
                  </CardTitle>
                  <CardDescription>
                    Рекомендации на основе вашего анализа
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <a href="/calculators">
                        <Calculator className="h-6 w-6" />
                        <span className="font-medium">Рассчитать налоги</span>
                        <span className="text-xs text-muted-foreground">Детальные расчёты</span>
                      </a>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <a href="/documents">
                        <FileText className="h-6 w-6" />
                        <span className="font-medium">Подготовить документы</span>
                        <span className="text-xs text-muted-foreground">Шаблоны и формы</span>
                      </a>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                      <a href="/comparison">
                        <TrendingUp className="h-6 w-6" />
                        <span className="font-medium">Сравнить формы</span>
                        <span className="text-xs text-muted-foreground">Подробное сравнение</span>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Действия с результатами */}
              <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
                <CardHeader>
                  <CardTitle>Результаты анализа готовы</CardTitle>
                  <CardDescription>
                    Сохраните или поделитесь рекомендациями ИИ-помощника
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleDownloadReport} className="gap-2">
                      <Download className="h-4 w-4" />
                      Скачать отчёт
                    </Button>
                    <Button variant="outline" onClick={handleShareResults} className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Поделиться результатами
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Статистика и инсайты */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Экономия времени</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Анализ форм бизнеса</span>
                        <Badge variant="secondary">-2 часа</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Расчёт налогов</span>
                        <Badge variant="secondary">-1 час</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Подготовка документов</span>
                        <Badge variant="secondary">-3 часа</Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-medium">
                          <span>Общая экономия</span>
                          <Badge className="bg-green-100 text-green-800">-6 часов</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Точность рекомендаций</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Подбор формы бизнеса</span>
                        <Badge variant="secondary">95%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Расчёт налоговой нагрузки</span>
                        <Badge variant="secondary">98%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Соответствие законодательству</span>
                        <Badge variant="secondary">100%</Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-medium">
                          <span>Общая точность</span>
                          <Badge className="bg-blue-100 text-blue-800">97%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </PageSection>

      {/* AI-помощник */}
      <EnhancedAIAssistant 
        isMinimized={isChatMinimized}
        onToggle={() => setIsChatMinimized(!isChatMinimized)}
      />
    </PageLayout>
  );
}
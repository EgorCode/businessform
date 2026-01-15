import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import WizardSection from "@/components/WizardSection";
import { CheckCircle, Lightbulb, Target, Zap } from "lucide-react";

export default function WizardPage() {
  const advantages = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Точный подбор",
      description: "Алгоритм анализирует ваши ответы и предлагает наиболее подходящую форму бизнеса"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Быстрый результат",
      description: "Получите персонализированную рекомендацию всего за 5 минут"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Экспертная база",
      description: "Рекомендации основаны на актуальном законодательстве и практике ведения бизнеса"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Полный анализ",
      description: "Учитываем все важные факторы: налоги, отчётность, риски и возможности"
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Мастер подбора бизнеса"
        description="Получите персонализированную рекомендацию по выбору организационно-правовой формы для вашего бизнеса"
        breadcrumbs={[{ label: "Мастер подбора бизнеса" }]}
      />

      <PageSection size="lg">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <WizardSection />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Почему стоит воспользоваться мастером?</CardTitle>
                <CardDescription>
                  Наш инструмент поможет сделать правильный выбор с учётом всех нюансов вашего бизнеса
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      {advantage.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold">{advantage.title}</h4>
                      <p className="text-sm text-muted-foreground">{advantage.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Что вы получите в результате?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                    <span className="text-sm">Рекомендацию по оптимальной форме бизнеса</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                    <span className="text-sm">Сравнение с альтернативными вариантами</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                    <span className="text-sm">Информацию о налогах и отчётности</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                    <span className="text-sm">Пошаговый план регистрации</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageSection>


    </PageLayout>
  );
}
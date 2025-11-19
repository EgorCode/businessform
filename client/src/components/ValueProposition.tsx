import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calculator, FileCheck } from "lucide-react";

const features = [
  {
    icon: FileCheck,
    title: "Мастер выбора",
    description: "Ответьте на 5-7 вопросов и получите персонализированную рекомендацию по выбору формы бизнеса с учётом вашей ситуации",
  },
  {
    icon: Calculator,
    title: "Калькуляторы налогов",
    description: "Рассчитайте налоговую нагрузку для НПД, УСН 6% и 15%, страховые взносы. Сравните варианты и выберите оптимальный",
  },
  {
    icon: BookOpen,
    title: "База знаний",
    description: "30+ готовых шаблонов документов, пошаговые гайды по регистрации и ведению бизнеса, актуальные статьи и чек-листы",
  },
];

export default function ValueProposition() {
  return (
    <section className="border-b py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-features-title">
            Всё необходимое в одном месте
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-features-subtitle">
            Комплексная платформа для уверенного старта предпринимательского пути
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { CheckCircle } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Пройдите опрос",
    description: "Ответьте на простые вопросы о планируемом бизнесе, доходах, количестве партнёров и особых требованиях",
  },
  {
    number: "2",
    title: "Получите рекомендацию",
    description: "Система проанализирует ваши ответы и порекомендует оптимальную форму бизнеса с подробным обоснованием",
  },
  {
    number: "3",
    title: "Рассчитайте налоги",
    description: "Используйте калькуляторы для расчёта точной налоговой нагрузки и сравнения разных вариантов налогообложения",
  },
  {
    number: "4",
    title: "Скачайте документы",
    description: "Получите готовые шаблоны для регистрации бизнеса и пошаговые инструкции по подаче документов",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-b bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-how-it-works-title">
            Как это работает
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-how-it-works-subtitle">
            Простой процесс от выбора до регистрации
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex gap-6 rounded-lg border bg-card p-8"
              data-testid={`card-step-${index}`}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {step.number}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              <CheckCircle className="absolute right-8 top-8 h-5 w-5 text-primary/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

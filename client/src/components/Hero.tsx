import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Business_wizard_dashboard_mockup_bb572ce7.png";

export default function Hero() {
  const [, setLocation] = useLocation();
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight tracking-tight lg:text-6xl" data-testid="text-hero-title">
                Выберите правильную форму бизнеса за 5 минут
              </h1>
              <p className="text-lg text-muted-foreground lg:text-xl" data-testid="text-hero-subtitle">
                Интерактивный мастер поможет определить оптимальную организационно-правовую форму, рассчитать налоги и получить готовые документы для регистрации
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" data-testid="button-start-wizard" onClick={() => setLocation('/wizard')}>
                Начать опрос
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" data-testid="button-compare" onClick={() => setLocation('/comparison')}>
                Сравнить формы
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span data-testid="text-trust-indicator">2000+ предпринимателей выбрали форму бизнеса с нашей помощью</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg border bg-card shadow-xl">
              <img
                src={heroImage}
                alt="Интерфейс платформы БизнесФорма"
                className="w-full"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

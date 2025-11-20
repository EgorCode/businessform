import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, TrendingUp, Users, ShoppingBag } from "lucide-react";

const quickStats = [
  { label: "Форм бизнеса", value: "3", icon: TrendingUp },
  { label: "AI рекомендаций", value: "2000+", icon: Sparkles },
  { label: "Документов", value: "30+", icon: Users },
];

export default function NewHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge variant="outline" className="gap-2">
                <Sparkles className="h-3 w-3" />
                Платформа с AI-помощником
              </Badge>
              
              <h1 className="text-5xl font-bold leading-tight tracking-tight lg:text-6xl xl:text-7xl" data-testid="text-new-hero-title">
                Выберите форму бизнеса
                <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  за 5 минут с AI
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed lg:text-2xl" data-testid="text-new-hero-subtitle">
                Интерактивный путь от идеи до регистрации. Анализ документов, расчёт налогов и персональные рекомендации от FormaGPT
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 text-base" data-testid="button-start-journey">
                <Sparkles className="h-5 w-5" />
                Начать свой путь
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base" data-testid="button-view-case">
                Посмотреть кейс блогера
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t">
              {quickStats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <div className="relative space-y-4">
              <div className="rounded-2xl border-2 border-primary/20 bg-card/50 backdrop-blur-sm p-6 hover-elevate">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Блогер</div>
                    <div className="text-sm text-muted-foreground">80K → 2M ₽/мес</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  НПД → ИП → ООО за 36 месяцев
                </div>
              </div>

              <div className="rounded-2xl border-2 border-blue-500/20 bg-card/50 backdrop-blur-sm p-6 hover-elevate">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Фрилансер</div>
                    <div className="text-sm text-muted-foreground">60K → 500K ₽/мес</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  НПД → ИП за 12 месяцев
                </div>
              </div>

              <div className="rounded-2xl border-2 border-green-500/20 bg-card/50 backdrop-blur-sm p-6 hover-elevate">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Маркетплейс</div>
                    <div className="text-sm text-muted-foreground">100K → 5M ₽/мес</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  ИП → ООО при росте
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

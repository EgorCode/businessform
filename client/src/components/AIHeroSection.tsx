import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, MessageCircle, TrendingUp, Shield, Clock } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface AIHeroSectionProps {
  onStartChat?: () => void;
  onStartWizard?: () => void;
}

export default function AIHeroSection({ onStartChat, onStartWizard }: AIHeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "AI-консультант",
      description: "Мгновенные ответы на вопросы о бизнесе"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Анализ ситуации",
      description: "Персональные рекомендации на основе ваших данных"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Юридическая поддержка",
      description: "Помощь с документами и регистрацией"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Экономия времени",
      description: "Быстрый старт за 5 минут вместо недель"
    }
  ];

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
                Платформа с AI-помощником 24/7
              </Badge>
              
              <h1 className="text-5xl font-bold leading-tight tracking-tight lg:text-6xl xl:text-7xl">
                Начните бизнес с
                <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  AI-помощником
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed lg:text-2xl">
                Интерактивный путь от идеи до регистрации. ИИ-помощник поможет выбрать форму бизнеса, рассчитать налоги и подготовить документы.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="gap-2 text-base relative overflow-hidden group"
                onClick={() => setLocation('/ai-analysis')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Начать с AI-помощником</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-base" onClick={onStartWizard}>
                Традиционный мастер
              </Button>
            </div>

            {/* Преимущества AI-подхода */}
            <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{feature.title}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Статистика */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">AI-консультаций</span>
                </div>
                <div className="text-2xl font-bold">2000+</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">Форм бизнеса</span>
                </div>
                <div className="text-2xl font-bold">3</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Время старта</span>
                </div>
                <div className="text-2xl font-bold">5 мин</div>
              </div>
            </div>
          </div>

          {/* Интерактивная демонстрация */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <div className="relative space-y-4">
              {/* Пример чата с AI */}
              <Card className={`border-2 transition-all duration-300 ${isHovered ? 'border-primary/50 shadow-xl' : 'border-primary/20'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">ИИ-помощник</div>
                      <div className="text-xs text-muted-foreground">AI-помощник</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-muted rounded-lg p-3 text-sm">
                      👋 Привет! Я помогу выбрать форму бизнеса. Расскажите о вашей ситуации?
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 text-sm ml-8">
                      Планирую фриланс-проект, доход ~100 тыс/мес
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-sm">
                      💡 Отлично! Для вашей ситуации рекомендую самозанятость (НПД):
                      • Налог 6% с доходов
                      • Без отчётности
                      • До 2.4 млн ₽ в год
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Пример результата */}
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div className="font-semibold text-sm">Рекомендация готова</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Самозанятость (НПД)</div>
                    <div className="text-muted-foreground">Идеально для фрилансера с вашим доходом</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
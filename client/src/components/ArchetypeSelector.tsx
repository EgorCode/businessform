import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";

const archetypes = [
  {
    id: "blogger",
    title: "Блогер / Контент-мейкер",
    icon: TrendingUp,
    description: "Создаёте контент, работаете с брендами, продаёте рекламу и продукты своей аудитории",
    revenuePath: "80K ₽/мес → 300K ₽/мес → 2M ₽/мес",
    typicalJourney: "НПД (0-6 мес) → ИП (6-18 мес) → ООО (18+ мес)",
    challenges: ["Рост дохода выше лимитов", "Наём команды", "Работа с брендами"],
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    id: "freelancer",
    title: "Фрилансер / Специалист",
    icon: Users,
    description: "Оказываете профессиональные услуги (дизайн, разработка, консалтинг, маркетинг)",
    revenuePath: "60K ₽/мес → 200K ₽/мес → 500K ₽/мес",
    typicalJourney: "НПД (0-12 мес) → ИП (12+ мес)",
    challenges: ["Работа с крупными клиентами", "Страховые взносы", "Масштабирование"],
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    id: "marketplace",
    title: "Основатель маркетплейса",
    icon: ShoppingBag,
    description: "Продаёте товары онлайн (Wildberries, Ozon) или создаёте собственную платформу",
    revenuePath: "100K ₽/мес → 1M ₽/мес → 5M ₽/мес",
    typicalJourney: "ИП (старт) → ООО (при росте)",
    challenges: ["Логистика и склад", "НДС и маркировка", "Партнёрства"],
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
  },
];

interface ArchetypeSelectorProps {
  onSelect: (archetypeId: string) => void;
}

export default function ArchetypeSelector({ onSelect }: ArchetypeSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-7xl space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="mb-4">
            Шаг 1 из 4
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl" data-testid="text-archetype-title">
            Выберите свой путь
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-archetype-subtitle">
            Мы персонализируем рекомендации на основе вашего профиля и бизнес-модели
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {archetypes.map((archetype) => {
            const Icon = archetype.icon;
            const isHovered = hoveredId === archetype.id;
            
            return (
              <Card
                key={archetype.id}
                className={`relative overflow-hidden border-2 transition-all duration-300 hover-elevate ${
                  archetype.borderColor
                } ${isHovered ? 'scale-105 shadow-2xl' : ''}`}
                onMouseEnter={() => setHoveredId(archetype.id)}
                onMouseLeave={() => setHoveredId(null)}
                data-testid={`card-archetype-${archetype.id}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${archetype.color} opacity-50`} />
                
                <CardHeader className="relative">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{archetype.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {archetype.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Типичный рост дохода
                      </p>
                      <p className="text-sm font-mono font-semibold">{archetype.revenuePath}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Эволюция формы бизнеса
                      </p>
                      <p className="text-sm font-medium">{archetype.typicalJourney}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Частые вызовы
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {archetype.challenges.map((challenge, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {challenge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full gap-2"
                    onClick={() => {
                      console.log('Selected archetype:', archetype.id);
                      onSelect(archetype.id);
                    }}
                    data-testid={`button-select-${archetype.id}`}
                  >
                    Выбрать этот путь
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <button
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onSelect("custom")}
            data-testid="button-skip-archetype"
          >
            Пропустить выбор архетипа →
          </button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Palette, Home, Hammer, BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import { useAIAssistant } from "@/contexts/AIAssistantContext";
import LiveVisitorCounter from "@/components/ui/live-visitor";
import { WizardDialog } from "@/components/WizardDialog";

const selfEmployedCategories = [
  {
    label: "Дизайнер",
    description: "Графика, веб, интерьер",
    taxRate: "6%",
    icon: Palette,
    gradient: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/20"
  },
  {
    label: "Аренда жилья",
    description: "Посуточно или длительно",
    taxRate: "4%",
    icon: Home,
    gradient: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/20"
  },
  {
    label: "Ремесленник",
    description: "Хендмейд, мебель, декор",
    taxRate: "4-6%",
    icon: Hammer,
    gradient: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/20"
  },
  {
    label: "Блогер",
    description: "Контент, курсы, гайды",
    taxRate: "4%",
    icon: BookOpen,
    gradient: "from-rose-500 to-red-500",
    borderColor: "border-rose-500/20"
  },
];

export default function NewHero() {
  const [, setLocation] = useLocation();
  const { toggleMinimized } = useAIAssistant();
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b">



      <div className="relative mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge variant="outline" className="gap-2 bg-green-500/10 border-green-500/30">
                <Sparkles className="h-3 w-3 text-green-600" />
                Самозанятость — проще, чем кажется
              </Badge>

              <h1 className="text-5xl font-bold leading-tight tracking-tight lg:text-6xl xl:text-7xl" data-testid="text-new-hero-title">
                Стать самозанятым
                <span className="block bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  легко...
                </span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed lg:text-2xl" data-testid="text-new-hero-subtitle">
                Налог от 4%. Без отчётности. Без страховых взносов.
                Узнайте, подходит ли вам этот статус.
              </p>
            </div>



            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="gap-2 text-base"
                data-testid="button-start-journey"
                onClick={() => setLocation("/wizard")}
              >
                Неуверен? Пройди опрос
                <ArrowRight className="h-5 w-5" />
              </Button>

            </div>

            <div className="pt-2">
              <LiveVisitorCounter />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {selfEmployedCategories.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border-2 ${category.borderColor} bg-card/50 backdrop-blur-sm p-5 hover-elevate cursor-pointer transition-all hover:scale-105`}
                    onClick={() => setLocation("/case-studies")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <Badge className={`bg-gradient-to-r ${category.gradient} text-white border-0`}>
                        {category.taxRate}
                      </Badge>
                    </div>
                    <div className="font-semibold">{category.label}</div>
                    <div className="text-sm text-muted-foreground">{category.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

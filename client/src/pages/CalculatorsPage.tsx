import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaxCalculator from "@/components/TaxCalculator";
import SalaryCalculator from "@/components/calculators/SalaryCalculator";
import ProfitabilityCalculator from "@/components/calculators/ProfitabilityCalculator";
import InsuranceContributionsCalculator from "@/components/calculators/InsuranceContributionsCalculator";
import RegistrationCostCalculator from "@/components/calculators/RegistrationCostCalculator";
import SocialInsuranceExpanded from "@/components/calculators/SocialInsuranceExpanded";
import { Calculator, DollarSign, TrendingUp, FileText } from "lucide-react";
import { Pricing, PricingPlan } from "@/components/blocks/pricing";

interface CalculatorItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  badge?: string;
}

export default function CalculatorsPage() {
  const [openCalculator, setOpenCalculator] = useState<string | null>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const pricingPlans: PricingPlan[] = [
    {
      name: "БЕСПЛАТНАЯ",
      price: "0",
      yearlyPrice: "0",
      period: "в месяц",
      features: [
        "Функционал нашего сайта",
        "Авторские материалы",
        "Ответ поддержки за 48ч",
        "Чат в группе Телеграмм",
        "Хорошее настроение",
      ],
      description: "Идеально для знакомства с платформой",
      buttonText: "Продолжить бесплатно",
      isPopular: false,
      type: 'base',
      onClick: () => setIsPricingOpen(false)
    },
    {
      name: "МАКСИМАЛЬНАЯ",
      price: "299",
      yearlyPrice: "239",
      period: "в месяц",
      features: [
        "Все функции портала",
        "Персональный менеджер",
        "Ответ поддержки за 1ч",
        "Индивидуальный менеджер в Телеграмм",
        "Помощь в оформлении документов",
        "Спасибо от нас",
      ],
      description: "Для самых лучших!",
      buttonText: "Связаться с нами",
      href: "#",
      isPopular: true,
      type: 'max',
      onClick: () => window.open("https://t.me/+fwAIYLOHTMI5OGQy", "_blank")
    },
  ];

  const calculators: CalculatorItem[] = [
    {
      id: "tax",
      title: "Налоговый калькулятор",
      description: "Расчет налогов для ИП и самозанятых (НПД и УСН)",
      icon: <Calculator className="h-6 w-6" />,
      component: <TaxCalculator />,
      badge: "Популярный"
    },
    {
      id: "salary",
      title: "Калькулятор зарплаты",
      description: "Расчет налогов с зарплаты сотрудника и суммы к выплате",
      icon: <DollarSign className="h-6 w-6" />,
      component: <SalaryCalculator />
    },
    {
      id: "profitability",
      title: "Калькулятор рентабельности",
      description: "Расчет ключевых бизнес-показателей и рентабельности",
      icon: <TrendingUp className="h-6 w-6" />,
      component: <ProfitabilityCalculator />
    },

    {
      id: "registration",
      title: "Калькулятор стоимости регистрации",
      description: "Расчет затрат на регистрацию бизнеса и сопутствующие расходы",
      icon: <FileText className="h-6 w-6" />,
      component: <RegistrationCostCalculator />
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Калькуляторы для бизнеса"
        description="Профессиональные инструменты для расчета налогов, зарплаты, рентабельности и других бизнес-показателей"
        breadcrumbs={[{ label: "Калькуляторы" }]}
      />

      <PageSection size="lg">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calc) => (
            <Card key={calc.id} className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {calc.icon}
                    </div>
                    <CardTitle className="text-lg">{calc.title}</CardTitle>
                  </div>
                  {calc.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {calc.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm">
                  {calc.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={openCalculator === calc.id} onOpenChange={(open) => setOpenCalculator(open ? calc.id : null)}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Рассчитать</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] dialog-scrollbar-hidden">
                    <DialogHeader>
                      <DialogTitle>{calc.title}</DialogTitle>
                      <DialogDescription>
                        {calc.description}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      {calc.component}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection size="lg">
        <SocialInsuranceExpanded />
      </PageSection>

      <PageSection size="md">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-semibold">Нужна помощь с расчетами?</h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            Наши эксперты помогут с выбором оптимальной системы налогообложения и расчетом всех необходимых показателей для вашего бизнеса.
          </p>
          <Dialog open={isPricingOpen} onOpenChange={setIsPricingOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-10 rounded-md px-8">
                Получить консультацию
              </button>
            </DialogTrigger>
            <DialogContent className="max-h-[95vh] max-w-4xl overflow-y-auto w-full p-0 bg-transparent border-none shadow-none sm:max-w-[900px]">
              <div className="relative w-full rounded-xl bg-card shadow-2xl ring-1 ring-border overflow-hidden">
                <div className="p-2 md:p-4">
                  <Pricing
                    title="Выберите ваш тариф"
                    description="Раскройте весь потенциал платформы."
                    plans={pricingPlans}
                    onClose={() => setIsPricingOpen(false)}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageSection>
    </PageLayout>
  );
}
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
import { Calculator, DollarSign, TrendingUp, Shield, FileText } from "lucide-react";

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
      id: "insurance",
      title: "Калькулятор страховых взносов",
      description: "Расчет страховых взносов для ИП и самозанятых",
      icon: <Shield className="h-6 w-6" />,
      component: <InsuranceContributionsCalculator />
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

      <PageSection size="md" background="muted">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-semibold">Нужна помощь с расчетами?</h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            Наши эксперты помогут с выбором оптимальной системы налогообложения и расчетом всех необходимых показателей для вашего бизнеса.
          </p>
          <Button size="lg">Получить консультацию</Button>
        </div>
      </PageSection>
    </PageLayout>
  );
}
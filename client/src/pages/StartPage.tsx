import { useState } from "react";
import { useSearch } from "wouter";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import SelfEmploymentWizard from "@/components/SelfEmploymentWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuickStart from "@/components/start/QuickStart";
import BusinessIdeas from "@/components/start/BusinessIdeas";
import ResourceChecklist from "@/components/start/ResourceChecklist";
import {
  Rocket,
  Target,
  TrendingUp,
  Users,
  ArrowRight,
  Play,
  Lightbulb,
  CheckCircle,
  Star,
  Zap,
  BookOpen,
  Calculator,
  FileText
} from "lucide-react";

export default function StartPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const showSelfEmployedWizard = searchParams.get("form") === "self-employed";

  if (showSelfEmployedWizard) {
    return (
      <PageLayout>
        <PageHeader
          title="Мастер регистрации самозанятости"
          description="Пройдите короткий опрос и получите пошаговый план регистрации и рекомендации."
          breadcrumbs={[{ label: "Начать", href: "/start" }, { label: "Регистрация НПД" }]}
        />
        <PageSection size="lg">
          <SelfEmploymentWizard />
        </PageSection>
      </PageLayout>
    );
  }

  const stats = [
    {
      title: "Бизнес-идей",
      value: "50+",
      description: "Проверенных направлений",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Шагов к успеху",
      value: "5",
      description: "Основных этапов запуска",
      icon: <Target className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Необходимых ресурсов",
      value: "15",
      description: "Ключевых элементов для старта",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Средний срок запуска",
      value: "2-4 недели",
      description: "От идеи до первого дохода",
      icon: <Zap className="h-5 w-5" />,
      color: "text-orange-600"
    }
  ];

  const benefits = [
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: "Быстрый старт",
      description: "Пошаговый план поможет запустить бизнес за минимальное время"
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Точный выбор",
      description: "Анализ рынка и трендов для выбора перспективного направления"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Финансовая оценка",
      description: "Расчет затрат и прогнозирование рентабельности"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Поддержка",
      description: "Консультации экспертов и доступ к сообществу предпринимателей"
    }
  ];

  const nextSteps = [
    {
      title: "Мастер выбора формы бизнеса",
      description: "Подберите оптимальную организационно-правовую форму",
      icon: <Calculator className="h-5 w-5" />,
      link: "/start?form=self-employed",
      badge: "Рекомендуем"
    },
    {
      title: "Сравнение форм бизнеса",
      description: "Сравните ИП, ООО и самозанятость по ключевым параметрам",
      icon: <FileText className="h-5 w-5" />,
      link: "/comparison"
    },
    {
      title: "Калькуляторы",
      description: "Рассчитайте налоги, зарплату и рентабельность",
      icon: <Calculator className="h-5 w-5" />,
      link: "/calculators"
    },
    {
      title: "Документы",
      description: "Подготовьте необходимые документы для регистрации",
      icon: <FileText className="h-5 w-5" />,
      link: "/documents"
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Начать свой бизнес"
        description="Полное руководство для запуска успешного бизнеса с нуля. Пошаговые инструкции, проверенные идеи и все необходимые ресурсы."
        breadcrumbs={[{ label: "Начать" }]}
      />

      {/* Приветственная секция */}
      <PageSection size="lg" background="primary">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Начните свой бизнес <span className="text-primary">прямо сейчас</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Пошаговое руководство для запуска успешного бизнеса. От идеи до первого дохода за 4 недели.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={() => setActiveTab("quickstart")}>
              <Play className="mr-2 h-5 w-5" />
              Начать сейчас
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" onClick={() => setActiveTab("ideas")}>
              <Lightbulb className="mr-2 h-5 w-5" />
              Найти идею
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-12">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-background/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className={`flex justify-center mb-2 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="font-medium">{stat.title}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageSection>

      {/* Основной контент с вкладками */}
      <PageSection size="lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 min-w-max sm:min-w-0">
              <TabsTrigger value="overview" className="whitespace-nowrap text-xs sm:text-sm">Обзор</TabsTrigger>
              <TabsTrigger value="quickstart" className="whitespace-nowrap text-xs sm:text-sm">Быстрый старт</TabsTrigger>
              <TabsTrigger value="ideas" className="whitespace-nowrap text-xs sm:text-sm">Бизнес-идеи</TabsTrigger>
              <TabsTrigger value="resources" className="whitespace-nowrap text-xs sm:text-sm">Ресурсы</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-8 space-y-8">
            {/* Преимущества */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Почему стоит начать с нами?</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="text-center hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-center mb-2">
                        {benefit.icon}
                      </div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{benefit.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Следующие шаги */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">Что дальше?</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {nextSteps.map((step, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                          {step.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{step.title}</h3>
                            {step.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {step.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {step.description}
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <a href={step.link}>
                              Перейти
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>


          </TabsContent>

          <TabsContent value="quickstart" className="mt-8">
            <QuickStart />
          </TabsContent>

          <TabsContent value="ideas" className="mt-8">
            <BusinessIdeas />
          </TabsContent>

          <TabsContent value="resources" className="mt-8">
            <ResourceChecklist />
          </TabsContent>
        </Tabs>
      </PageSection>

      {/* Дополнительная информация */}
      <PageSection background="muted" bordered>
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Остались вопросы?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Наша команда экспертов готова помочь вам на каждом этапе запуска бизнеса.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Получить консультацию
            </Button>
            <Button variant="outline" size="lg">
              <BookOpen className="mr-2 h-5 w-5" />
              База знаний
            </Button>
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle,
  Circle,
  DollarSign,
  FileText,
  Users,
  Home,
  Laptop,
  BookOpen,
  AlertCircle,
  Lightbulb,
  Calculator,
  Clock
} from "lucide-react";

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  cost?: string;
  time?: string;
  completed: boolean;
  tips?: string[];
}

const initialResources: ResourceItem[] = [
  // Финансовые ресурсы
  {
    id: "f1",
    title: "Стартовый капитал",
    description: "Денежные средства для регистрации и первоначальных расходов",
    category: "financial",
    priority: "high",
    cost: "5 000 - 50 000 ₽",
    time: "1-2 недели",
    completed: false,
    tips: [
      "Рассмотрите возможность получения микрокредита",
      "Используйте личные сбережения",
      "Изучите государственные программы поддержки"
    ]
  },
  {
    id: "f2",
    title: "Финансовый резерв",
    description: "Средства для покрытия расходов на первые 3-6 месяцев работы",
    category: "financial",
    priority: "high",
    cost: "100 000 - 500 000 ₽",
    time: "1-3 месяца",
    completed: false,
    tips: [
      "Рассчитайте минимальную сумму для покрытия личных расходов",
      "Учтите налоги и обязательные платежи",
      "Создайте отдельный счет для бизнеса"
    ]
  },
  {
    id: "f3",
    title: "Банковский счет",
    description: "Открытие расчетного счета для ИП или юридического лица",
    category: "financial",
    priority: "high",
    cost: "0 - 3 000 ₽",
    time: "1-3 дня",
    completed: false,
    tips: [
      "Выберите банк с выгодными условиями для малого бизнеса",
      "Обратите внимание на стоимость обслуживания",
      "Изучите условия интернет-банкинга"
    ]
  },
  
  // Юридические ресурсы
  {
    id: "l1",
    title: "Паспорт и ИНН",
    description: "Основные документы для регистрации в качестве ИП",
    category: "legal",
    priority: "high",
    cost: "Бесплатно",
    time: "1-2 недели",
    completed: false,
    tips: [
      "Проверьте срок действия паспорта",
      "Получите ИНН заранее, если еще нет",
      "Сделайте копии всех документов"
    ]
  },
  {
    id: "l2",
    title: "Юридический адрес",
    description: "Адрес регистрации для ИП или юридического лица",
    category: "legal",
    priority: "high",
    cost: "0 - 15 000 ₽/год",
    time: "1 день",
    completed: false,
    tips: [
      "Для ИП можно использовать адрес проживания",
      "Для ООО требуется юридический адрес",
      "Рассмотрите варианты аренды адреса"
    ]
  },
  {
    id: "l3",
    title: "Учредительные документы",
    description: "Заявление о регистрации и устав (для ООО)",
    category: "legal",
    priority: "high",
    cost: "0 - 5 000 ₽",
    time: "1-2 дня",
    completed: false,
    tips: [
      "Используйте шаблоны с официальных сайтов",
      "Обратитесь к юристу для проверки",
      "Подготовьте несколько экземпляров"
    ]
  },
  
  // Технические ресурсы
  {
    id: "t1",
    title: "Компьютер и интернет",
    description: "Рабочее место с выходом в интернет для ведения дел",
    category: "technical",
    priority: "high",
    cost: "15 000 - 50 000 ₽",
    time: "1 неделя",
    completed: false,
    tips: [
      "Подойдет существующий компьютер",
      "Обеспечьте стабильное интернет-соединение",
      "Рассмотрите облачные сервисы для хранения данных"
    ]
  },
  {
    id: "t2",
    title: "Телефон и связь",
    description: "Отдельный номер телефона для деловых коммуникаций",
    category: "technical",
    priority: "medium",
    cost: "300 - 1 000 ₽/мес",
    time: "1 день",
    completed: false,
    tips: [
      "Используйте отдельную SIM-карту",
      "Рассмотрите виртуальную АТС",
      "Настройте профессиональную голосовую почту"
    ]
  },
  {
    id: "t3",
    title: "Специализированное ПО",
    description: "Программы для ведения учета, документооборота и коммуникаций",
    category: "technical",
    priority: "medium",
    cost: "0 - 5 000 ₽/мес",
    time: "2-3 дня",
    completed: false,
    tips: [
      "Используйте бесплатные версии для начала",
      "Рассмотрите облачные бухгалтерские программы",
      "Настройте систему электронного документооборота"
    ]
  },
  
  // Человеческие ресурсы
  {
    id: "h1",
    title: "Профессиональные знания",
    description: "Экспертиза в выбранной сфере деятельности",
    category: "human",
    priority: "high",
    cost: "0 - 30 000 ₽",
    time: "1-3 месяца",
    completed: false,
    tips: [
      "Пройдите курсы повышения квалификации",
      "Изучите опыт конкурентов",
      "Найдите наставника в вашей сфере"
    ]
  },
  {
    id: "h2",
    title: "Бухгалтер на аутсорсе",
    description: "Специалист для ведения бухгалтерии и налогов",
    category: "human",
    priority: "medium",
    cost: "5 000 - 15 000 ₽/мес",
    time: "1 неделя",
    completed: false,
    tips: [
      "Выберите проверенного специалиста",
      "Заключите договор на оказание услуг",
      "Регулярно контролируйте работу"
    ]
  },
  {
    id: "h3",
    title: "Сеть контактов",
    description: "Профессиональные связи для поиска клиентов и партнеров",
    category: "human",
    priority: "medium",
    cost: "Бесплатно",
    time: "Постоянно",
    completed: false,
    tips: [
      "Посещайте профильные мероприятия",
      "Активно используйте социальные сети",
      "Участвуйте в бизнес-сообществах"
    ]
  },
  
  // Физические ресурсы
  {
    id: "p1",
    title: "Рабочее пространство",
    description: "Место для работы и встреч с клиентами",
    category: "physical",
    priority: "medium",
    cost: "0 - 20 000 ₽/мес",
    time: "1-2 недели",
    completed: false,
    tips: [
      "Начните с работы из дома",
      "Рассмотрите коворкинги",
      "Оцените необходимость отдельного офиса"
    ]
  },
  {
    id: "p2",
    title: "Оборудование и инструменты",
    description: "Необходимое оборудование для ведения деятельности",
    category: "physical",
    priority: "medium",
    cost: "5 000 - 100 000 ₽",
    time: "1-2 недели",
    completed: false,
    tips: [
      "Составьте список необходимого оборудования",
      "Рассмотрите варианты аренды или лизинга",
      "Начните с минимального набора"
    ]
  },
  {
    id: "p3",
    title: "Транспорт",
    description: "Транспортное средство для деловых поездок и доставки",
    category: "physical",
    priority: "low",
    cost: "0 - 30 000 ₽/мес",
    time: "1 неделя",
    completed: false,
    tips: [
      "Оцените реальную потребность в транспорте",
      "Рассмотрите каршеринг или такси",
      "Учтите расходы на топливо и обслуживание"
    ]
  }
];

const categories = [
  { id: "all", label: "Все ресурсы", icon: <BookOpen className="h-4 w-4" /> },
  { id: "financial", label: "Финансовые", icon: <DollarSign className="h-4 w-4" /> },
  { id: "legal", label: "Юридические", icon: <FileText className="h-4 w-4" /> },
  { id: "technical", label: "Технические", icon: <Laptop className="h-4 w-4" /> },
  { id: "human", label: "Человеческие", icon: <Users className="h-4 w-4" /> },
  { id: "physical", label: "Физические", icon: <Home className="h-4 w-4" /> }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800 border-red-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-green-100 text-green-800 border-green-200";
    default: return "secondary";
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "high": return "Высокий";
    case "medium": return "Средний";
    case "low": return "Низкий";
    default: return priority;
  }
};

export default function ResourceChecklist() {
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleResource = (resourceId: string) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, completed: !resource.completed }
          : resource
      )
    );
  };

  const toggleExpanded = (resourceId: string) => {
    setExpandedItems(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const filteredResources = selectedCategory === "all" 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const completedResources = resources.filter(resource => resource.completed).length;
  const progressPercentage = (completedResources / resources.length) * 100;

  const totalCost = resources
    .filter(r => r.completed && r.cost && r.cost !== "Бесплатно")
    .reduce((sum, resource) => {
      const costStr = resource.cost || "0";
      const minCost = parseInt(costStr.split(" - ")[0].replace(/\D/g, "")) || 0;
      return sum + minCost;
    }, 0);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Необходимые ресурсы
            </CardTitle>
            <CardDescription>
              Чек-лист ресурсов для запуска и ведения бизнеса
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {completedResources}/{resources.length} готово
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Общий прогресс */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Общая готовность</span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Примерная стоимость подготовленных ресурсов: {formatNumber(totalCost)} ₽</span>
            <span>Осталось ресурсов: {resources.length - completedResources}</span>
          </div>
        </div>

        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checklist">Чек-лист</TabsTrigger>
            <TabsTrigger value="summary">Сводка</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="mt-4">
            {/* Фильтр по категориям */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-1"
                >
                  {category.icon}
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Список ресурсов */}
            <div className="space-y-3">
              {filteredResources.map((resource) => (
                <div 
                  key={resource.id} 
                  className={`p-4 rounded-lg border transition-all ${
                    resource.completed 
                      ? "bg-green-50 border-green-200" 
                      : "bg-muted/30 border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Checkbox
                        checked={resource.completed}
                        onCheckedChange={() => toggleResource(resource.id)}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${resource.completed ? "text-green-800" : ""}`}>
                          {resource.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getPriorityColor(resource.priority)}`}>
                            {getPriorityLabel(resource.priority)}
                          </Badge>
                          {resource.cost && (
                            <Badge variant="outline" className="text-xs">
                              {resource.cost}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-2 ${resource.completed ? "text-green-700" : "text-muted-foreground"}`}>
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        {resource.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {resource.time}
                          </span>
                        )}
                      </div>
                      
                      {resource.tips && resource.tips.length > 0 && (
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-primary"
                            onClick={() => toggleExpanded(resource.id)}
                          >
                            <Lightbulb className="h-3 w-3 mr-1" />
                            {expandedItems.includes(resource.id) ? "Скрыть советы" : "Показать советы"}
                          </Button>
                          
                          {expandedItems.includes(resource.id) && (
                            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                              <ul className="space-y-1">
                                {resource.tips.map((tip, index) => (
                                  <li key={index} className="text-xs text-blue-700 flex items-start gap-1">
                                    <span className="mt-0.5 h-1 w-1 rounded-full bg-blue-500 flex-shrink-0"></span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Статистика по категориям */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Готовность по категориям</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categories.slice(1).map((category) => {
                    const categoryResources = resources.filter(r => r.category === category.id);
                    const completedCategory = categoryResources.filter(r => r.completed).length;
                    const categoryProgress = categoryResources.length > 0 
                      ? (completedCategory / categoryResources.length) * 100 
                      : 0;
                    
                    return (
                      <div key={category.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {category.icon}
                            <span className="text-sm font-medium">{category.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {completedCategory}/{categoryResources.length}
                          </span>
                        </div>
                        <Progress value={categoryProgress} className="h-1" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Приоритетные задачи */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Приоритетные задачи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {resources
                      .filter(r => !r.completed && r.priority === "high")
                      .slice(0, 5)
                      .map((resource) => (
                        <div key={resource.id} className="flex items-center gap-2 p-2 bg-red-50 rounded border border-red-200">
                          <Circle className="h-3 w-3 text-red-500" />
                          <span className="text-sm">{resource.title}</span>
                        </div>
                      ))}
                    
                    {resources.filter(r => !r.completed && r.priority === "high").length === 0 && (
                      <p className="text-sm text-green-600">Все высокоприоритетные задачи выполнены!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Рекомендации */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progressPercentage < 30 && (
                    <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        Сосредоточьтесь на ресурсах с высоким приоритетом. Это основа для успешного запуска бизнеса.
                      </p>
                    </div>
                  )}
                  
                  {progressPercentage >= 30 && progressPercentage < 70 && (
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-800">
                        Отличный прогресс! Теперь можно уделить внимание ресурсам со средним приоритетом.
                      </p>
                    </div>
                  )}
                  
                  {progressPercentage >= 70 && (
                    <div className="p-3 bg-green-50 rounded border border-green-200">
                      <p className="text-sm text-green-800">
                        Вы почти готовы к запуску! Проверьте оставшиеся ресурсы и составьте план действий.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    <Button variant="outline" size="sm">
                      Рассчитать общую стоимость
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
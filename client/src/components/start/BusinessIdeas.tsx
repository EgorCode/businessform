import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Laptop, 
  Heart, 
  Home, 
  Car, 
  Utensils, 
  Camera, 
  PenTool,
  TrendingUp,
  DollarSign,
  Users,
  Clock
} from "lucide-react";

interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  initialInvestment: "low" | "medium" | "high";
  profitability: "low" | "medium" | "high";
  complexity: "low" | "medium" | "high";
  timeToProfit: "fast" | "medium" | "slow";
  icon: React.ReactNode;
  tags: string[];
  pros: string[];
  cons: string[];
}

const businessIdeas: BusinessIdea[] = [
  {
    id: "1",
    title: "Интернет-магазин товаров для дома",
    description: "Продажа товаров для дома и декора через онлайн-платформы и социальные сети",
    category: "e-commerce",
    initialInvestment: "medium",
    profitability: "medium",
    complexity: "medium",
    timeToProfit: "medium",
    icon: <ShoppingCart className="h-5 w-5" />,
    tags: ["Онлайн-бизнес", "Товары", "Маркетплейсы"],
    pros: ["Растущий рынок", "Возможность работать из дома", "Широкий выбор товаров"],
    cons: ["Высокая конкуренция", "Необходимость логистики", "Требуются маркетинговые навыки"]
  },
  {
    id: "2",
    title: "IT-консалтинг для малого бизнеса",
    description: "Помощь малому бизнесу в автоматизации процессов и выборе ПО",
    category: "it",
    initialInvestment: "low",
    profitability: "high",
    complexity: "high",
    timeToProfit: "fast",
    icon: <Laptop className="h-5 w-5" />,
    tags: ["IT", "Консалтинг", "B2B"],
    pros: ["Высокая маржинальность", "Минимальные вложения", "Спрос на услуги"],
    cons: ["Требуется экспертиза", "Конкуренция с крупными компаниями", "Сложность поиска клиентов"]
  },
  {
    id: "3",
    title: "Фитнес-студия или тренерский бизнес",
    description: "Персональные тренировки, групповые занятия или онлайн-коучинг",
    category: "services",
    initialInvestment: "low",
    profitability: "medium",
    complexity: "medium",
    timeToProfit: "fast",
    icon: <Heart className="h-5 w-5" />,
    tags: ["Фитнес", "Здоровье", "Услуги"],
    pros: ["Растущий тренд на ЗОЖ", "Гибкий график", "Возможность онлайн-формата"],
    cons: ["Высокая физическая нагрузка", "Необходимость сертификации", "Сезонность спроса"]
  },
  {
    id: "4",
    title: "Аренда недвижимости для краткосрочного проживания",
    description: "Сдача квартир посуточно или организация гостевого дома",
    category: "realestate",
    initialInvestment: "high",
    profitability: "high",
    complexity: "medium",
    timeToProfit: "medium",
    icon: <Home className="h-5 w-5" />,
    tags: ["Недвижимость", "Инвестиции", "Туризм"],
    pros: ["Стабильный доход", "Рост стоимости актива", "Налоговые выгоды"],
    cons: ["Высокие первоначальные вложения", "Требуется управление", "Риски простоя"]
  },
  {
    id: "5",
    title: "Автосервис или мобильный шиномонтаж",
    description: "Техническое обслуживание автомобилей или выездные услуги",
    category: "automotive",
    initialInvestment: "medium",
    profitability: "medium",
    complexity: "high",
    timeToProfit: "medium",
    icon: <Car className="h-5 w-5" />,
    tags: ["Авто", "Сервис", "B2C"],
    pros: ["Постоянный спрос", "Возможность расширения", "Высокая лояльность клиентов"],
    cons: ["Требуется оборудование", "Высокая конкуренция", "Сезонность услуг"]
  },
  {
    id: "6",
    title: "Кейтеринг или доставка готовой еды",
    description: "Приготовление и доставка обедов в офисы или на мероприятия",
    category: "food",
    initialInvestment: "low",
    profitability: "medium",
    complexity: "medium",
    timeToProfit: "fast",
    icon: <Utensils className="h-5 w-5" />,
    tags: ["Еда", "Доставка", "Мероприятия"],
    pros: ["Постоянный спрос", "Возможность начать с малого", "Повторные заказы"],
    cons: ["Санитарные требования", "Логистика доставки", "Конкуренция"]
  },
  {
    id: "7",
    title: "Фотостудия или фотограф на мероприятия",
    description: "Профессиональная фотосъемка для мероприятий или портретов",
    category: "creative",
    initialInvestment: "low",
    profitability: "medium",
    complexity: "low",
    timeToProfit: "fast",
    icon: <Camera className="h-5 w-5" />,
    tags: ["Фотография", "Творчество", "Мероприятия"],
    pros: ["Творческая самореализация", "Гибкий график", "Низкие вложения"],
    cons: ["Сезонность работы", "Высокая конкуренция", "Требуется оборудование"]
  },
  {
    id: "8",
    title: "Копирайтинг и контент-маркетинг",
    description: "Создание текстового контента для бизнеса и медиа",
    category: "creative",
    initialInvestment: "low",
    profitability: "medium",
    complexity: "low",
    timeToProfit: "fast",
    icon: <PenTool className="h-5 w-5" />,
    tags: ["Тексты", "Маркетинг", "Онлайн"],
    pros: ["Работа из дома", "Минимальные вложения", "Высокий спрос"],
    cons: ["Высокая конкуренция", "Требуются навыки", "Нестабильный доход"]
  }
];

const categories = [
  { id: "all", label: "Все направления" },
  { id: "e-commerce", label: "E-commerce" },
  { id: "it", label: "IT и технологии" },
  { id: "services", label: "Услуги" },
  { id: "realestate", label: "Недвижимость" },
  { id: "automotive", label: "Авто" },
  { id: "food", label: "Еда и напитки" },
  { id: "creative", label: "Творчество" }
];

const getBadgeVariant = (type: string, value: string) => {
  if (type === "investment") {
    switch (value) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-red-100 text-red-800 border-red-200";
      default: return "secondary";
    }
  }
  if (type === "profitability") {
    switch (value) {
      case "low": return "bg-gray-100 text-gray-800 border-gray-200";
      case "medium": return "bg-blue-100 text-blue-800 border-blue-200";
      case "high": return "bg-green-100 text-green-800 border-green-200";
      default: return "secondary";
    }
  }
  if (type === "complexity") {
    switch (value) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-red-100 text-red-800 border-red-200";
      default: return "secondary";
    }
  }
  if (type === "time") {
    switch (value) {
      case "fast": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "slow": return "bg-red-100 text-red-800 border-red-200";
      default: return "secondary";
    }
  }
  return "secondary";
};

const getLabel = (type: string, value: string) => {
  if (type === "investment") {
    switch (value) {
      case "low": return "Низкие вложения";
      case "medium": return "Средние вложения";
      case "high": return "Высокие вложения";
      default: return value;
    }
  }
  if (type === "profitability") {
    switch (value) {
      case "low": return "Низкая";
      case "medium": return "Средняя";
      case "high": return "Высокая";
      default: return value;
    }
  }
  if (type === "complexity") {
    switch (value) {
      case "low": return "Просто";
      case "medium": return "Средне";
      case "high": return "Сложно";
      default: return value;
    }
  }
  if (type === "time") {
    switch (value) {
      case "fast": return "Быстрая окупаемость";
      case "medium": return "Средняя окупаемость";
      case "slow": return "Долгая окупаемость";
      default: return value;
    }
  }
  return value;
};

export default function BusinessIdeas() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);

  const filteredIdeas = selectedCategory === "all" 
    ? businessIdeas 
    : businessIdeas.filter(idea => idea.category === selectedCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Популярные бизнес-идеи
        </CardTitle>
        <CardDescription>
          Проверенные направления для начинающих предпринимателей с анализом рисков и преимуществ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="grid">Сетка</TabsTrigger>
              <TabsTrigger value="list">Список</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          <TabsContent value="grid" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIdeas.map((idea) => (
                <Card key={idea.id} className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {idea.icon}
                        </div>
                        <CardTitle className="text-lg">{idea.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {idea.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {idea.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <Badge className={`text-xs ${getBadgeVariant("investment", idea.initialInvestment)}`}>
                          {getLabel("investment", idea.initialInvestment)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <Badge className={`text-xs ${getBadgeVariant("profitability", idea.profitability)}`}>
                          {getLabel("profitability", idea.profitability)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <Badge className={`text-xs ${getBadgeVariant("complexity", idea.complexity)}`}>
                          {getLabel("complexity", idea.complexity)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <Badge className={`text-xs ${getBadgeVariant("time", idea.timeToProfit)}`}>
                          {getLabel("time", idea.timeToProfit)}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedIdea(idea)}
                    >
                      Подробнее
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="space-y-4">
              {filteredIdeas.map((idea) => (
                <Card key={idea.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                        {idea.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{idea.title}</h3>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedIdea(idea)}
                          >
                            Подробнее
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {idea.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`text-xs ${getBadgeVariant("investment", idea.initialInvestment)}`}>
                            {getLabel("investment", idea.initialInvestment)}
                          </Badge>
                          <Badge className={`text-xs ${getBadgeVariant("profitability", idea.profitability)}`}>
                            {getLabel("profitability", idea.profitability)}
                          </Badge>
                          <Badge className={`text-xs ${getBadgeVariant("complexity", idea.complexity)}`}>
                            {getLabel("complexity", idea.complexity)}
                          </Badge>
                          <Badge className={`text-xs ${getBadgeVariant("time", idea.timeToProfit)}`}>
                            {getLabel("time", idea.timeToProfit)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Детальная информация о бизнес-идее */}
        {selectedIdea && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {selectedIdea.icon}
                {selectedIdea.title}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIdea(null)}>
                Закрыть
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{selectedIdea.description}</p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2 text-green-700">Преимущества:</h4>
                <ul className="space-y-1">
                  {selectedIdea.pros.map((pro, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-red-700">Недостатки:</h4>
                <ul className="space-y-1">
                  {selectedIdea.cons.map((con, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button className="w-full">
                Рассчитать стоимость запуска
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
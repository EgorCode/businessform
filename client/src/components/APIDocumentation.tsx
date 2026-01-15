import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Database, Zap, Shield, CheckCircle, AlertCircle } from "lucide-react";

export default function APIDocumentation() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/ai/chat",
      description: "Отправить сообщение в AI-чат",
      parameters: [
        { name: "message", type: "string", required: true, description: "Текст сообщения пользователя" },
        { name: "context", type: "array", required: false, description: "История диалога" },
        { name: "category", type: "string", required: false, description: "Категория сообщения" }
      ],
      response: {
        message: "string",
        category: "general|business-form|taxes|documents|registration",
        suggestions: ["string"],
        relatedTools: ["string"]
      }
    },
    {
      method: "POST",
      path: "/api/ai/analyze-business",
      description: "Анализ бизнес-ситуации для рекомендации формы",
      parameters: [
        { name: "description", type: "string", required: true, description: "Описание бизнеса" },
        { name: "expectedIncome", type: "number", required: false, description: "Ожидаемый доход в месяц" },
        { name: "employees", type: "number", required: false, description: "Количество сотрудников" },
        { name: "industry", type: "string", required: false, description: "Сфера деятельности" },
        { name: "hasPartners", type: "boolean", required: false, description: "Наличие партнёров" }
      ],
      response: {
        recommendedForm: "self-employed|sole-proprietor|llc",
        reasoning: "string",
        taxSystem: "string",
        estimatedTaxes: "number",
        registrationSteps: ["string"],
        documents: ["string"],
        pros: ["string"],
        cons: ["string"]
      }
    },
    {
      method: "POST",
      path: "/api/ai/calculate-taxes",
      description: "Расчёт налогов для разных форм бизнеса",
      parameters: [
        { name: "businessForm", type: "string", required: true, description: "Форма бизнеса" },
        { name: "taxSystem", type: "string", required: true, description: "Система налогообложения" },
        { name: "income", type: "number", required: true, description: "Доход" },
        { name: "expenses", type: "number", required: false, description: "Расходы" },
        { name: "employees", type: "number", required: false, description: "Количество сотрудников" }
      ],
      response: {
        totalTax: "number",
        taxBreakdown: {
          incomeTax: "number",
          socialContributions: "number",
          otherTaxes: "number"
        },
        effectiveRate: "number",
        quarterlyPayments: ["number"]
      }
    },
    {
      method: "POST",
      path: "/api/ai/analyze-document",
      description: "Анализ загруженных документов",
      parameters: [
        { name: "document", type: "file", required: true, description: "Файл документа (PDF, JPG, PNG)" }
      ],
      response: {
        summary: "string",
        insights: ["string"]
      }
    }
  ];

  const codeExamples = {
    chat: `// Пример запроса к AI-чату
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: "Какую форму бизнеса выбрать для фрилансера?",
    category: "business-form"
  })
});

const data = await response.json();
console.log(data.message); // Ответ от AI`,
    
    businessAnalysis: `// Пример анализа бизнеса
const response = await fetch('/api/ai/analyze-business', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    description: "Разработка мобильных приложений",
    expectedIncome: 150000,
    employees: 1,
    industry: "IT и разработка",
    hasPartners: false
  })
});

const result = await response.json();
console.log(result.recommendedForm); // self-employed
console.log(result.estimatedTaxes); // 9000`,
    
    taxCalculation: `// Пример расчёта налогов
const response = await fetch('/api/ai/calculate-taxes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    businessForm: "sole-proprietor",
    taxSystem: "УСН 6%",
    income: 100000,
    expenses: 20000
  })
});

const taxes = await response.json();
console.log(taxes.totalTax); // 10500
console.log(taxes.effectiveRate); // 10.5`
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            API ИИ-помощника
          </CardTitle>
          <CardDescription>
            Техническая документация для интеграции ИИ-помощника
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">REST API</Badge>
              <Badge variant="outline">JSON</Badge>
              <Badge variant="outline">Bearer Token</Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Базовый URL:</h4>
              <code className="block bg-muted p-2 rounded text-sm">
                https://api.bizstartmaster.ru/v1
              </code>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Аутентификация:</h4>
              <p className="text-sm text-muted-foreground">
                Все запросы должны содержать заголовок Authorization с Bearer токеном:
              </p>
              <code className="block bg-muted p-2 rounded text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="endpoints">Эндпоинты</TabsTrigger>
          <TabsTrigger value="examples">Примеры кода</TabsTrigger>
          <TabsTrigger value="errors">Ошибки</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          {endpoints.map((endpoint, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{endpoint.path}</CardTitle>
                  <Badge variant={endpoint.method === "POST" ? "default" : "secondary"}>
                    {endpoint.method}
                  </Badge>
                </div>
                <CardDescription>{endpoint.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Параметры:</h4>
                  <div className="space-y-2">
                    {endpoint.parameters.map((param, paramIdx) => (
                      <div key={paramIdx} className="flex items-start gap-3 p-2 border rounded">
                        <div className="flex items-center gap-2 min-w-0">
                          <code className="text-sm bg-muted px-1 rounded">{param.name}</code>
                          <Badge variant="outline" className="text-xs">
                            {param.type}
                          </Badge>
                          {param.required && (
                            <Badge variant="destructive" className="text-xs">required</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {param.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Ответ:</h4>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          {Object.entries(codeExamples).map(([key, code]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  {key === 'chat' && 'AI-чат'}
                  {key === 'businessAnalysis' && 'Анализ бизнеса'}
                  {key === 'taxCalculation' && 'Расчёт налогов'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                  <code>{code}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Коды ошибок
              </CardTitle>
              <CardDescription>
                Возможные ошибки и способы их решения
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">400</Badge>
                      <span className="font-medium">Bad Request</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Неверный формат запроса или отсутствуют обязательные параметры
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">401</Badge>
                      <span className="font-medium">Unauthorized</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Неверный API ключ или отсутствует заголовок авторизации
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">429</Badge>
                      <span className="font-medium">Too Many Requests</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Превышен лимит запросов. Максимум 100 запросов в минуту
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">500</Badge>
                      <span className="font-medium">Internal Server Error</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Внутренняя ошибка сервера. Попробуйте повторить запрос позже
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Лимиты и квоты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium">Бесплатный тариф</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        100 запросов в день
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Базовые модели AI
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                        Без приоритетной поддержки
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Pro тариф</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        10 000 запросов в день
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Улучшенные модели AI
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Приоритетная поддержка
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
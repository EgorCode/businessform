import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

// todo: remove mock functionality
const articles = [
  {
    id: 1,
    title: "Пошаговая инструкция по регистрации ИП в 2024 году",
    category: "Регистрация",
    excerpt: "Подробный гайд по всем этапам регистрации индивидуального предпринимателя: от подготовки документов до получения свидетельства",
    readTime: "8 мин",
  },
  {
    id: 2,
    title: "УСН 6% или 15%: как выбрать оптимальную ставку",
    category: "Налоги",
    excerpt: "Разбираем на примерах, в каких случаях выгоднее платить налог с доходов, а когда - с разницы между доходами и расходами",
    readTime: "6 мин",
  },
  {
    id: 3,
    title: "Что делать после регистрации ООО: чек-лист",
    category: "Регистрация",
    excerpt: "15 важных шагов, которые нужно сделать сразу после получения документов о регистрации общества",
    readTime: "10 мин",
  },
  {
    id: 4,
    title: "Как правильно нанять первого сотрудника",
    category: "Кадры",
    excerpt: "Подробная инструкция по оформлению трудового договора, постановке на учет в фондах и кадровому документообороту",
    readTime: "12 мин",
  },
  {
    id: 5,
    title: "НПД vs ИП: когда пора переходить",
    category: "Налоги",
    excerpt: "Признаки того, что самозанятость больше не подходит для вашего бизнеса и пора регистрировать ИП",
    readTime: "5 мин",
  },
  {
    id: 6,
    title: "Расчёт страховых взносов для ИП в 2024",
    category: "Налоги",
    excerpt: "Актуальные размеры фиксированных взносов, правила их уплаты и возможность уменьшения налога",
    readTime: "7 мин",
  },
];

export default function KnowledgeBase() {
  const handleReadArticle = (articleId: number, articleTitle: string) => {
    console.log('Reading article:', { articleId, articleTitle });
  };

  return (
    <section id="knowledge" className="border-b py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl" data-testid="text-knowledge-title">
            База знаний
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid="text-knowledge-subtitle">
            Гайды, статьи и чек-листы по регистрации и ведению бизнеса
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="flex flex-col hover-elevate" data-testid={`card-article-${article.id}`}>
              <CardHeader>
                <Badge variant="secondary" className="mb-2 w-fit">
                  {article.category}
                </Badge>
                <CardTitle className="text-xl leading-tight">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="line-clamp-3 text-base leading-relaxed">
                  {article.excerpt}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleReadArticle(article.id, article.title)}
                  data-testid={`button-read-${article.id}`}
                >
                  Читать
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

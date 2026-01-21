import { useMemo, useState, useEffect as ReactUseEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/strapi";
import { KnowledgeArticle as StrapiArticle, StrapiResponse } from "@/types/strapi";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Eye, Star, Heart, TrendingUp, Calendar, User, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KnowledgeCategoriesProps {
  category: string;
  searchQuery: string;
  selectedTag: string;
}

interface Article {
  id: number | string;
  documentId?: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  author?: string;
  readTime: string;
  tags: string[];
  views: number;
  rating: number;
  isFavorite: boolean;
  isNew: boolean;
  isPopular: boolean;
  publishDate: string;
}

// Моковые данные для статей (fallback)
const staticArticles: Article[] = [
  // Авторские статьи (Баканина Анастасия)
  {
    id: 101,
    title: "Блог как бизнес-проект: ключевые этапы построения",
    category: "starting",
    author: "Баканина Анастасия",
    excerpt: "Для большинства авторов контента самозанятость или налог на профессиональный доход (НПД) — золотой ключ: просто, легально, без избыточной бюрократии.",
    content: `Юридически понятия «блогер» в закодательсве нет. Но если за публикации, обзоры, сторис или ролики приходят деньги — деятельность признаётся предпринимательской (ст. 2 ГК РФ). А значит, требует оформления...`,
    readTime: "5 мин",
    tags: ["Блогер", "НПД", "Бизнес"],
    views: 3200,
    rating: 5.0,
    isFavorite: false,
    isNew: true,
    isPopular: true,
    publishDate: "2024-03-30"
  },
  {
    id: 102,
    title: "ИП: в чем сильные стороны и где подводные камни",
    category: "starting",
    author: "Баканина Анастасия",
    excerpt: "Индивидуальный предприниматель (ИП) — это физическое лицо, зарегистрированное в установленном законом порядке. Разбираем плюсы, минусы и налоговые режимы.",
    content: `Индивидуальный предприниматель (ИП) — это физическое лицо, зарегистрированное в установленном законом порядке и осуществляющее предпринимательскую деятельность...`,
    readTime: "10 мин",
    tags: ["ИП", "Регистрация", "Налоги"],
    views: 2800,
    rating: 4.9,
    isFavorite: true,
    isNew: true,
    isPopular: true,
    publishDate: "2024-03-28"
  },
];

const categoryNames = {
  all: "Все статьи",
  starting: "Начало бизнеса",
  taxes: "Налоги и бухгалтерия",
  hr: "Кадры и трудовое право",
  marketing: "Маркетинг и продажи",
  legal: "Юридические аспекты",
  finance: "Финансы и инвестиции",
};

export default function KnowledgeCategories({ category, searchQuery, selectedTag }: KnowledgeCategoriesProps) {
  const { settings } = useSiteSettings();
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Fetch from Strapi v5
  const { data: strapiResponse, isLoading, error } = useQuery<StrapiResponse<StrapiArticle[]>>({
    queryKey: ["/knowledge-articles"],
    queryFn: () => fetchAPI<StrapiResponse<StrapiArticle[]>>("/knowledge-articles"),
    retry: 1,
  });

  // Handle visibility
  if (settings && settings.showKnowledgeBase === false) {
    return null;
  }

  // Transform and sync local state
  const articles = useMemo(() => {
    if (error) {
      console.log("⚠️ [Knowledge] Using static articles due to fetch error");
      return staticArticles;
    }

    if (strapiResponse?.data && strapiResponse.data.length > 0) {
      console.log("📦 [Knowledge] Transforming Strapi articles...");
      return strapiResponse.data.map((item: StrapiArticle): Article => ({
        id: item.documentId,
        documentId: item.documentId,
        title: item.title,
        category: item.category,
        excerpt: item.excerpt,
        content: typeof item.content === 'string' ? item.content : JSON.stringify(item.content), // Fallback simplification
        author: item.author,
        readTime: item.readTime,
        tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(',') : []),
        views: item.views,
        rating: item.rating,
        isFavorite: item.isFavorite,
        isNew: item.isNew,
        isPopular: item.isPopular,
        publishDate: item.publishDate,
      }));
    }

    return isLoading ? [] : staticArticles;
  }, [strapiResponse, error, isLoading]);

  // Sync initial articles to local state for toggling favorites
  ReactUseEffect(() => {
    if (articles.length > 0) {
      setLocalArticles(articles);
    }
  }, [articles]);

  const toggleFavorite = (articleId: number | string) => {
    setLocalArticles(prev =>
      prev.map(article =>
        article.id === articleId
          ? { ...article, isFavorite: !article.isFavorite }
          : article
      )
    );
  };

  const filteredArticles = localArticles.filter((article: Article) => {
    const matchesCategory = category === "all" || article.category === category;
    const matchesSearch = searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === "" || article.tags.includes(selectedTag);

    return matchesCategory && matchesSearch && matchesTag;
  });

  const tabFilteredArticles = filteredArticles.filter((article: Article) => {
    if (activeTab === "all") return true;
    if (activeTab === "popular") return article.isPopular;
    if (activeTab === "new") return article.isNew;
    if (activeTab === "favorites") return article.isFavorite;
    return true;
  });

  if (isLoading && !strapiResponse) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleReadArticle = (article: Article) => {
    setSelectedArticle(article);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {categoryNames[category as keyof typeof categoryNames]}
        </h2>
        <div className="text-sm text-muted-foreground">
          Найдено статей: {filteredArticles.length}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList data-testid="knowledge-categories-tabs">
          <TabsTrigger value="all" data-testid="knowledge-categories-tab">Все статьи</TabsTrigger>
          <TabsTrigger value="popular" className="gap-2" data-testid="knowledge-categories-tab">
            <TrendingUp className="h-4 w-4" />
            Популярные
          </TabsTrigger>
          <TabsTrigger value="new" className="gap-2" data-testid="knowledge-categories-tab">
            <Calendar className="h-4 w-4" />
            Новые
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2" data-testid="knowledge-categories-tab">
            <Heart className="h-4 w-4" />
            Избранное
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {tabFilteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Статьи не найдены. Попробуйте изменить параметры поиска или фильтры.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tabFilteredArticles.map((article) => (
                <Card key={article.id} className="flex flex-col hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        {article.isNew && (
                          <Badge variant="secondary" className="w-fit">
                            Новое
                          </Badge>
                        )}
                        {article.isPopular && (
                          <Badge variant="default" className="w-fit">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Популярное
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => toggleFavorite(article.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${article.isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                        />
                      </Button>
                    </div>
                    {article.author && (
                      <div className="text-xs font-semibold text-primary mt-2">
                        {article.author}
                      </div>
                    )}
                    <CardTitle className="text-xl leading-tight line-clamp-2 mt-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="line-clamp-3 text-base leading-relaxed">
                      {article.excerpt}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{article.rating}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReadArticle(article)}
                    >
                      Читать
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0">
          {selectedArticle && (
            <>
              <DialogHeader className="p-6 pb-4 border-b">
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="font-normal">
                    {categoryNames[selectedArticle.category as keyof typeof categoryNames] || selectedArticle.category}
                  </Badge>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedArticle.readTime} чтения</span>
                </div>
                <DialogTitle className="text-2xl font-bold leading-tight">{selectedArticle.title}</DialogTitle>
                {selectedArticle.author && (
                  <DialogDescription className="text-base text-foreground font-medium pt-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Автор: {selectedArticle.author}
                  </DialogDescription>
                )}
              </DialogHeader>
              <ScrollArea className="flex-1 p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
                    {selectedArticle.content || selectedArticle.excerpt}
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
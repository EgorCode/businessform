import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { News } from "@shared/schema";

interface NewsHighlightProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function NewsHighlight({ limit = 3, showViewAll = true }: NewsHighlightProps) {
  const [news, setNews] = useState<(News & {
    categoryName?: string;
    categorySlug?: string;
    tags?: string[];
    businessForms?: string[];
  })[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getBusinessFormColor = (form: string) => {
    switch (form) {
      case 'НПД':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ИП':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ООО':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/news/featured?limit=${limit}`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching featured news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [limit]);

  if (loading) {
    return (
      <section className="border-b py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold">Актуальные новости</h2>
              </div>
              
              {showViewAll && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-8 rounded-md px-3 text-xs"
                >
                  Все новости
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: limit }).map((_, index) => (
                <Card key={index} className="transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-16 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="border-b py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">Актуальные новости</h2>
            </div>
            
            {showViewAll && (
              <Link href="/news">
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-8 rounded-md px-3 text-xs"
                >
                  Все новости
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {news.map((newsItem, index) => (
              <div key={newsItem.id} className="relative flex flex-col h-full">
                <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {newsItem.categoryName && (
                        <Badge variant="outline" className="text-xs">
                          {newsItem.categoryName}
                        </Badge>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(newsItem.publishedAt)}
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg leading-tight">
                      <Link
                        href={`/news/${newsItem.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {newsItem.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex-1">
                    {newsItem.summary && (
                      <CardDescription className="text-sm line-clamp-2 mb-3">
                        {newsItem.summary}
                      </CardDescription>
                    )}
                    
                    {newsItem.businessForms && newsItem.businessForms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {newsItem.businessForms.map((form, formIndex) => (
                          <Badge
                            key={formIndex}
                            variant="outline"
                            className={`text-xs ${getBusinessFormColor(form)}`}
                          >
                            {form}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-auto">
                      <Link
                        href={`/news/${newsItem.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Читать далее
                      </Link>
                      
                      {newsItem.imageUrl && (
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ml-2">
                          <img
                            src={newsItem.imageUrl}
                            alt={newsItem.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
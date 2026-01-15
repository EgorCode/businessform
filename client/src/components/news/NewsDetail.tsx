import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft, Share2, Tag } from "lucide-react";
import { News } from "@shared/schema";

interface NewsDetailProps {
  newsId?: string;
}

export default function NewsDetail({ newsId: propNewsId }: NewsDetailProps) {
  const params = useParams();
  const newsId = propNewsId || params.id;
  const [news, setNews] = useState<News & {
    categoryName?: string;
    categorySlug?: string;
    tags?: string[];
    businessForms?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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
    if (!newsId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/news/${newsId}`);
      
      if (!response.ok) {
        throw new Error('Новость не найдена');
      }
      
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке новости');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [newsId]);

  const shareNews = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary || '',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">Ошибка</h1>
        <p className="text-muted-foreground mb-6">{error || 'Новость не найдена'}</p>
        <Link href="/news">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к новостям
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/news" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            К новостям
          </Link>
          
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
            {news.categoryName && (
              <Badge variant="outline">
                {news.categoryName}
              </Badge>
            )}
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(news.publishedAt)}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {news.title}
          </h1>
          
          {news.businessForms && news.businessForms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {news.businessForms.map((form, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={getBusinessFormColor(form)}
                >
                  {form}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        {news.imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={news.imageUrl} 
              alt={news.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {news.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Теги</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t pt-6 flex flex-col sm:flex-row gap-4">
          <Button onClick={shareNews} variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Поделиться
          </Button>
          
          <Link href="/news">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Все новости
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
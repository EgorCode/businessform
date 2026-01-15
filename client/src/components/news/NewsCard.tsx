import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag } from "lucide-react";
import { Link } from "wouter";
import { News } from "@shared/schema";

interface NewsCardProps {
  news: News & {
    categoryName?: string;
    categorySlug?: string;
    tags?: string[];
    businessForms?: string[];
  };
  compact?: boolean;
}

export default function NewsCard({ news, compact = false }: NewsCardProps) {
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

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className={compact ? "pb-3" : "pb-4"}>
        <div className="flex items-start justify-between gap-2 mb-2">
          {news.categoryName && (
            <Badge variant="outline" className="text-xs">
              {news.categoryName}
            </Badge>
          )}
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(news.publishedAt)}
          </div>
        </div>
        
        <CardTitle className={`${compact ? "text-lg" : "text-xl"} leading-tight`}>
          <Link 
            href={`/news/${news.id}`}
            className="hover:text-primary transition-colors"
          >
            {news.title}
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {news.summary && (
          <CardDescription className={`${compact ? "text-sm line-clamp-2" : "line-clamp-3"} mb-4`}>
            {news.summary}
          </CardDescription>
        )}
        
        {news.businessForms && news.businessForms.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {news.businessForms.map((form, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className={`text-xs ${getBusinessFormColor(form)}`}
              >
                {form}
              </Badge>
            ))}
          </div>
        )}
        
        {news.tags && Array.isArray(news.tags) && news.tags.length > 0 && !compact && (
          <div className="flex flex-wrap gap-1 mb-3">
            {news.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {news.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{news.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Link 
            href={`/news/${news.id}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Читать далее
          </Link>
          
          {news.imageUrl && (
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ml-2">
              <img 
                src={news.imageUrl} 
                alt={news.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
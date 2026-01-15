import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, Eye, Star, Heart, Share2, Calendar, User, MessageSquare } from "lucide-react";

interface KnowledgeArticleProps {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  readTime: string;
  tags: string[];
  views: number;
  rating: number;
  isFavorite: boolean;
  isNew: boolean;
  isPopular: boolean;
  publishDate: string;
  author?: string;
  comments?: number;
}

export default function KnowledgeArticle({
  id,
  title,
  category,
  excerpt,
  content,
  readTime,
  tags,
  views,
  rating,
  isFavorite,
  isNew,
  isPopular,
  publishDate,
  author = "Эксперт BizStartMaster",
  comments = 0,
}: KnowledgeArticleProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [userRating, setUserRating] = useState(0);
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  const handleRating = (newRating: number) => {
    setUserRating(newRating);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const categoryColors = {
    starting: "bg-blue-100 text-blue-800 border-blue-200",
    taxes: "bg-green-100 text-green-800 border-green-200",
    hr: "bg-purple-100 text-purple-800 border-purple-200",
    marketing: "bg-orange-100 text-orange-800 border-orange-200",
    legal: "bg-red-100 text-red-800 border-red-200",
    finance: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const categoryNames = {
    starting: "Начало бизнеса",
    taxes: "Налоги и бухгалтерия",
    hr: "Кадры и трудовое право",
    marketing: "Маркетинг и продажи",
    legal: "Юридические аспекты",
    finance: "Финансы и инвестиции",
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge 
                className={categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800 border-gray-200"}
              >
                {categoryNames[category as keyof typeof categoryNames]}
              </Badge>
              {isNew && (
                <Badge variant="secondary">
                  Новое
                </Badge>
              )}
              {isPopular && (
                <Badge variant="default">
                  Популярное
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl leading-tight">
              {title}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className="h-9 w-9"
            >
              <Heart
                className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-9 w-9"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-base leading-relaxed">
          {excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{comments}</span>
            </div>
          </div>
        </div>

        {content && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Содержание статьи</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullContent(!showFullContent)}
              >
                {showFullContent ? "Скрыть" : "Показать полностью"}
              </Button>
            </div>
            
            {showFullContent && (
              <div className="prose prose-sm max-w-none">
                {content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Оцените статью:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 cursor-pointer transition-colors ${
                    star <= (userRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                  onClick={() => handleRating(star)}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating.toFixed(1)} ({userRating > 0 ? 'Ваша оценка' : 'Средняя оценка'})
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Назад к списку
        </Button>
        <Button>
          Читать полностью
        </Button>
      </CardFooter>
    </Card>
  );
}
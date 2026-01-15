import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import NewsCard from "./NewsCard";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { News, NewsCategory } from "@shared/schema";

interface NewsListProps {
  initialNews?: (News & {
    categoryName?: string;
    categorySlug?: string;
    tags?: string[];
    businessForms?: string[];
  })[];
  initialCategories?: NewsCategory[];
  featured?: boolean;
}

export default function NewsList({ initialNews = [], initialCategories = [], featured = false }: NewsListProps) {
  const [news, setNews] = useState<(News & {
    categoryName?: string;
    categorySlug?: string;
    tags?: string[];
    businessForms?: string[];
  })[]>(initialNews);
  const [categories, setCategories] = useState<NewsCategory[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBusinessForm, setSelectedBusinessForm] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const businessForms = [
    { value: "all", label: "Все формы" },
    { value: "НПД", label: "НПД" },
    { value: "ИП", label: "ИП" },
    { value: "ООО", label: "ООО" }
  ];

  const fetchNews = async (page = 1, reset = false) => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: featured ? "3" : "12"
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedBusinessForm && selectedBusinessForm !== "all") params.append("businessForm", selectedBusinessForm);

      const endpoint = featured ? "/api/news/featured" : "/api/news";
      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();

      if (featured) {
        setNews(data);
      } else {
        setNews(data.news);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/news/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (initialCategories.length === 0) {
      fetchCategories();
    }
  }, [initialCategories.length]);

  useEffect(() => {
    setCurrentPage(1);
    fetchNews(1, true);
  }, [searchTerm, selectedCategory, selectedBusinessForm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchNews(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews(1, true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedBusinessForm("all");
    setCurrentPage(1);
  };

  if (featured && news.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="space-y-6">
      {!featured && (
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск новостей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map((category) => {
                  console.log('Category:', category);
                  return (
                    <SelectItem key={category.id || 'unknown'} value={(category.id || '0').toString()}>
                      {category.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select value={selectedBusinessForm} onValueChange={setSelectedBusinessForm}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Форма бизнеса" />
              </SelectTrigger>
              <SelectContent>
                {businessForms.map((form) => {
                  console.log('Business form:', form);
                  return (
                    <SelectItem key={form.value || 'all'} value={form.value || 'all'}>
                      {form.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {(searchTerm || selectedCategory || selectedBusinessForm) && (
              <Button variant="outline" onClick={clearFilters}>
                Сбросить
              </Button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: featured ? 3 : 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchTerm || selectedCategory || selectedBusinessForm
                  ? "Новостей по заданным фильтрам не найдено"
                  : "Новостей пока нет"}
              </p>
              {(searchTerm || selectedCategory || selectedBusinessForm) && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Сбросить фильтры
                </Button>
              )}
            </div>
          ) : (
            <div className={`grid gap-6 ${featured ? "md:grid-cols-1 lg:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"}`}>
              {news.map((newsItem) => (
                <NewsCard 
                  key={newsItem.id} 
                  news={newsItem} 
                  compact={featured}
                />
              ))}
            </div>
          )}
        </>
      )}

      {!featured && !loading && news.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Показано {news.length} из {totalCount} новостей
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Назад
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Вперед
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
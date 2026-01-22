import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import NewsCard from "./NewsCard";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";
import { StrapiResponse, NewsItem as StrapiNewsItem } from "@/types/strapi";

import { staticNews, News } from "@/data/staticNews";

// No local staticNews array definition needed anymore

interface NewsListProps {
  initialNews?: any[];
  initialCategories?: any[];
  featured?: boolean;
}

export default function NewsList({ featured = false }: NewsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = featured ? 3 : 12;

  // 2. Fetch Dynamic News from Strapi
  const buildQuery = () => {
    const params = new URLSearchParams();
    params.append("pagination[page]", currentPage.toString());
    params.append("pagination[pageSize]", pageSize.toString());
    params.append("sort[0]", "publishedAt:desc");
    params.append("populate", "*");

    if (searchTerm) {
      params.append("filters[title][$containsi]", searchTerm);
    }

    if (selectedCategory && selectedCategory !== "all") {
      params.append("filters[category][$eq]", selectedCategory);
    }

    return `/news-items?${params.toString()}`;
  };

  const { data: strapiResponse, isLoading } = useQuery({
    queryKey: ["news-list", currentPage, searchTerm, selectedCategory, featured],
    queryFn: () => fetchAPI<StrapiResponse<StrapiNewsItem[]>>(buildQuery()),
    retry: 1
  });

  const strapiNews = strapiResponse?.data?.map((item: StrapiNewsItem) => ({
    id: item.documentId || item.id, // Use documentId if available
    title: item.title,
    summary: item.summary,
    content: item.content || "",
    publishedAt: item.publishedAt,
    categoryName: item.category || "Новости",
    imageUrl: getStrapiMedia(item.image?.url),
    businessForms: [],
    tags: [],
    isStatic: false
  })) || [];

  // 3. Combine Static + Strapi Data
  // Filter static news based on search term and category locally
  const filteredStaticNews = staticNews.filter(item => {
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedCategory !== "all" && item.categoryName !== selectedCategory) return false;
    return true;
  });

  // Merge logic:
  // If "Featured" (homepage), take top 3 from mixed list.
  // If "All News" (NewsPage), show everything.
  // Order: Strapi (Newest) -> Static (Legacy)
  const allNews = [...strapiNews, ...filteredStaticNews];

  // Apply pagination manually if needed for combined list, but since Strapi is paginated on server,
  // and static is small, we just append static to the current page.
  // Ideally, static news should only appear on Page 1.
  const displayNews = (currentPage === 1) ? [...strapiNews, ...filteredStaticNews] : strapiNews;

  // If featured, limit to 3 items total
  const finalNews = featured ? displayNews.slice(0, 3) : displayNews;

  const totalCount = (strapiResponse?.meta?.pagination?.total || 0) + filteredStaticNews.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Categories
  const categories = [
    { id: "НПД", name: "НПД" },
    { id: "ИП", name: "ИП" },
    { id: "ООО", name: "ООО" },
    { id: "Законодательство", name: "Законодательство" },
    { id: "ФНС", name: "ФНС" }
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  if (featured && finalNews.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-6">
      {!featured && (
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Поиск новостей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || selectedCategory !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                Сбросить
              </Button>
            )}
          </div>
        </div>
      )}

      {isLoading && finalNews.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: featured ? 3 : 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {finalNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Новостей не найдено
              </p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${featured ? "md:grid-cols-1 lg:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"}`}>
              {finalNews.map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  news={newsItem as any}
                  compact={featured}
                />
              ))}
            </div>
          )}
        </>
      )}

      {!featured && !isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {totalCount} новостей
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
            <span className="text-sm">
              Страница {currentPage} из {totalPages}
            </span>
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

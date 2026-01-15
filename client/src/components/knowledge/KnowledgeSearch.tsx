import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface KnowledgeSearchProps {
  onSearch: (query: string) => void;
  selectedCategory: string;
  selectedTag: string;
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
}

const categories = [
  { value: "all", label: "Все категории" },
  { value: "starting", label: "Начало бизнеса" },
  { value: "taxes", label: "Налоги и бухгалтерия" },
  { value: "hr", label: "Кадры и трудовое право" },
  { value: "marketing", label: "Маркетинг и продажи" },
  { value: "legal", label: "Юридические аспекты" },
  { value: "finance", label: "Финансы и инвестиции" },
];

const popularTags = [
  "Регистрация ИП",
  "УСН",
  "Налоги",
  "Трудовой договор",
  "Маркетинг",
  "Инвестиции",
  "Лицензирование",
  "Бухгалтерия",
  "Кадры",
  "Продажи",
];

export default function KnowledgeSearch({
  onSearch,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
}: KnowledgeSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      onTagChange("");
    } else {
      onTagChange(tag);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    onTagChange("");
    onCategoryChange("all");
  };

  const hasActiveFilters = selectedTag || selectedCategory !== "all" || searchQuery;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по статьям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="gap-2">
          <Search className="h-4 w-4" />
          Найти
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Очистить
          </Button>
        )}
      </form>

      {showFilters && (
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Категория</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onCategoryChange(category.value)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Популярные теги</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTag && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Выбранный тег:</span>
          <Badge variant="secondary" className="gap-1">
            {selectedTag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => onTagChange("")}
            />
          </Badge>
        </div>
      )}
    </div>
  );
}
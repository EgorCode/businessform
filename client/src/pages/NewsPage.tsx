import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import NewsList from "@/components/news/NewsList";
import { Newspaper, TrendingUp } from "lucide-react";
import { News, NewsCategory } from "@shared/schema";

export default function NewsPage() {
  const [featuredNews, setFeaturedNews] = useState<(News & {
    categoryName?: string;
    categorySlug?: string;
    tags?: string[];
    businessForms?: string[];
  })[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedNews = async () => {
    try {
      const response = await fetch("/api/news/featured");
      const data = await response.json();
      setFeaturedNews(data);
    } catch (error) {
      console.error("Error fetching featured news:", error);
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
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchFeaturedNews(),
        fetchCategories()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <PageLayout>
      <PageHeader
        title="Новости"
        description="Актуальные новости законодательства, налоговые изменения и важные события для бизнеса"
        breadcrumbs={[{ label: "Новости" }]}
      />

      {/* Featured News Section */}
      {featuredNews.length > 0 && (
        <PageSection size="lg" background="muted">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold">Актуальные новости</h2>
            </div>
            
            <NewsList
              initialNews={featuredNews}
              initialCategories={categories}
              featured={true}
            />
          </div>
        </PageSection>
      )}

      {/* All News Section */}
      <PageSection size="lg">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Все новости</h2>
          
          <NewsList
            initialNews={[]}
            initialCategories={categories}
            featured={false}
          />
        </div>
      </PageSection>
    </PageLayout>
  );
}
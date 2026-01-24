import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import KnowledgeSearch from "@/components/knowledge/KnowledgeSearch";
import KnowledgeCategories from "@/components/knowledge/KnowledgeCategories";
import FeaturedArticlesGrid from "@/components/FeaturedArticlesGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
  };

  return (
    <PageLayout>
      <PageHeader
        title="База знаний"
        description="Полезные статьи, гайды и инструкции для ведения бизнеса"
        breadcrumbs={[{ label: "База знаний" }]}
      />

      <PageSection size="sm">
        <KnowledgeSearch
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onCategoryChange={handleCategoryChange}
          onTagChange={handleTagChange}
        />
      </PageSection>

      <PageSection size="sm" className="pt-0">
        <FeaturedArticlesGrid />
      </PageSection>

      <PageSection>
        <Tabs defaultValue="all" className="w-full" onValueChange={handleCategoryChange}>
          <div className="overflow-x-auto -mx-4 px-6 sm:mx-0 sm:px-2 py-2">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 min-w-max sm:min-w-0 gap-1 sm:gap-2 h-auto p-2">
              <TabsTrigger value="all" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Все статьи</TabsTrigger>
              <TabsTrigger value="starting" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Старт бизнеса</TabsTrigger>
              <TabsTrigger value="taxes" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Налоги</TabsTrigger>
              <TabsTrigger value="hr" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Кадры</TabsTrigger>
              <TabsTrigger value="marketing" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Маркетинг</TabsTrigger>
              <TabsTrigger value="legal" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Право</TabsTrigger>
              <TabsTrigger value="finance" className="whitespace-nowrap text-xs sm:text-xs md:text-sm px-2 sm:px-3 py-2 h-auto">Финансы</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-6">
            <KnowledgeCategories
              category="all"
              searchQuery={searchQuery}
              selectedTag={selectedTag}
            />
          </TabsContent>

          <TabsContent value="starting" className="mt-6">
            <KnowledgeCategories
              category="starting"
              searchQuery={searchQuery}
              selectedTag={selectedTag}
            />
          </TabsContent>

          <TabsContent value="taxes" className="mt-6">
            <KnowledgeCategories
              category="taxes"
              searchQuery={searchQuery}
              selectedTag={selectedTag}
            />
          </TabsContent>

          <TabsContent value="hr" className="mt-6">
            <KnowledgeCategories
              category="hr"
              searchQuery={searchQuery}
              selectedTag={selectedTag}
            />
          </TabsContent>

          <TabsContent value="marketing" className="mt-6">
            <KnowledgeCategories
              category="marketing"
              searchQuery={searchQuery}
              selectedTag={selectedTag}
            />
          </TabsContent>

          <TabsContent value="legal" className="mt-6">
            <KnowledgeCategories
              category="legal"
              searchQuery={searchQuery}
              selectedTag={selectedTag}
            />
          </TabsContent>

          <TabsContent value="finance" className="mt-6">
            <KnowledgeCategories
              category="finance"
              searchQuery={searchQuery}
              selectedTag={selectedTag}
            />
          </TabsContent>
        </Tabs>
      </PageSection>
    </PageLayout>
  );
}
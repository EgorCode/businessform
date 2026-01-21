import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";
import { KnowledgeArticle as StrapiArticle, StrapiResponse } from "@/types/strapi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Clock, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useSiteSettings } from "@/hooks/useSiteSettings";

interface ArticleItem {
    id: number | string;
    documentId?: string;
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    link: string;
    tags: string[];
    readTime?: string;
    content?: string;
}

const staticArticleItems: ArticleItem[] = [
    {
        id: "static-1",
        title: "Блог как бизнес-проект: ключевые этапы построения",
        author: "Баканина Анастасия",
        category: "Бизнес",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=300&h=300",
        description: "Для большинства авторов контента самозанятость или налог на профессиональный доход (НПД) — золотой ключ: просто, легально, без избыточной бюрократии.",
        link: "#",
        tags: ["Авторские статьи"],
        readTime: "5 мин",
        content: `Юридически понятия «блогер» в закодательсве нет. Но если за публикации, обзоры, сторис или ролики приходят деньги — деятельность признаётся предпринимательской (ст. 2 ГК РФ). А значит, требует оформления...`
    },
];

export default function FeaturedArticlesGrid() {
    const { settings } = useSiteSettings();
    const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

    // Fetch from Strapi v5 (shared Knowledge endpoint)
    const { data: strapiResponse, isLoading, error } = useQuery<StrapiResponse<StrapiArticle[]>>({
        queryKey: ["/knowledge-articles-featured"],
        queryFn: () => fetchAPI<StrapiResponse<StrapiArticle[]>>("/knowledge-articles?filters[isPopular][$eq]=true&pagination[limit]=6"),
        retry: 1,
    });

    // Handle visibility
    if (settings && settings.showFeaturedArticles === false) {
        return null;
    }

    const articleItems = useMemo(() => {
        if (error) {
            console.log("⚠️ [Featured] Using static articles due to fetch error");
            return staticArticleItems;
        }

        if (strapiResponse?.data && strapiResponse.data.length > 0) {
            console.log("📦 [Featured] Transforming Strapi featured articles...");
            return strapiResponse.data.map((item: StrapiArticle): ArticleItem => ({
                id: item.documentId,
                documentId: item.documentId,
                title: item.title,
                author: item.author || "Редакция",
                category: item.category,
                image: item.isPopular ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300&h=300" : "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=300&h=300", // Fallback if no media field yet
                description: item.excerpt,
                link: "#",
                tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(',') : []),
                readTime: item.readTime,
                content: typeof item.content === 'string' ? item.content : JSON.stringify(item.content),
            }));
        }

        return isLoading ? [] : staticArticleItems;
    }, [strapiResponse, error, isLoading]);

    if (isLoading && !strapiResponse) {
        return (
            <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold">Авторские статьи</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articleItems.map((article: ArticleItem, index: number) => (
                    <Card key={article.id || index} className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                    {article.category}
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <User className="w-3 h-3 mr-1" />
                                    {article.author}
                                </div>
                            </div>

                            <CardTitle className="text-xl leading-tight">
                                <div
                                    onClick={() => setSelectedArticle(article)}
                                    className="hover:text-primary transition-colors cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                >
                                    {article.title}
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <CardDescription className="line-clamp-3 mb-4">
                                {article.description}
                            </CardDescription>

                            <div className="flex flex-wrap gap-1 mb-3">
                                {article.tags.map((tag: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs bg-purple-100 text-purple-800 border-purple-200">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <div
                                    onClick={() => setSelectedArticle(article)}
                                    className="text-sm font-medium text-primary hover:underline cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                >
                                    Читать далее
                                </div>

                                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ml-2">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=300&h=300";
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
                <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0">
                    {selectedArticle && (
                        <>
                            <DialogHeader className="p-6 pb-4 border-b">
                                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                                    <Badge variant="secondary" className="font-normal">
                                        {selectedArticle.category}
                                    </Badge>
                                    <span>•</span>
                                    {selectedArticle.readTime && (
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedArticle.readTime} чтения</span>
                                    )}
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
                                    {selectedArticle.image && (
                                        <div className="mb-6 rounded-lg overflow-hidden w-full max-h-[300px]">
                                            <img
                                                src={selectedArticle.image}
                                                alt={selectedArticle.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
                                        {selectedArticle.content || selectedArticle.description}
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

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";
import { SiteSettings, NewsItem, StrapiResponse } from "@/types/strapi";
import { Testimonial, TestimonialItem } from "@/components/ui/clean-testimonial";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Using Unsplash source URLs for business/finance related images as fallback
const staticNewsItems: TestimonialItem[] = [
    {
        quote: "ОТМЕНА НАЛОГА В 2026 ГОДУ НЕ ПЛАНИРУЕТСЯ",
        author: "15 января 2026 г.",
        role: "НПД • Самозанятость",
        company: "Законодательство",
        avatar: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=300&h=300",
        description: "По официальной позиции Правительства РФ, режим НПД будет действовать как минимум до конца 2028 года. Отмены не ожидается.",
        link: "/news#npd-2028"
    },
    {
        quote: "ДОБРОВОЛЬНОЕ СТРАХОВАНИЕ ДЛЯ САМОЗАНЯТЫХ",
        author: "15 января 2026 г.",
        role: "Социальные гарантии",
        company: "НПД",
        avatar: "https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?auto=format&fit=crop&q=80&w=300&h=300",
        description: "С 2026 года запускается программа: взнос ~1,3–1,9 тыс. ₽/мес даёт право на больничные выплаты. Эксперимент продлится до 2028 года.",
        link: "/news#insurance-2026"
    },
    {
        quote: "НОВЫЙ ПОРЯДОК ВЗЫСКАНИЯ И КОНТРОЛЬ БИЗНЕСА",
        author: "15 января 2026 г.",
        role: "Налоги и Штрафы",
        company: "ФНС • Бизнес",
        avatar: "https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?auto=format&fit=crop&q=80&w=300&h=300",
        description: "Уведомления о долгах через «Мой налог» и авто-взыскание. Усиление проверок компаний на скрытые трудовые отношения с самозанятыми.",
        link: "/news#tax-control-2026"
    },
];

export default function NewsFeed() {
    const { settings } = useSiteSettings();

    // Fetch data from Strapi v5
    const { data: strapiResponse, isLoading, error } = useQuery<StrapiResponse<NewsItem[]>>({
        queryKey: ["/news-items"],
        queryFn: () => fetchAPI<StrapiResponse<NewsItem[]>>("/news-items"),
        retry: 1,
    });

    // Handle visibility
    if (settings && settings.showNews === false) {
        return null;
    }

    // Transform Strapi data to TestimonialItem format
    const displayItems = useMemo(() => {
        if (error) {
            console.log("⚠️ [NewsFeed] Using fallback news due to fetch error");
            return staticNewsItems;
        }

        if (strapiResponse?.data && strapiResponse.data.length > 0) {
            console.log("📦 [NewsFeed] Found Strapi data, transforming...");
            return strapiResponse.data.map((item): TestimonialItem => {
                // Formatting date: "15 января 2026 г."
                const date = new Date(item.publishedAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }) + " г.";

                const result = {
                    quote: item.title.toUpperCase(),
                    author: date,
                    role: item.category || "НПД • Бизнес",
                    company: "Новость из Strapi",
                    avatar: getStrapiMedia(item.image?.url) || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=300&h=300",
                    description: item.summary || "Нажмите, чтобы прочитать подробнее об изменениях в законодательстве.",
                    link: `/news/${item.documentId}`,
                };

                console.log("✅ [NewsFeed] Transformed item:", result.quote);
                return result;
            });
        }

        return isLoading ? [] : staticNewsItems;
    }, [strapiResponse, error, isLoading]);

    if (isLoading && !strapiResponse) {
        return (
            <section className="py-10">
                <div className="mx-auto max-w-7xl px-4 flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </section>
        );
    }

    // Don't render empty section
    if (displayItems.length === 0) return null;

    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start lg:pl-[12%]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up w-5 h-5 text-primary"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                    <h2 className="text-2xl font-semibold">Актуальные новости</h2>
                </div>
                <Testimonial items={displayItems} />
            </div>
        </section>
    );
}

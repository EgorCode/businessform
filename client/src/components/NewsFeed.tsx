import { Testimonial, TestimonialItem } from "@/components/ui/clean-testimonial";

// Using Unsplash source URLs for business/finance related images
const newsItems: TestimonialItem[] = [
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
    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start lg:pl-[12%]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up w-5 h-5 text-primary"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                    <h2 className="text-2xl font-semibold">Актуальные новости</h2>
                </div>
                <Testimonial items={newsItems} />
            </div>
        </section>
    );
}

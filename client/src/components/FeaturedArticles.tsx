
import { SplitTestimonial, SplitTestimonialItem } from "@/components/ui/split-testimonial-reusable";

const articleItems: SplitTestimonialItem[] = [
    {
        id: 1,
        quote: "Блог как бизнес-проект: ключевые этапы построения для начинающих",
        name: "Баканина Анастасия",
        role: "5 мин чтения",
        company: "Бизнес | НПД",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=300&h=300",
        link: "/knowledge#blog-business" // kept for reference, though SplitTestimonial doesn't use it for the main click yet (it just cycles).
    },
    {
        id: 2,
        quote: "ИП: в чем сильные стороны и где скрыты подводные камни",
        name: "Баканина Анастасия",
        role: "7 мин чтения",
        company: "Законодательство | ИП",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
        id: 3,
        quote: "Кто такие самозанятые: суть статуса и основные правила работы",
        name: "Баканина Анастасия",
        role: "4 мин чтения",
        company: "НПД | Старт",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
        id: 4,
        quote: "Как устроено ООО: что нужно знать перед трудным выбором",
        name: "Баканина Анастасия",
        role: "8 мин чтения",
        company: "Законодательство | ООО",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
        id: 5,
        quote: "От подработки к бизнесу: какую форму выбрать фрилансеру",
        name: "Баканина Анастасия",
        role: "6 мин чтения",
        company: "Гайд | Фриланс",
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300&h=300",
    }
];

export default function FeaturedArticles() {
    return (
        <SplitTestimonial
            title="Авторские статьи"
            items={articleItems}
            description="Экспертный опыт и практические рекомендации для вашего бизнеса"
            viewAllLink="/knowledge"
            viewAllText="Читать все статьи"
        />
    );
}


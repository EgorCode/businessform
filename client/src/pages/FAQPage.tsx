import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { HoverPreview } from "@/components/ui/hover-preview";

interface DictionaryItem {
    id: string;
    term: string;
    definition: string;
}

export default function FAQPage() {
    const dictionaryItems: DictionaryItem[] = [
        {
            id: "ooo-def",
            term: "Что такое ООО?",
            definition: "**Общество с ограниченной ответственностью (ООО)** — это хозяйственное общество, учреждённое одним или несколькими лицами, уставный капитал которого разделён на доли. Участники такого общества не отвечают по его обязательствам и несут риск убытков, связанных с деятельностью общества, в пределах стоимости принадлежащих им долей в уставном капитале (ст. 87 ГК РФ)."
        },
        {
            id: "ip-def",
            term: "Что такое ИП?",
            definition: "**Индивидуальный предприниматель (ИП)** — это физическое лицо, которое вправе заниматься предпринимательской деятельностью без образования юридического лица с момента государственной регистрации в качестве индивидуального предпринимателя (ст. 23 ГК РФ)."
        },
        {
            id: "npd-def",
            term: "Что такое Самозанятость (НПД)?",
            definition: "**Самозанятость (НПД)** - не является организационно-правовой формой, а представляет собой специальный налоговый режим — налог на профессиональный доход (НПД). Введён Федеральным законом от 27.11.2018 №422-ФЗ. НПД могут применять физические лица и ИП, которые работают без наёмных сотрудников."
        },
        {
            id: "tax-regimes-def",
            term: "Что такое Налоговые режимы?",
            definition: "**Налоговые режимы (системы налогообложения)** — особые правила расчёта и уплаты налогов, закреплённые в Налоговом кодексе РФ (п. 7 ст. 12 НК РФ)."
        },
        {
            id: "tax-object-def",
            term: "Что такое Объект налогообложения?",
            definition: "**Объект налогообложения** — то, с чего платится налог (доход, имущество, продажа и т. д.)."
        },
        {
            id: "tax-base-def",
            term: "Что такое Налоговая база?",
            definition: "**Налоговая база** — сумма, к которой применяется налоговая ставка."
        },
        {
            id: "tax-period-def",
            term: "Что такое Налоговый период?",
            definition: "**Налоговый период** — промежуток времени, за который нужно сдать расчёты и заплатить авансы (может быть год, квартал или месяц)."
        },
        {
            id: "tax-benefits-def",
            term: "Что такое Налоговые льготы?",
            definition: "**Налоговые льготы** — возможность заплатить меньше или не платить налог совсем (например, пониженные ставки или освобождение от уплаты)."
        },
        {
            id: "income-threshold-def",
            term: "Что такое Пороговый доход?",
            definition: "**Пороговый доход** — максимально допустимая величина дохода."
        },
        {
            id: "business-account-def",
            term: "Что такое Расчётный счёт?",
            definition: "**Расчётный счёт** — это банковский счёт, который открывают юридические лица и индивидуальные предприниматели для ведения коммерческой деятельности."
        },
        {
            id: "legal-entity-def",
            term: "Что такое Юридическое лицо?",
            definition: "**Юридическое лицо** — признается организация, которая имеет обособленное имущество и отвечает им по своим обязательствам, может от своего имени приобретать и осуществлять гражданские права и нести гражданские обязанности, быть истцом и ответчиком в суде."
        },
        {
            id: "individual-def",
            term: "Что такое Физическое лицо?",
            definition: "**Физическое лицо** — это человек как субъект гражданского права, обладающий правоспособность и дееспособностью, участвующий в гражданских, трудовых, налоговых и административных правоотношениях."
        }
    ];

    return (
        <PageLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-12 text-center">
                    <Badge variant="outline" className="mb-4 bg-primary/10 text-primary">
                        <HelpCircle className="mr-1 h-3 w-3" />
                        База знаний
                    </Badge>
                    <h1 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl text-foreground">
                        Часто задаваемые вопросы (FAQ)
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Словарь терминов и определений для начинающих предпринимателей
                    </p>
                </div>

                <Card className="border-2 shadow-sm max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-xl">Основные понятия</CardTitle>
                        <CardDescription>
                            Краткие определения ключевых терминов налогообложения и бизнеса
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {dictionaryItems.map((item) => (
                                <AccordionItem key={item.id} value={item.id}>
                                    <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary transition-colors">
                                        {item.term}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="pt-2 pb-4 text-muted-foreground leading-relaxed">
                                            {item.definition.split('**').map((part, index) =>
                                                index % 2 === 1 ? (
                                                    <span key={index} className="font-semibold text-foreground">{part}</span>
                                                ) : part
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-semibold">Словарь предпринимателя</h2>
                            <p className="text-muted-foreground">Наведите на термин, чтобы узнать подробнее</p>
                        </div>
                        <HoverPreview />
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

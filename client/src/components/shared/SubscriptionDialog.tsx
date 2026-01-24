
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Pricing, PricingPlan } from "@/components/blocks/pricing";

// Re-export PricingPlan so consumers don't need to import it from pricing block
export type { PricingPlan };

export interface SubscriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plans?: PricingPlan[];
    title?: string;
    description?: string;
    hideToggle?: boolean;
}

const defaultRawPlans: Omit<PricingPlan, 'onClick'>[] = [
    {
        name: "БЕСПЛАТНАЯ",
        price: "0",
        yearlyPrice: "0",
        period: "в месяц",
        features: [
            "Функционал нашего сайта",
            "Авторские материалы",
            "Ответ поддержки за 48ч",
            "Чат в группе Телеграмм",
            "Хорошее настроение",
        ],
        description: "Идеально для знакомства с платформой",
        buttonText: "Продолжить бесплатно",
        isPopular: false,
        type: 'base',
    },
    {
        name: "МАКСИМАЛЬНАЯ",
        price: "299",
        yearlyPrice: "239",
        period: "в месяц",
        features: [
            "Все функции портала",
            "Персональный менеджер",
            "Ответ поддержки за 1ч",
            "Индивидуальный менеджер в Телеграмм",
            "Помощь в оформлении документов",
            "Спасибо от нас",
        ],
        description: "Для самых лучших!",
        buttonText: "Связаться с нами",
        href: "#",
        isPopular: true,
        type: 'max',
    },
];

export function SubscriptionDialog({
    open,
    onOpenChange,
    plans,
    title = "Выберите ваш тариф",
    description = "Раскройте весь потенциал платформы.",
    hideToggle = false
}: SubscriptionDialogProps) {

    const finalPlans: PricingPlan[] = (plans || defaultRawPlans as PricingPlan[]).map(plan => {
        // If plan already has onClick, keep it. Otherwise assign default based on type.
        if (plan.onClick) return plan;

        if (plan.type === 'base') {
            return {
                ...plan,
                onClick: () => onOpenChange(false)
            };
        }

        if (plan.type === 'max') {
            return {
                ...plan,
                onClick: () => window.open("https://t.me/+fwAIYLOHTMI5OGQy", "_blank")
            };
        }

        return plan;
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[90vh] w-[95vw] sm:w-full max-w-4xl p-0 bg-transparent border-none shadow-none sm:max-w-[900px] flex flex-col"
            >
                <div className="relative w-full rounded-2xl bg-card shadow-2xl ring-1 ring-border overflow-y-auto">
                    <div className="p-4 pt-10 sm:p-6 md:p-8">
                        <Pricing
                            title={title}
                            description={description}
                            plans={finalPlans}
                            hideToggle={hideToggle}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Pricing, PricingPlan } from "@/components/blocks/pricing";

interface SubscriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plans?: PricingPlan[];
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

export function SubscriptionDialog({ open, onOpenChange, plans }: SubscriptionDialogProps) {

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
                className="max-h-[90vh] max-w-4xl w-full p-0 bg-transparent border-none shadow-none sm:max-w-[900px]"
                style={{ overflowY: 'auto' }}
            >
                <div className="relative w-full rounded-xl bg-card shadow-2xl ring-1 ring-border overflow-hidden">
                    <div className="p-2 md:p-4">
                        <Pricing
                            title="Выберите ваш тариф"
                            description="Раскройте весь потенциал платформы."
                            plans={finalPlans}
                        // We omit onClose to rely on the Dialog's own close button
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

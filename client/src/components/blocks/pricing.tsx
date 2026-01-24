import React, { useState, useRef } from "react";
import { Check, Star, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";

// --- Internal Utilities ---
const NumberFlow = ({ value, format, className }: { value: number, format: Intl.NumberFormatOptions, className?: string }) => {
    return (
        <span className={className}>
            {new Intl.NumberFormat('ru-RU', format).format(value)}
        </span>
    );
};

// --- Interfaces ---
export interface PricingPlan {
    name: string;
    price: string;
    yearlyPrice: string;
    period: string;
    features: string[];
    description: string;
    buttonText: string;
    href?: string;
    onClick?: (plan: PricingPlan) => void;
    isPopular: boolean;
    type?: 'base' | 'max';
}

interface PricingProps {
    plans: PricingPlan[];
    title?: string;
    description?: string;
    onClose?: () => void;
    hideToggle?: boolean;
}

export function Pricing({
    plans,
    title = "Выберите тариф",
    description = "Выберите подходящий вариант страхования",
    onClose,
    hideToggle = false,
}: PricingProps) {
    const [isMonthly, setIsMonthly] = useState(true);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <div className="w-full px-1 sm:px-4 py-2 sm:py-4">
            <div className="text-center space-y-2 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight md:text-3xl text-foreground">
                    {title}
                </h2>
                <div className="h-1 w-20 bg-blue-600/20 mx-auto rounded-full" />
            </div>

            {!hideToggle && (
                <div className="flex justify-center mb-6">
                    <label className="relative inline-flex items-center cursor-pointer select-none bg-muted/50 p-1 rounded-full px-3">
                        <Label className="mr-2 text-[10px] sm:text-xs font-semibold cursor-pointer text-muted-foreground data-[active=true]:text-foreground">
                            Месяц
                        </Label>
                        <Switch
                            checked={!isMonthly}
                            onCheckedChange={(checked) => setIsMonthly(!checked)}
                            className="scale-75 sm:scale-90"
                        />
                        <span className="ml-2 text-[10px] sm:text-xs font-semibold text-muted-foreground data-[active=true]:text-foreground">
                            Год <span className="text-primary font-bold">(-20%)</span>
                        </span>
                    </label>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto items-stretch">
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.4,
                            type: "spring",
                            stiffness: 100,
                            damping: 30,
                            delay: index * 0.1,
                        }}
                        className={cn(
                            `rounded-2xl border bg-card border-card-border text-card-foreground shadow-sm flex flex-col relative h-full`,
                            plan.isPopular ? "border-blue-500 ring-2 ring-blue-500/20 z-10 scale-[1.02] sm:scale-100" : "z-0",
                        )}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 py-1 px-3 rounded-full flex items-center shadow-lg">
                                <Star className="text-white h-3 w-3 fill-current" />
                                <span className="text-white ml-1 font-sans text-[10px] font-bold uppercase tracking-wider">
                                    Популярный
                                </span>
                            </div>
                        )}
                        <div className="flex-1 flex flex-col p-4 sm:p-6">
                            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] text-center mb-4">
                                {plan.name}
                            </p>
                            <div className="flex flex-col items-center mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                                        <NumberFlow
                                            value={
                                                isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                                            }
                                            format={{
                                                style: "currency",
                                                currency: "RUB",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }}
                                            className="font-variant-numeric: tabular-nums"
                                        />
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        / мес
                                    </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    {isMonthly ? "платите помесячно" : "при оплате за год"}
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-foreground/80">
                                        <div className="rounded-full bg-blue-500/10 p-0.5 mt-0.5">
                                            <Check className="h-3 w-3 text-blue-600 flex-shrink-0" />
                                        </div>
                                        <span className="text-left text-xs sm:text-sm leading-snug">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto space-y-4">
                                <Button
                                    onClick={() => plan.onClick?.(plan)}
                                    variant={plan.isPopular ? "default" : "outline"}
                                    size="lg"
                                    className={cn(
                                        "w-full font-bold transition-all duration-200 active:scale-[0.98]",
                                        plan.isPopular
                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25 shadow-lg"
                                            : "hover:bg-accent border-2"
                                    )}
                                >
                                    {plan.buttonText}
                                </Button>
                                <p className="text-[10px] text-muted-foreground text-center px-4">
                                    {plan.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

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
        <div className="container px-4 py-4">
            <div className="text-center space-y-2 mb-4">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                    {title}
                </h2>
                <p className="text-muted-foreground text-sm whitespace-pre-line">
                </p>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 rounded-full md:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {!hideToggle && (
                <div className="flex justify-center mb-6">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                        <Label className="mr-3 text-xs sm:text-sm font-semibold cursor-pointer">
                            Ежемесячно
                        </Label>
                        <Switch
                            checked={!isMonthly}
                            onCheckedChange={(checked) => setIsMonthly(!checked)}
                            className="relative scale-90 sm:scale-100"
                        />
                        <span className="ml-2 text-xs sm:text-sm font-semibold text-foreground">
                            Ежегодно <span className="text-primary font-bold block sm:inline text-[10px] sm:text-xs md:text-sm">(Выгодно)</span>
                        </span>
                    </label>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto items-stretch">
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
                            `rounded-xl border bg-card border-card-border text-card-foreground shadow-sm flex flex-col relative h-full`,
                            plan.isPopular ? "border-blue-500 ring-1 ring-blue-500 z-10" : "z-0",
                        )}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0 bg-blue-600 py-0.5 px-2 rounded-bl-lg rounded-tr-xl flex items-center">
                                <Star className="text-white h-3 w-3 fill-current" />
                                <span className="text-white ml-1 font-sans text-xs font-semibold">
                                    Популярный
                                </span>
                            </div>
                        )}
                        <div className="flex-1 flex flex-col p-6">
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest text-left">
                                {plan.name}
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-x-1">
                                <span className="text-3xl font-bold tracking-tight text-foreground">
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
                                {plan.period && (
                                    <span className="text-xs font-semibold leading-6 tracking-wide text-muted-foreground">
                                        / {plan.period}
                                    </span>
                                )}
                            </div>

                            <p className="text-[10px] leading-4 text-muted-foreground mb-6 text-center">
                                {isMonthly ? "оплата раз в месяц" : "оплата раз в год"}
                            </p>

                            <ul className="mt-auto gap-3 flex flex-col mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-foreground/90">
                                        <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-left text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <hr className="w-full my-4 border-border" />
                                <Button
                                    onClick={() => plan.onClick?.(plan)}
                                    variant={plan.isPopular ? "default" : "outline"}
                                    size="lg"
                                    className={cn(
                                        "w-full font-semibold",
                                        plan.isPopular
                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                                            : "hover:bg-accent"
                                    )}
                                >
                                    {plan.buttonText}
                                </Button>
                                <p className="mt-3 text-xs leading-4 text-muted-foreground text-center">
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

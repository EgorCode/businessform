"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import { Link } from "wouter"
import { Button } from "@/components/ui/button"

export interface SplitTestimonialItem {
    id?: number | string;
    quote: string;
    name: string; // Author name
    role: string; // Author role
    company: string; // Category / Tagline
    image: string;
    link?: string; // Optional link for "Next" or "Read more" behavior
}

interface SplitTestimonialProps {
    items: SplitTestimonialItem[];
    title: string;
    description?: string;
    viewAllLink?: string;
    viewAllText?: string;
    className?: string; // Add className prop for flexible styling
}

export function SplitTestimonial({
    items,
    title,
    description,
    viewAllLink,
    viewAllText = "Смотреть все",
    className
}: SplitTestimonialProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isHovering, setIsHovering] = useState(false)

    const active = items[activeIndex]

    const nextTestimonial = () => {
        setActiveIndex((prev) => (prev + 1) % items.length)
    }

    return (
        <div className={`w-full max-w-5xl mx-auto px-6 py-20 ${className || ''}`}>
            <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-semibold tracking-tight lg:text-4xl text-foreground">{title}</h2>
                {description && (
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <div
                className="relative grid grid-cols-[1fr_auto] gap-12 items-center cursor-pointer group"
                onClick={nextTestimonial}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Left: Quote Content */}
                <div className="space-y-8">
                    {/* Company/Category Tag */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.company}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground"
                        >
                            <span className="w-8 h-px bg-muted-foreground/50" />
                            {active.company}
                        </motion.div>
                    </AnimatePresence>

                    {/* Quote/Title */}
                    <div className="relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.blockquote
                                key={active.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="text-3xl md:text-4xl font-light leading-[1.3] tracking-tight text-foreground"
                            >
                                {active.quote}
                            </motion.blockquote>
                        </AnimatePresence>
                    </div>

                    {/* Author Info / Date */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="flex items-center gap-4"
                        >
                            <div className="w-10 h-px bg-foreground/20" />
                            <div>
                                <p className="text-sm font-medium text-foreground">{active.name}</p>
                                <p className="text-xs text-muted-foreground">{active.role}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right: Visual Element */}
                <div className="relative w-48 h-64">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0, filter: "blur(20px)", scale: 1.05 }}
                            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                            exit={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0"
                        >
                            <div className="w-full h-full rounded-2xl overflow-hidden border border-border/50">
                                <img
                                    src={active.image || "/placeholder.svg"}
                                    alt={active.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Click indicator or Read Link */}
                    <motion.div
                        animate={{
                            opacity: isHovering ? 1 : 0,
                            scale: isHovering ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground z-10"
                    >
                        {active.link ? (
                            <Link href={active.link} onClick={(e) => e.stopPropagation()}>
                                <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                                    <span>Читать</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </Link>
                        ) : (
                            <>
                                <span>Далее</span>
                                <ArrowUpRight className="w-3 h-3" />
                            </>
                        )}
                    </motion.div>
                </div>

                {/* Progress Dots */}
                <div className="absolute -bottom-16 left-0 flex items-center gap-3">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation()
                                setActiveIndex(index)
                            }}
                            className="relative p-1 group/dot"
                        >
                            <span
                                className={`
                  block w-2 h-2 rounded-full transition-all duration-300
                  ${index === activeIndex
                                        ? "bg-foreground scale-100"
                                        : "bg-muted-foreground/30 scale-75 hover:bg-muted-foreground/50 hover:scale-100"
                                    }
                `}
                            />
                            {index === activeIndex && (
                                <motion.span
                                    layoutId="activeDot"
                                    className="absolute inset-0 border border-foreground/30 rounded-full"
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* View All Button */}
            {viewAllLink && (
                <div className="mt-20 text-center">
                    <Button asChild variant="outline" size="lg">
                        <Link href={viewAllLink}>{viewAllText}</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}

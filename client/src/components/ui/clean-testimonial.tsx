"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "wouter"

// Define a type for the items we want to display.
// This preserves the flexibility to use Testimonial structure for News items.
export interface TestimonialItem {
    quote: string; // Used for Headline/Title
    author: string; // Used for Date or Author
    role: string; // Used for Category/Tag
    company: string; // Used for additional info or "Read More" text
    avatar: string; // Used for Image
    description?: string; // Short body text
    link?: string; // Link to full news item
}

interface TestimonialProps {
    items: TestimonialItem[];
}

function usePreloadImages(images: string[]) {
    useEffect(() => {
        images.forEach((src) => {
            const img = new Image()
            img.src = src
        })
    }, [images])
}

function SplitText({ text }: { text: string }) {
    const words = text.split(" ")

    return (
        <span className="inline">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                        duration: 0.4,
                        delay: i * 0.03,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block mr-[0.25em]"
                >
                    {word}
                </motion.span>
            ))}
        </span>
    )
}

export function Testimonial({ items }: TestimonialProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const [, setLocation] = useLocation();

    usePreloadImages(items.map((t) => t.avatar))

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 10000);

        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0;
                return prev + 1; // Updates every 100ms, so 1% per 100ms = 100% in 10s
            });
        }, 100);

        return () => {
            clearInterval(timer);
            clearInterval(progressTimer);
        };
    }, [activeIndex]);

    // Reset progress when index changes manually
    useEffect(() => {
        setProgress(0);
    }, [activeIndex]);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % items.length);
        setProgress(0);
    }

    const currentItem = items[activeIndex]

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-4xl mx-auto py-20 px-8 cursor-pointer"
            onClick={handleNext}
        >
            {/* Floating index indicator */}
            <motion.div
                className="absolute top-8 right-8 flex items-baseline gap-1 font-mono text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <motion.span
                    className="text-2xl font-light text-foreground"
                    key={activeIndex}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {String(activeIndex + 1).padStart(2, "0")}
                </motion.span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{String(items.length).padStart(2, "0")}</span>
            </motion.div>

            {/* Stacked avatar previews */}
            <motion.div
                className="absolute top-8 left-8 flex -space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.6 }}
            >
                {items.map((t, i) => (
                    <motion.div
                        key={i}
                        className={`w-10 h-10 rounded-full border-2 border-background overflow-hidden transition-all duration-300 ${i === activeIndex ? "ring-1 ring-accent ring-offset-1 ring-offset-background" : "grayscale opacity-50"
                            }`}
                        whileHover={{ scale: 1.1, opacity: 1 }}
                    >
                        <img src={t.avatar || "/placeholder.svg"} alt={t.author} className="w-full h-full object-cover" />
                    </motion.div>
                ))}
            </motion.div>

            {/* Main content */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="pr-12 min-h-[120px]"
                    >
                        {currentItem.link ? (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setLocation(currentItem.link!);
                                }}
                                className="inline-block hover:opacity-80 transition-opacity cursor-pointer mb-4"
                            >
                                <blockquote className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-foreground">
                                    <SplitText text={currentItem.quote} />
                                </blockquote>
                            </div>
                        ) : (
                            <blockquote className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-foreground mb-4">
                                <SplitText text={currentItem.quote} />
                            </blockquote>
                        )}

                        {currentItem.description && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.7, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
                            >
                                {currentItem.description}
                            </motion.p>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Author info */}
                <motion.div className="mt-12 relative" layout>
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                            <motion.div
                                className="absolute -inset-1.5 rounded-full border border-accent/40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                            {items.map((t, i) => (
                                <motion.img
                                    key={t.avatar + i}
                                    src={t.avatar}
                                    alt={t.author}
                                    className="absolute inset-0 w-16 h-16 rounded-full object-cover grayscale transition-[filter] duration-500"
                                    animate={{
                                        opacity: i === activeIndex ? 1 : 0,
                                        zIndex: i === activeIndex ? 1 : 0,
                                        filter: i === activeIndex ? 'grayscale(0%)' : 'grayscale(100%)'
                                    }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                />
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                className="relative pl-4"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    className="absolute left-0 top-0 bottom-0 w-px bg-accent"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ originY: 0 }}
                                />
                                <span className="block text-sm font-medium text-foreground tracking-wide">
                                    {currentItem.author}
                                </span>
                                <span className="block text-xs text-muted-foreground mt-0.5 font-mono uppercase tracking-widest">
                                    {currentItem.role} — {currentItem.company}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Progress bar (Timer) */}
                <div className="mt-16 h-1 bg-border relative overflow-hidden rounded-full">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-accent"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.1 }}
                    />
                </div>
            </div>

            {/* Read all link */}
            <div className="absolute bottom-8 left-8 z-10">
                <Link href="/news" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono hover:text-primary transition-colors cursor-pointer border-b border-transparent hover:border-primary pb-0.5">
                        Читать все новости
                    </span>
                </Link>
            </div>
        </div>
    )
}

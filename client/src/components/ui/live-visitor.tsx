import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from 'react';
// Using motion/react as requested (requires 'motion' package)
import { motion, AnimatePresence } from 'motion/react';

const AVATARS: string[] = [
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Technologist.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Student.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Mechanic.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Student.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Teacher.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Woman%20Technologist.png",
    "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Person%20With%20Blond%20Hair.png"
];

const AVATAR_COLORS: string[] = ['#dbeafe', '#dcfce7', '#fce7f3', '#ffedd5', '#f3f4f6'];

interface AvatarConfig {
    displayLimit: number;
    showPlus: boolean;
}

interface DigitPlaceProps {
    place: number;
    value: number;
}

const LiveVisitorCounter = () => {
    const [visitorCount, setVisitorCount] = useState<number>(135);
    const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ displayLimit: 3, showPlus: false });

    useEffect(() => {
        const baseVisitors = 135;
        const baseAvatars = 5;
        const visitorsAboveBase = visitorCount - baseVisitors;
        const additionalAvatars = Math.floor(visitorsAboveBase / 3);
        const calculatedLimit = baseAvatars + additionalAvatars;
        const displayLimit = Math.max(1, Math.min(calculatedLimit, 5));
        const showPlus = calculatedLimit > 5;

        setAvatarConfig({ displayLimit, showPlus });
    }, [visitorCount]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisitorCount(prev => {
                const change = Math.floor(Math.random() * 11) - 5;
                const newCount = prev + change;
                return Math.max(105, Math.min(140, newCount));
            });
        }, 1660);

        return () => clearInterval(interval);
    }, []);

    const DigitPlace: React.FC<DigitPlaceProps> = ({ place, value }) => {
        const [offset, setOffset] = useState<number>(0);
        const targetRef = useRef<number>(0);
        const currentRef = useRef<number>(0);

        useEffect(() => {
            const valueRoundedToPlace = Math.floor(value / place);
            targetRef.current = valueRoundedToPlace % 10;

            // Smooth transition using requestAnimationFrame
            let animationFrame: number;
            const animate = () => {
                const diff = targetRef.current - currentRef.current;
                if (Math.abs(diff) > 0.01) {
                    currentRef.current += diff * 0.15; // Smooth easing
                    setOffset(currentRef.current);
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    currentRef.current = targetRef.current;
                    setOffset(targetRef.current);
                }
            };

            animationFrame = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animationFrame);
        }, [value, place, visitorCount]); // Added visitorCount dep to trigger updates safely

        const shouldDisplay = value >= place;

        if (!shouldDisplay) return null;

        return (
            <div className="relative h-8 w-5 overflow-hidden font-mono text-2xl font-bold text-foreground">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                    // Logic from original component to calculate offset position
                    // We want the current number to be at 0px
                    // The offset is the interpolated current value [0-9]

                    // The original logic was:
                    // let digitOffset = (10 + num - offset) % 10;
                    // let translateY = digitOffset * 20;
                    // if (digitOffset > 5) translateY -= 10 * 20;

                    // Adapting for 32px height (h-8 = 2rem = 32px)
                    // Visual explanation: if number is 5 and we show 5, offset is 5. 
                    // digitOffset for num=5 is (10+5-5)%10 = 0. translateY = 0. Correct.
                    // digitOffset for num=6 is (10+6-5)%10 = 1. translateY = 32. Below.
                    // digitOffset for num=4 is (10+4-5)%10 = 9. translateY = 9*32 = 288.
                    // But if >5 logic kicks in: 9 > 5 -> 288 - 320 = -32. Above. Correct.

                    const itemHeight = 32;
                    let digitOffset = (10 + num - offset) % 10;
                    let translateY = digitOffset * itemHeight;

                    if (digitOffset > 5) {
                        translateY -= 10 * itemHeight;
                    }

                    return (
                        <span
                            key={num}
                            className="absolute inset-x-0 flex items-center justify-center h-8"
                            style={{
                                transform: `translateY(${translateY}px)`,
                                // Use linear or custom easing for manual RAF animation? 
                                // Actually the span itself doesn't need transition if we update translateY every frame via React state 'offset'.
                                // But re-rendering standard React state on RAF is heavy.
                                // The original code used React state for 'offset' and updated styles via render.
                                // It applied a CSS transition 'transform 0.3s' ON TOP of the RAF interpolation? 
                                // No, the snippet had `transition: 'transform 0.3s...'`. 
                                // AND it had RAF updating `setOffset`. This is a bit conflicting or double-smoothing.
                                // I will stick to the provided logic but remove the CSS transition if RAF handles the smoothing, 
                                // OR if RAF is just setting the state, the CSS transition might fight it. 
                                // Actually, `currentRef.current += diff * 0.15` suggests manual easing. 
                                // So we likely don't want CSS transition conflicts, OR the user code had it. I'll rely on the manual easing.
                            }}
                        >
                            {num}
                        </span>
                    );
                })}
            </div>
        );
    };

    const visibleAvatars = AVATARS.slice(0, avatarConfig.displayLimit);

    return (
        <div className="pt-8 border-t flex flex-row items-center justify-between gap-4">
            {/* Counter Section */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Сейчас на сайте</span>
                </div>

                <div className="flex items-baseline gap-0.5">
                    {[100, 10, 1].map(place => (
                        <DigitPlace key={place} place={place} value={visitorCount} />
                    ))}
                    <span className="text-sm font-medium text-muted-foreground ml-1">чел.</span>
                </div>
            </div>

            {/* Avatars Section */}
            <div className="flex items-center -space-x-3">
                <AnimatePresence mode="popLayout">
                    {visibleAvatars.map((url, index) => (
                        <motion.div
                            key={`${index}-${url}`}
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.1 }}
                            className="relative h-10 w-10 rounded-full border-2 border-background overflow-hidden flex items-center justify-center z-10"
                            style={{
                                zIndex: 10 + index, // Ensure stacking order
                                backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length]
                            }}
                        >
                            <img src={url} alt={`Visitor ${index}`} className="h-full w-full object-cover" />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {avatarConfig.showPlus && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center z-20"
                    >
                        <span className="text-xs font-semibold text-muted-foreground">+</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default LiveVisitorCounter;

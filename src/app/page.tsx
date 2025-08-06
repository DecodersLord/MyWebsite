"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ScrollSections from "./ScrollPinnedSections";
import SocialIcons from "./components/SocialIcons";

function useIsHydrated() {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);
    return hydrated;
}

type Stage = 0 | 1 | 2;

export default function Home() {
    const isHydrated = useIsHydrated();
    const topControls = useAnimation();
    const bottomControls = useAnimation();

    const [stage, setStage] = useState<Stage>(0);
    const [currentHighlight, setCurrentHighlight] = useState(0);

    const animating = useRef(false);
    const canScroll = useRef(true);
    const touchStartY = useRef<number | null>(null);

    const highlights = [
        "From Game Developer to Full-Stack Engineer",
        "4+ years building scalable web apps",
        "Expert in Node.js, React, Python, Docker and Cloud",
        "Passionate about real-time systems and AI",
    ];

    const gateAnimation = useCallback(
        async (direction: "open" | "close") => {
            if (animating.current || !canScroll.current) return;
            animating.current = true;
            canScroll.current = false;

            if (direction === "open") {
                await Promise.all([
                    topControls.start({
                        y: ["0%", "-110%", "-100%"],
                        transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
                    }),
                    bottomControls.start({
                        y: ["0%", "110%", "100%"],
                        transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
                    }),
                ]);
                setStage(1);
            } else {
                setStage(0);
                await Promise.all([
                    topControls.start({
                        y: ["-100%", "5%", "0%"],
                        transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
                    }),
                    bottomControls.start({
                        y: ["100%", "-5%", "0%"],
                        transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
                    }),
                ]);
                setTimeout(
                    () => window.scrollTo({ top: 0, behavior: "smooth" }),
                    200
                );
            }

            animating.current = false;
            setTimeout(() => (canScroll.current = true), 1500);
        },
        [bottomControls, topControls]
    );

    const handleStageChange = useCallback((newStage: Stage) => {
        if (!canScroll.current) return;
        canScroll.current = false;
        setStage(newStage);
        setTimeout(() => (canScroll.current = true), 1200);
    }, []);

    useEffect(() => {
        if (!isHydrated) return;
        const interval = setInterval(
            () => setCurrentHighlight((prev) => (prev + 1) % highlights.length),
            3000
        );
        return () => clearInterval(interval);
    }, [isHydrated, highlights.length]);

    useEffect(() => {
        if (!isHydrated) return;

        const isWithinScrollableContainer = (element: Element): boolean => {
            let current = element;
            while (current && current !== document.body) {
                if (current.hasAttribute("data-scrollable")) {
                    const container = current as HTMLElement;
                    const { scrollTop, scrollHeight, clientHeight } = container;

                    // Check if container is actually scrollable and not at boundaries
                    return scrollHeight > clientHeight;
                }
                current = current.parentElement as Element;
            }
            return false;
        };

        const onWheel = (e: WheelEvent) => {
            const target = e.target as Element;

            if (isWithinScrollableContainer(target)) {
                return; // Don't trigger page navigation
            }

            if (!canScroll.current) return;

            if (e.deltaY > 0) {
                if (stage === 0) {
                    gateAnimation("open");
                } else if (stage === 1) {
                    handleStageChange(2);
                }
            } else if (e.deltaY < 0) {
                if (stage === 2) {
                    handleStageChange(1);
                } else if (stage === 1) {
                    gateAnimation("close");
                }
            }
        };

        const onTouchStart = (e: TouchEvent) => {
            const target = e.target as Element;

            if (isWithinScrollableContainer(target)) {
                return;
            }

            touchStartY.current = e.touches[0].clientY;
        };

        const onTouchEnd = (e: TouchEvent) => {
            const target = e.target as Element;

            if (
                isWithinScrollableContainer(target) ||
                touchStartY.current == null ||
                !canScroll.current
            ) {
                touchStartY.current = null;
                return;
            }

            const deltaY = touchStartY.current - e.changedTouches[0].clientY;
            const threshold = 75; // Higher threshold for mobile

            if (Math.abs(deltaY) < threshold) {
                touchStartY.current = null;
                return; // Not enough movement to trigger navigation
            }

            if (deltaY > 0) {
                if (stage === 0) {
                    gateAnimation("open");
                } else if (stage === 1) {
                    handleStageChange(2);
                }
            } else {
                if (stage === 2) {
                    handleStageChange(1);
                } else if (stage === 1) {
                    gateAnimation("close");
                }
            }

            touchStartY.current = null;
        };

        window.addEventListener("wheel", onWheel);
        window.addEventListener("touchstart", onTouchStart, { passive: false });
        window.addEventListener("touchend", onTouchEnd);

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [isHydrated, stage, gateAnimation, handleStageChange]);

    return (
        <main className="relative min-h-screen">
            <div className="absolute inset-0 -z-10 bg-animated"></div>

            {/* SVG Clip Path Definition */}
            <svg className="absolute" width="0" height="0">
                <defs>
                    <clipPath
                        id="curvedBottom"
                        clipPathUnits="objectBoundingBox"
                    >
                        <path d="M 0,0 L 1,0 L 1,0.8 Q 0.5,1.2 0,0.8 Z" />
                    </clipPath>
                    <clipPath id="curvedTop" clipPathUnits="objectBoundingBox">
                        <path d="M 0,0.2 Q 0.5,-0.2 1,0.2 L 1,1 L 0,1 Z" />
                    </clipPath>
                </defs>
            </svg>

            {/* GATE */}
            <>
                <motion.div
                    animate={topControls}
                    initial={{ y: 0 }}
                    className="fixed top-0 left-0 right-0 bg-custom flex items-center justify-center z-50 text-accent h-[75%]"
                >
                    <div className="flex flex-col items-center text-center px-4 py-6 space-y-4 small-height:flex-row small-height:space-y-0">
                        <Image
                            src="/profile-pic.jpeg"
                            alt="Priyank Sevak"
                            className="rounded-full border-4 border-white shadow-lg object-cover w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
                            width={200}
                            height={200}
                            priority
                        />
                        <h1 className="text-accent text-xl sm:text-xl md:text-4xl font-semibold flex items-center gap-2 flex-wrap justify-center">
                            <span>Priyank Sevak</span>
                        </h1>
                        <div className="flex flex-wrap justify-center gap-3 w-full max-w-xs sm:max-w-sm">
                            <SocialIcons />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    animate={bottomControls}
                    initial={{ y: 0 }}
                    className="fixed bottom-0 left-0 right-0 bg-slate-100 flex items-center justify-center z-50 bg-animated text-base"
                    style={{
                        height: "calc(25vh + 100px)",
                        clipPath: "url(#curvedTop)",
                    }}
                >
                    <div className="flex flex-col items-center justify-center px-4 py-6 text-center space-y-3 sm:space-y-4">
                        <h2 className="text-base sm:text-lg md:text-2xl font-bold text-heading leading-snug">
                            My Developer Journey
                        </h2>

                        <p className="text-md sm:text-md md:text-xl font-medium text-subtle text-balance max-w-[90%] break-words leading-relaxed">
                            {isHydrated ? (
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={currentHighlight}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.5 }}
                                        className="inline-block"
                                    >
                                        {highlights[currentHighlight]}
                                    </motion.span>
                                </AnimatePresence>
                            ) : (
                                <span suppressHydrationWarning>
                                    {highlights[0]}
                                </span>
                            )}
                        </p>

                        <p className="text-[10px] sm:text-xs animate-bounce text-subtle">
                            Scroll down to explore my milestones ↓
                        </p>
                    </div>
                </motion.div>
            </>
            {stage > 0 && <ScrollSections currentStage={stage as 1 | 2} />}
        </main>
    );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ScrollSections from "./ScrollPinnedSections";
import SocialIcons from "./components/SocialIcons";

export default function Home() {
    const topControls = useAnimation();
    const bottomControls = useAnimation();
    const [stage, setStage] = useState<0 | 1 | 2>(0);
    const animating = useRef(false);
    const canScroll = useRef(true);
    const [currentHighlight, setCurrentHighlight] = useState(0);

    const highlights = [
        "From Game Developer to Full-Stack Engineer",
        "4+ years building scalable web apps",
        "Expert in Node.js, React, Python, Docker and Cloud",
        "Passionate about real-time systems and AI",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHighlight((prev) => (prev + 1) % highlights.length);
        }, 3000); // Change every 3s
        return () => clearInterval(interval);
    }, []);

    const gateAnimation = async (direction: "open" | "close") => {
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

        // Re-enable scrolling after animation completes + buffer
        setTimeout(() => {
            canScroll.current = true;
        }, 1500); // 1.2s animation + 300ms buffer
    };

    const handleStageChange = (newStage: 0 | 1 | 2) => {
        // Fix: Type the parameter correctly
        if (!canScroll.current) return;

        canScroll.current = false;
        setStage(newStage);

        // Re-enable scrolling after a short delay
        setTimeout(() => {
            canScroll.current = true;
        }, 1200); // Fix: Increased delay for consistent behavior
    };

    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
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

        window.addEventListener("wheel", onWheel);
        return () => window.removeEventListener("wheel", onWheel);
    }, [stage]);

    return (
        <main className="relative min-h-screen">
            <div className="absolute inset-0 -z-10 bg-animated"></div>
            {/* GATE */}
            <>
                <motion.div
                    animate={topControls}
                    initial={{ y: 0 }}
                    className="fixed top-0 left-0 right-0 h-1/2 bg-custom text-white flex items-center justify-center z-50"
                >
                    <div className="flex flex-col items-center">
                        <Image
                            src="/profile-pic.jpeg"
                            alt="Priyank Sevak"
                            width={160}
                            height={160}
                            className="rounded-full border-4 border-white shadow-lg"
                        />
                        <h1 className="mt-4 text-2xl font-semibold flex items-center gap-2">
                            <Image
                                src="/hi.png"
                                width={48}
                                height={48}
                                alt="Hi"
                            />
                            <span className="flex items-center mt-4">
                                I&apos;m Priyank Sevak
                            </span>
                        </h1>

                        {/* Social Icons */}
                        <SocialIcons />
                    </div>
                </motion.div>

                <motion.div
                    animate={bottomControls}
                    initial={{ y: 0 }}
                    className="fixed bottom-0 left-0 right-0 h-1/2 bg-slate-100 text-gray-800 flex items-center justify-center z-50 bg-animated"
                >
                    <div className="text-center px-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            My Developer Journey
                        </h2>
                        <p className="text-xl font-medium leading-lg mt-2 text-gray-700 h-8 overflow-hidden relative">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={currentHighlight}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {highlights[currentHighlight]}
                                </motion.span>
                            </AnimatePresence>
                        </p>
                        <p className="mt-14 text-sm text-gray-500 animate-bounce">
                            Scroll down to explore my milestones ↓
                        </p>
                    </div>
                </motion.div>
            </>

            {/* Scroll Sections */}
            {stage > 0 && <ScrollSections currentStage={stage as 1 | 2} />}
        </main>
    );
}

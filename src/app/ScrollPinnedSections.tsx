"use client";

import { AnimatePresence, motion } from "framer-motion";
import Projects from "./components/Projects";
import Experience from "./components/Experience";

export default function ScrollSections({
    currentStage,
}: {
    currentStage: 1 | 2;
}) {
    return (
        <>
            <AnimatePresence mode="wait">
                {currentStage === 1 && (
                    <motion.div
                        key="projects"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <Projects />
                    </motion.div>
                )}
                {currentStage === 2 && (
                    <motion.div
                        key="experience"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <Experience />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

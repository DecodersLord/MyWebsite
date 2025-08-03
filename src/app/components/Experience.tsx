"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { motion } from "framer-motion";
import Card from "../components/Card";
import { useHoverSystem } from "../hooks/useHoverSystem";
import { ExperienceCard } from "./ExperienceCard";
import { type Experience } from "../types";

export default function Experience() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    // Initialize hover system for experience
    const experienceHover = useHoverSystem({
        scaleOnHover: 1.02,
        translateOnHover: -4, // Subtle movement
        staggerDelay: 0.1,
        springConfig: {
            stiffness: 300,
            damping: 30,
            mass: 1,
        },
    });

    const currentYear = new Date().getFullYear();

    // Helper function to extract year from date string
    const getYearFromDate = (dateString: string): number => {
        if (!dateString || typeof dateString !== "string") {
            return currentYear; // or return 0, or some default value
        }

        // Handle various date formats: "2023", "Jan 2023", "January 2023", "2023-01", etc.
        const yearMatch = dateString.match(/\b(\d{4})\b/);
        return yearMatch ? parseInt(yearMatch[1]) : currentYear;
    };

    // Get unique years from experiences and sort them
    const getUniqueYears = (experiences: Experience[]): number[] => {
        const years = experiences
            .map((exp) => getYearFromDate(exp.start_date))
            .filter(
                (year) =>
                    year !== currentYear ||
                    experiences.some(
                        (exp) => getYearFromDate(exp.start_date) === year
                    )
            ); // Keep valid years

        return [...new Set(years)].sort((a, b) => b - a); // Sort descending (most recent first)
    };

    // Helper function to calculate position based on year
    const getPositionForYear = (
        year: number,
        uniqueYears: number[]
    ): number => {
        const yearIndex = uniqueYears.indexOf(year);
        return yearIndex * 250;
    };

    // Helper function to get experiences for a specific year with their positions
    const getExperiencesForYear = (year: number, experiences: Experience[]) => {
        return experiences
            .filter((exp) => getYearFromDate(exp.start_date) === year)
            .sort((a, b) => {
                // Sort by global sequence (1=oldest, higher numbers=newer)
                if (a.sequence !== undefined && b.sequence !== undefined) {
                    return b.sequence - a.sequence;
                }
                // Fallback to sorting by id if sequence is not available
                return a.id.localeCompare(b.id);
            })
            .map((exp, index) => ({
                ...exp,
                dotOffset: index * 8, // 8px offset for each additional experience in the same year
            }));
    };

    useEffect(() => {
        async function fetchExperiences() {
            try {
                const querySnapshot = await getDocs(
                    collection(db, "Experience")
                );
                const exps: Experience[] = [];
                querySnapshot.forEach((doc) => {
                    exps.push({
                        id: doc.id,
                        ...(doc.data() as Omit<Experience, "id">),
                    });
                });

                // Filter out experiences with invalid start_dates and sort by global sequence
                const validExps = exps.filter(
                    (exp) =>
                        exp.start_date && typeof exp.start_date === "string"
                );
                const sortedExps = validExps.sort((a, b) => {
                    // Sort by global sequence if available (1=oldest, higher=newer)
                    if (a.sequence !== undefined && b.sequence !== undefined) {
                        return b.sequence - a.sequence; // Reverse for display (newest first on timeline)
                    }

                    return a.id.localeCompare(b.id);
                });

                setExperiences(sortedExps);
            } catch (error) {
                console.error("Error fetching experiences:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchExperiences();
    }, []);

    if (loading) return <p className="text-center">Loading experience...</p>;

    // Get unique years from the filtered experiences
    const uniqueYears = getUniqueYears(experiences);

    return (
        <section className="min-h-screen px-2 py-10">
            {/* Title with rule */}
            <div className="max-w-7xl mx-auto mb-10">
                <h2 className="text-4xl font-bold text-heading">Experience</h2>
                <div className="mt-2 h-[2px] bg-black" />
            </div>

            {/* SCROLLABLE CONTAINER FOR ENTIRE SECTION */}
            <section
                className="h-screen overflow-y-auto overscroll-contain style-7"
                onWheel={(e) => {
                    const element = e.currentTarget;
                    const { scrollTop, scrollHeight, clientHeight } = element;

                    // Only prevent page navigation if we're scrolling within this section
                    if (
                        (e.deltaY > 0 &&
                            scrollTop < scrollHeight - clientHeight) || // Scrolling down and not at bottom
                        (e.deltaY < 0 && scrollTop > 0) // Scrolling up and not at top
                    ) {
                        e.stopPropagation();
                    }
                }}
                onTouchMove={(e) => e.stopPropagation()}
            >
                {/* Desktop version - now scrollable */}
                <div className="relative max-w-6xl mx-auto hidden md:block px-4 py-8">
                    {/* Calculate dynamic height based on content */}
                    <div
                        className="relative"
                        style={{
                            minHeight: `${Math.max(
                                uniqueYears.length * 250 + 200,
                                800
                            )}px`,
                        }}
                    >
                        {/* Centered vertical line - dynamic height */}
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 top-0 w-[2px] bg-slate-700"
                            style={{
                                height: `${uniqueYears.length * 250 + 100}px`,
                            }}
                        />

                        {/* Year markers on the timeline */}
                        {uniqueYears.map((year, index) => (
                            <div
                                key={year}
                                className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
                                style={{ top: `${index * 250 + 50}px` }}
                            >
                                <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-20">
                                    {year}
                                </div>
                            </div>
                        ))}

                        {/* Experience cards positioned by actual years */}
                        <div className="pt-10">
                            {uniqueYears.map((year) => {
                                const yearExperiences = getExperiencesForYear(
                                    year,
                                    experiences
                                );
                                const yearPosition = getPositionForYear(
                                    year,
                                    uniqueYears
                                );

                                return yearExperiences.map((exp, expIndex) => {
                                    const globalIndex = experiences.findIndex(
                                        (e) => e.id === exp.id
                                    );
                                    const isLeft = expIndex % 2 === 0;
                                    const hoverProps =
                                        experienceHover.getHoverProps(
                                            exp.id,
                                            globalIndex
                                        );

                                    return (
                                        <motion.div
                                            key={exp.id}
                                            initial={{
                                                opacity: 0,
                                                x: isLeft ? -50 : 50,
                                            }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.6,
                                                ease: "easeOut",
                                            }}
                                            viewport={{
                                                once: true,
                                                amount: 0.3,
                                            }}
                                            className={`absolute flex ${
                                                isLeft
                                                    ? "justify-start"
                                                    : "justify-end"
                                            } w-full`}
                                            style={{
                                                top: `${
                                                    yearPosition +
                                                    50 +
                                                    expIndex * 100
                                                }px`,
                                            }}
                                        >
                                            {/* Timeline dot */}
                                            <div
                                                className="absolute left-1/2 top-8 transform h-4 w-4 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 shadow-lg z-10"
                                                style={{
                                                    transform: `translate(-50%, ${exp.dotOffset}px)`,
                                                }}
                                            ></div>

                                            <ExperienceCard
                                                experience={exp}
                                                isLeft={isLeft}
                                                {...hoverProps}
                                            />

                                            {/* Horizontal connector line */}
                                            <div
                                                className={`absolute w-28 h-[2px] bg-slate-300 dark:bg-slate-700 ${
                                                    isLeft
                                                        ? "right-1/2 "
                                                        : "left-1/2"
                                                }`}
                                                style={{
                                                    top: `calc(2rem + 6px + ${exp.dotOffset}px)`,
                                                }}
                                            />
                                        </motion.div>
                                    );
                                });
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile version - also within scrollable container */}
                <div className="md:hidden relative max-w-md mx-auto px-4 py-8">
                    <div
                        className="relative"
                        style={{ minHeight: `${experiences.length * 180}px` }}
                    >
                        <div
                            className="absolute left-6 top-0 w-[2px] bg-slate-300 dark:bg-slate-700"
                            style={{ height: `${experiences.length * 180}px` }}
                        />

                        {experiences.map((exp, i) => {
                            const hoverProps = experienceHover.getHoverProps(
                                `mobile-${exp.id}`,
                                i
                            );
                            const startYear = getYearFromDate(exp.start_date);

                            return (
                                <motion.div
                                    key={`mobile-${i}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.45 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    className="relative mb-10 pl-16"
                                >
                                    {/* Year indicator for mobile */}
                                    <div className="absolute left-6 transform -translate-x-1/2 top-0 flex items-center justify-center">
                                        <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-20">
                                            {startYear}
                                        </div>
                                    </div>

                                    {/* Mobile card with hover system */}
                                    <motion.div
                                        animate={{
                                            scale: hoverProps.hoverAnimation
                                                .scale,
                                            y: hoverProps.hoverAnimation.y,
                                        }}
                                        transition={{
                                            type: "spring",
                                            ...hoverProps.springConfig,
                                        }}
                                        onHoverStart={hoverProps.onHover}
                                        onHoverEnd={hoverProps.onLeave}
                                    >
                                        <Card
                                            shadow={
                                                hoverProps.isHovered
                                                    ? "lg"
                                                    : "sm"
                                            }
                                        >
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                {exp.role}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {exp.company_name}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {exp.start_date} -{" "}
                                                {exp.end_date}
                                            </p>
                                            <ul className="list-disc ml-5 mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                                {exp.Description.split(
                                                    "\n"
                                                ).map((b, j) => (
                                                    <li key={j}>{b}</li>
                                                ))}
                                            </ul>
                                        </Card>

                                        {/* Mobile glow effect */}
                                        {hoverProps.isHovered && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/5 to-transparent rounded-lg blur-xl"
                                                style={{
                                                    transform: "scale(1.1)",
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Bottom spacer for mobile */}
                    <div className="h-20" />
                </div>
            </section>
        </section>
    );
}

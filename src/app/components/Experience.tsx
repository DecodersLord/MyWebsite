"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import { useDeviceType } from "../hooks/useDeviceType";
import { useHoverSystem } from "../hooks/useHoverSystem";
import { ExperienceCard } from "./ExperienceCard";
import { type Experience } from "../types";

export default function Experience() {
    const deviceType = useDeviceType();
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasExpandedCards, setHasExpandedCards] = useState(false);

    // Initialize hover system for experience with device-aware settings
    const experienceHover = useHoverSystem({
        scaleOnHover: deviceType.hasHover ? 1.02 : 1.0,
        translateOnHover: deviceType.hasHover ? -4 : 0,
        staggerDelay: 0.1,
        springConfig: {
            stiffness: 300,
            damping: 30,
            mass: 1,
        },
        gridConfig: {
            projectsPerPage: experiences.length,
            columnsPerRow: 1,
            isDesktop: deviceType.isDesktop,
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
        return yearIndex * 150;
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
                dotOffset: index * 20, // 8px offset for each additional experience in the same year
            }));
    };

    // Container classes based on device and expansion state
    const getContainerClasses = () => {
        const baseClasses = "relative";
        const scrollClasses =
            hasExpandedCards || deviceType.isMobile
                ? "overflow-y-auto overscroll-contain scrollbar-hide"
                : "max-w-9/10 mx-auto overflow-y-auto overscroll-contain style-7";

        if (deviceType.isMobile) {
            return `${baseClasses} ${scrollClasses} h-screen max-h-[80vh]`;
        }
        return `${baseClasses} ${scrollClasses} ${
            hasExpandedCards
                ? "max-h-[calc(100vh-200px)]"
                : "min-h-[calc(100vh-150px)]"
        }`;
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
        <section className="pt-5">
            {/* Title with rule */}
            <div className="max-w-9/10 mx-auto mb-10">
                <h2 className="text-4xl font-bold text-heading">Experience</h2>
                <div className="mt-2 h-[2px] bg-black" />
            </div>

            {/* Enhanced scrollable container */}
            <section
                className={getContainerClasses()}
                style={{
                    WebkitOverflowScrolling: "touch",
                    overscrollBehavior: "contain",
                    touchAction: "pan-y",
                }}
            >
                {/* Desktop version - now scrollable */}
                <div className="relative hidden md:block px-8 py-8">
                    {/* Calculate dynamic height based on content */}
                    <div className="relative flex flex-col">
                        {/* Centered vertical line - dynamic height */}
                        <div
                            className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-700"
                            style={{
                                height: `${Math.max(
                                    uniqueYears.length * 250 + 100,
                                    600
                                )}px`,
                            }}
                        />

                        {/* Experience cards positioned by actual years */}
                        <div className="relative pt-10">
                            {uniqueYears.map((year, index) => {
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
                                    const cardProps = deviceType.hasHover
                                        ? experienceHover.getHoverProps(
                                              exp.id,
                                              expIndex
                                          )
                                        : experienceHover.getExpandProps(
                                              exp.id
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
                                                    globalIndex * 100
                                                }px`,
                                            }}
                                        >
                                            {expIndex == 0 && (
                                                <div
                                                    key={year}
                                                    className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center -top-15"
                                                >
                                                    <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-20">
                                                        {year}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Timeline dot */}
                                            <div
                                                className="absolute left-1/2 top-8 transform h-4 w-4 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 shadow-lg z-10"
                                                style={{
                                                    transform: `translate(-50%, ${exp.dotOffset}px)`,
                                                }}
                                            ></div>

                                            {/* Mobile experience card */}
                                            <ExperienceCard
                                                experience={exp}
                                                isLeft={false}
                                                isMobile={false}
                                                {...cardProps}
                                                springConfig={
                                                    experienceHover.springConfig || {
                                                        stiffness: 300,
                                                        damping: 30,
                                                        mass: 1,
                                                    }
                                                }
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

                {/* Enhanced Mobile Timeline */}
                <div className="md:hidden relative max-w-md mx-auto px-4 py-6">
                    <AnimatePresence>
                        <motion.div
                            className={`relative ${
                                hasExpandedCards ? "pb-20" : "pb-8"
                            }`}
                            style={{
                                minHeight: `${
                                    experiences.length *
                                    (hasExpandedCards ? 220 : 180)
                                }px`,
                            }}
                            layout
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <motion.div
                                className="absolute left-6 top-0 w-[2px] bg-slate-300 dark:bg-slate-700"
                                style={{
                                    height: `${
                                        experiences.length *
                                        (hasExpandedCards ? 250 : 250)
                                    }px`,
                                }}
                                layout
                                transition={{ duration: 0.3 }}
                            />

                            {uniqueYears.map((year, index) => {
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
                                    const cardProps = deviceType.hasHover
                                        ? experienceHover.getHoverProps(
                                              `mobile-${exp.id}`,
                                              expIndex
                                          )
                                        : experienceHover.getExpandProps(
                                              `mobile-${exp.id}`
                                          );

                                    return (
                                        <motion.div
                                            key={`mobile-${expIndex}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.45 }}
                                            viewport={{
                                                once: true,
                                                amount: 0.3,
                                            }}
                                            className="relative pl-16"
                                            style={{
                                                marginBottom:
                                                    cardProps.isExpanded
                                                        ? "2rem"
                                                        : "1rem",
                                            }}
                                            layout
                                            layoutId={`mobile-${exp.id}`}
                                        >
                                            {expIndex == 0 && (
                                                <div
                                                    key={year}
                                                    className="absolute left-6 transform -translate-x-1/2 -top-4 flex items-center justify-center"
                                                >
                                                    <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-20">
                                                        {year}
                                                    </div>
                                                </div>
                                            )}
                                            {/* Timeline dot for mobile */}
                                            <motion.div
                                                className="absolute left-6 transform -translate-x-1/2 top-6 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 shadow-lg z-10"
                                                layout
                                            />

                                            {/* Mobile experience card */}
                                            <ExperienceCard
                                                experience={exp}
                                                isLeft={false}
                                                isMobile={true}
                                                {...cardProps}
                                                springConfig={
                                                    experienceHover.springConfig || {
                                                        stiffness: 300,
                                                        damping: 30,
                                                        mass: 1,
                                                    }
                                                }
                                                staggerDelay={expIndex * 0.1}
                                            />

                                            {/* Horizontal connector for mobile */}
                                            <motion.div
                                                className="absolute left-6 top-7 w-10 h-[2px] bg-slate-300 dark:bg-slate-700"
                                                layout
                                            />
                                        </motion.div>
                                    );
                                });
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </section>
    );
}

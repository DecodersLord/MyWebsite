import React from "react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "../types";
import { ProjectCard } from "./ProjectCard";
import { useHoverSystem } from "../hooks/useHoverSystem";
import { useDeviceType } from "../hooks/useDeviceType";

export interface ProjectsGridProps {
    projects: Project[];
    currentPage: number;
    PROJECTS_PER_PAGE: number;
}

export function ProjectsGrid({
    projects,
    currentPage,
    PROJECTS_PER_PAGE,
}: ProjectsGridProps) {
    const deviceType = useDeviceType();
    const [hasExpandedCards, setHasExpandedCards] = useState(false);

    // Initialize hover system for projects
    const projectHover = useHoverSystem({
        scaleOnHover: 1.1,
        staggerDelay: 0.05,
        springConfig: {
            stiffness: 400,
            damping: 25,
            mass: 0.8,
        },
        gridConfig: {
            projectsPerPage: PROJECTS_PER_PAGE,
            columnsPerRow: deviceType.isDesktop
                ? 4
                : deviceType.isTablet
                ? 2
                : 1,
            isDesktop: deviceType.isDesktop,
        },
    });

    useEffect(() => {
        const expandedCards = projects.some((project) => {
            const cardProps = deviceType.hasHover
                ? projectHover.getHoverProps(project.id, 0)
                : projectHover.getExpandProps(project.id);
            return cardProps.isExpanded;
        });
        setHasExpandedCards(expandedCards);
    }, [projects, projectHover, deviceType.hasHover]);

    const getGridClasses = () => {
        const baseClasses = "grid responsive-grid";
        if (deviceType.isMobile) return `${baseClasses} grid-rows-1 gap-4`;
        if (deviceType.isTablet) return `${baseClasses} grid-cols-2 gap-5`;
        return ` ${baseClasses} grid-cols-4 gap-6`;
    };

    const getContainerClasses = () => {
        const baseClasses = "relative";
        const scrollClasses =
            hasExpandedCards || deviceType.isMobile
                ? "overflow-y-auto overscroll-contain scrollbar-hide"
                : "overflow-visible";

        if (deviceType.isMobile) {
            return `${baseClasses} ${scrollClasses} min-h-[400px] max-h-[80vh]`;
        }
        if (deviceType.isTablet) {
            return `${baseClasses} ${scrollClasses} min-h-[500px] ${
                hasExpandedCards ? "max-h-[80vh]" : ""
            }`;
        }
        return `${baseClasses} ${scrollClasses} min-h-[600px] md:min-h-[800px] ${
            hasExpandedCards ? "max-h-[80vh]" : ""
        }`;
    };

    const getGridItemClasses = (isExpanded: boolean) => {
        return `relative transition-all duration-300 ${
            isExpanded ? "row-span-2" : "row-span-1"
        }`;
    };

    return (
        <div className={getContainerClasses()}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    className={getGridClasses()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{
                        // Dynamic grid row sizing for expanded cards
                        gridAutoRows: hasExpandedCards
                            ? "minmax(500px, auto)"
                            : "300px",
                    }}
                >
                    {projects.map((project, index) => {
                        const cardProps = deviceType.hasHover
                            ? projectHover.getHoverProps(project.id, index)
                            : projectHover.getExpandProps(project.id);

                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    delay: index * 0.05,
                                    duration: 0.3,
                                    ease: "easeOut",
                                }}
                                className={getGridItemClasses(
                                    cardProps.isExpanded
                                )}
                                style={{
                                    minHeight: cardProps.isExpanded
                                        ? "auto"
                                        : "300px",
                                }}
                            >
                                <div
                                    className={
                                        cardProps.isHovered
                                            ? "absolute inset-0 w-full"
                                            : "relative w-full h-full"
                                    }
                                    style={{
                                        transform: cardProps.isHovered
                                            ? cardProps.customTransform
                                            : "none",
                                        transformOrigin:
                                            cardProps.transformOrigin,
                                        zIndex: cardProps.isHovered ? 50 : 10,
                                    }}
                                >
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        {...cardProps}
                                        springConfig={
                                            projectHover.springConfig || {
                                                stiffness: 400,
                                                damping: 25,
                                                mass: 0.8,
                                            }
                                        }
                                        staggerDelay={index * 0.05}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Fill empty slots */}
                    {Array.from(
                        { length: PROJECTS_PER_PAGE - projects.length },
                        (_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        )
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

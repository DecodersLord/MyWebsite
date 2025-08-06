import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "../types";
import { ProjectCard } from "./ProjectCard";
import { useHoverSystem } from "../hooks/useHoverSystem";

export interface ProjectsGridProps {
    projects: Project[];
    currentPage: number;
    hoveredProject: string | null;
    onHover: (id: string | null) => void;
    PROJECTS_PER_PAGE: number;
}

export function ProjectsGrid({
    projects,
    currentPage,
    PROJECTS_PER_PAGE,
}: ProjectsGridProps) {
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
            columnsPerRow:
                typeof window !== "undefined" && window.innerWidth >= 768
                    ? 4
                    : 2,
            isDesktop:
                typeof window !== "undefined" && window.innerWidth >= 768,
        },
    });

    return (
        <div className="relative min-h-[600px] md:min-h-[800px] overflow-visible">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    className="grid responsive-grid grid-cols-2 md:grid-cols-4 gap-6 overflow-visible small-height:grid-column"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {projects.map((project, index) => {
                        const hoverProps = projectHover.getHoverProps(
                            project.id,
                            index
                        );

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
                                className="relative"
                                style={{
                                    minHeight: "300px",
                                }}
                            >
                                <div
                                    className={
                                        hoverProps.isHovered
                                            ? "absolute inset-0 w-full"
                                            : "relative w-full h-full"
                                    }
                                    style={{
                                        transform: hoverProps.isHovered
                                            ? hoverProps.customTransform
                                            : "none",
                                        transformOrigin:
                                            hoverProps.transformOrigin,
                                        zIndex: hoverProps.isHovered ? 50 : 10,
                                    }}
                                >
                                    <ProjectCard
                                        project={project}
                                        {...hoverProps}
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

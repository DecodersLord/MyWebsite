import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "../types";
import { ProjectCard } from "./ProjectCard";

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
    hoveredProject,
    onHover,
    PROJECTS_PER_PAGE,
}: ProjectsGridProps) {
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
                        // Detect if card is in bottom row
                        const isDesktop =
                            typeof window !== "undefined" &&
                            window.innerWidth >= 768;
                        const columnsPerRow = isDesktop ? 4 : 2;
                        const rowIndex = Math.floor(index / columnsPerRow);
                        const totalRows = Math.ceil(
                            PROJECTS_PER_PAGE / columnsPerRow
                        );
                        const isBottomRow = rowIndex === totalRows - 1;
                        const isHovered = hoveredProject === project.id;

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
                                className="aspect-square relative"
                                style={{
                                    zIndex: isHovered ? 50 : 10,
                                }}
                            >
                                <div
                                    className={`w-full h-full transition-transform duration-300 ease-out ${
                                        isBottomRow && isHovered
                                            ? "scale-110 -translate-y-8 md:-translate-y-32"
                                            : isHovered
                                            ? "scale-110 translate-y-2 md:translate-y-3"
                                            : ""
                                    }`}
                                    style={{
                                        transformOrigin: isBottomRow
                                            ? "bottom center"
                                            : "center",
                                    }}
                                >
                                    <ProjectCard
                                        project={project}
                                        isHovered={isHovered}
                                        onHover={() => onHover(project.id)}
                                        onLeave={() => onHover(null)}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Fill empty slots to maintain grid structure */}
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

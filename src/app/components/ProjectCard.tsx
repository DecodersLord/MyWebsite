import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Project, Category, TECHS } from "../types";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { HoverableCard } from "./hoverCard";

export const ProjectCard = React.memo(function ProjectCard({
    project,
    isHovered,
    onHover,
    onLeave,
    hoverAnimation,
    springConfig,
    staggerDelay,
}: {
    project: Project;
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
    hoverAnimation: {
        scale: number;
        y: number;
        zIndex: number;
    };
    springConfig: {
        stiffness: number;
        damping: number;
        mass: number;
    };
    staggerDelay?: number;
}) {
    const getCategoryIcon = (category: Category) => {
        switch (category) {
            case "Front-end":
                return "🎨";
            case "Back-end":
                return "⚙️";
            case "Game-dev":
                return "🎮";
            default:
                return "📁";
        }
    };

    const getCategoryGradient = (category: Category) => {
        switch (category) {
            case "Front-end":
                return "from-blue-500/20 to-cyan-500/20";
            case "Back-end":
                return "from-green-500/20 to-emerald-500/20";
            case "Game-dev":
                return "from-purple-500/20 to-pink-500/20";
            default:
                return "from-[var(--color-accent)]/20 to-[var(--color-accent)]/5";
        }
    };

    return (
        <HoverableCard
            isHovered={isHovered}
            onHover={onHover}
            onLeave={onLeave}
            hoverAnimation={hoverAnimation}
            springConfig={springConfig}
            staggerDelay={staggerDelay}
            className="overflow-hidden bg-[var(--color-card)] border border-[var(--color-subtle)]/20"
            transformOrigin="center center"
            expandableContent={{
                type: "project",
                data: project,
                techsMap: TECHS,
            }}
        >
            {/* Main content container */}
            <div className="relative">
                {/* Base card content - always visible */}
                <div className="flex flex-col gap-4">
                    {/* Project Image/Icon */}
                    <div className="flex-shrink-0">
                        <div
                            className={`w-full h-40 rounded-md bg-gradient-to-br ${getCategoryGradient(
                                project.category
                            )} flex items-center justify-center relative overflow-hidden`}
                        >
                            <motion.div
                                animate={{
                                    scale: isHovered ? 2 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className="text-2xl"
                            >
                                {getCategoryIcon(project.category)}
                            </motion.div>
                        </div>
                    </div>

                    {/* Basic info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-accent mb-1 text-wrap">
                            {project.title}
                        </h4>
                        <p className="text-sm text-white mb-2 line-clamp-2">
                            {project.description}
                        </p>

                        {/* Category badge - always visible */}
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-tag)]/60 text-accent rounded-full text-xs">
                            {getCategoryIcon(project.category)}
                            <span className="capitalize">
                                {project.category}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </HoverableCard>
    );
});

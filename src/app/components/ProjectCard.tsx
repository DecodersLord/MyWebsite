import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Card from "../components/Card";
import { Project, Category, TECHS } from "../types";
import { FiGithub, FiExternalLink } from "react-icons/fi";

export const ProjectCard = React.memo(function ProjectCard({
    project,
    isHovered,
    onHover,
    onLeave,
}: {
    project: Project;
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
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
        <motion.div
            layout
            animate={{
                scale: isHovered ? 1.05 : 1,
                zIndex: isHovered ? 50 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.8,
            }}
            onHoverStart={onHover}
            onHoverEnd={onLeave}
            className="relative origin-center"
            style={{
                transformOrigin: "center center",
            }}
        >
            <Card
                shadow={isHovered ? "lg" : "sm"}
                padding="md"
                className="overflow-hidden transition-shadow duration-300 bg-[var(--color-card)] border border-[var(--color-subtle)]/20"
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
                            <h4 className="text-lg font-semibold text-accent mb-1 truncate">
                                {project.title}
                            </h4>
                            <p className="text-sm text-white mb-2 line-clamp-2">
                                {project.description}
                            </p>

                            {/* Category badge - always visible */}
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-background)]/60 text-accent rounded-full text-xs">
                                {getCategoryIcon(project.category)}
                                <span className="capitalize">
                                    {project.category}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Expanded content - Netflix overlay style */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                }}
                                className="mt-4 pt-4 border-t border-[var(--color-accent)]/30"
                            >
                                {/* Technologies */}
                                {project.technologies &&
                                    project.technologies.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="mb-4"
                                        >
                                            <h5 className="text-xs font-semibold text-white uppercase tracking-wide mb-2">
                                                Technologies
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies.map(
                                                    (tech, index) => (
                                                        <motion.span
                                                            key={tech}
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    0.15 +
                                                                    index *
                                                                        0.05,
                                                                duration: 0.2,
                                                            }}
                                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[var(--color-background)]/60 text-accent rounded-full"
                                                            title={
                                                                TECHS[tech]
                                                                    ?.label
                                                            }
                                                        >
                                                            {TECHS[tech]?.icon}
                                                            <span className="hidden sm:inline">
                                                                {
                                                                    TECHS[tech]
                                                                        ?.label
                                                                }
                                                            </span>
                                                        </motion.span>
                                                    )
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                {/* Action buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex gap-2"
                                >
                                    {project.live && (
                                        <motion.a
                                            href={project.live}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-2 px-3 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-white rounded-md transition-colors text-sm font-medium flex-1 justify-center"
                                        >
                                            <FiExternalLink size={14} />
                                            Live Demo
                                        </motion.a>
                                    )}
                                    {project.github && (
                                        <motion.a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors text-sm font-medium flex-1 justify-center"
                                        >
                                            <FiGithub size={14} />
                                            Code
                                        </motion.a>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>

            {/* Subtle glow effect on hover */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent rounded-lg blur-xl"
                        style={{ transform: "scale(1.1)" }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
});

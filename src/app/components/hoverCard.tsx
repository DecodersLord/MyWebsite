import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import Card from "./Card";
import { Project, Experience, TECHS } from "../types";

interface HoverableCardProps {
    children: ReactNode;
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
    className?: string;
    shadow?: "none" | "sm" | "md" | "lg";
    padding?: "none" | "sm" | "md" | "lg";
    transformOrigin?: string;

    // Expandable content props
    expandableContent?: {
        type: "project" | "experience";
        data: Project | Experience;
        techsMap?: typeof TECHS; // For projects
    };
}

export function HoverableCard({
    children,
    isHovered,
    onHover,
    onLeave,
    hoverAnimation,
    springConfig,
    staggerDelay = 0,
    className = "",
    shadow = "sm",
    padding = "md",
    transformOrigin = "center center",
    expandableContent,
}: HoverableCardProps) {
    const renderProjectContent = (project: Project, techsMap: typeof TECHS) => (
        <>
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4"
                >
                    <h5 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                        Technologies
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
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
                                    delay: 0.15 + index * 0.05,
                                    duration: 0.2,
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[var(--color-tag)]/60 text-accent rounded-full"
                                title={techsMap[tech]?.label}
                            >
                                {techsMap[tech]?.icon || <FiExternalLink />}
                                <span className="hidden sm:inline">
                                    {techsMap[tech]?.label || tech}
                                </span>
                            </motion.span>
                        ))}
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
        </>
    );

    const renderExperienceContent = (experience: Experience) => (
        <>
            {/* Skills */}
            {experience.skills && experience.skills.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-4"
                >
                    <h5 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                        Key Skills
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skill, index) => (
                            <motion.span
                                key={skill}
                                initial={{
                                    opacity: 0,
                                    scale: 0.8,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                transition={{
                                    delay: 0.15 + index * 0.05,
                                    duration: 0.2,
                                }}
                                className="px-2 py-1 text-xs bg-[var(--color-tag)]/60 text-accent rounded-full"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            )}
        </>
    );

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: hoverAnimation.scale,
                y: hoverAnimation.y,
                zIndex: hoverAnimation.zIndex,
            }}
            transition={{
                type: "spring",
                ...springConfig,
                delay: staggerDelay,
            }}
            onHoverStart={onHover}
            onHoverEnd={onLeave}
            className="relative"
            style={{
                transformOrigin,
            }}
        >
            <Card
                shadow={isHovered ? "lg" : shadow}
                padding={padding}
                className={`transition-shadow duration-300 ${className}`}
            >
                {children}

                {/* Expanded content - Netflix overlay style */}
                {expandableContent && (
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
                                {expandableContent.type === "project"
                                    ? renderProjectContent(
                                          expandableContent.data as Project,
                                          TECHS
                                      )
                                    : renderExperienceContent(
                                          expandableContent.data as Experience
                                      )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </Card>

            {/* Optional glow effect */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent rounded-lg blur-xl"
                    style={{ transform: "scale(1.1)" }}
                />
            )}
        </motion.div>
    );
}

import React, { useEffect } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Project,
    TECHS,
    getCategoryColor,
    getCategoryLabel,
    getCategoryIcon,
    Category,
} from "../types";
import Image from "next/image";
import { FiImage, FiChevronDown } from "react-icons/fi";
import { useDeviceType } from "../hooks/useDeviceType";
import HoverableCard from "./HoverableCard";

export const ProjectCard = React.memo(function ProjectCard({
    project,
    isHovered,
    isExpanded,
    onHover,
    onLeave,
    hoverAnimation,
    springConfig,
    staggerDelay,
    onExpand,
    onRetract,
}: {
    project: Project;
    isHovered: boolean;
    isExpanded: boolean;
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
    onExpand: () => void;
    onRetract: () => void;
}) {
    const deviceType = useDeviceType();

    const toggleExpand = () => (isExpanded ? onRetract() : onExpand());

    return (
        <HoverableCard
            isHovered={isHovered}
            isExpanded={isExpanded}
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
            onExpand={onExpand}
            onRetract={onRetract}
        >
            {/* Main content container */}
            <div className="relative">
                {/* Base card content - always visible */}
                <div className="flex flex-col gap-2">
                    {/* Project Image/Icon */}
                    <div className="flex-shrink-0">
                        <div
                            className={`w-full h-40 rounded-md bg-gradient-to-br ${getCategoryColor(
                                project.category
                            )} flex items-center justify-center relative overflow-hidden`}
                        >
                            {project.imageURL ? (
                                <div className="text-2xl">
                                    <Image
                                        src={project.imageURL}
                                        alt={`${
                                            project.title
                                        } - ${getCategoryLabel(
                                            project.category
                                        )} project`}
                                        className="w-full h-full object-cover rounded-md"
                                        width={400}
                                        height={500}
                                        priority
                                    />
                                </div>
                            ) : (
                                <ProjectImagePlaceholder
                                    category={project.category}
                                />
                            )}
                        </div>
                    </div>

                    {/* Basic info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center place-content-between gap-2 ">
                            <h4 className="text-lg font-semibold text-accent mb-1 text-wrap">
                                {project.title}
                                {/* Overlay for touch devices to indicate interactivity */}
                            </h4>
                            {deviceType.hasTouch && !deviceType.hasHover && (
                                <motion.div
                                    className="bg-black/50 rounded-full p-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand();
                                    }}
                                >
                                    <FiChevronDown className="text-white text-sm" />
                                </motion.div>
                            )}
                        </div>

                        <motion.p
                            animate={{
                                height:
                                    isHovered || isExpanded ? "auto" : "2.5rem", // ~2 lines height
                            }}
                            transition={{ duration: 0.3 }}
                            className={`text-sm text-white mb-2 text-wrap overflow-hidden ${
                                !isHovered && !isExpanded ? "line-clamp-2" : ""
                            }`}
                        >
                            {project.description}
                        </motion.p>

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

const ProjectImagePlaceholder = ({ category }: { category: Category }) => {
    return (
        <div
            className={`w-full h-40 rounded-md bg-gradient-to-br ${getCategoryColor(
                category
            )} flex flex-col items-center justify-center relative overflow-hidden`}
        >
            {/* Background pattern (optional) */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
            </div>

            {/* Icon and text */}
            <div className="relative z-10 flex flex-col items-center gap-2 text-white/70">
                <FiImage size={32} className="opacity-60" />
                <span className="text-xs font-medium">No Image Available</span>
            </div>
        </div>
    );
};

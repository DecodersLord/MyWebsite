import React from "react";
import { motion } from "framer-motion";
import { Experience } from "../types";
import { useDeviceType } from "../hooks/useDeviceType";
import {
    FiChevronDown,
    FiMapPin,
    FiCalendar,
    FiBriefcase,
} from "react-icons/fi";
import HoverableCard from "./HoverableCard";
import { AnimatePresence } from "framer-motion";

interface ExperienceCardProps {
    experience: Experience;
    isLeft: boolean;
    isMobile?: boolean;
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
}

export const ExperienceCard = React.memo(function ExperienceCard({
    experience,
    isLeft,
    isMobile = false,
    isHovered,
    isExpanded,
    onHover,
    onLeave,
    hoverAnimation,
    springConfig,
    staggerDelay,
    onExpand,
    onRetract,
}: ExperienceCardProps) {
    const deviceType = useDeviceType();

    const toggleExpand = () => (isExpanded ? onRetract() : onExpand());

    // Dynamic gradient based on position and mobile state
    const gradientClasses = isMobile
        ? "from-violet-600 via-indigo-600 to-transparent bg-gradient-to-r rounded-l-full"
        : `from-violet-600 via-indigo-600 to-transparent ${
              isLeft
                  ? "bg-gradient-to-l rounded-r-full"
                  : "bg-gradient-to-r rounded-l-full"
          }`;

    // Container width classes
    const containerClasses = isMobile
        ? "w-full"
        : `w-5/12 ${isLeft ? "pr-8" : "pl-8"}`;

    // Content alignment
    const contentAlignment = isMobile
        ? "text-left"
        : isLeft
        ? "text-right"
        : "text-left";

    // Skills alignment
    const skillsAlignment = isMobile ? "" : isLeft ? "justify-end" : "";

    return (
        <div className={containerClasses}>
            <HoverableCard
                isHovered={isHovered}
                isExpanded={isExpanded}
                onHover={onHover}
                onLeave={onLeave}
                hoverAnimation={hoverAnimation}
                springConfig={springConfig}
                staggerDelay={staggerDelay}
                className="overflow-hidden bg-[var(--color-card)] border border-[var(--color-subtle)]/20 shadow-lg hover:shadow-xl transition-shadow duration-300"
                transformOrigin={
                    isMobile
                        ? "center center"
                        : isLeft
                        ? "right center"
                        : "left center"
                }
                expandableContent={{
                    type: "experience",
                    data: experience,
                }}
                onExpand={onExpand}
                onRetract={onRetract}
            >
                {/* Header Section */}
                <div className={contentAlignment}>
                    <div className={`${gradientClasses} px-6 relative`}>
                        <div className="flex items-center justify-between">
                            <h3
                                className={`font-semibold text-white py-3 ${
                                    isMobile ? "text-sm flex-1" : "text-xl"
                                }`}
                            >
                                {experience.role}
                            </h3>

                            {/* Expand button for touch devices */}
                            {deviceType.hasTouch && !deviceType.hasHover && (
                                <motion.button
                                    className="bg-black/30 hover:bg-black/50 rounded-full p-2 ml-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand();
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        animate={{
                                            rotate: isExpanded ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FiChevronDown className="text-white text-sm" />
                                    </motion.div>
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Company and Date Info */}
                    <div className="px-4 py-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <FiBriefcase className="text-gray-400 text-sm" />
                            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {experience.company_name}
                            </h4>
                        </div>

                        <div className="flex items-center gap-2">
                            <FiCalendar className="text-gray-400 text-sm" />
                            <h4 className="text-xs text-gray-500 dark:text-gray-400">
                                {experience.start_date} - {experience.end_date}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="px-4 pb-4">
                    <div className={`flex flex-wrap gap-2 ${skillsAlignment}`}>
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
                                whileHover={{
                                    scale: 1.05,
                                    backgroundColor:
                                        "var(--color-accent-hover, rgba(99, 102, 241, 0.8))",
                                }}
                                className="px-3 py-1.5 text-xs bg-[var(--color-tag)]/60 text-accent rounded-full font-medium cursor-default transition-colors duration-200"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </HoverableCard>
        </div>
    );
});

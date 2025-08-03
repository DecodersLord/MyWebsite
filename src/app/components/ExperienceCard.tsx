import React from "react";
import { motion } from "framer-motion";
import { HoverableCard } from "./hoverCard";
import { Experience } from "../types";

interface ExperienceCardProps {
    experience: Experience;
    isLeft: boolean;
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
}

export const ExperienceCard = React.memo(function ExperienceCard({
    experience,
    isLeft,
    isHovered,
    onHover,
    onLeave,
    hoverAnimation,
    springConfig,
    staggerDelay,
}: ExperienceCardProps) {
    return (
        <div className={`w-5/12 ${isLeft ? "pr-8" : "pl-8"}`}>
            <HoverableCard
                isHovered={isHovered}
                onHover={onHover}
                onLeave={onLeave}
                hoverAnimation={hoverAnimation}
                springConfig={springConfig}
                staggerDelay={staggerDelay}
                transformOrigin={isLeft ? "right center" : "left center"}
                expandableContent={{
                    type: "experience",
                    data: experience,
                }}
            >
                <div className={`${isLeft ? "text-right" : "text-left"}`}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {experience.role}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {experience.company_name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {experience.start_date} - {experience.end_date}
                    </p>
                </div>
                <ul
                    className={`list-disc mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300 ${
                        isLeft ? "mr-5 text-right" : "ml-5 text-left"
                    }`}
                >
                    {experience.Description.split("\n").map((bullet, j) => (
                        <li key={j} className={isLeft ? "list-none" : ""}>
                            {bullet}
                        </li>
                    ))}
                </ul>
            </HoverableCard>
        </div>
    );
});

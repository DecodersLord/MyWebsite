import React from "react";
import { motion } from "framer-motion";
import { HoverableCard } from "./hoverCard";
import { Experience } from "../types";
import { c } from "node_modules/framer-motion/dist/types.d-Bq-Qm38R";

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
    const gradientTitle =
        `from-violet-600 via-indigo-600 to-transparent -z-10` +
        ` ${
            isLeft
                ? "bg-gradient-to-l rounded-r-full"
                : "bg-gradient-to-r rounded-l-full"
        }`;

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
                    <div className={`${gradientTitle} px-6`}>
                        <h3 className={`text-xl font-semibold text-white py-2`}>
                            {experience.role}
                        </h3>
                    </div>

                    <div className="px-4">
                        <h4 className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {experience.company_name}
                        </h4>
                        <h4 className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {experience.start_date} - {experience.end_date}
                        </h4>
                    </div>
                </div>
                <ul
                    className={`list-disc mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300 ${
                        isLeft ? "mr-5 text-right" : "ml-5 text-left"
                    }`}
                >
                    {experience.Description.split("\n").map((bullet, j) => (
                        <li key={j} className="list-none">
                            {bullet}
                        </li>
                    ))}
                </ul>
            </HoverableCard>
        </div>
    );
});

"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
    children: ReactNode;
    className?: string;
    shadow?: "none" | "sm" | "md" | "lg";
    padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
    children,
    className = "",
    shadow = "sm",
    padding = "md",
}: CardProps) {
    const shadowClasses = {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
    }[shadow];

    const paddingClasses = {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-8",
    }[padding];

    return (
        <div
            className={clsx(
                "rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300",
                shadowClasses,
                paddingClasses,
                className
            )}
        >
            {children}
        </div>
    );
}

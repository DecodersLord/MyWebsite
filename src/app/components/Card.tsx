"use client";

import { ReactNode } from "react";

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
            className={`rounded-xl border border-gray-700 bg-[var(--color-card)] transition-colors duration-300 ${shadowClasses} ${paddingClasses} ${className}`}
        >
            {children}
        </div>
    );
}

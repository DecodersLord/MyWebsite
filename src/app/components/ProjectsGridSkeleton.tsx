import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface ProjectsGridSkeletonProps {
    PROJECTS_PER_PAGE: number;
}

function SkeletonCard() {
    return (
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg relative">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Content skeleton */}
            <div className="p-4 h-full flex flex-col justify-between">
                {/* Title skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                </div>

                {/* Image/content area skeleton */}
                <div className="flex-1 my-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

                {/* Tags/footer skeleton */}
                <div className="flex gap-2">
                    <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export function ProjectsGridSkeleton({
    PROJECTS_PER_PAGE,
}: ProjectsGridSkeletonProps) {
    return (
        <div className="relative overflow-visible">
            <motion.div
                className="grid responsive-grid grid-cols-2 md:grid-cols-4 gap-6 overflow-visible small-height:grid-column"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {Array.from({ length: PROJECTS_PER_PAGE }, (_, index) => (
                    <motion.div
                        key={`skeleton-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: index * 0.05,
                            duration: 0.3,
                            ease: "easeOut",
                        }}
                        className="aspect-square relative"
                        style={{ zIndex: 10 }}
                    >
                        <div className="w-full h-full">
                            <SkeletonCard />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

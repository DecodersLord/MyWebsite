"use client";

import React from "react";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { AnimatePresence, motion } from "framer-motion";
import { Project, Category, TechTag, TECHS } from "../types";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { PaginationContainer } from "./PaginationContainer";
import { ProjectsGrid } from "./ProjectsGrid";

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTechs, setSelectedTechs] = useState<Set<TechTag>>(new Set());
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [projectsPerPage, setProjectsPerPage] = useState(8);
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const calculateProjectsPerPage = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            if (width < 640 || height < 750) return 2; // 2x2 grid
            if (width <= 1024) return 4; // 2x2 grid
            return 8; // 4x2
        };

        const updateLayout = () => {
            const newProjectsPerPage = calculateProjectsPerPage();
            setProjectsPerPage((prev) => {
                // Only update if the value actually changed to prevent unnecessary re-renders
                return prev !== newProjectsPerPage ? newProjectsPerPage : prev;
            });
        };

        updateLayout(); // Set on mount

        // Listen to multiple events that can change viewport dimensions
        window.addEventListener("resize", updateLayout);
        window.addEventListener("orientationchange", updateLayout);

        // Use ResizeObserver for more reliable detection of size changes
        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(() => {
                // Small delay to ensure the viewport has fully updated
                setTimeout(updateLayout, 100);
            });
            resizeObserver.observe(document.documentElement);
        }

        // Also listen for zoom/scale changes via matchMedia
        const mediaQueries = [
            window.matchMedia("(max-width: 639px)"),
            window.matchMedia("(min-width: 640px) and (max-width: 1023px)"),
            window.matchMedia("(min-width: 1024px)"),
        ];

        const handleMediaChange = () => {
            // Small delay to ensure all layout changes are complete
            setTimeout(updateLayout, 50);
        };

        mediaQueries.forEach((mq) => {
            if (mq.addEventListener) {
                mq.addEventListener("change", handleMediaChange);
            } else {
                // Fallback for older browsers
                mq.addListener(handleMediaChange);
            }
        });

        return () => {
            window.removeEventListener("resize", updateLayout);
            window.removeEventListener("orientationchange", updateLayout);

            if (resizeObserver) {
                resizeObserver.disconnect();
            }

            mediaQueries.forEach((mq) => {
                if (mq.removeEventListener) {
                    mq.removeEventListener("change", handleMediaChange);
                } else {
                    // Fallback for older browsers
                    mq.removeListener(handleMediaChange);
                }
            });
        };
    }, []);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const snap = await getDocs(collection(db, "Projects"));
                const result: Project[] = [];
                snap.forEach((doc) => {
                    const data = doc.data() as Omit<Project, "id">;
                    result.push({
                        id: doc.id,
                        ...data,
                    });
                });
                setProjects(result);
            } catch (e) {
                console.error("Error fetching projects:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    const filteredProjects = useMemo(() => {
        if (selectedTechs.size === 0) return projects;
        return projects.filter((project) =>
            project.technologies?.some((tech) => selectedTechs.has(tech))
        );
    }, [projects, selectedTechs]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const currentProjects = useMemo(() => {
        const startIndex = currentPage * projectsPerPage;
        return filteredProjects.slice(startIndex, startIndex + projectsPerPage);
    }, [filteredProjects, currentPage, projectsPerPage]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(0);
    }, [selectedTechs]);

    // Reset page when projectsPerPage changes and current page becomes invalid
    useEffect(() => {
        const newTotalPages = Math.ceil(
            filteredProjects.length / projectsPerPage
        );
        if (currentPage >= newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages - 1);
        }
    }, [projectsPerPage, filteredProjects.length, currentPage]);

    const toggleTech = useCallback((tech: TechTag) => {
        setSelectedTechs((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(tech)) {
                newSet.delete(tech);
            } else {
                newSet.add(tech);
            }
            return newSet;
        });
    }, []);

    const clearAllFilters = useCallback(() => {
        setSelectedTechs(new Set());
    }, []);

    const closeMobileFilter = useCallback(() => {
        setShowMobileFilter(false);
    }, []);

    const goToPage = useCallback(
        (page: number) => {
            if (page >= 0 && page < totalPages) {
                setCurrentPage(page);
            }
        },
        [totalPages]
    );

    const nextPage = useCallback(() => {
        goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const prevPage = useCallback(() => {
        goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                prevPage();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                nextPage();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextPage, prevPage]);

    if (loading) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center">
                <p className="text-center text-subtle">Loading projects...</p>
            </div>
        );
    }

    return (
        <section className="min-h-screen px-2 py-10">
            {/* Title with rule */}
            <div className="max-w-7xl mx-auto mb-10">
                <h2 className="text-4xl font-bold text-heading">Projects</h2>
                <div className="mt-2 h-[2px] bg-black" />
            </div>

            {/* Mobile dock toggle */}
            <button
                aria-label="Open filters"
                onClick={() => setShowMobileFilter(true)}
                className="block fixed right-4 bottom-4 z-9999 rounded-full p-3 shadow-lg bg-white text-[var(--color-foreground)] hover:scale-110 transition-transform"
            >
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    className="fill-current"
                >
                    <path d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm3 6h4v2h-4v-2z" />
                </svg>
            </button>

            {/* Mobile slide-over filter */}
            <AnimatePresence mode="wait">
                {showMobileFilter && (
                    <MobileFilterDrawer
                        techs={TECHS}
                        selectedTechs={selectedTechs}
                        toggleTech={toggleTech}
                        onClose={closeMobileFilter}
                        onClearAll={clearAllFilters}
                    />
                )}
            </AnimatePresence>

            {/* Projects content */}
            <div className="max-w-7xl mx-auto">
                {/* Pagination Container */}
                <PaginationContainer
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalProjects={filteredProjects.length}
                    onPrevPage={prevPage}
                    onNextPage={nextPage}
                    onGoToPage={goToPage}
                />

                {/* Projects Grid */}
                <ProjectsGrid
                    projects={currentProjects}
                    currentPage={currentPage}
                    hoveredProject={hoveredProject}
                    onHover={setHoveredProject}
                    PROJECTS_PER_PAGE={projectsPerPage}
                />

                {/* No projects message */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-subtle text-lg">
                            {selectedTechs.size > 0
                                ? "No projects found matching the selected filters."
                                : "No projects available."}
                        </p>
                        {selectedTechs.size > 0 && (
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 text-[var(--color-accent)] hover:underline"
                            >
                                Clear filters to see all projects
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

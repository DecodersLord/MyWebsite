"use client";

import React from "react";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AnimatePresence, motion } from "framer-motion";
import { Project, Category, TechTag, TECHS } from "../types";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { PaginationContainer } from "./PaginationContainer";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsGridSkeleton } from "./ProjectsGridSkeleton";

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

            // Detect zoom level (approximate)
            const zoom = window.devicePixelRatio || 1;
            const actualWidth = width * zoom;



            // Use CSS pixels for consistent behavior
            if (width < 640 || height < 750) return 2; // Mobile: 1x2
            if (width < 1024) return 4; // Tablet: 2x2
            if (width < 1600) return 4; // Small desktop: 3x2
            return 8; // Large desktop: 4x2
        };

        const updateLayout = () => {
            const newProjectsPerPage = calculateProjectsPerPage();
            setProjectsPerPage((prev) => {
                return prev !== newProjectsPerPage ? newProjectsPerPage : prev;
            });
        };

        updateLayout();

        const resizeObserver = new ResizeObserver(() => {
            setTimeout(updateLayout, 100);
        });
        resizeObserver.observe(document.documentElement);

        window.addEventListener("resize", updateLayout);

        return () => {
            window.removeEventListener("resize", updateLayout);
            resizeObserver.disconnect();
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

    return (
        <section className="pt-5">
            {/* Title with rule */}
            <div className="max-w-9/10 mx-auto mb-10">
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
            <div className="max-w-9/10 mx-auto ">
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
                {loading ? (
                    <ProjectsGridSkeleton PROJECTS_PER_PAGE={projectsPerPage} />
                ) : filteredProjects.length === 0 ? (
                    /* No projects message */
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
                ) : (
                    <ProjectsGrid
                        projects={currentProjects}
                        currentPage={currentPage}
                        PROJECTS_PER_PAGE={projectsPerPage}
                    />
                )}
            </div>
        </section>
    );
}

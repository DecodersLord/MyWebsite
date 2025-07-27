"use client";

import React from "react";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { Project, Category, TechTag, TECHS } from "../types";
import { FilterRail } from "./FilterRail";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { PaginationContainer } from "./PaginationContainer";
import { ProjectsGrid } from "./ProjectsGrid";

const PROJECTS_PER_PAGE = 8; // 4x2 grid on desktop, 2x2 on mobile

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTechs, setSelectedTechs] = useState<Set<TechTag>>(new Set());
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

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
    const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
    const currentProjects = useMemo(() => {
        const startIndex = currentPage * PROJECTS_PER_PAGE;
        return filteredProjects.slice(
            startIndex,
            startIndex + PROJECTS_PER_PAGE
        );
    }, [filteredProjects, currentPage]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(0);
    }, [selectedTechs]);

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

            {/* Desktop filter (sticky right) */}
            <aside className="hidden lg:block fixed right-6 top-40 w-16 z-30">
                <FilterRail
                    selectedTechs={selectedTechs}
                    toggleTech={toggleTech}
                    techs={TECHS}
                />
            </aside>

            {/* Mobile dock toggle */}
            <button
                aria-label="Open filters"
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden fixed right-4 bottom-4 z-50 rounded-full p-3 shadow-lg bg-white text-[var(--color-foreground)] hover:scale-110 transition-transform"
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
                    PROJECTS_PER_PAGE={PROJECTS_PER_PAGE}
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

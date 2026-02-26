import React from "react";

export interface PaginationContainerProps {
    currentPage: number;
    totalPages: number;
    totalProjects: number;
    onPrevPage: () => void;
    onNextPage: () => void;
    onGoToPage: (page: number) => void;
}

export const PaginationContainer = function PaginationContainer({
    currentPage,
    totalPages,
    totalProjects,
    onPrevPage,
    onNextPage,
    onGoToPage,
}: PaginationContainerProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mb-8">
            {/* Desktop Pagination */}
            <div className="hidden md:flex items-center justify-between">
                <div className="text-sm text-subtle">
                    Page {currentPage + 1} of {totalPages} • {totalProjects}{" "}
                    project{totalProjects !== 1 ? "s" : ""}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onPrevPage}
                        disabled={currentPage === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:bg-[var(--color-card)]/75 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[var(--color-foreground)]"
                        aria-label="Previous page"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                        Previous
                    </button>

                    {/* Page indicators */}
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => onGoToPage(i)}
                                className={`w-10 h-10 rounded-lg font-medium transition-all ${i === currentPage
                                        ? "bg-[var(--color-card)] text-white"
                                        : "bg-white hover:bg-[var(--color-card)]/75 hover:text-white"
                                    }`}
                                aria-label={`Go to page ${i + 1}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-md hover:bg-[var(--color-card)]/75 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[var(--color-foreground)]"
                        aria-label="Next page"
                    >
                        Next
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Pagination */}
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-subtle">
                        {totalProjects} project{totalProjects !== 1 ? "s" : ""}
                    </div>
                    <div className="text-sm text-subtle">
                        {currentPage + 1} / {totalPages}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={onPrevPage}
                        disabled={currentPage === 0}
                        className="p-3 rounded-full bg-white shadow-md hover:bg-[var(--color-card)] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>

                    {/* Mobile page dots */}
                    <div className="flex gap-1 mx-4">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => onGoToPage(i)}
                                className={`w-3 h-3 rounded-full transition-all ${i === currentPage
                                        ? "bg-[var(--color-card)] w-8"
                                        : "bg-white hover:bg-[var(--color-card)]/50"
                                    }`}
                                aria-label={`Go to page ${i + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={onNextPage}
                        disabled={currentPage === totalPages - 1}
                        className="p-3 rounded-full bg-white shadow-md hover:bg-[var(--color-card)] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next page"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

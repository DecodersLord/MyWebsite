import { useState, useCallback } from "react";

export interface HoverSystemConfig {
    scaleOnHover?: number;
    translateOnHover?: number;
    staggerDelay?: number;
    springConfig?: {
        stiffness: number;
        damping: number;
        mass: number;
    };
    // Grid-specific config for projects
    gridConfig?: {
        projectsPerPage: number;
        columnsPerRow: number;
        isDesktop: boolean;
    };
}

export function useHoverSystem(config: HoverSystemConfig = {}) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const {
        scaleOnHover = 1.05,
        translateOnHover = 0,
        staggerDelay = 0.05,
        springConfig = {
            stiffness: 400,
            damping: 25,
            mass: 0.8,
        },
        gridConfig,
    } = config;

    const handleHover = useCallback((id: string | null) => {
        setHoveredItem(id);
    }, []);

    const handleExpand = useCallback((id: string | null) => {
        setExpandedItem(id);
    }, []);

    const getHoverProps = useCallback(
        (id: string, index: number = 0) => {
            const isHovered = hoveredItem === id;

            // Calculate if this is bottom row for projects grid
            let isBottomRow = false;
            let customTransform = "";
            let transformOrigin = "center center";

            if (gridConfig && isHovered) {
                const { projectsPerPage, columnsPerRow, isDesktop } =
                    gridConfig;
                const rowIndex = Math.floor(index / columnsPerRow);
                const totalRows = Math.ceil(projectsPerPage / columnsPerRow);
                isBottomRow = rowIndex === totalRows - 1;

                if (isBottomRow) {
                    customTransform = `scale(${scaleOnHover}) translateY(${
                        isDesktop ? -50 : -32
                    }px)`;
                    transformOrigin = "bottom center";
                } else {
                    customTransform = `scale(${scaleOnHover}) translateY(${
                        isDesktop ? 12 : 8
                    }px)`;
                    transformOrigin = "center center";
                }
            }

            return {
                isHovered,
                isExpanded: false, // still required by type
                onHover: () => handleHover(id),
                onLeave: () => handleHover(null),
                onExpand: () => {}, // no-op for hover devices
                onRetract: () => {}, // no-op for hover devices
                hoverAnimation: {
                    scale: gridConfig ? 1 : isHovered ? scaleOnHover : 1,
                    y: gridConfig ? 0 : isHovered ? translateOnHover : 0,
                    zIndex: isHovered ? 50 : 10,
                },
                springConfig,
                staggerDelay: index * staggerDelay,
                isBottomRow,
                customTransform,
                transformOrigin,
            };
        },
        [
            hoveredItem,
            handleHover,
            scaleOnHover,
            translateOnHover,
            staggerDelay,
            springConfig,
            gridConfig,
        ]
    );

    const getExpandProps = useCallback(
        (id: string) => {
            const isExpanded = expandedItem === id;

            return {
                isHovered: false,
                isExpanded,
                onHover: () => {},
                onLeave: () => {},
                onExpand: () => handleExpand(id),
                onRetract: () => handleExpand(null),
                hoverAnimation: { scale: 1, y: 0, zIndex: 1 },
                springConfig,
                staggerDelay,
                isBottomRow: false,
                customTransform: "",
                transformOrigin: "center center",
            };
        },
        [expandedItem, handleExpand, springConfig]
    );

    return {
        hoveredItem,
        expandedItem,
        handleHover,
        handleExpand,
        getHoverProps,
        getExpandProps,
        springConfig,
    };
}

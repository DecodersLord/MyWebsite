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
                        isDesktop ? -128 : -32
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
                onHover: () => handleHover(id),
                onLeave: () => handleHover(null),
                hoverAnimation: {
                    scale: gridConfig ? 1 : isHovered ? scaleOnHover : 1, // Don't apply scale if using grid config
                    y: gridConfig ? 0 : isHovered ? translateOnHover : 0, // Don't apply y if using grid config
                    zIndex: isHovered ? 50 : 10,
                },
                springConfig,
                staggerDelay: index * staggerDelay,
                // Grid-specific properties
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

    return {
        hoveredItem,
        handleHover,
        getHoverProps,
    };
}

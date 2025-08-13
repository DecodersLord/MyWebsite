import { useState, useEffect } from "react";

export const useDeviceType = () => {
    const [deviceType, setDeviceType] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        hasHover: false,
        hasTouch: false,
    });

    useEffect(() => {
        const checkDeviceType = () => {
            const width = window.innerWidth;
            const hasHover = window.matchMedia(
                "(hover: hover) and (pointer: fine)"
            ).matches;
            const hasTouch =
                "ontouchstart" in window || navigator.maxTouchPoints > 0;

            setDeviceType({
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isDesktop: width >= 1024,
                hasHover: hasHover && !hasTouch, // Only true hover if no touch
                hasTouch: hasTouch,
            });
        };

        checkDeviceType();
        window.addEventListener("resize", checkDeviceType);

        // Also listen for hover capability changes
        const hoverQuery = window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );
        hoverQuery.addEventListener("change", checkDeviceType);

        return () => {
            window.removeEventListener("resize", checkDeviceType);
            hoverQuery.removeEventListener("change", checkDeviceType);
        };
    }, []);

    return deviceType;
};

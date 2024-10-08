/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.{html,js}", "./src/**/*.{html,js}"],
    theme: {
        extend: {
            fontFamily: {
                "press-start": ['"Press Start 2P"', "cursive"],
                space: ['"Space Grotesk"', "sans-serif"],
            },
            colors: {
                "mid-blue": "#1967e7",
                "div-1-color": "#282a36",
                "div-2-color": "#21222c",
                "border-color": "#7359f8",
                "nav-color": "#373251",
            },
            height: {
                "half-screen": "50vh",
                "quater-screen": "78vh",
                "icon-size": "4.5rem",
            },
            width: {
                sidebar: "13%",
                "main-content": "75%",
                "icon-size": "4.5rem",
            },
            screens: {
                sm: { min: "640px", max: "767px" },
                // => @media (min-width: 640px and max-width: 767px) { ... }

                md: { min: "768px", max: "1023px" },
                // => @media (min-width: 768px and max-width: 1023px) { ... }

                lg: { min: "1024px", max: "1279px" },
                // => @media (min-width: 1024px and max-width: 1279px) { ... }

                xl: { min: "1280px", max: "1535px" },
                // => @media (min-width: 1280px and max-width: 1535px) { ... }

                "2xl": { min: "1536px" },
                // => @media (min-width: 1536px) { ... }
            },
            inset: {
                6: "1.6rem",
            },
            keyframes: {
                "fade-in-down": {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(-10px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
            },
            animation: {
                "fade-in-down": "fade-in-down 0.5s ease-out",
            },
        },
    },
    variants: {},
    plugins: [],
};

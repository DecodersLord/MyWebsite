import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssNesting from "postcss-nesting";
import postcssPresetEnv from "postcss-preset-env";

const config = {
    plugins: {
        "postcss-nesting": postcssNesting(),
        "postcss-preset-env": postcssPresetEnv({
            stage: 1,
            features: {
                "custom-properties": true,
                "color-functional-notation": true,
                "custom-media-queries": true,
            },
        }),
        tailwindcss: {},
        autoprefixer: {},
    },
};

export default config;

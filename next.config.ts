import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            "leetcard.jacoblin.cool",
            "github-readme-streak-stats.herokuapp.com",
        ],
        dangerouslyAllowSVG: true,
    },
    /* config options here */
};

export default nextConfig;

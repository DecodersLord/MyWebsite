import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { hostname: "leetcard.jacoblin.cool" },
            { hostname: "github-readme-streak-stats.herokuapp.com" },
            { hostname: "i.postimg.cc" },
        ],
        dangerouslyAllowSVG: true,
    },
    /* config options here */
};

export default nextConfig;

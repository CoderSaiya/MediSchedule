import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        logging: {
            level: 'verbose'
        }
    },
};

export default nextConfig;

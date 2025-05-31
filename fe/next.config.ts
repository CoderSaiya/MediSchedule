import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        logging: {
            level: 'verbose'
        }
    },
    images: {
        domains: [
            'api.qrserver.com',
            'sonysam1233.blob.core.windows.net'
        ],
    },
};

export default nextConfig;

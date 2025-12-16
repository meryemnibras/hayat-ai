import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: "standalone",

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Security headers handled by middleware
  poweredByHeader: false,

  // Turbopack config (empty to enable Turbopack)
  turbopack: {},
};

export default nextConfig;

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

  // Force revalidation to prevent cache issues
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 30,
    },
  },
};

export default nextConfig;

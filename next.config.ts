import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // تفعيل React Strict Mode
  reactStrictMode: true,

  // Note: output: "standalone" is for Docker deployments
  // Vercel doesn't need this - it handles deployment automatically
  // output: "standalone",

  // إعدادات الصور
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  // Headers للأمان
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },

  // متغيرات البيئة العامة
  env: {
    NEXT_PUBLIC_APP_NAME: 'Hayat Beauty Clinic',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // تحسينات إضافية
  compress: true,
  poweredByHeader: false,

  // Experimental features
  experimental: {
    optimizeCss: true,
    staleTimes: {
      dynamic: 30,
      static: 30,
    },
  },

  // Turbopack config (empty to enable Turbopack)
  turbopack: {},
};

export default nextConfig;

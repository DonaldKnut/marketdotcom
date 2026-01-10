import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better Netlify compatibility
  experimental: {},

  // External packages for server components
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],

  // Configure images for Netlify
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Environment variables that should be available at build time
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },

  // Redirects for SPA routing (if needed)
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

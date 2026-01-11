/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip static generation for API routes during build
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },

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
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_9071bb582b6486e980b86bce551587236426329a',
  },

  // Skip static generation for API routes
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

export default nextConfig;

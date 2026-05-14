import type { NextConfig } from 'next'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.bricklink.com',
      },
    ],
    unoptimized: false, // Pro has unlimited transforms
    formats: ['image/avif', 'image/webp'], // Modern formats = 50% smaller
    minimumCacheTTL: 2592000, // Cache for 30 days
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Bundle Prisma client properly for Vercel
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@prisma/client-hostinger': 'commonjs @prisma/client-hostinger',
      });
    }
    return config;
  },
  // Ensure output includes Prisma engine
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/@prisma/client-hostinger/**/*'],
  },
  async headers() {
    return [
      {
        source: '/catalog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, immutable',
          },
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
      {
        source: '/avatars/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache static pages (no BrickLink pricing) aggressively
      {
        source: '/about',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/faq',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/articles',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/articles/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // Cache theme/browse pages for 30 minutes (no pricing data)
      {
        source: '/themes',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600',
          },
        ],
      },
      {
        source: '/themes/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600',
          },
        ],
      },
      {
        source: '/sets-themes/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ],
      },
    ];
  },
  async redirects() {
    return []
  },
}

export default withBundleAnalyzer(nextConfig)

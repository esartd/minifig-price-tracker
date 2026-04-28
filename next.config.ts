import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

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
    formats: ['image/avif', 'image/webp'],
    unoptimized: false,
    loader: 'default',
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
    return [
      {
        source: '/minifig/:itemNo',
        destination: '/minifigs/:itemNo',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(withBundleAnalyzer(nextConfig))

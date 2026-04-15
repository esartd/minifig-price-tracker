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

export default withBundleAnalyzer(nextConfig)

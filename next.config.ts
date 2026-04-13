import type { NextConfig } from 'next'

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

export default nextConfig

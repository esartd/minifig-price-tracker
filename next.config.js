/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.bricklink.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.rebrickable.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'www.lego.com',
      },
    ],
  },
  // Add cache headers for static catalog files
  // BrickLink API Terms: "Display item Content or product information...
  // which is more than six hours older than such information is on the Website"
  async headers() {
    return [
      {
        // Cache catalog JSON files for 6 hours (max allowed by BrickLink API Terms)
        source: '/catalog/:path*.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=21600, s-maxage=21600, stale-while-revalidate=3600',
          },
        ],
      },
      {
        // Cache images for 30 days (they rarely change)
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

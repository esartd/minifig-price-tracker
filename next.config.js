/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a deploy build into a scratch directory and swap it in when it is
  // finished, instead of overwriting .next underneath the server that is
  // still using it. Unset everywhere except during deploy, so both `next
  // build` locally and `next start` in production resolve to plain `.next`.
  distDir: process.env.NEXT_DIST_DIR || '.next',

  // Use database-backed cache handler for ISR (prevents API calls on every page view)
  cacheHandler: process.env.NODE_ENV === 'production'
    ? require.resolve('./cache-handler.js')
    : undefined,
  cacheMaxMemorySize: 0, // Disable in-memory cache, use database only
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
    unoptimized: true, // Disabled for self-hosted VPS - avoids 400 errors when images don't exist
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

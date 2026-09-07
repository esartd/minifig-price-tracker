import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n-subdomain';
import { originFor } from '@/lib/site-domain';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Block AI scrapers and data harvesters (waste CPU without providing SEO value)
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'ClaudeBot',
          'cohere-ai',
          'Omgilibot',
          'FacebookBot',
          'Applebot-Extended',
          'PerplexityBot',
          'Google-Extended',
          'Bytespider',
          'Diffbot',
          'ImagesiftBot',
          'Amazonbot',
          'PetalBot',
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'BLEXBot',
        ],
        disallow: ['/'],
      },
      // Allow legitimate search engines (good for SEO)
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'DuckDuckBot',
          'Slurp',
          'Baiduspider',
          'YandexBot',
        ],
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/collection/',
          '/inventory/',
          '/sets-collection/',
          '/sets-inventory/',
        ],
      },
      // Default rule for all other bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/collection/',
          '/inventory/',
          '/sets-collection/',
          '/sets-inventory/',
          '/_next/',
          '/favicon.ico',
        ],
      },
    ],
    // One sitemap per locale, hostnames from lib/site-domain.ts.
    sitemap: locales.map((locale) => `${originFor(locale)}/sitemap.xml`),
  }
}

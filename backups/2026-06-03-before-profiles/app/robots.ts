import { MetadataRoute } from 'next'

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
    sitemap: [
      'https://figtracker.ericksu.com/sitemap.xml',
      'https://de.figtracker.ericksu.com/sitemap.xml',
      'https://fr.figtracker.ericksu.com/sitemap.xml',
      'https://es.figtracker.ericksu.com/sitemap.xml',
      'https://it.figtracker.ericksu.com/sitemap.xml',
      'https://nl.figtracker.ericksu.com/sitemap.xml',
      'https://pl.figtracker.ericksu.com/sitemap.xml',
      'https://pt.figtracker.ericksu.com/sitemap.xml',
      'https://sv.figtracker.ericksu.com/sitemap.xml',
      'https://ja.figtracker.ericksu.com/sitemap.xml',
    ],
  }
}

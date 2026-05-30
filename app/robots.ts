import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
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

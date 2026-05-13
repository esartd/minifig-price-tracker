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
        ],
      },
    ],
    sitemap: [
      'https://figtracker.ericksu.com/sitemap.xml',
      'https://de.figtracker.ericksu.com/sitemap.xml',
      'https://fr.figtracker.ericksu.com/sitemap.xml',
      'https://es.figtracker.ericksu.com/sitemap.xml',
    ],
  }
}

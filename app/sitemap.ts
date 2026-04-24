import { MetadataRoute } from 'next'
import { getAllMinifigs, getAllCategories } from '@/lib/catalog-static'

// Generate sitemap dynamically at runtime to avoid build-time database queries
export const dynamic = 'force-dynamic'
export const revalidate = 86400 // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://figtracker.ericksu.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/themes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclosure`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    // Get all minifigs for individual pages (18k+ URLs)
    const minifigs = await getAllMinifigs()
    const minifigPages: MetadataRoute.Sitemap = minifigs
      .filter(m => m.minifigure_no) // Only include valid IDs
      .map(minifig => ({
        url: `${baseUrl}/minifigs/${minifig.minifigure_no}`,
        lastModified: minifig.updated_at ? new Date(minifig.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))

    // Get all categories for theme pages
    const categories = await getAllCategories()
    const uniqueThemes = new Set<string>()

    categories.forEach(cat => {
      const parts = cat.name.split(' / ')
      const parentTheme = parts[0]
      uniqueThemes.add(parentTheme)
    })

    const themePages: MetadataRoute.Sitemap = Array.from(uniqueThemes).map(theme => ({
      url: `${baseUrl}/themes/${encodeURIComponent(theme.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    console.log(`[SITEMAP] Generated ${staticPages.length} static + ${minifigPages.length} minifigs + ${themePages.length} themes = ${staticPages.length + minifigPages.length + themePages.length} total URLs`)

    return [...staticPages, ...themePages, ...minifigPages]
  } catch (error) {
    console.error('[SITEMAP] Error generating dynamic URLs:', error)
    return staticPages
  }
}

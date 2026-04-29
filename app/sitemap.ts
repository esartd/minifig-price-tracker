import { MetadataRoute } from 'next'
import { getAllMinifigs, getAllCategories } from '@/lib/catalog-static'

// Generate sitemap dynamically at runtime to avoid build-time database queries
export const dynamic = 'force-dynamic'
export const revalidate = 86400 // 24 hours

const locales = ['en', 'de', 'fr', 'es'] as const
const domains = {
  en: 'https://figtracker.ericksu.com',
  de: 'https://de.figtracker.ericksu.com',
  fr: 'https://fr.figtracker.ericksu.com',
  es: 'https://es.figtracker.ericksu.com',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  // Helper function to create multilingual entries
  const createMultilingualEntry = (path: string, changeFrequency: any, priority: number) => {
    return locales.flatMap(locale => ({
      url: `${domains[locale]}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${domains[l]}${path}`])
        )
      }
    }))
  }

  // Static pages with all language variants
  const staticPages: MetadataRoute.Sitemap = [
    ...createMultilingualEntry('', 'daily', 1), // Homepage
    ...createMultilingualEntry('/search', 'daily', 0.9),
    ...createMultilingualEntry('/themes', 'weekly', 0.9),
    ...createMultilingualEntry('/sets-themes', 'weekly', 0.9),
    ...createMultilingualEntry('/about', 'monthly', 0.8),
    ...createMultilingualEntry('/faq', 'monthly', 0.8),
    ...createMultilingualEntry('/guides', 'weekly', 0.8),
    ...createMultilingualEntry('/privacy', 'monthly', 0.5),
    ...createMultilingualEntry('/disclosure', 'monthly', 0.5),
  ]

  try {
    // Get all minifigs for individual pages (18k+ URLs) - all locales
    const minifigs = await getAllMinifigs()
    const minifigPages: MetadataRoute.Sitemap = minifigs
      .filter(m => m.minifigure_no) // Only include valid IDs
      .flatMap(minifig => {
        const path = `/minifigs/${minifig.minifigure_no}`
        const minifigLastModified = minifig.updated_at ? new Date(minifig.updated_at) : lastModified

        return locales.map(locale => ({
          url: `${domains[locale]}${path}`,
          lastModified: minifigLastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              locales.map(l => [l, `${domains[l]}${path}`])
            )
          }
        }))
      })

    // Get all categories for theme pages - all locales
    const categories = await getAllCategories()
    const uniqueThemes = new Set<string>()

    categories.forEach(cat => {
      const parts = cat.name.split(' / ')
      const parentTheme = parts[0]
      uniqueThemes.add(parentTheme)
    })

    const themePages: MetadataRoute.Sitemap = Array.from(uniqueThemes).flatMap(theme => {
      const slug = encodeURIComponent(theme.toLowerCase().replace(/\s+/g, '-'))
      const path = `/themes/${slug}`

      return locales.map(locale => ({
        url: `${domains[locale]}${path}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${domains[l]}${path}`])
          )
        }
      }))
    })

    // Sets themes pages - all locales
    const { loadAllBoxes } = await import('@/lib/boxes-data')
    const boxes = loadAllBoxes()
    const setThemes = new Set<string>()

    boxes.forEach(box => {
      const parent = box.category_name.split(' / ')[0].trim()
      setThemes.add(parent)
    })

    const setThemePages: MetadataRoute.Sitemap = Array.from(setThemes).flatMap(theme => {
      const slug = encodeURIComponent(theme.toLowerCase().replace(/\s+/g, '-'))
      const path = `/sets-themes/${slug}`

      return locales.map(locale => ({
        url: `${domains[locale]}${path}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${domains[l]}${path}`])
          )
        }
      }))
    })

    console.log(`[SITEMAP] Generated ${staticPages.length} static + ${minifigPages.length} minifigs + ${themePages.length} themes + ${setThemePages.length} set themes = ${staticPages.length + minifigPages.length + themePages.length + setThemePages.length} total URLs`)

    return [...staticPages, ...themePages, ...setThemePages, ...minifigPages]
  } catch (error) {
    console.error('[SITEMAP] Error generating dynamic URLs:', error)
    return staticPages
  }
}

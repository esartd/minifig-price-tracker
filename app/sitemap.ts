import { MetadataRoute } from 'next'
import { getAllMinifigs, getAllCategories } from '@/lib/catalog-static'
import { prisma } from '@/lib/prisma'

// Generate sitemap dynamically at runtime to avoid build-time database queries
export const dynamic = 'force-dynamic'
export const revalidate = 86400 // 24 hours

const locales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'sv', 'ja'] as const
const domains = {
  en: 'https://figtracker.ericksu.com',
  de: 'https://de.figtracker.ericksu.com',
  fr: 'https://fr.figtracker.ericksu.com',
  es: 'https://es.figtracker.ericksu.com',
  it: 'https://it.figtracker.ericksu.com',
  nl: 'https://nl.figtracker.ericksu.com',
  pl: 'https://pl.figtracker.ericksu.com',
  pt: 'https://pt.figtracker.ericksu.com',
  sv: 'https://sv.figtracker.ericksu.com',
  ja: 'https://ja.figtracker.ericksu.com',
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
        languages: {
          ...Object.fromEntries(
            locales.map(l => [l, `${domains[l]}${path}`])
          ),
          'x-default': `${domains.en}${path}`
        }
      }
    }))
  }

  // Static pages with all language variants
  const staticPages: MetadataRoute.Sitemap = [
    ...createMultilingualEntry('', 'daily', 1), // Homepage (search page)
    ...createMultilingualEntry('/themes', 'weekly', 0.9),
    ...createMultilingualEntry('/sets-themes', 'weekly', 0.9),
    ...createMultilingualEntry('/retiring-soon', 'weekly', 0.9), // Retiring sets prediction tool
    ...createMultilingualEntry('/articles', 'weekly', 0.9),
    ...createMultilingualEntry('/about', 'monthly', 0.8),
    ...createMultilingualEntry('/faq', 'monthly', 0.8),
    ...createMultilingualEntry('/privacy', 'monthly', 0.5),
    ...createMultilingualEntry('/disclosure', 'monthly', 0.5),
    ...createMultilingualEntry('/premium', 'monthly', 0.6),
    ...createMultilingualEntry('/identify', 'monthly', 0.7),
    ...createMultilingualEntry('/support', 'monthly', 0.4),
    ...createMultilingualEntry('/collectors', 'weekly', 0.7),
    ...createMultilingualEntry('/price-alerts', 'monthly', 0.7),
    ...createMultilingualEntry('/listing-generator', 'monthly', 0.7),
    ...createMultilingualEntry('/leaderboards', 'weekly', 0.7),
    ...createMultilingualEntry('/how-we-calculate-prices', 'monthly', 0.7),
    ...createMultilingualEntry('/export', 'monthly', 0.8),
    ...createMultilingualEntry('/whatnot-export', 'monthly', 0.7),
    ...createMultilingualEntry('/bricklink-export', 'monthly', 0.7),
  ]

  try {
    // Get all published articles - all locales
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true },
    })

    const articlePages: MetadataRoute.Sitemap = articles.flatMap(article => {
      const path = `/articles/${article.slug}`
      return locales.map(locale => ({
        url: `${domains[locale]}${path}`,
        lastModified: article.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map(l => [l, `${domains[l]}${path}`])
            ),
            'x-default': `${domains.en}${path}`
          }
        }
      }))
    })

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
            languages: {
              ...Object.fromEntries(
                locales.map(l => [l, `${domains[l]}${path}`])
              ),
              'x-default': `${domains.en}${path}`
            }
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
          languages: {
            ...Object.fromEntries(
              locales.map(l => [l, `${domains[l]}${path}`])
            ),
            'x-default': `${domains.en}${path}`
          }
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
          languages: {
            ...Object.fromEntries(
              locales.map(l => [l, `${domains[l]}${path}`])
            ),
            'x-default': `${domains.en}${path}`
          }
        }
      }))
    })

    // Individual set pages - all locales (20k+ URLs)
    const setPages: MetadataRoute.Sitemap = boxes
      .filter(box => box.box_no) // Only include valid IDs
      .flatMap(box => {
        const path = `/sets/${box.box_no}`
        const boxLastModified = lastModified // Can add updated_at field later

        return locales.map(locale => ({
          url: `${domains[locale]}${path}`,
          lastModified: boxLastModified,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
          alternates: {
            languages: {
              ...Object.fromEntries(
                locales.map(l => [l, `${domains[l]}${path}`])
              ),
              'x-default': `${domains.en}${path}`
            }
          }
        }))
      })

    // Public collector profile pages - only users who are public AND have a
    // username AND have enough items to be worth indexing (profilePublic
    // defaults to true for everyone, so an unfiltered query would flood the
    // sitemap with thousands of empty/near-empty "thin content" pages).
    const MIN_ITEMS_FOR_SITEMAP = 5
    const publicCollectors = await prisma.user.findMany({
      where: { profilePublic: true, username: { not: null } },
      select: {
        username: true,
        updatedAt: true,
        _count: {
          select: {
            CollectionItem: true,
            PersonalCollectionItem: true,
            SetInventoryItem: true,
            SetPersonalCollectionItem: true,
          },
        },
      },
    })

    const collectorPages: MetadataRoute.Sitemap = publicCollectors
      .filter(u => {
        const total = u._count.CollectionItem + u._count.PersonalCollectionItem +
          u._count.SetInventoryItem + u._count.SetPersonalCollectionItem
        return u.username && total >= MIN_ITEMS_FOR_SITEMAP
      })
      .flatMap(u => {
        const path = `/collectors/${u.username}`
        return locales.map(locale => ({
          url: `${domains[locale]}${path}`,
          lastModified: u.updatedAt,
          changeFrequency: 'weekly' as const,
          priority: 0.5,
          alternates: {
            languages: {
              ...Object.fromEntries(
                locales.map(l => [l, `${domains[l]}${path}`])
              ),
              'x-default': `${domains.en}${path}`
            }
          }
        }))
      })

    console.log(`[SITEMAP] Generated ${staticPages.length} static + ${articlePages.length} articles + ${minifigPages.length} minifigs + ${themePages.length} themes + ${setThemePages.length} set themes + ${setPages.length} sets + ${collectorPages.length} collector profiles = ${staticPages.length + articlePages.length + minifigPages.length + themePages.length + setThemePages.length + setPages.length + collectorPages.length} total URLs`)

    return [...staticPages, ...articlePages, ...themePages, ...setThemePages, ...minifigPages, ...setPages, ...collectorPages]
  } catch (error) {
    console.error('[SITEMAP] Error generating dynamic URLs:', error)
    return staticPages
  }
}

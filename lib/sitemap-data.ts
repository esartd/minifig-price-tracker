import { getAllMinifigs, getAllCategories } from '@/lib/catalog-static';
import { loadAllBoxes } from '@/lib/boxes-data';
import { prisma } from '@/lib/prisma';
import { escapeXmlText } from '@/lib/xml';

/**
 * Sitemap source data, sharded.
 *
 * The single sitemap this replaced was 527 MB across 411,450 URLs and took
 * ~35 seconds to serve. Google's limits are 50,000 URLs and 50 MB per file,
 * so it was roughly ten times over both and was almost certainly being
 * rejected outright — meaning none of it counted for anything.
 *
 * The volume itself is legitimate: ~41,000 real pages, each published in ten
 * languages, and hreflang requires every language version to be listed with
 * links to all the others. That is genuinely 410,000 URLs. The fix is to
 * split it across files and publish an index, not to list less.
 *
 * The important structural choice here is that we collect **paths** (~41,000)
 * and only expand a single shard's slice into per-locale URLs. Expanding
 * everything and then slicing would do the expensive part on every request,
 * which is what made the old one slow.
 */

export const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'sv', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

export const DOMAINS: Record<Locale, string> = {
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
};

/**
 * Paths per shard. Each becomes 10 URLs, so this is 10,000 URLs and roughly
 * 12 MB — measured, not estimated.
 *
 * Size is the binding constraint here, not URL count. Eleven hreflang
 * alternates cost about 1.25 KB per entry, so Google's 50,000-URL limit would
 * mean a 62 MB file: legal on count, illegal on the 50 MB size limit. Working
 * back from size instead leaves generous headroom and keeps each file quick
 * for a crawler to pull.
 */
export const PATHS_PER_SHARD = 1000;

/** How long the collected path list is reused. It changes only with the catalog. */
const CACHE_TTL_MS = 60 * 60 * 1000;

export type ChangeFrequency = 'daily' | 'weekly' | 'monthly';

export interface SitemapPath {
  path: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
}

const STATIC_PATHS: Array<[string, ChangeFrequency, number]> = [
  ['', 'daily', 1],
  ['/themes', 'weekly', 0.9],
  ['/sets-themes', 'weekly', 0.9],
  ['/retiring-soon', 'weekly', 0.9],
  ['/articles', 'weekly', 0.9],
  ['/about', 'monthly', 0.8],
  ['/faq', 'monthly', 0.8],
  ['/privacy', 'monthly', 0.5],
  ['/disclosure', 'monthly', 0.5],
  ['/premium', 'monthly', 0.6],
  ['/identify', 'monthly', 0.7],
  ['/support', 'monthly', 0.4],
  ['/collectors', 'weekly', 0.7],
  ['/price-alerts', 'monthly', 0.7],
  ['/listing-generator', 'monthly', 0.7],
  ['/leaderboards', 'weekly', 0.7],
  ['/how-we-calculate-prices', 'monthly', 0.7],
  ['/export', 'monthly', 0.8],
  ['/whatnot-export', 'monthly', 0.7],
  ['/bricklink-export', 'monthly', 0.7],
  ['/ebay-export', 'monthly', 0.7],
  ['/marketplace', 'weekly', 0.8],
];

/** Only public profiles with real content — thin pages hurt more than they help. */
const MIN_ITEMS_FOR_SITEMAP = 5;

function themeSlug(theme: string): string {
  return encodeURIComponent(theme.toLowerCase().replace(/\s+/g, '-'));
}

interface PathCache {
  paths: SitemapPath[];
  expiresAt: number;
}

let pathCache: PathCache | null = null;

async function buildPaths(): Promise<SitemapPath[]> {
  const now = new Date();
  const paths: SitemapPath[] = STATIC_PATHS.map(([path, changeFrequency, priority]) => ({
    path,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // Highest-value pages first, so that if a crawler only gets through the
  // early shards it has seen the pages that matter most.
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true },
    });
    for (const article of articles) {
      paths.push({
        path: `/articles/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  } catch (error) {
    console.error('[sitemap] articles unavailable, skipping:', error);
  }

  const boxes = loadAllBoxes();

  try {
    const categories = await getAllCategories();
    const minifigThemes = new Set(categories.map((c) => c.name.split(' / ')[0].trim()));
    for (const theme of minifigThemes) {
      paths.push({
        path: `/themes/${themeSlug(theme)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  } catch (error) {
    console.error('[sitemap] minifig themes unavailable, skipping:', error);
  }

  const setThemes = new Set(boxes.map((b) => b.category_name.split(' / ')[0].trim()));
  for (const theme of setThemes) {
    paths.push({
      path: `/sets-themes/${themeSlug(theme)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  try {
    const collectors = await prisma.user.findMany({
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
    });
    for (const user of collectors) {
      const total =
        user._count.CollectionItem +
        user._count.PersonalCollectionItem +
        user._count.SetInventoryItem +
        user._count.SetPersonalCollectionItem;
      if (!user.username || total < MIN_ITEMS_FOR_SITEMAP) continue;
      paths.push({
        path: `/collectors/${user.username}`,
        lastModified: user.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  } catch (error) {
    console.error('[sitemap] collectors unavailable, skipping:', error);
  }

  try {
    const minifigs = await getAllMinifigs();
    for (const minifig of minifigs) {
      if (!minifig.minifigure_no) continue;
      paths.push({
        path: `/minifigs/${minifig.minifigure_no}`,
        lastModified: minifig.updated_at ? new Date(minifig.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  } catch (error) {
    console.error('[sitemap] minifigs unavailable, skipping:', error);
  }

  for (const box of boxes) {
    if (!box.box_no) continue;
    paths.push({
      path: `/sets/${box.box_no}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return paths;
}

export async function getSitemapPaths(): Promise<SitemapPath[]> {
  if (pathCache && Date.now() < pathCache.expiresAt) return pathCache.paths;

  const paths = await buildPaths();
  pathCache = { paths, expiresAt: Date.now() + CACHE_TTL_MS };
  return paths;
}

export async function getShardCount(): Promise<number> {
  const paths = await getSitemapPaths();
  return Math.max(1, Math.ceil(paths.length / PATHS_PER_SHARD));
}

/**
 * One shard as a urlset document.
 *
 * Written by hand rather than through Next's sitemap convention because that
 * convention cannot emit a sitemap index, and an index is the whole point of
 * splitting. Built as an array join rather than string concatenation — at
 * 25,000 entries the difference is not academic.
 */
export async function renderShard(index: number): Promise<string | null> {
  const paths = await getSitemapPaths();
  const start = index * PATHS_PER_SHARD;
  if (start >= paths.length || index < 0) return null;

  const slice = paths.slice(start, start + PATHS_PER_SHARD);
  const parts: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const entry of slice) {
    // hreflang requires every language version to appear as its own <url>,
    // each listing all the others. Dropping the repetition would be smaller
    // but would stop Google pairing the translations.
    const alternates = LOCALES.map(
      (l) =>
        `<xhtml:link rel="alternate" hreflang="${l}" href="${escapeXmlText(DOMAINS[l] + entry.path)}"/>`
    ).join('');
    const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXmlText(DOMAINS.en + entry.path)}"/>`;
    const lastmod = entry.lastModified.toISOString();

    for (const locale of LOCALES) {
      parts.push(
        '<url>' +
          `<loc>${escapeXmlText(DOMAINS[locale] + entry.path)}</loc>` +
          `<lastmod>${lastmod}</lastmod>` +
          `<changefreq>${entry.changeFrequency}</changefreq>` +
          `<priority>${entry.priority}</priority>` +
          alternates +
          xDefault +
          '</url>'
      );
    }
  }

  parts.push('</urlset>');
  return parts.join('');
}

/**
 * Public origin for a request, resolved from the Host header.
 *
 * `request.nextUrl.origin` cannot be used: the app runs behind nginx on
 * 127.0.0.1:3000, so it reports `https://localhost:3000` and the published
 * index pointed every crawler at localhost.
 *
 * The header is mapped onto the known domain list rather than echoed back.
 * A Host header is attacker-controlled, and reflecting it would let anyone
 * serve a sitemap advertising their own URLs under our name.
 */
export function resolveOrigin(host: string | null): string {
  if (!host) return DOMAINS.en;
  const hostname = host.split(':')[0].toLowerCase();
  const match = (Object.keys(DOMAINS) as Locale[]).find(
    (locale) => new URL(DOMAINS[locale]).hostname === hostname
  );
  return match ? DOMAINS[match] : DOMAINS.en;
}

/** The index document that /sitemap.xml serves. */
export async function renderIndex(origin: string): Promise<string> {
  const count = await getShardCount();
  const lastmod = new Date().toISOString();

  const parts: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (let i = 0; i < count; i++) {
    parts.push(
      `<sitemap><loc>${escapeXmlText(`${origin}/sitemaps/${i}.xml`)}</loc><lastmod>${lastmod}</lastmod></sitemap>`
    );
  }
  parts.push('</sitemapindex>');
  return parts.join('');
}

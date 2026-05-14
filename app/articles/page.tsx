import type { Metadata } from 'next';
import ArticlesPageClient from '@/components/articles-page-client';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';


async function getTranslations(locale: string) {
  try {
    const translations = await import(`@/translations-backup/${locale}.json`);
    return translations.default || translations;
  } catch (error) {
    const fallback = await import('@/translations-backup/en.json');
    return fallback.default || fallback;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const t = await getTranslations(locale);

  const domains = {
    en: 'https://figtracker.ericksu.com',
    de: 'https://de.figtracker.ericksu.com',
    fr: 'https://fr.figtracker.ericksu.com',
    es: 'https://es.figtracker.ericksu.com',
  };

  return {
    title: `${t.navigation?.guides || 'Articles'} | FigTracker`,
    description: t.guides?.hero?.subtitle || 'Expert guides and insights for LEGO collectors and sellers.',
    keywords: t.guides?.meta?.keywords || ['LEGO guides', 'LEGO pricing', 'LEGO investing', 'LEGO selling tips', 'minifigure values'],
    openGraph: {
      title: t.guides?.meta?.ogTitle || 'LEGO Articles & Guides | FigTracker',
      description: t.guides?.meta?.ogDescription || 'Expert guides for LEGO collectors and sellers',
      url: `${domains[locale as keyof typeof domains]}/articles`,
    },
    alternates: {
      canonical: `${domains[locale as keyof typeof domains]}/articles`,
      languages: {
        'en': `${domains.en}/articles`,
        'de': `${domains.de}/articles`,
        'fr': `${domains.fr}/articles`,
        'es': `${domains.es}/articles`,
        'x-default': `${domains.en}/articles`,
      },
    },
  };
}

export default async function ArticlesPage() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  const t = await getTranslations(locale);

  // Fetch articles from database
  const dbArticles = await prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
  });

  // Convert database articles to display format
  const articles = dbArticles.map(article => {
    const translations = JSON.parse(article.translations as string);
    const translation = translations.find((t: any) => t.locale === locale) || translations[0];
    const contentBlocks = JSON.parse(article.contentBlocks as string);

    // Find first image block for cover photo
    const firstImageBlock = contentBlocks.find((block: any) => block.type === 'image');
    const coverImage = firstImageBlock?.images?.[0]?.imageUrl || null;

    return {
      title: translation.title,
      description: translation.description,
      slug: article.slug,
      status: 'published' as const,
      category: article.category || 'Guide',
      date: new Date(article.publishedAt || article.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long' }),
      readTime: `${article.readTimeMinutes} min read`,
      coverImage,
    };
  });

  // Merge with any legacy articles from translations (if needed)
  // Filter out "coming-soon" articles since we now have real articles published
  const guidesData = t.guides?.items || [];
  const legacyArticles = guidesData
    .filter((guide: any) => guide.status !== 'coming-soon' && !articles.some(a => a.slug === guide.slug))
    .map((guide: any) => ({
      title: guide.title,
      description: guide.description,
      slug: guide.slug,
      status: guide.status,
      category: t.guides?.category || 'Guide',
      date: 'May 2026',
      readTime: t.guides?.readTime || '5 min read',
      coverImage: null,
    }));

  const allArticles = [...articles, ...legacyArticles];

  const domains = {
    en: 'https://figtracker.ericksu.com',
    de: 'https://de.figtracker.ericksu.com',
    fr: 'https://fr.figtracker.ericksu.com',
    es: 'https://es.figtracker.ericksu.com',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t.guides?.meta?.ogTitle || 'LEGO Articles & Guides',
    description: t.guides?.meta?.ogDescription || 'Expert articles and guides for LEGO collectors and sellers',
    url: `${domains[locale as keyof typeof domains]}/articles`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlesPageClient articles={allArticles} />
    </>
  );
}

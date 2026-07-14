import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { ArticleRenderer } from '@/components/article/ArticleRenderer';
import { SocialShare } from '@/components/article/SocialShare';
import { RelatedArticles } from '@/components/article/RelatedArticles';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';

function getTranslations(locale: string): any {
  switch (locale) {
    case 'de': return translationsDe;
    case 'fr': return translationsFr;
    case 'es': return translationsEs;
    default: return translations;
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';

  // Try database first
  const dbArticle = await prisma.article.findUnique({
    where: { slug }
  });

  if (dbArticle) {
    const translations = JSON.parse(dbArticle.translations as string);
    const translation = translations.find((t: any) => t.locale === locale) || translations[0];

    if (translation) {
      return {
        title: `${translation.title} | FigTracker`,
        description: translation.description,
      };
    }
  }

  // Fallback to translation files
  const t = getTranslations(locale);
  const guideArticles = t.guideArticles as Record<string, any>;
  const guide = guideArticles[slug];

  if (!guide) {
    return { title: t.articles?.notFound || 'Article Not Found' };
  }

  return {
    title: `${guide.title} | FigTracker`,
    description: guide.description,
  };
}

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const session = await auth();
  const isAdmin = session?.user?.email === 'erickkosysu@gmail.com';

  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';
  const t = getTranslations(locale);

  // Try database first
  const dbArticle = await prisma.article.findUnique({
    where: { slug },
    
  });

  // Get all articles for related articles section
  const allArticles = await prisma.article.findMany({
    where: { status: 'published' },
    select: {
      slug: true,
      category: true,
      readTimeMinutes: true,
      translations: true,
      contentBlocks: true,
    },
  });

  if (dbArticle) {
    const contentBlocks = JSON.parse(dbArticle.contentBlocks as string);
    const translations = JSON.parse(dbArticle.translations as string);
    const translation = translations.find((t: any) => t.locale === locale) || translations[0];

    // Prepare related articles
    const relatedArticles = allArticles.map(article => {
      const articleTranslations = JSON.parse(article.translations as string);
      const articleTranslation = articleTranslations.find((t: any) => t.locale === locale) || articleTranslations[0];
      const articleContentBlocks = JSON.parse(article.contentBlocks as string);
      const firstImageBlock = articleContentBlocks.find((block: any) => block.type === 'image');
      const coverImage = firstImageBlock?.images?.[0]?.imageUrl || null;

      return {
        title: articleTranslation.title,
        description: articleTranslation.description,
        slug: article.slug,
        category: article.category || (t.guides?.category || 'Guide'),
        readTime: t.articles?.minRead
          ? t.articles.minRead.replace('{minutes}', String(article.readTimeMinutes))
          : `${article.readTimeMinutes} min read`,
        coverImage,
      };
    });

    // Find first image for schema
    const firstImageBlock = contentBlocks.find((block: any) => block.type === 'image');
    const imageUrl = firstImageBlock?.images?.[0]?.imageUrl || null;

    const domains = {
      en: 'https://figtracker.ericksu.com',
      de: 'https://de.figtracker.ericksu.com',
      fr: 'https://fr.figtracker.ericksu.com',
      es: 'https://es.figtracker.ericksu.com',
    };
    const baseUrl = domains[locale as keyof typeof domains] || domains.en;

    // Breadcrumb Schema (JSON-LD)
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t.navigation?.home || 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t.navigation?.articles || 'Articles',
          item: `${baseUrl}/articles`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: translation.title,
          item: `${baseUrl}/articles/${slug}`,
        },
      ],
    };

    // Article Schema (JSON-LD)
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: translation.title,
      description: translation.description,
      image: imageUrl || `${baseUrl}/og-image.png`,
      datePublished: dbArticle.publishedAt?.toISOString() || dbArticle.createdAt.toISOString(),
      dateModified: dbArticle.updatedAt.toISOString(),
      author: {
        '@type': 'Organization',
        name: 'FigTracker',
        url: baseUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'FigTracker',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/articles/${slug}`,
      },
      keywords: Array.isArray(translation.metaKeywords) ? translation.metaKeywords.join(', ') : (translation.metaKeywords || ''),
      articleSection: dbArticle.category || (t.guides?.category || 'Guide'),
      inLanguage: locale,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <article style={{ minHeight: '100vh', background: 'white' }}>
        {/* Breadcrumbs */}
        <nav style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '24px 24px 0',
          fontSize: 'var(--text-sm)',
          color: '#737373',
        }}>
          <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>{t.navigation?.home || 'Home'}</Link>
          <span> / </span>
          <Link href="/articles" style={{ color: '#3b82f6', textDecoration: 'none' }}>{t.navigation?.articles || 'Articles'}</Link>
          <span> / </span>
          <span style={{ color: '#171717' }}>{translation.title}</span>
        </nav>

        {/* Article Header */}
        <header style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '40px 24px 0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            marginBottom: '16px',
          }}>
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: '700',
              color: '#171717',
              lineHeight: '1.2',
              margin: 0,
              marginBottom: '20px',
            }}>
              {translation.title}
            </h1>

            {isAdmin && (
              <Link
                href={`/write?edit=${slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: '#3b82f6',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s',
                }}
              >
                <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {t.common?.edit || 'Edit'}
              </Link>
            )}
          </div>

          <div style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            marginBottom: '12px'
          }}>
            <span>{t.articles?.byline || 'FigTracker Team'}</span>
            <span> · </span>
            <span>{new Date(dbArticle.publishedAt || dbArticle.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span> · </span>
            <span>
              {t.articles?.minRead
                ? t.articles.minRead.replace('{minutes}', String(dbArticle.readTimeMinutes))
                : `${dbArticle.readTimeMinutes} min read`}
            </span>
          </div>

          {/* Social Share Buttons - Top */}
          <div style={{ marginBottom: '24px' }}>
            <SocialShare
              title={translation.title}
              url={`/articles/${slug}`}
              position="top"
            />
          </div>

          <div style={{
            borderBottom: '1px solid #e5e5e5',
            paddingBottom: '24px',
            marginBottom: '24px'
          }} />
        </header>

        {/* Article Content */}
        <div style={{ marginTop: '16px' }}>
          <ArticleRenderer blocks={contentBlocks} />
        </div>

        {/* Social Share Buttons - Bottom */}
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '0 24px 48px',
        }}>
          <SocialShare
            title={translation.title}
            url={`/articles/${slug}`}
            position="bottom"
          />
        </div>

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} currentSlug={slug} />

      </article>
      </>
    );
  }

  // Fallback to old markdown-based articles
  const guideArticles = t.guideArticles as Record<string, any>;
  const guide = guideArticles[slug];

  if (!guide) {
    notFound();
  }

  // (Keep existing markdown rendering for legacy articles)
  return (
    <article style={{ minHeight: '100vh', background: 'white' }}>
      <p style={{ padding: '40px', textAlign: 'center', color: '#737373' }}>
        {t.articles?.legacyFormatNotice || 'Legacy article format - please migrate to new CMS'}
      </p>
    </article>
  );
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { ArticleRenderer } from '@/components/article/ArticleRenderer';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';

function getTranslations(locale: string) {
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

    return {
      title: `${translation.title} | FigTracker`,
      description: translation.description,
    };
  }

  // Fallback to translation files
  const t = getTranslations(locale);
  const guideArticles = t.guideArticles as Record<string, any>;
  const guide = guideArticles[slug];

  if (!guide) {
    return { title: 'Article Not Found' };
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
    where: { slug }
  });

  if (dbArticle) {
    const contentBlocks = JSON.parse(dbArticle.contentBlocks as string);
    const translations = JSON.parse(dbArticle.translations as string);
    const translation = translations.find((t: any) => t.locale === locale) || translations[0];

    return (
      <article style={{ minHeight: '100vh', background: 'white' }}>
        {/* Breadcrumbs */}
        <nav style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '24px 24px 0',
          fontSize: 'var(--text-sm)',
          color: '#737373',
        }}>
          <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>{t.breadcrumbs?.home || 'Home'}</Link>
          <span> / </span>
          <Link href="/articles" style={{ color: '#3b82f6', textDecoration: 'none' }}>Articles</Link>
          <span> / </span>
          <span style={{ color: '#171717' }}>{translation.title}</span>
        </nav>

        {/* Article Header */}
        <header style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '40px 24px 32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: '700',
              color: '#171717',
              lineHeight: '1.2',
              margin: 0,
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
                Edit
              </Link>
            )}
          </div>

          <div style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            marginBottom: '16px'
          }}>
            <span>FigTracker Team</span>
            <span> · </span>
            <span>{new Date(dbArticle.publishedAt || dbArticle.createdAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span> · </span>
            <span>{dbArticle.readTimeMinutes} min read</span>
          </div>
          <div style={{
            borderBottom: '1px solid #e5e5e5',
            marginBottom: '24px'
          }} />
        </header>

        {/* Article Content */}
        <ArticleRenderer blocks={contentBlocks} />

      </article>
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
        Legacy article format - please migrate to new CMS
      </p>
    </article>
  );
}

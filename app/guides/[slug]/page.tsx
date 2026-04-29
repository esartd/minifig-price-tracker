import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { marked } from 'marked';
import { headers } from 'next/headers';
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

function getGuides(locale: string) {
  const t = getTranslations(locale);
  const articles = t.guideArticles as Record<string, {
    title: string;
    description: string;
    author: string;
    readTime: string;
    content: string;
  }>;

  return Object.entries(articles).reduce((acc, [slug, article]) => {
    acc[slug] = {
      ...article,
      date: '2026-04-24',
    };
    return acc;
  }, {} as Record<string, {
    title: string;
    description: string;
    author: string;
    date: string;
    readTime: string;
    content: string;
  }>);
}

type GuideSlug = string;


export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';
  const guides = getGuides(locale);
  const guide = guides[slug as GuideSlug];

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  return {
    title: `${guide.title} | FigTracker`,
    description: guide.description,
    keywords: guide.title.split(' ').concat(['LEGO', 'minifigures', 'Bricklink', 'price guide', 'collecting']),
    authors: [{ name: guide.author }],
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      publishedTime: guide.date,
      authors: [guide.author],
    },
    alternates: {
      canonical: `https://figtracker.ericksu.com/guides/${slug}`,
    },
  };
}

export default async function GuidePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';
  const guides = getGuides(locale);
  const guide = guides[slug as GuideSlug];

  if (!guide) {
    notFound();
  }

  const t = getTranslations(locale).guidePage;

  // Schema.org BlogPosting markup
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: guide.title,
    description: guide.description,
    author: {
      '@type': 'Organization',
      name: guide.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FigTracker',
      logo: {
        '@type': 'ImageObject',
        url: 'https://figtracker.ericksu.com/favicon.svg'
      }
    },
    datePublished: guide.date,
    dateModified: guide.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://figtracker.ericksu.com/guides/${slug}`
    },
    image: 'https://figtracker.ericksu.com/og-image.png',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <article style={{ minHeight: '100vh', background: 'white' }}>
        {/* Breadcrumbs */}
        <style dangerouslySetInnerHTML={{ __html: `
          .breadcrumb-nav {
            max-width: 720px;
            margin: 0 auto;
            padding: 24px 24px 0;
            font-size: var(--text-sm);
            color: #737373;
          }
          .breadcrumb-nav a {
            color: #3b82f6;
            text-decoration: none;
          }
          .breadcrumb-nav a:hover {
            text-decoration: underline;
          }
        `}} />
        <nav className="breadcrumb-nav">
          <Link href="/">{t.breadcrumbs.home}</Link>
          <span> / </span>
          <Link href="/guides">{t.breadcrumbs.guides}</Link>
          <span> / </span>
          <span style={{ color: '#171717' }}>{guide.title}</span>
        </nav>

        {/* Article Header */}
        <header style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '40px 24px 32px'
        }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: '700',
            color: '#171717',
            lineHeight: '1.2',
            marginBottom: '16px'
          }}>
            {guide.title}
          </h1>
          <div style={{
            display: 'flex',
            gap: '12px',
            fontSize: 'var(--text-sm)',
            color: '#737373',
            paddingBottom: '32px',
            borderBottom: '1px solid #e5e5e5'
          }}>
            <span>{guide.author}</span>
            <span>·</span>
            <span>{new Date(guide.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>·</span>
            <span>{guide.readTime}</span>
          </div>
        </header>

        {/* Article Content */}
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '32px 24px 80px'
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            .article-content {
              font-size: 18px;
              line-height: 1.75;
              color: #171717;
            }
            .article-content > *:first-child {
              margin-top: 0;
            }
            .article-content h1 {
              font-size: 32px;
              font-weight: 700;
              margin: 56px 0 24px;
              line-height: 1.2;
              color: #171717;
            }
            .article-content h2 {
              font-size: 28px;
              font-weight: 700;
              margin: 48px 0 20px;
              line-height: 1.3;
              color: #171717;
            }
            .article-content h3 {
              font-size: 22px;
              font-weight: 600;
              margin: 40px 0 16px;
              line-height: 1.4;
              color: #171717;
            }
            .article-content p {
              margin: 24px 0;
              color: #3c4043;
            }
            .article-content a {
              color: #1a73e8;
              text-decoration: none;
            }
            .article-content a:hover {
              text-decoration: underline;
            }
            .article-content strong {
              font-weight: 600;
              color: #171717;
            }
            .article-content ul, .article-content ol {
              margin: 24px 0;
              padding-left: 40px;
            }
            .article-content li {
              margin: 12px 0;
              color: #3c4043;
              line-height: 1.75;
            }
            .article-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 32px 0;
              font-size: 16px;
            }
            .article-content th, .article-content td {
              border: 1px solid #e5e5e5;
              padding: 16px;
              text-align: left;
            }
            .article-content th {
              background: #f8f9fa;
              font-weight: 600;
              color: #171717;
            }
            .article-content td {
              color: #3c4043;
            }
            .article-content hr {
              border: none;
              border-top: 1px solid #e5e5e5;
              margin: 56px 0;
            }
            .article-content blockquote {
              border-left: 4px solid #e5e5e5;
              margin: 24px 0;
              padding-left: 20px;
              color: #5f6368;
              font-style: italic;
            }
          `}} />
          <div
            className="article-content"
            dangerouslySetInnerHTML={{
              __html: marked(guide.content, {
                breaks: true,
                gfm: true,
              })
            }}
          />
        </div>

        {/* CTA Footer */}
        <section style={{
          background: '#f8f9fa',
          borderTop: '1px solid #e5e5e5',
          padding: '64px 24px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '16px'
            }}>
              {t.startTracking}
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: '#5f6368',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              {t.startTrackingDesc}
            </p>
            <Link
              href="/search"
              className="cta-button"
            >
              {t.searchMinifigures}
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}

// Generate static params for known guides
export async function generateStaticParams() {
  // Use English version to get all guide slugs
  const guides = getGuides('en');
  return Object.keys(guides).map((slug) => ({
    slug,
  }));
}

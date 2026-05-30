'use client';

import Link from 'next/link';

interface RelatedArticle {
  title: string;
  description: string;
  slug: string;
  category: string;
  readTime: string;
  coverImage?: string | null;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  currentSlug: string;
}

export function RelatedArticles({ articles, currentSlug }: RelatedArticlesProps) {
  // Filter out current article and limit to 3
  const related = articles
    .filter(a => a.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '48px 24px',
      borderTop: '1px solid #e5e5e5',
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '24px',
        color: '#171717',
      }}>
        Related Articles
      </h2>

      <div style={{
        display: 'grid',
        gap: '20px',
      }}>
        {related.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e5e5e5',
              textDecoration: 'none',
              transition: 'all 0.2s',
              background: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e5e5';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {article.coverImage && (
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <img
                  src={article.coverImage}
                  alt={article.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#3b82f6',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                {article.category}
              </div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '8px',
                lineHeight: '1.3',
              }}>
                {article.title}
              </h3>

              <p style={{
                fontSize: '14px',
                color: '#737373',
                lineHeight: '1.5',
                marginBottom: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {article.description}
              </p>

              <div style={{
                fontSize: '12px',
                color: '#a3a3a3',
              }}>
                {article.readTime}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

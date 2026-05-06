'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

interface Article {
  title: string;
  description: string;
  slug: string | null;
  status: 'published' | 'coming-soon';
  category: string;
  date: string;
  readTime: string;
}

export default function ArticlesPageClient({ articles }: { articles: Article[] }) {
  const { t } = useTranslation();

  const featuredArticle = articles.find(a => a.status === 'published');
  const otherArticles = articles.filter(a => a !== featuredArticle);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Hero Section */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 24px 64px'
        }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: '700',
            color: '#171717',
            marginBottom: '16px',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
          }}>
            {t.navigation.guides || 'Articles'}
          </h1>
          <p style={{
            fontSize: '21px',
            color: '#525252',
            lineHeight: '1.5',
            maxWidth: '640px',
          }}>
            {t.guides?.hero?.subtitle || 'Expert guides and insights for LEGO collectors and sellers.'}
          </p>
        </div>
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid #e5e5e5',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '48px 24px'
          }}>
            <Link
              href={featuredArticle.slug?.startsWith('/') ? featuredArticle.slug : `/articles/${featuredArticle.slug}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div style={{
                background: '#fafafa',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '100%',
                  height: '480px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ fontSize: '72px', opacity: 0.3 }}>📦</div>
                </div>

                <div style={{ padding: '40px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {featuredArticle.category}
                    </span>
                    <span style={{ color: '#d4d4d4' }}>•</span>
                    <span style={{ fontSize: '12px', color: '#737373' }}>
                      {featuredArticle.date}
                    </span>
                    <span style={{ color: '#d4d4d4' }}>•</span>
                    <span style={{ fontSize: '12px', color: '#737373' }}>
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 style={{
                    fontSize: '40px',
                    fontWeight: '700',
                    color: '#171717',
                    marginBottom: '16px',
                    lineHeight: '1.2',
                    letterSpacing: '-0.02em',
                  }}>
                    {featuredArticle.title}
                  </h2>

                  <p style={{
                    fontSize: '19px',
                    color: '#525252',
                    lineHeight: '1.6',
                  }}>
                    {featuredArticle.description}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '64px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '32px',
        }}>
          {otherArticles.map((article, index) => (
            <Link
              key={index}
              href={article.slug?.startsWith('/') ? article.slug : `/articles/${article.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article style={{
                background: '#ffffff',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e5e5e5',
                transition: 'all 0.2s',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  width: '100%',
                  height: '220px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ fontSize: '48px', opacity: 0.3 }}>📦</div>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {article.category}
                    </span>
                    <span style={{ color: '#d4d4d4', fontSize: '11px' }}>•</span>
                    <span style={{ fontSize: '11px', color: '#737373' }}>
                      {article.date}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '21px',
                    fontWeight: '700',
                    color: '#171717',
                    marginBottom: '12px',
                    lineHeight: '1.3',
                    letterSpacing: '-0.01em',
                  }}>
                    {article.title}
                  </h3>

                  <p style={{
                    fontSize: '15px',
                    color: '#525252',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    flex: 1,
                  }}>
                    {article.description}
                  </p>

                  {article.status === 'published' ? (
                    <div style={{ fontSize: '15px', color: '#3b82f6', fontWeight: '500' }}>
                      {t.guides?.readGuide || 'Read article'} →
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '13px',
                      color: '#737373',
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderRadius: '6px',
                      display: 'inline-block',
                      fontWeight: '500',
                    }}>
                      {t.guides?.comingSoon || 'Coming soon'}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: '#ffffff',
        borderTop: '1px solid #e5e5e5',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 24px',
          textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: '700',
            color: '#171717',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}>
            {t.guides.cta.title}
          </h2>
          <p style={{
            fontSize: '19px',
            color: '#525252',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px',
          }}>
            {t.guides.cta.subtitle}
          </p>
          <Link
            href="/search"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 32px',
              background: '#3b82f6',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '17px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            {t.guides.cta.button}
          </Link>
        </div>
      </div>
    </div>
  );
}

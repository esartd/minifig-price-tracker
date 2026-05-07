'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';
import { useSession } from 'next-auth/react';

interface Article {
  title: string;
  description: string;
  slug: string | null;
  status: 'published' | 'coming-soon';
  category: string;
  date: string;
  readTime: string;
  coverImage?: string | null;
}

export default function ArticlesPageClient({ articles }: { articles: Article[] }) {
  const { t, translations } = useTranslation();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const isAdmin = session?.user?.email === 'erickkosysu@gmail.com';

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map(a => a.category)));
    return cats.filter(Boolean);
  }, [articles]);

  // Filter articles by search and category
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  // Show the first article as featured, then all articles (including featured) in the grid
  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles; // Show all articles in grid in chronological order

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
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '24px',
            marginBottom: '16px',
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '56px',
                fontWeight: '700',
                color: '#171717',
                marginBottom: '0',
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
              }}>
                {translations.guides.pageTitle}
              </h1>
            </div>
            {isAdmin && (
              <Link
                href="/write"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: '#3b82f6',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Write Article
              </Link>
            )}
          </div>
          <p style={{
            fontSize: '21px',
            color: '#525252',
            lineHeight: '1.5',
            maxWidth: '640px',
            marginBottom: '32px',
          }}>
            {t('guides.hero.subtitle') || 'Expert guides and insights for LEGO collectors and sellers.'}
          </p>

          {/* Search and Filter */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '640px',
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '16px',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                background: '#fafafa',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.background = '#ffffff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.background = '#fafafa';
              }}
            />

            {categories.length > 0 && (
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: selectedCategory === 'all' ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                    borderRadius: '8px',
                    background: selectedCategory === 'all' ? '#eff6ff' : '#ffffff',
                    color: selectedCategory === 'all' ? '#3b82f6' : '#737373',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: selectedCategory === category ? '2px solid #3b82f6' : '1px solid #e5e5e5',
                      borderRadius: '8px',
                      background: selectedCategory === category ? '#eff6ff' : '#ffffff',
                      color: selectedCategory === category ? '#3b82f6' : '#737373',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
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
                  background: featuredArticle.coverImage ? '#f5f5f5' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {featuredArticle.coverImage ? (
                    <img
                      src={featuredArticle.coverImage}
                      alt={featuredArticle.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <svg width="280" height="80" viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <text x="140" y="50" fontFamily="system-ui, -apple-system, sans-serif" fontSize="32" fontWeight="600" fill="white" textAnchor="middle" letterSpacing="-0.32">FigTracker</text>
                    </svg>
                  )}
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
        {/* Results count */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div style={{
            fontSize: '15px',
            color: '#737373',
            marginBottom: '24px',
          }}>
            {filteredArticles.length === articles.length
              ? `Showing all ${articles.length} articles`
              : `Found ${filteredArticles.length} of ${articles.length} articles`}
          </div>
        )}

        {otherArticles.length === 0 && !featuredArticle ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            color: '#737373',
          }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>
              No articles found
            </p>
            <p style={{ fontSize: '14px' }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
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
                  background: article.coverImage ? '#f5f5f5' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <text x="100" y="38" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="600" fill="white" textAnchor="middle" letterSpacing="-0.24">FigTracker</text>
                    </svg>
                  )}
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
                      {translations.guides.readGuide}
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
                      {translations.guides.comingSoon}
                    </div>
                  )}
                </div>
              </article>
            </Link>
            ))}
          </div>
        )}
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
            {translations.guides.cta.title}
          </h2>
          <p style={{
            fontSize: '19px',
            color: '#525252',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px',
          }}>
            {translations.guides.cta.subtitle}
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
            {translations.guides.cta.button}
          </Link>
        </div>
      </div>
    </div>
  );
}

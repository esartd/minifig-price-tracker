'use client';

import { useState, useMemo } from 'react';

export interface ArticleSearchItem {
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  date: string;
  readTime: string;
  author: string;
}

interface ArticleSearchProps {
  articles: ArticleSearchItem[];
  categories?: string[];
}

export function ArticleSearch({ articles, categories = [] }: ArticleSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Filter by search query
      const matchesSearch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by category
      const matchesCategory = selectedCategory === 'all' ||
        article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div>
      {/* Search and Filter Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {/* Search Input */}
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
            background: '#ffffff',
            outline: 'none',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e5e5e5'}
        />

        {/* Category Filter */}
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

      {/* Results Count */}
      <div style={{
        fontSize: '14px',
        color: '#737373',
        marginBottom: '24px',
      }}>
        {filteredArticles.length === articles.length
          ? `Showing all ${articles.length} articles`
          : `Found ${filteredArticles.length} of ${articles.length} articles`}
      </div>

      {/* Article Grid */}
      {filteredArticles.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          color: '#737373',
        }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>No articles found</p>
          <p style={{ fontSize: '14px' }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {filteredArticles.map(article => (
            <a
              key={article.slug}
              href={`/articles/${article.slug}`}
              style={{
                display: 'block',
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '24px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Category Badge */}
              {article.category && (
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: '#eff6ff',
                  color: '#3b82f6',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {article.category}
                </div>
              )}

              {/* Title */}
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#171717',
                marginBottom: '12px',
                lineHeight: '1.3',
              }}>
                {article.title}
              </h3>

              {/* Excerpt */}
              <p style={{
                fontSize: '15px',
                color: '#737373',
                lineHeight: '1.5',
                marginBottom: '16px',
              }}>
                {article.excerpt}
              </p>

              {/* Metadata */}
              <div style={{
                fontSize: '13px',
                color: '#a3a3a3',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}>
                <span>{article.author}</span>
                <span>·</span>
                <span>{new Date(article.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

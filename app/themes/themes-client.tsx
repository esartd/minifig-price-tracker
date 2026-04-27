'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Theme {
  parent: string;
  subcategories: Array<{
    name: string;
    fullName: string;
    count: number;
  }>;
  subcategoryCount: number;
  totalCount: number;
  representativeImage: string | null;
  isCurrent: boolean;
}

interface ThemesClientProps {
  themes: Theme[];
}

function ThemeCard({ theme }: { theme: Theme }) {
  const [showFallback, setShowFallback] = useState(false);

  const handleImageError = () => {
    setShowFallback(true);
  };

  // Create URL-safe slug
  const themeSlug = theme.parent.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <Link
      href={`/themes/${themeSlug}`}
      style={{ textDecoration: 'none' }}
    >
      <article style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e5e5e5',
        transition: 'all 0.2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = '#3b82f6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e5e5e5';
      }}>
        {/* Representative Image */}
        <div style={{
          height: '160px',
          background: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          {theme.representativeImage && !showFallback ? (
            <Image
              src={theme.representativeImage}
              alt={`${theme.parent} LEGO minifigure`}
              width={140}
              height={140}
              style={{ objectFit: 'contain', maxHeight: '140px', maxWidth: '100%' }}
              onError={handleImageError}
              priority={theme.isCurrent}
            />
          ) : (
            <div style={{
              fontSize: '48px',
              opacity: 0.2
            }}>
              🧱
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '8px',
            lineHeight: '1.3'
          }}>
            {theme.parent}
          </h2>

          <div style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            marginBottom: '12px'
          }}>
            {theme.totalCount.toLocaleString()} minifigs
            {theme.subcategoryCount > 0 && (
              <> · {theme.subcategoryCount} series</>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function ThemesClient({ themes }: ThemesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter themes based on search query
  const filteredThemes = themes.filter(theme =>
    theme.parent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate current and older themes
  const currentThemes = filteredThemes.filter(theme => theme.isCurrent);
  const olderThemes = filteredThemes.filter(theme => !theme.isCurrent);

  const totalMinifigs = themes.reduce((sum, theme) => sum + theme.totalCount, 0);

  return (
      <div style={{
        minHeight: '100vh',
        background: '#fafafa'
      }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e5e5'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 16px'
        }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#171717',
            lineHeight: '1.2'
          }}>
            Browse by Theme
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            marginBottom: '24px'
          }}>
            {themes.length} themes · {totalMinifigs.toLocaleString()} minifigures
          </p>

          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search themes..."
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '12px 16px',
              fontSize: 'var(--text-base)',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e5e5';
            }}
          />
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 16px'
      }}>
        {/* Empty State */}
        {filteredThemes.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#737373'
          }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', marginBottom: '8px', color: '#171717' }}>
              No themes found
            </div>
            <div style={{ fontSize: 'var(--text-base)' }}>
              Try a different search term
            </div>
          </div>
        )}

        {/* Current Themes */}
        {currentThemes.length > 0 && (
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '24px'
            }}>
              Current Themes ({currentThemes.length})
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px'
            }}>
              {currentThemes.map(theme => (
                <ThemeCard key={theme.parent} theme={theme} />
              ))}
            </div>
          </div>
        )}

        {/* Older Themes */}
        {olderThemes.length > 0 && (
          <div>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '24px'
            }}>
              Older Themes ({olderThemes.length})
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px'
            }}>
              {olderThemes.map(theme => (
                <ThemeCard key={theme.parent} theme={theme} />
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
  );
}

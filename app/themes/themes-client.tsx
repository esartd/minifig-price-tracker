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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  const handleImageError = () => {
    // Show brick emoji fallback
    setShowFallback(true);
  };

  return (
    <Link
      href={`/themes/${encodeURIComponent(theme.parent)}`}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e5e5e5',
        transition: 'all 0.2s',
        cursor: 'pointer',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = '#3b82f6';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e5e5e5';
      }}>
        {/* Representative Image */}
        <div style={{
          height: '200px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '20px'
        }}>
          {theme.representativeImage && !showFallback ? (
            <Image
              src={theme.representativeImage}
              alt={theme.parent}
              width={180}
              height={180}
              style={{ objectFit: 'contain', maxHeight: '180px', maxWidth: '100%' }}
              unoptimized
              onError={handleImageError}
            />
          ) : (
            <div style={{
              fontSize: '72px',
              opacity: 0.3
            }}>
              🧱
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#171717',
            marginBottom: '12px',
            lineHeight: '1.4'
          }}>
            {theme.parent}
          </h2>

          <div style={{
            fontSize: '14px',
            color: '#737373',
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            {theme.totalCount.toLocaleString()} minifigures
            {theme.subcategoryCount > 0 && (
              <> • {theme.subcategoryCount} {theme.subcategoryCount === 1 ? 'series' : 'series'}</>
            )}
          </div>

          {/* Subcategories Preview */}
          {theme.subcategories && theme.subcategories.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '16px'
            }}>
              {theme.subcategories.slice(0, 3).map(sub => (
                <div
                  key={sub.name}
                  style={{
                    fontSize: '11px',
                    background: '#f0f9ff',
                    color: '#0369a1',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '140px'
                  }}
                >
                  {sub.name} ({sub.count})
                </div>
              ))}
              {theme.subcategories.length > 3 && (
                <div style={{
                  fontSize: '11px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  padding: '6px 10px',
                  borderRadius: '6px'
                }}>
                  +{theme.subcategories.length - 3} more
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ThemesClient({ themes }: ThemesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllOlderThemes, setShowAllOlderThemes] = useState(false);

  // Calculate dynamic year range for "Current Themes"
  const currentYear = new Date().getFullYear();
  const minCurrentYear = currentYear - 2;
  const yearRange = `${minCurrentYear}-${currentYear}`;

  // Filter themes based on search query
  const filteredThemes = themes.filter(theme =>
    theme.parent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMinifigs = themes.reduce((sum, theme) => sum + theme.totalCount, 0);
  const filteredCurrentThemes = filteredThemes.filter(t => t.isCurrent);
  const filteredAllThemes = filteredThemes.filter(t => !t.isCurrent);

  return (
    <>
      <style jsx>{`
        .responsive-padding {
          padding: 16px !important;
        }

        @media (min-width: 768px) {
          .responsive-padding {
            padding: 24px !important;
          }
        }

        @media (min-width: 1024px) {
          .responsive-padding {
            padding: 32px !important;
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#fafafa'
      }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px'
        }}
        className="responsive-padding">
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 36px)',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#171717',
            lineHeight: '1.2'
          }}>
            Browse Minifigures by Theme
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 16px)',
            color: '#737373',
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            Explore {totalMinifigs.toLocaleString()} minifigures across {themes.length} themes
          </p>

          {/* Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: '#ffffff',
              border: '1px solid #dfe1e5',
              borderRadius: '24px',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              width: '100%',
              maxWidth: '720px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 1px 6px rgba(32,33,36,.28)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Search Icon */}
            <svg style={{ width: 'var(--icon-base)', height: 'var(--icon-base)', flexShrink: 0, color: '#9aa0a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="var(--icon-stroke)">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {/* Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search themes..."
              autoComplete="off"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 'var(--text-base)',
                fontWeight: '400',
                color: '#202124',
                backgroundColor: 'transparent',
                padding: 0
              }}
            />

            {/* Clear button (X) */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  padding: 0,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  flexShrink: 0,
                  color: '#5f6368'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f3f4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px'
      }}
      className="responsive-padding">
        {/* Current Themes Section */}
        {filteredCurrentThemes.length > 0 && (
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Current Themes
              <span style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#737373'
              }}>
                ({filteredCurrentThemes.length})
              </span>
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#737373',
              marginBottom: '24px'
            }}>
              Themes with minifigures released in the last 2 years ({yearRange})
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '28px'
            }}>
              {filteredCurrentThemes.map(theme => (
                <ThemeCard key={theme.parent} theme={theme} />
              ))}
            </div>
          </div>
        )}

        {/* Older Themes Section */}
        {filteredAllThemes.length > 0 && (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#171717',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Older Themes
              <span style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#737373'
              }}>
                ({filteredAllThemes.length})
              </span>
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#737373',
              marginBottom: '24px'
            }}>
              Themes from previous years
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '28px'
            }}>
              {(showAllOlderThemes ? filteredAllThemes : filteredAllThemes.slice(0, 12)).map(theme => (
                <ThemeCard key={theme.parent} theme={theme} />
              ))}
            </div>

            {!showAllOlderThemes && filteredAllThemes.length > 12 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button
                  onClick={() => setShowAllOlderThemes(true)}
                  style={{
                    padding: '14px 40px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#3b82f6',
                    background: '#ffffff',
                    border: '2px solid #3b82f6',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#3b82f6';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.1)';
                  }}
                >
                  Show More ({filteredAllThemes.length - 12} more themes)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredCurrentThemes.length === 0 && filteredAllThemes.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#737373'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              No themes found
            </div>
            <div style={{ fontSize: '14px' }}>
              Try adjusting your search
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}

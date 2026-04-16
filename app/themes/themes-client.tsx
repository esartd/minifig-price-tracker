'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Theme {
  parent: string;
  subcategories: Array<any>;
  totalCount: number;
  representativeImage: string | null;
  isCurrent: boolean;
}

export default function ThemesClient({ themes }: { themes: Theme[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter themes based on search query
  const filteredThemes = themes.filter(theme =>
    theme.parent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMinifigs = themes.reduce((sum, theme) => sum + theme.totalCount, 0);
  const currentThemes = filteredThemes.filter(t => t.isCurrent);
  const allThemes = filteredThemes.filter(t => !t.isCurrent);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 16px'
    }}>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '600',
          color: '#171717',
          letterSpacing: '-0.02em',
          marginBottom: '16px'
        }}>
          Browse by Theme
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          Explore {totalMinifigs.toLocaleString()} minifigures across {themes.length} themes
        </p>

        {/* Search Bar - Google Style (matches search page) */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
          boxSizing: 'border-box'
        }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              height: 'var(--icon-2xl)',
              padding: '0 16px',
              backgroundColor: '#ffffff',
              border: '1px solid #dfe1e5',
              borderRadius: '24px',
              boxSizing: 'border-box',
              boxShadow: 'none',
              transition: 'box-shadow 200ms'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 6px rgba(32,33,36,.28)';
            }}
            onMouseLeave={(e) => {
              const input = e.currentTarget.querySelector('input');
              if (document.activeElement !== input) {
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 6px rgba(32,33,36,.28)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Search Icon - Fixed 20px */}
            <svg style={{ width: 'var(--icon-base)', height: 'var(--icon-base)', flexShrink: 0, color: '#9aa0a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="var(--icon-stroke)">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {/* Input - Fills remaining space */}
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

            {/* Clear button (X) - Google Style */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  width: 'var(--icon-base)',
                  height: 'var(--icon-base)',
                  minWidth: '20px',
                  minHeight: '20px',
                  flexShrink: 0,
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f3f4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="var(--icon-xs)" height="var(--icon-xs)" viewBox="0 0 24 24" fill="none">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#70757a"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* No results message */}
      {filteredThemes.length === 0 && searchQuery && (
        <div style={{
          textAlign: 'center',
          padding: '64px 16px',
          color: '#737373'
        }}>
          <svg width="var(--icon-2xl)" height="var(--icon-2xl)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="var(--icon-stroke)" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p style={{ fontSize: 'var(--text-base)', marginBottom: '8px', color: '#171717' }}>No themes found</p>
          <p style={{ fontSize: 'var(--text-sm)' }}>Try searching for something else</p>
        </div>
      )}

      {/* Current Themes Section */}
      {currentThemes.length > 0 && (
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: '600',
            color: '#171717',
            letterSpacing: '-0.02em',
            marginBottom: '24px'
          }}>
            Current Themes
            {searchQuery && <span style={{ fontSize: 'var(--text-base)', fontWeight: 'normal', color: '#737373', marginLeft: '12px' }}>({currentThemes.length})</span>}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {currentThemes.map((theme) => (
              <ThemeTile key={theme.parent} theme={theme} router={router} />
            ))}
          </div>
        </div>
      )}

      {/* All Themes Section */}
      {allThemes.length > 0 && (
        <div>
          <h2 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: '600',
            color: '#171717',
            letterSpacing: '-0.02em',
            marginBottom: '24px'
          }}>
            All Themes
            {searchQuery && <span style={{ fontSize: 'var(--text-base)', fontWeight: 'normal', color: '#737373', marginLeft: '12px' }}>({allThemes.length})</span>}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {allThemes.map((theme) => (
              <ThemeTile key={theme.parent} theme={theme} router={router} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Theme tile component to avoid duplication
function ThemeTile({ theme, router }: { theme: Theme; router: any }) {
  return (
    <button
      onClick={() => router.push(`/themes/${encodeURIComponent(theme.parent)}`)}
      style={{
        padding: '16px',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '16px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.borderColor = '#d4d4d4';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.borderColor = '#e5e5e5';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Representative Image - Left side */}
      {theme.representativeImage && (
        <div style={{
          width: '80px',
          height: '80px',
          flexShrink: 0,
          background: '#ffffff',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Image
            src={theme.representativeImage}
            alt={theme.parent}
            width={80}
            height={80}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            unoptimized
          />
        </div>
      )}

      {/* Text Content - Right side */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontSize: 'var(--text-base)',
          fontWeight: '600',
          color: '#171717',
          marginBottom: '4px',
          letterSpacing: '-0.01em'
        }}>
          {theme.parent}
        </h3>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#737373'
        }}>
          {theme.totalCount.toLocaleString()} minifigure{theme.totalCount !== 1 ? 's' : ''}
          {theme.subcategories.length > 0 && ` · ${theme.subcategories.length} ${theme.subcategories.length === 1 ? 'series' : 'series'}`}
        </p>
      </div>
    </button>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Theme {
  parent: string;
  subcategories: Array<any>;
  totalCount: number;
  representativeImage: string | null;
  isCurrent: boolean;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();

        if (data.success) {
          setThemes(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter themes based on search query
  const filteredThemes = themes.filter(theme =>
    theme.parent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e5e5',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    );
  }

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
          fontSize: '40px',
          fontWeight: '600',
          color: '#171717',
          letterSpacing: '-0.02em',
          marginBottom: '16px'
        }}>
          Browse by Theme
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#737373',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          Explore {totalMinifigs.toLocaleString()} minifigures across {themes.length} themes
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '600px' }}>
          <input
            type="text"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 48px 14px 20px',
              fontSize: '16px',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              outline: 'none',
              transition: 'all 0.2s',
              backgroundColor: '#ffffff',
              color: '#171717'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e5e5';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {/* Search Icon */}
          <div style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#737373',
            pointerEvents: 'none'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '44px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#737373',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#737373'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* No results message */}
      {filteredThemes.length === 0 && searchQuery && (
        <div style={{
          textAlign: 'center',
          padding: '64px 16px',
          color: '#737373'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p style={{ fontSize: '18px', marginBottom: '8px', color: '#171717' }}>No themes found</p>
          <p style={{ fontSize: '14px' }}>Try searching for something else</p>
        </div>
      )}

      {/* Current Themes Section */}
      {currentThemes.length > 0 && (
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#171717',
            letterSpacing: '-0.02em',
            marginBottom: '24px'
          }}>
            Current Themes
            {searchQuery && <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#737373', marginLeft: '12px' }}>({currentThemes.length})</span>}
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
            fontSize: '24px',
            fontWeight: '600',
            color: '#171717',
            letterSpacing: '-0.02em',
            marginBottom: '24px'
          }}>
            All Themes
            {searchQuery && <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#737373', marginLeft: '12px' }}>({allThemes.length})</span>}
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
          fontSize: '18px',
          fontWeight: '600',
          color: '#171717',
          marginBottom: '4px',
          letterSpacing: '-0.01em'
        }}>
          {theme.parent}
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#737373'
        }}>
          {theme.totalCount.toLocaleString()} minifigure{theme.totalCount !== 1 ? 's' : ''}
          {theme.subcategories.length > 0 && ` · ${theme.subcategories.length} ${theme.subcategories.length === 1 ? 'series' : 'series'}`}
        </p>
      </div>
    </button>
  );
}

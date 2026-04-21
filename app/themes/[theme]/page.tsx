'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { THEME_OVERRIDES } from '@/lib/theme-main-characters';

interface Subcategory {
  id: number;
  fullName: string;
  subTheme: string;
  count: number;
  representativeImage: string | null;
}

interface Minifig {
  no: string;
  name: string;
  year_released: string | null;
  image_url: string;
}

export default function SubcategoriesPage({ params }: { params: Promise<{ theme: string }> }) {
  const router = useRouter();
  const [theme, setTheme] = useState<string>('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [uncategorizedMinifigs, setUncategorizedMinifigs] = useState<Minifig[]>([]);
  const [themeHeroImage, setThemeHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(p => {
      const decodedTheme = decodeURIComponent(p.theme);
      setTheme(decodedTheme);
      fetchSubcategories(decodedTheme);
    });
  }, []);

  const fetchSubcategories = async (themeName: string) => {
    try {
      // Use exact same logic as themes list page
      let minifigNo = THEME_OVERRIDES[themeName] || null;

      // If no override, fetch from catalog to find first minifig from this theme
      if (!minifigNo) {
        const catalogResponse = await fetch('/api/catalog/minifigs');
        const catalogData = await catalogResponse.json();

        if (catalogData.success && catalogData.data) {
          const minifigFromTheme = catalogData.data.find((m: any) => {
            const parentTheme = m.category_name.split(' / ')[0];
            return parentTheme === themeName;
          });
          if (minifigFromTheme) {
            minifigNo = minifigFromTheme.minifigure_no;
          }
        }
      }

      // Set hero image
      if (minifigNo) {
        setThemeHeroImage(`https://img.bricklink.com/ItemImage/MN/0/${minifigNo}.png`);
      }

      const response = await fetch(`/api/subcategories?theme=${encodeURIComponent(themeName)}`);
      const data = await response.json();

      if (data.success) {
        const subs = data.data;

        // If only 1 subcategory AND it's a real series (not Uncategorized), redirect to it
        if (subs.length === 1 && subs[0].subTheme !== 'Uncategorized') {
          router.replace(`/themes/${encodeURIComponent(themeName)}/${encodeURIComponent(subs[0].subTheme)}`);
          return;
        }

        // Separate uncategorized minifigs from series
        const uncategorized = subs.find((sub: Subcategory) => sub.subTheme === 'Uncategorized');
        const categorized = subs.filter((sub: Subcategory) => sub.subTheme !== 'Uncategorized');

        setSubcategories(categorized);

        // If there are uncategorized items, fetch them to display inline
        if (uncategorized) {
          fetchUncategorizedMinifigs(themeName);
        }
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUncategorizedMinifigs = async (themeName: string) => {
    try {
      const response = await fetch(
        `/api/minifigs/search?subcategory=${encodeURIComponent(themeName)}`
      );
      const data = await response.json();

      if (data.success) {
        setUncategorizedMinifigs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch uncategorized minifigs:', error);
    }
  };

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

  const totalMinifigs = subcategories.reduce((sum, sub) => sum + sub.count, 0) + uncategorizedMinifigs.length;
  const seriesCount = subcategories.filter(sub => sub.subTheme !== '(Other)').length;

  // Sort: A-Z, then "(Other)" at the very bottom
  const sortedSubcategories = [...subcategories].sort((a, b) => {
    // "(Other)" always at the very end
    if (a.subTheme === '(Other)') return 1;
    if (b.subTheme === '(Other)') return -1;

    // Everything else alphabetically
    return a.subTheme.localeCompare(b.subTheme);
  });

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 16px'
    }}>
      {/* Breadcrumb */}
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Themes', href: '/themes' },
        { label: theme }
      ]} />

      {/* Hero Section - Theme level (larger, more prominent than series pages) */}
      {themeHeroImage ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          marginBottom: '48px',
          padding: '32px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
          border: '1px solid #e5e5e5',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Minifig Image - Larger for theme level */}
          <div style={{
            flexShrink: 0,
            width: '160px',
            height: '160px',
            background: '#ffffff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e5e5e5',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
          }}>
            <Image
              src={themeHeroImage}
              alt={theme}
              width={160}
              height={160}
              style={{
                objectFit: 'contain',
                padding: '12px'
              }}
              unoptimized
            />
          </div>

          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: '#3b82f6',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Theme
            </div>
            <h1 style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              marginBottom: '12px',
              color: '#171717'
            }}>
              {theme}
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              color: '#737373'
            }}>
              {totalMinifigs.toLocaleString()} minifigure{totalMinifigs !== 1 ? 's' : ''}
              {sortedSubcategories.length > 0 && ` across ${seriesCount} ${seriesCount === 1 ? 'series' : 'series'}`}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: '700',
            color: '#171717',
            letterSpacing: '-0.02em',
            marginBottom: '12px'
          }}>
            {theme}
          </h1>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: '#737373',
            lineHeight: '1.6'
          }}>
            {totalMinifigs.toLocaleString()} minifigure{totalMinifigs !== 1 ? 's' : ''}
            {sortedSubcategories.length > 0 && ` across ${seriesCount} ${seriesCount === 1 ? 'series' : 'series'}`}
          </p>
        </div>
      )}

      {sortedSubcategories.length > 0 && (
        <>
          <h2 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}>
            Series
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '48px'
          }}>
            {sortedSubcategories.map((subcategory) => (
              <Link
                key={subcategory.fullName}
                href={`/themes/${encodeURIComponent(theme)}/${encodeURIComponent(subcategory.subTheme)}`}
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
                  gap: '16px',
                  textDecoration: 'none'
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
                {subcategory.representativeImage && (
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
                      src={subcategory.representativeImage}
                      alt={subcategory.subTheme}
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
                    {subcategory.subTheme}
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: '#737373'
                  }}>
                    {subcategory.count.toLocaleString()} minifigure{subcategory.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Uncategorized Minifigs Section */}
      {uncategorizedMinifigs.length > 0 && (
        <>
          {sortedSubcategories.length > 0 ? (
            <>
              <h2 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '16px',
                letterSpacing: '-0.02em'
              }}>
                Other {theme} Minifigures
              </h2>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: '#737373',
                marginBottom: '24px',
                lineHeight: '1.6'
              }}>
                {uncategorizedMinifigs.length} minifigure{uncategorizedMinifigs.length !== 1 ? 's' : ''} that {uncategorizedMinifigs.length !== 1 ? "don't" : "doesn't"} belong to a specific series
              </p>
            </>
          ) : (
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '24px',
              letterSpacing: '-0.02em'
            }}>
              Minifigures
            </h2>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '16px'
          }}>
            {uncategorizedMinifigs.map((minifig) => (
              <Link
                key={minifig.no}
                href={`/minifigs/${minifig.no}`}
                style={{
                  padding: '16px',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  textDecoration: 'none'
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
                <div style={{
                  width: '100%',
                  height: '160px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={minifig.image_url}
                    alt={minifig.name}
                    width={120}
                    height={160}
                    style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
                    unoptimized
                  />
                </div>
                <div>
                  <h3 style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    color: '#171717',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4'
                  }}>
                    {minifig.name}
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-xs)',
                    color: '#a3a3a3'
                  }}>
                    {minifig.no}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

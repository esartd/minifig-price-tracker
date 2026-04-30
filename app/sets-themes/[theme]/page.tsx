'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from '@/components/TranslationProvider';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import ThemeDescription from '@/components/ThemeDescription';
import { getSetAvailability } from '@/lib/set-availability';
import { generateAmazonLegoSetLink } from '@/lib/affiliate-links';
import { getRepresentativeSet } from '@/lib/theme-set-representatives';
import themeDescriptions from '@/lib/theme-descriptions.json';
import { formatCompactNumberSmart } from '@/lib/format-number';

interface LegoBox {
  box_no: string;
  name: string;
  category_name: string;
  year_released: string;
  weight: string;
  image_url: string;
}

function SetCard({ set }: { set: LegoBox }) {
  const { t } = useTranslation();
  const availability = getSetAvailability(set.box_no, set.year_released);
  const amazonUrl = generateAmazonLegoSetLink(set.box_no, set.name);
  const showAmazonLink = availability.status === 'available' || availability.status === 'retiring_soon';
  const [currentImageUrl, setCurrentImageUrl] = useState(set.image_url);
  const [showFallback, setShowFallback] = useState(false);

  const handleImageError = () => {
    // Try fallback: ON -> SN (Original New -> Standard New)
    if (currentImageUrl.includes('/ON/')) {
      setCurrentImageUrl(currentImageUrl.replace('/ON/', '/SN/'));
    } else {
      setShowFallback(true);
    }
  };

  return (
    <Link
      href={`/sets/${set.box_no}`}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e5e5e5',
        transition: 'all 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        {/* Image */}
        <div style={{
          height: '240px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {!showFallback ? (
            <Image
              key={currentImageUrl}
              src={currentImageUrl}
              alt={set.name}
              width={240}
              height={240}
              style={{ objectFit: 'contain', maxHeight: '220px' }}
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
        <div style={{ padding: '16px' }}>
          <div style={{
            fontSize: '12px',
            color: '#3b82f6',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            {set.box_no}
          </div>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '8px',
            lineHeight: '1.4',
            minHeight: '42px'
          }}>
            {set.name}
          </h3>

          {/* Subcategory Badge */}
          {set.category_name.split(' / ').length > 1 && (
            <div style={{
              fontSize: '11px',
              background: '#f0f9ff',
              color: '#0369a1',
              padding: '4px 8px',
              borderRadius: '6px',
              marginBottom: '8px',
              display: 'inline-block'
            }}>
              {set.category_name.split(' / ').slice(1).join(' / ')}
            </div>
          )}

          <div style={{
            fontSize: '12px',
            color: '#737373',
            marginTop: '8px'
          }}>
            {t('setsThemePage.yearLabel')}: {set.year_released} • {t('setsThemePage.weightLabel')}: {set.weight}g
          </div>

          {/* Amazon Button */}
          {showAmazonLink && (
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'block',
                marginTop: '12px',
                padding: '8px 12px',
                background: '#ffffff',
                color: '#525252',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}
            >
              {t('setsThemePage.findOnAmazon')}
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ThemePage() {
  const { t } = useTranslation();
  const params = useParams();
  const theme = decodeURIComponent(params.theme as string);

  const [sets, setSets] = useState<LegoBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'year' | 'name'>('year');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('all');
  const [themeHeroImage, setThemeHeroImage] = useState<string | null>(null);

  useEffect(() => {
    // Set hero image from representative set
    const boxNo = getRepresentativeSet(theme);
    if (boxNo) {
      // Use BrickLink image URL directly for sets
      setThemeHeroImage(`https://img.bricklink.com/ItemImage/ON/0/${boxNo}.png`);
    }
    loadSets();
  }, [theme]);

  const loadSets = async () => {
    try {
      const response = await fetch(`/api/boxes/search?theme=${encodeURIComponent(theme)}&limit=1000`);
      const data = await response.json();
      if (data.success) {
        setSets(data.data);
      }
    } catch (error) {
      console.error('Error loading sets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique subcategories
  const subcategories = Array.from(new Set(
    sets.map(set => {
      const parts = set.category_name.split(' / ');
      return parts.length > 1 ? parts.slice(1).join(' / ') : 'Other';
    })
  )).sort();

  // Filter and sort sets
  let filteredSets = sets;
  if (subcategoryFilter !== 'all') {
    filteredSets = sets.filter(set => {
      const parts = set.category_name.split(' / ');
      const sub = parts.length > 1 ? parts.slice(1).join(' / ') : 'Other';
      return sub === subcategoryFilter;
    });
  }

  const sortedSets = [...filteredSets].sort((a, b) => {
    if (sortBy === 'year') {
      return parseInt(b.year_released) - parseInt(a.year_released);
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧱</div>
          <div style={{ fontSize: '18px', color: '#525252' }}>{t('setsThemePage.loadingText', { theme })}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .responsive-container {
          padding: 16px !important;
        }

        @media (min-width: 768px) {
          .responsive-container {
            padding: 24px !important;
          }
        }

        @media (min-width: 1024px) {
          .responsive-container {
            padding: 32px !important;
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#fafafa'
      }}>
      {/* Header with Hero Card */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e5e5'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px'
        }}
        className="responsive-container">
          {/* Breadcrumbs */}
          <Breadcrumbs items={[
            { label: t('setsThemePage.breadcrumbs.home'), href: '/' },
            { label: t('setsThemePage.breadcrumbs.setThemes'), href: '/sets-themes' },
            { label: theme }
          ]} />

          {/* Hero Card (if we have theme override) */}
          {themeHeroImage ? (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '40px',
              marginTop: '24px',
              marginBottom: '24px',
              padding: '48px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
              border: '1px solid #e5e5e5',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
              {/* Representative Image */}
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
                  alt={`${theme} LEGO theme representative`}
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
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {t('setsThemePage.themeLabel')}
                </div>
                <h1 style={{
                  fontSize: 'clamp(28px, 5vw, 36px)',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  marginBottom: '12px',
                  color: '#171717',
                  lineHeight: '1.2'
                }}>
                  {theme} Sets
                </h1>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  color: '#737373',
                  marginBottom: 0
                }}>
                  {t('setsThemePage.setsInTheme', { count: sets.length })}
                </p>

                {/* Theme Description */}
                {(themeDescriptions as Record<string, string>)[theme] && (
                  <ThemeDescription
                    themeName={theme}
                    description={(themeDescriptions as Record<string, string>)[theme]}
                  />
                )}
              </div>
            </div>
          ) : (
            // Fallback: simple header (no override found)
            <>
              <h1 style={{
                fontSize: 'clamp(28px, 5vw, 36px)',
                fontWeight: '700',
                marginTop: '16px',
                marginBottom: '8px',
                color: '#171717',
                lineHeight: '1.2'
              }}>
                {theme} Sets
              </h1>
              <p style={{
                fontSize: 'clamp(14px, 2vw, 16px)',
                color: '#737373',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                {formatCompactNumberSmart(sets.length)} sets in this theme
              </p>
            </>
          )}

          {/* Controls */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            marginTop: themeHeroImage ? '0' : '16px'
          }}>
            {/* Subcategory Filter */}
            {subcategories.length > 1 && (
              <select
                value={subcategoryFilter}
                onChange={(e) => setSubcategoryFilter(e.target.value)}
                style={{
                  padding: '12px 48px 12px 16px',
                  fontSize: 'clamp(14px, 2vw, 15px)',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23525252' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  minWidth: '0',
                  flex: '1 1 auto',
                  minHeight: '44px'
                }}
              >
                <option value="all">{t('setsThemePage.subcategoryAll', { count: sets.length })}</option>
                {subcategories.map(sub => (
                  <option key={sub} value={sub}>
                    {sub} ({sets.filter(s => {
                      const parts = s.category_name.split(' / ');
                      const setSub = parts.length > 1 ? parts.slice(1).join(' / ') : 'Other';
                      return setSub === sub;
                    }).length})
                  </option>
                ))}
              </select>
            )}

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'year' | 'name')}
              style={{
                padding: '12px 48px 12px 16px',
                fontSize: 'clamp(14px, 2vw, 15px)',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23525252' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                minWidth: '0',
                flex: '1 1 auto',
                minHeight: '44px'
              }}
            >
              <option value="year">{t('setsThemePage.sortByYear')}</option>
              <option value="name">{t('setsThemePage.sortByName')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sets Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '16px'
      }}
      className="responsive-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '28px'
        }}>
          {sortedSets.map(set => (
            <SetCard key={set.box_no} set={set} />
          ))}
        </div>

        {/* Empty State */}
        {sortedSets.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#737373'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              {t('setsThemePage.noSetsFound')}
            </div>
            <div style={{ fontSize: '14px' }}>
              {t('setsThemePage.tryAdjustFilters')}
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}

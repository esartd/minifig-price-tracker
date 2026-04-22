'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import SetAdCard from '@/components/SetAdCard';
import { getSensitiveImageStyles } from '@/lib/minifig-filters';
import { getMainCharacter, THEME_OVERRIDES } from '@/lib/theme-main-characters';

interface Minifig {
  no: string;
  name: string;
  year_released: string | null;
  image_url: string;
}

interface LegoSet {
  setNumber: string;
  name: string;
  theme: string;
  year: number;
  imageUrl: string;
  amazonUrl?: string; // Optional direct Amazon affiliate URL
}

export default function SubcategoryMinifigsPage({
  params
}: {
  params: Promise<{ theme: string; subcategory: string }>
}) {
  const router = useRouter();
  const [theme, setTheme] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [minifigs, setMinifigs] = useState<Minifig[]>([]);
  const [featuredSets, setFeaturedSets] = useState<LegoSet[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(p => {
      const decodedTheme = decodeURIComponent(p.theme);
      const decodedSubcategory = decodeURIComponent(p.subcategory);
      setTheme(decodedTheme);
      setSubcategory(decodedSubcategory);
      fetchMinifigs(decodedTheme, decodedSubcategory);
    });
  }, []);

  const fetchMinifigs = async (themeName: string, subcategoryName: string) => {
    try {
      // If subcategory is "Uncategorized", it means there's no real subcategory
      // Search by theme name only (e.g., "Agents" not "Agents / Uncategorized")
      const fullCategoryName = subcategoryName === 'Uncategorized'
        ? themeName
        : `${themeName} / ${subcategoryName}`;

      // Fetch representative image from subcategories API (same source as theme list page)
      const subcategoriesResponse = await fetch(
        `/api/subcategories?theme=${encodeURIComponent(themeName)}`
      );
      const subcategoriesData = await subcategoriesResponse.json();

      if (subcategoriesData.success) {
        const matchingSubcategory = subcategoriesData.data.find(
          (sub: any) => sub.subTheme === subcategoryName
        );
        if (matchingSubcategory?.representativeImage) {
          setCoverImage(matchingSubcategory.representativeImage);
        } else if (subcategoryName === 'Uncategorized') {
          // For uncategorized, use theme override or wait for first minifig
          const overrideMinifig = THEME_OVERRIDES[themeName];
          if (overrideMinifig) {
            setCoverImage(`https://img.bricklink.com/ItemImage/MN/0/${overrideMinifig}.png`);
          }
        }
      }

      // Fetch minifigs
      const minifigsResponse = await fetch(
        `/api/minifigs/search?subcategory=${encodeURIComponent(fullCategoryName)}`
      );
      const minifigsData = await minifigsResponse.json();

      if (minifigsData.success) {
        const minifigsData_array = minifigsData.data;
        setMinifigs(minifigsData_array);

        // If no cover image yet (uncategorized without override), use first minifig
        if (!coverImage && subcategoryName === 'Uncategorized' && minifigsData_array.length > 0) {
          setCoverImage(minifigsData_array[0].image_url);
        }

        // Calculate dynamic ad count based on page length
        // Formula: Math.floor(minifigs / 15) + 1 (max 10 ads)
        const numMinifigs = minifigsData.data.length;
        const numAds = Math.min(10, Math.floor(numMinifigs / 15) + 1);

        // Fetch random sets from last 2 years (number based on page length)
        const setsResponse = await fetch(
          `/api/sets/random?theme=${encodeURIComponent(themeName)}&count=${numAds}`
        );
        const setsData = await setsResponse.json();

        if (setsData.success && setsData.data.length > 0) {
          setFeaturedSets(setsData.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
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

  // Build breadcrumb items
  const breadcrumbItems: Array<{ label: string; href?: string }> = [
    { label: 'Home', href: '/' },
    { label: 'Themes', href: '/themes' }
  ];

  if (subcategory === 'Uncategorized') {
    // For uncategorized, just show theme as final item
    breadcrumbItems.push({ label: theme });
  } else {
    // For subcategories, show theme link then subcategory
    breadcrumbItems.push(
      { label: theme, href: `/themes/${encodeURIComponent(theme)}` },
      { label: subcategory }
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 16px'
    }}>
      {/* Breadcrumb */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Hero Section with Cover Image - Clean Spotify Style */}
      {coverImage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '32px',
          padding: '24px',
          borderRadius: '12px',
          background: '#ffffff',
          border: '1px solid #e5e5e5'
        }}>
          {/* Minifig Image */}
          <div style={{
            flexShrink: 0,
            width: '120px',
            height: '120px',
            background: '#ffffff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e5e5e5'
          }}>
            <Image
              src={coverImage}
              alt={subcategory === 'Uncategorized' ? theme : subcategory}
              width={120}
              height={120}
              style={{
                objectFit: 'contain',
                padding: '8px'
              }}
              priority
            />
          </div>

          {/* Text Content */}
          <div style={{
            flex: 1
          }}>
            <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#737373'
            }}>
              {subcategory !== 'Uncategorized' && theme}
            </div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
              color: '#171717'
            }}>
              {subcategory === 'Uncategorized' ? theme : subcategory}
            </h1>
            <p style={{
              fontSize: 'var(--text-base)',
              color: '#737373'
            }}>
              {minifigs.length.toLocaleString()} minifigure{minifigs.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Standard Header (no cover image) */}
      {!coverImage && (
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '600',
            color: '#171717',
            letterSpacing: '-0.02em',
            marginBottom: '8px'
          }}>
            {subcategory === 'Uncategorized' ? theme : subcategory}
          </h1>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            lineHeight: '1.6'
          }}>
            {minifigs.length.toLocaleString()} minifigure{minifigs.length !== 1 ? 's' : ''}{subcategory !== 'Uncategorized' && ` · ${theme}`}
          </p>
        </div>
      )}

      {minifigs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 16px',
          color: '#737373'
        }}>
          <p>No minifigures found in this category.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {(() => {
            // Scattered grid pattern for theme pages
            // Pattern: Ads at positions 10, 25, 40, 55... (first at 10, then every 15)
            const items: Array<{ type: 'minifig' | 'set'; data: Minifig | LegoSet; key: string }> = [];

            const firstAdPosition = 10;
            const spacing = 15;
            const adPositions: number[] = [];

            // Calculate ad positions based on available sets
            for (let i = 0; i < featuredSets.length; i++) {
              const position = firstAdPosition + (i * spacing);
              if (position <= minifigs.length) {
                adPositions.push(position);
              }
            }

            minifigs.forEach((minifig, index) => {
              items.push({ type: 'minifig', data: minifig, key: minifig.no });

              // Insert ad at strategic positions
              const adIndex = adPositions.indexOf(index + 1);
              if (adIndex !== -1 && featuredSets[adIndex]) {
                items.push({
                  type: 'set',
                  data: featuredSets[adIndex],
                  key: `set-${featuredSets[adIndex].setNumber}`
                });
              }
            });

            return items.map((item) => {
              if (item.type === 'set') {
                const set = item.data as LegoSet;
                return (
                  <SetAdCard
                    key={item.key}
                    setNumber={set.setNumber}
                    setName={set.name}
                    imageUrl={set.imageUrl}
                    year={set.year}
                    amazonUrl={set.amazonUrl}
                  />
                );
              }

              const minifig = item.data as Minifig;
              return (
            <Link
              key={minifig.no}
              href={`/minifigs/${minifig.no}`}
              style={{
                textDecoration: 'none',
                display: 'block'
              }}
            >
              <div style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
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
              }}>
                {/* Image */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '100%',
                  marginBottom: '12px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={minifig.image_url}
                    alt={minifig.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 180px"
                    style={{
                      objectFit: 'contain',
                      padding: '8px',
                      ...getSensitiveImageStyles(minifig.no, minifig.name)
                    }}
                  />
                </div>

                {/* Item Number */}
                <div style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '4px',
                  fontFamily: 'inherit'
                }}>
                  {minifig.no}
                </div>

                {/* Name */}
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: '#171717',
                  lineHeight: '1.4',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {minifig.name}
                </div>

                {/* Year */}
                {minifig.year_released && (
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: '#737373',
                    marginTop: 'auto'
                  }}>
                    {minifig.year_released}
                  </div>
                )}
              </div>
            </Link>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}

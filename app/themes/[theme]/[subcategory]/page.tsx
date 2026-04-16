'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSensitiveImageStyles } from '@/lib/minifig-filters';

interface Minifig {
  no: string;
  name: string;
  year_released: string | null;
  image_url: string;
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

      const response = await fetch(
        `/api/minifigs/search?subcategory=${encodeURIComponent(fullCategoryName)}`
      );
      const data = await response.json();

      if (data.success) {
        setMinifigs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch minifigs:', error);
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
          {minifigs.map((minifig) => (
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
                    unoptimized
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
          ))}
        </div>
      )}
    </div>
  );
}

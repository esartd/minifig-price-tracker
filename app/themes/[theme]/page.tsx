'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Subcategory {
  id: number;
  fullName: string;
  subTheme: string;
  count: number;
  representativeImage: string | null;
}

export default function SubcategoriesPage({ params }: { params: Promise<{ theme: string }> }) {
  const router = useRouter();
  const [theme, setTheme] = useState<string>('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
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
      const response = await fetch(`/api/subcategories?theme=${encodeURIComponent(themeName)}`);
      const data = await response.json();

      if (data.success) {
        const subs = data.data;

        // If only 1 subcategory, skip hub page and go directly to minifigures
        if (subs.length === 1) {
          router.push(`/themes/${encodeURIComponent(themeName)}/${encodeURIComponent(subs[0].subTheme)}`);
          return;
        }

        setSubcategories(subs);
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
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

  const totalMinifigs = subcategories.reduce((sum, sub) => sum + sub.count, 0);
  const seriesCount = subcategories.filter(sub => sub.subTheme !== 'Uncategorized' && sub.subTheme !== '(Other)').length;

  // Sort: A-Z, then "Uncategorized", then "(Other)" at the very bottom
  const sortedSubcategories = [...subcategories].sort((a, b) => {
    // "(Other)" always at the very end
    if (a.subTheme === '(Other)') return 1;
    if (b.subTheme === '(Other)') return -1;

    // "Uncategorized" second to last
    if (a.subTheme === 'Uncategorized') return 1;
    if (b.subTheme === 'Uncategorized') return -1;

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

      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: '600',
          color: '#171717',
          letterSpacing: '-0.02em',
          marginBottom: '16px'
        }}>
          {theme}
        </h1>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          lineHeight: '1.6'
        }}>
          {totalMinifigs.toLocaleString()} minifigures across {seriesCount} {seriesCount === 1 ? 'series' : 'series'}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {sortedSubcategories.map((subcategory) => (
          <button
            key={subcategory.fullName}
            onClick={() => router.push(`/themes/${encodeURIComponent(theme)}/${encodeURIComponent(subcategory.subTheme)}`)}
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
          </button>
        ))}
      </div>
    </div>
  );
}

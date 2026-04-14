'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Subcategory {
  id: number;
  fullName: string;
  subTheme: string;
  count: number;
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
        setSubcategories(data.data);
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

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 16px'
    }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/themes"
          style={{
            fontSize: '14px',
            color: '#3b82f6',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '16px', height: '16px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          All Themes
        </Link>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: '40px',
          fontWeight: '600',
          color: '#171717',
          letterSpacing: '-0.02em',
          marginBottom: '16px'
        }}>
          {theme}
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#737373',
          lineHeight: '1.6'
        }}>
          {totalMinifigs.toLocaleString()} minifigures across {subcategories.length} {subcategories.length === 1 ? 'series' : 'series'}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.fullName}
            onClick={() => router.push(`/themes/${encodeURIComponent(theme)}/${encodeURIComponent(subcategory.subTheme)}`)}
            style={{
              padding: '24px',
              background: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
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
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '8px',
              letterSpacing: '-0.01em'
            }}>
              {subcategory.subTheme}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#737373'
            }}>
              {subcategory.count.toLocaleString()} minifigure{subcategory.count !== 1 ? 's' : ''}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

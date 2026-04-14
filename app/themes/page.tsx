'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Theme {
  parent: string;
  subcategories: Array<any>;
  totalCount: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

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
          lineHeight: '1.6'
        }}>
          Explore {totalMinifigs.toLocaleString()} minifigures across {themes.length} themes
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {themes.map((theme) => (
          <button
            key={theme.parent}
            onClick={() => router.push(`/themes/${encodeURIComponent(theme.parent)}`)}
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
              {theme.parent}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#737373'
            }}>
              {theme.totalCount.toLocaleString()} minifigure{theme.totalCount !== 1 ? 's' : ''}
              {theme.subcategories.length > 0 && ` · ${theme.subcategories.length} ${theme.subcategories.length === 1 ? 'series' : 'series'}`}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Subcategory {
  id: number;
  name: string;
  fullName: string;
  count: number;
}

interface Theme {
  parent: string;
  subcategories: Subcategory[];
  totalCount: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(new Set());
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

  const toggleTheme = (themeName: string) => {
    setExpandedThemes(prev => {
      const next = new Set(prev);
      if (next.has(themeName)) {
        next.delete(themeName);
      } else {
        next.add(themeName);
      }
      return next;
    });
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
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {themes.map((theme) => {
          const isExpanded = expandedThemes.has(theme.parent);
          const hasSubcategories = theme.subcategories.length > 0;

          return (
            <div
              key={theme.parent}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Parent Theme Header */}
              <button
                onClick={() => hasSubcategories && toggleTheme(theme.parent)}
                style={{
                  width: '100%',
                  padding: '24px',
                  background: isExpanded ? '#fafafa' : '#ffffff',
                  border: 'none',
                  cursor: hasSubcategories ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '8px',
                    letterSpacing: '-0.01em'
                  }}>
                    {theme.parent}
                  </h3>
                  <p style={{
                    fontSize: '15px',
                    color: '#737373'
                  }}>
                    {theme.totalCount.toLocaleString()} minifigure{theme.totalCount !== 1 ? 's' : ''}
                    {hasSubcategories && ` · ${theme.subcategories.length} subcategories`}
                  </p>
                </div>

                {hasSubcategories && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#737373',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}>
                    ▼
                  </div>
                )}
              </button>

              {/* Subcategories */}
              {hasSubcategories && isExpanded && (
                <div style={{
                  padding: '0 24px 24px 24px',
                  background: '#fafafa',
                  borderTop: '1px solid #e5e5e5'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '12px',
                    marginTop: '16px'
                  }}>
                    {theme.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => router.push(`/categories/${encodeURIComponent(theme.parent)}?sub=${encodeURIComponent(sub.fullName)}`)}
                        style={{
                          padding: '16px',
                          background: '#ffffff',
                          border: '1px solid #e5e5e5',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e5e5e5';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <h4 style={{
                          fontSize: '15px',
                          fontWeight: '500',
                          color: '#171717',
                          marginBottom: '4px'
                        }}>
                          {sub.name}
                        </h4>
                        <p style={{
                          fontSize: '13px',
                          color: '#737373'
                        }}>
                          {sub.count.toLocaleString()} minifigure{sub.count !== 1 ? 's' : ''}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

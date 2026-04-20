'use client';

import { useEffect, useState } from 'react';

interface ThemeData {
  theme: string;
  count: number;
}

export default function PopularThemesSection() {
  const [loading, setLoading] = useState(true);
  const [topThemesByCollection, setTopThemesByCollection] = useState<ThemeData[]>([]);
  const [topThemesByWishlist, setTopThemesByWishlist] = useState<ThemeData[]>([]);

  useEffect(() => {
    const loadThemes = async () => {
      try {
        const response = await fetch('/api/admin/popular-themes');
        const data = await response.json();
        if (data.success) {
          setTopThemesByCollection(data.data.topThemesByCollection);
          setTopThemesByWishlist(data.data.topThemesByWishlist);
        }
      } catch (error) {
        console.error('Error loading popular themes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadThemes();
  }, []);

  if (loading) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e5e5',
        padding: 'var(--space-3)',
        marginBottom: 'var(--space-6)',
      }}>
        <h2 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: '600',
          color: '#171717',
          marginBottom: 'var(--space-3)',
        }}>
          Popular Themes
        </h2>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#737373',
          fontSize: 'var(--text-sm)'
        }}>
          Loading theme data...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e5e5',
      padding: 'var(--space-3)',
      marginBottom: 'var(--space-6)',
    }}>
      <h2 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: '600',
        color: '#171717',
        marginBottom: 'var(--space-3)',
      }}>
        Popular Themes
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {/* Top by Collection */}
        <div>
          <h3 style={{
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: 'var(--space-2)',
          }}>
            Most Collected Themes
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#737373',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Theme
                  </th>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'right',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#737373',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {topThemesByCollection.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{
                      padding: '12px 8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#171717',
                    }}>
                      {item.theme}
                    </td>
                    <td style={{
                      padding: '12px 8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#171717',
                      textAlign: 'right',
                    }}>
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top by Wishlist */}
        <div>
          <h3 style={{
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: 'var(--space-2)',
          }}>
            Most Wishlisted Themes
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#737373',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Theme
                  </th>
                  <th style={{
                    padding: '12px 8px',
                    textAlign: 'right',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#737373',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {topThemesByWishlist.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{
                      padding: '12px 8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#171717',
                    }}>
                      {item.theme}
                    </td>
                    <td style={{
                      padding: '12px 8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#171717',
                      textAlign: 'right',
                    }}>
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';
import { formatCompactNumberSmart } from '@/lib/format-number';

function getTranslations(locale: string) {
  switch (locale) {
    case 'de': return translationsDe;
    case 'fr': return translationsFr;
    case 'es': return translationsEs;
    default: return translations;
  }
}

function detectLocale(): string {
  if (typeof window === 'undefined') return 'en';
  const host = window.location.hostname;
  if (host.startsWith('de.')) return 'de';
  if (host.startsWith('fr.')) return 'fr';
  if (host.startsWith('es.')) return 'es';
  return 'en';
}

interface LegoBox {
  box_no: string;
  name: string;
  category_name: string;
  year_released: string;
  weight: string;
  image_url: string;
}

export default function SetsDemoPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSets: 0,
    recentSets: 0,
    themes: [] as Array<{ theme: string; count: number }>
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LegoBox[]>([]);
  const [searching, setSearching] = useState(false);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const t = getTranslations(locale).setsDemo;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/boxes/demo-stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`/api/boxes/search?q=${encodeURIComponent(query)}&limit=12`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

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
          <div style={{ fontSize: '18px', color: '#525252' }}>{t.loadingText}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#171717'
          }}>
            🧱 {t.title}
          </h1>
          <p style={{ fontSize: '16px', color: '#737373', marginBottom: '32px' }}>
            {t.subtitle.replace('{count}', formatCompactNumberSmart(stats.totalSets))}
          </p>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                {formatCompactNumberSmart(stats.totalSets)}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>{t.totalSets}</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                {formatCompactNumberSmart(stats.recentSets)}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>{t.recentSets}</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                {stats.themes.length}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>{t.uniqueThemes}</div>
            </div>
          </div>

          {/* Search Bar */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '16px',
                border: '2px solid #e5e5e5',
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
            />
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              color: '#171717'
            }}>
              {t.searchResults.replace('{count}', searchResults.length.toString())}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {searchResults.map(box => (
                <div key={box.box_no} style={{
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Image
                      src={box.image_url}
                      alt={box.name}
                      width={200}
                      height={200}
                      style={{ objectFit: 'contain', maxHeight: '180px' }}
                    />
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#3b82f6',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {box.box_no}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#171717',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {box.name}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    background: '#f0f9ff',
                    color: '#0369a1',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    marginBottom: '4px'
                  }}>
                    {box.category_name.split('/')[0].trim()}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#737373',
                    marginTop: '8px'
                  }}>
                    {t.year}: {box.year_released} • {t.weight}: {box.weight}g
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searching && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '18px', color: '#737373' }}>{t.searching}</div>
          </div>
        )}

        {/* Popular Themes */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#171717'
          }}>
            🏆 {t.popularThemesTitle}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {stats.themes.slice(0, 10).map((theme, index) => (
              <div key={theme.theme} style={{
                padding: '16px',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => handleSearch(theme.theme)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#3b82f6',
                  marginBottom: '4px'
                }}>
                  {theme.count}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#171717'
                }}>
                  {theme.theme}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: '#ecfdf5',
          border: '1px solid #86efac',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', color: '#166534', fontWeight: '600', marginBottom: '8px' }}>
            ✅ {t.backendComplete}
          </div>
          <div style={{ fontSize: '14px', color: '#2563eb' }}>
            {t.backendStatus}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { RetirementPrediction } from '@/lib/retiring-soon-algorithm';
import RetirementYearSection from './RetirementYearSection';
import { groupByRetirementYear } from '@/lib/retirement-years';

interface Props {
  initialData: RetirementPrediction[];
  themes: string[];
  initialTheme: string;
  /**
   * Passed from the server rather than read from the clock here, so the SSR
   * render and hydration agree on which years count as overdue.
   */
  currentYear: number;
  translations: any;
}

export default function RetiringSoonClient({
  initialData,
  themes,
  initialTheme = 'all',
  currentYear,
  translations
}: Props) {
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [retiringSets, setRetiringSets] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter themes based on search query
  const filteredThemes = searchQuery
    ? themes.filter(theme =>
        theme.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : themes;

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const getDisplayTheme = () => {
    if (selectedTheme === 'all') {
      return translations?.filters?.allThemes || 'All Themes';
    }
    return selectedTheme;
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedTheme !== 'all') params.set('theme', selectedTheme);

    // Update URL
    const newUrl = params.toString() ? `/retiring-soon?${params.toString()}` : '/retiring-soon';
    router.push(newUrl, { scroll: false });

    // Fetch new data
    fetch(`/api/sets/retiring-soon?${params}`)
      .then(res => res.json())
      .then(data => {
        setRetiringSets(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedTheme, router]);

  return (
    <>
      {/* Filters section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <label style={{
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            color: '#171717'
          }}>
            {translations?.filters?.selectTheme || 'Theme'}:
          </label>

          {/* Searchable dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative', minWidth: '280px' }}>
            <div
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                if (!isDropdownOpen) {
                  setTimeout(() => inputRef.current?.focus(), 0);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 1rem',
                fontSize: 'var(--text-sm)',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ color: '#171717' }}>{getDisplayTheme()}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: 'transform 0.2s',
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                left: 0,
                right: 0,
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                maxHeight: '400px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Search input */}
                <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e5e5' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={translations?.filters?.searchThemes || 'Search themes...'}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      fontSize: 'var(--text-sm)',
                      // Matches every other search box on the site: same grey,
                      // same pill. This was #d4d4d4 at 6px -- the only place
                      // using either value.
                      border: '1px solid #e5e5e5',
                      borderRadius: '999px',
                      outline: 'none'
                    }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'}
                  />
                </div>

                {/* Options list */}
                <div style={{
                  overflowY: 'auto',
                  maxHeight: '320px'
                }}>
                  <div
                    onClick={() => handleThemeSelect('all')}
                    style={{
                      padding: '0.75rem 1rem',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      background: selectedTheme === 'all' ? '#f0f9ff' : '#ffffff',
                      color: selectedTheme === 'all' ? '#3b82f6' : '#171717',
                      fontWeight: selectedTheme === 'all' ? '600' : '400',
                      borderBottom: '1px solid #f5f5f5'
                    }}
                    onMouseEnter={e => {
                      if (selectedTheme !== 'all') {
                        e.currentTarget.style.background = '#fafafa';
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedTheme !== 'all') {
                        e.currentTarget.style.background = '#ffffff';
                      }
                    }}
                  >
                    {translations?.filters?.allThemes || 'All Themes'}
                  </div>

                  {filteredThemes.length === 0 ? (
                    <div style={{
                      padding: '2rem 1rem',
                      textAlign: 'center',
                      fontSize: 'var(--text-sm)',
                      color: '#737373'
                    }}>
                      {translations?.filters?.noThemesFound || 'No themes found'}
                    </div>
                  ) : (
                    filteredThemes.map(theme => (
                      <div
                        key={theme}
                        onClick={() => handleThemeSelect(theme)}
                        style={{
                          padding: '0.75rem 1rem',
                          fontSize: 'var(--text-sm)',
                          cursor: 'pointer',
                          background: selectedTheme === theme ? '#f0f9ff' : '#ffffff',
                          color: selectedTheme === theme ? '#3b82f6' : '#171717',
                          fontWeight: selectedTheme === theme ? '600' : '400',
                          borderBottom: '1px solid #f5f5f5'
                        }}
                        onMouseEnter={e => {
                          if (selectedTheme !== theme) {
                            e.currentTarget.style.background = '#fafafa';
                          }
                        }}
                        onMouseLeave={e => {
                          if (selectedTheme !== theme) {
                            e.currentTarget.style.background = '#ffffff';
                          }
                        }}
                      >
                        {theme}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#525252',
          margin: 0
        }}>
          {selectedTheme === 'all'
            ? (translations?.filters?.showingCount || 'Showing {count} sets retiring soon').replace('{count}', String(retiringSets.length))
            : (translations?.filters?.showingCountInTheme || 'Showing {count} sets retiring soon in {theme}')
              .replace('{count}', String(retiringSets.length))
              .replace('{theme}', selectedTheme)
          }
        </p>
      </div>

      {/* Set grid or empty state */}
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4rem',
          color: '#525252'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e5e5',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : retiringSets.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: '#fafafa',
          borderRadius: '12px'
        }}>
          <p style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '0.5rem'
          }}>
            {translations?.empty?.noSets || 'No retiring sets found'}
          </p>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373'
          }}>
            {translations?.empty?.tryDifferentFilter || 'Try selecting a different theme or timeline'}
          </p>
        </div>
      ) : (
        <div>
          {groupByRetirementYear(retiringSets, currentYear).map(group => (
            <RetirementYearSection
              key={group.key}
              group={group}
              translations={translations}
            />
          ))}
        </div>
      )}
    </>
  );
}

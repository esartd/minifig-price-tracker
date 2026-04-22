'use client';

import { useState, useEffect } from 'react';
import { CollectionItem } from '@/types';
import ThemeFilters from './ThemeFilters';
import MinifigCard from './MinifigCard';

interface SearchResultsProps {
  searchResults: any[];
  searchResult: any | null;
  onSelectMinifig: (minifig: any) => void;
  onAddToCollection: (item: CollectionItem) => void;
  onCancelSelection: () => void;
  onClearSearch: () => void;
}

export default function SearchResults({
  searchResults,
  searchResult,
  onSelectMinifig,
  onAddToCollection,
  onCancelSelection,
  onClearSearch,
}: SearchResultsProps) {
  const [selectedThemes, setSelectedThemes] = useState<Set<string>>(new Set());
  const [pricing, setPricing] = useState<Record<string, { suggestedPrice: number; loading: boolean }>>({});
  const [activeTab, setActiveTab] = useState<'minifigs' | 'sets' | null>(null);
  const [displayCount, setDisplayCount] = useState(50);
  const [minifigDisplayCount, setMinifigDisplayCount] = useState(5);
  const [setsDisplayCount, setSetsDisplayCount] = useState(5);

  const RESULTS_PER_PAGE = 50;
  const PREVIEW_LIMIT = 5;

  // Separate minifigs and sets
  const allMinifigs = searchResults.filter(item => item.resultType !== 'set');
  const allSets = searchResults.filter(item => item.resultType === 'set');

  // Sort by year (newest first) - apply to both groups
  const sortByYear = (items: any[]) => {
    return [...items].sort((a, b) => {
      const yearA = parseInt(a.year_released || '0');
      const yearB = parseInt(b.year_released || '0');
      return yearB - yearA; // Descending (newest first)
    });
  };

  const minifigs = sortByYear(allMinifigs);
  const sets = sortByYear(allSets);

  // Determine which results to show based on active tab (for theme filtering)
  const displayedResults = activeTab === 'minifigs' ? minifigs : activeTab === 'sets' ? sets : searchResults;

  // Extract parent theme from category_name (e.g., "Star Wars / Episode 1" → "Star Wars")
  const getTheme = (minifig: any): string => {
    if (minifig.category_name) {
      const parts = minifig.category_name.split(' / ');
      return parts[0]; // Return parent theme
    }
    return 'Other';
  };

  // Group results by theme (only for displayed results)
  const themeGroups = displayedResults.reduce((acc, minifig) => {
    const theme = getTheme(minifig);
    if (!acc[theme]) {
      acc[theme] = { count: 0, items: [] };
    }
    acc[theme].count++;
    acc[theme].items.push(minifig);
    return acc;
  }, {} as Record<string, { count: number; items: any[] }>);

  const themes = Object.keys(themeGroups).sort((a, b) =>
    themeGroups[b].count - themeGroups[a].count
  );

  const toggleTheme = (theme: string) => {
    const newSelected = new Set(selectedThemes);
    if (newSelected.has(theme)) {
      newSelected.delete(theme);
    } else {
      newSelected.add(theme);
    }
    setSelectedThemes(newSelected);
  };

  const toggleAllThemes = () => {
    if (selectedThemes.size === themes.length) {
      setSelectedThemes(new Set());
    } else {
      setSelectedThemes(new Set(themes));
    }
  };

  const filteredResults = selectedThemes.size === 0
    ? displayedResults
    : displayedResults.filter(minifig => selectedThemes.has(getTheme(minifig)));

  // Sort by year (newest first)
  const sortedResults = [...filteredResults].sort((a, b) => {
    const yearA = parseInt(a.year_released || '0');
    const yearB = parseInt(b.year_released || '0');
    return yearB - yearA; // Descending (newest first)
  });

  // Debug log first 10 results after sort
  console.log('=== SEARCH RESULTS SORT DEBUG ===');
  sortedResults.slice(0, 10).forEach((r, i) => {
    console.log(`${i + 1}. Year: ${r.year_released} | ${r.minifigure_no || r.box_no} | ${r.name?.substring(0, 40)}`);
  });

  // Paginate results
  const paginatedResults = sortedResults.slice(0, displayCount);
  const hasMore = sortedResults.length > displayCount;

  // Reset display counts when search results change
  useEffect(() => {
    setDisplayCount(RESULTS_PER_PAGE);
    setMinifigDisplayCount(PREVIEW_LIMIT);
    setSetsDisplayCount(PREVIEW_LIMIT);
    setActiveTab(null);
  }, [searchResults]);

  // Reset display count when tab changes or filters change
  useEffect(() => {
    setDisplayCount(RESULTS_PER_PAGE);
  }, [activeTab, selectedThemes]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + RESULTS_PER_PAGE);
  };

  // Pricing disabled for search results - only fetch when adding to collection

  // Fetch pricing for single result
  useEffect(() => {
    if (!searchResult) return;

    const abortController = new AbortController();

    const fetchSinglePricing = async () => {
      setPricing(prev => ({
        ...prev,
        [searchResult.no]: { suggestedPrice: 0, loading: true }
      }));

      try {
        const response = await fetch(
          `/api/inventory/temp-pricing?itemNo=${searchResult.no}&condition=new`,
          { signal: abortController.signal }
        );

        const data = await response.json();

        if (data.success && data.pricing) {
          setPricing(prev => ({
            ...prev,
            [searchResult.no]: {
              suggestedPrice: data.pricing.suggestedPrice,
              loading: false
            }
          }));
        } else {
          setPricing(prev => ({
            ...prev,
            [searchResult.no]: { suggestedPrice: 0, loading: false }
          }));
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setPricing(prev => ({
            ...prev,
            [searchResult.no]: { suggestedPrice: 0, loading: false }
          }));
        }
      }
    };

    fetchSinglePricing();

    return () => {
      abortController.abort();
    };
  }, [searchResult]);

  if (!searchResults.length && !searchResult) {
    return null;
  }

  return (
    <div className="search-results-container" style={{
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      padding: '24px 16px',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <div className="search-results-header" style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: '600',
          color: '#171717',
          letterSpacing: '-0.01em',
          marginBottom: '16px'
        }}>
          Search Results
        </h2>

        {/* Tabs - Only show when viewing a specific type */}
        {searchResults.length > 0 && activeTab && (
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => setActiveTab(null)}
              style={{
                padding: '8px 16px',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: '#737373',
                background: 'transparent',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              ← Back to all results
            </button>
          </div>
        )}
      </div>

      {/* Multiple Results List */}
      {searchResults.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {/* Show grouped results by default (no active tab) */}
          {!activeTab ? (
            <>
              {/* Minifigures Group */}
              {minifigs.length > 0 && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      color: '#171717',
                      letterSpacing: '-0.01em'
                    }}>
                      Minifigures ({minifigs.length})
                    </h3>
                    {minifigs.length > PREVIEW_LIMIT && (
                      <button
                        onClick={() => setActiveTab('minifigs')}
                        style={{
                          padding: '8px 16px',
                          fontSize: 'var(--text-sm)',
                          fontWeight: '600',
                          color: '#3b82f6',
                          background: '#eff6ff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#dbeafe';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                        }}
                      >
                        See All →
                      </button>
                    )}
                  </div>
                  <div className="search-results-list" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}>
                    {minifigs.slice(0, minifigDisplayCount).map((minifig, index) => (
                      <MinifigCard
                        key={minifig.minifigure_no || minifig.no || index}
                        minifig={minifig}
                      />
                    ))}
                  </div>
                  {/* Load More Button for Minifigs */}
                  {minifigs.length > minifigDisplayCount && minifigDisplayCount < 50 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                      <button
                        onClick={() => setMinifigDisplayCount(prev => Math.min(prev + PREVIEW_LIMIT, minifigs.length))}
                        style={{
                          padding: '10px 24px',
                          fontSize: 'var(--text-sm)',
                          fontWeight: '600',
                          color: '#3b82f6',
                          background: '#ffffff',
                          border: '1px solid #3b82f6',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ffffff';
                        }}
                      >
                        Show More ({Math.min(minifigs.length - minifigDisplayCount, PREVIEW_LIMIT)} more)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Sets Group */}
              {sets.length > 0 && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      color: '#171717',
                      letterSpacing: '-0.01em'
                    }}>
                      Sets ({sets.length})
                    </h3>
                    {sets.length > PREVIEW_LIMIT && (
                      <button
                        onClick={() => setActiveTab('sets')}
                        style={{
                          padding: '8px 16px',
                          fontSize: 'var(--text-sm)',
                          fontWeight: '600',
                          color: '#3b82f6',
                          background: '#eff6ff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#dbeafe';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                        }}
                      >
                        See All →
                      </button>
                    )}
                  </div>
                  <div className="search-results-list" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}>
                    {sets.slice(0, setsDisplayCount).map((set, index) => (
                      <MinifigCard
                        key={set.box_no || index}
                        minifig={set}
                      />
                    ))}
                  </div>
                  {/* Load More Button for Sets */}
                  {sets.length > setsDisplayCount && setsDisplayCount < 50 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                      <button
                        onClick={() => setSetsDisplayCount(prev => Math.min(prev + PREVIEW_LIMIT, sets.length))}
                        style={{
                          padding: '10px 24px',
                          fontSize: 'var(--text-sm)',
                          fontWeight: '600',
                          color: '#3b82f6',
                          background: '#ffffff',
                          border: '1px solid #3b82f6',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ffffff';
                        }}
                      >
                        Show More ({Math.min(sets.length - setsDisplayCount, PREVIEW_LIMIT)} more)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Show filtered results when a tab is selected */
            <>
              <ThemeFilters
                themes={themes}
                themeCounts={themeGroups}
                selectedThemes={selectedThemes}
                onToggleTheme={toggleTheme}
                onToggleAll={toggleAllThemes}
              />

              <p className="search-results-count" style={{
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: '#737373',
                marginBottom: '8px'
              }}>
                Showing {paginatedResults.length} of {sortedResults.length} result{sortedResults.length !== 1 ? 's' : ''}
                {selectedThemes.size > 0 && ` (${displayedResults.length} total)`}
              </p>

              <div className="search-results-list" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}>
                {paginatedResults.map((minifig, index) => (
                  <MinifigCard
                    key={minifig.minifigure_no || minifig.box_no || index}
                    minifig={minifig}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                  <button
                    onClick={handleLoadMore}
                    style={{
                      padding: '12px 32px',
                      fontSize: 'var(--text-base)',
                      fontWeight: '600',
                      color: '#ffffff',
                      background: '#3b82f6',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#2563eb';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    Load More ({sortedResults.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Single Result Card */}
      {searchResult && searchResults.length === 0 && (
        <MinifigCard
          minifig={searchResult}
        />
      )}
    </div>
  );
}

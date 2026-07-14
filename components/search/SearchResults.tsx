'use client';

import { useState, useEffect, useMemo } from 'react';
import { CollectionItem } from '@/types';
import ThemeFilters from './ThemeFilters';
import MinifigCard from './MinifigCard';
import { useTranslation } from '@/components/TranslationProvider';

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
  const { translations, t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [pricing, setPricing] = useState<Record<string, { suggestedPrice: number; loading: boolean }>>({});
  const [activeTab, setActiveTab] = useState<'minifigs' | 'sets' | null>(null);
  const [displayCount, setDisplayCount] = useState(50);

  const minifiguresLabel = translations?.navigation?.minifigures || 'Minifigures';
  const setsLabel = translations?.navigation?.sets || 'Sets';
  const allLabel = translations?.search?.all || 'All';
  const seeAllMinifiguresLabel = translations?.search?.seeAllMinifigures || 'See All Minifigures →';

  const RESULTS_PER_PAGE = 50;
  const PREVIEW_LIMIT = 5;

  // Separate and sort minifigs and sets using useMemo for stable references
  const minifigs = useMemo(() => {
    const allMinifigs = searchResults.filter(item => item.resultType !== 'set');
    return [...allMinifigs].sort((a, b) => {
      const yearA = parseInt(a.year_released || '0');
      const yearB = parseInt(b.year_released || '0');
      return yearB - yearA; // Descending (newest first)
    });
  }, [searchResults]);

  const sets = useMemo(() => {
    const allSets = searchResults.filter(item => item.resultType === 'set');
    return [...allSets].sort((a, b) => {
      const yearA = parseInt(a.year_released || '0');
      const yearB = parseInt(b.year_released || '0');
      return yearB - yearA; // Descending (newest first)
    });
  }, [searchResults]);

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

  const selectTheme = (theme: string | null) => {
    setSelectedTheme(theme);
  };

  const filteredResults = selectedTheme === null
    ? displayedResults
    : displayedResults.filter(minifig => getTheme(minifig) === selectedTheme);

  // Sort by year (newest first)
  const sortedResults = [...filteredResults].sort((a, b) => {
    const yearA = parseInt(a.year_released || '0');
    const yearB = parseInt(b.year_released || '0');
    return yearB - yearA; // Descending (newest first)
  });

  // Paginate results
  const paginatedResults = sortedResults.slice(0, displayCount);
  const hasMore = sortedResults.length > displayCount;

  // Reset to grouped view when search results change
  useEffect(() => {
    setActiveTab(null);
    setDisplayCount(RESULTS_PER_PAGE);
  }, [searchResults]);

  // Reset display count when tab changes or filters change
  useEffect(() => {
    setDisplayCount(RESULTS_PER_PAGE);
  }, [activeTab, selectedTheme]);

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
          {t('search.searchResults')}
        </h2>

        {/* Tabs */}
        {searchResults.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '2px solid #e5e5e5',
            paddingBottom: '0'
          }}>
            <button
              onClick={() => setActiveTab(null)}
              style={{
                padding: '12px 20px',
                fontSize: 'var(--text-sm)',
                fontWeight: '600',
                color: activeTab === null ? '#3b82f6' : '#737373',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === null ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-2px'
              }}
            >
              {allLabel} ({minifigs.length + sets.length})
            </button>
            {minifigs.length > 0 && (
              <button
                onClick={() => setActiveTab('minifigs')}
                style={{
                  padding: '12px 20px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: activeTab === 'minifigs' ? '#3b82f6' : '#737373',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'minifigs' ? '2px solid #3b82f6' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '-2px'
                }}
              >
                {minifiguresLabel} ({minifigs.length})
              </button>
            )}
            {sets.length > 0 && (
              <button
                onClick={() => setActiveTab('sets')}
                style={{
                  padding: '12px 20px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: activeTab === 'sets' ? '#3b82f6' : '#737373',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'sets' ? '2px solid #3b82f6' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '-2px'
                }}
              >
                {setsLabel} ({sets.length})
              </button>
            )}
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
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: '#171717',
                    letterSpacing: '-0.01em',
                    marginBottom: '16px'
                  }}>
                    {minifiguresLabel} ({minifigs.length})
                  </h3>
                  <div className="search-results-list" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}>
                    {minifigs.slice(0, PREVIEW_LIMIT).map((minifig, index) => (
                      <MinifigCard
                        key={minifig.minifigure_no || minifig.no || index}
                        minifig={minifig}
                      />
                    ))}
                  </div>
                  {minifigs.length > PREVIEW_LIMIT && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '24px'
                    }}>
                      <button
                        onClick={() => setActiveTab('minifigs')}
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
                        {seeAllMinifiguresLabel}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Sets Group */}
              {sets.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: '#171717',
                    letterSpacing: '-0.01em',
                    marginBottom: '16px'
                  }}>
                    {setsLabel} ({sets.length})
                  </h3>
                  <div className="search-results-list" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}>
                    {sets.slice(0, PREVIEW_LIMIT).map((set, index) => (
                      <MinifigCard
                        key={set.box_no || index}
                        minifig={set}
                      />
                    ))}
                  </div>
                  {sets.length > PREVIEW_LIMIT && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '24px'
                    }}>
                      <button
                        onClick={() => setActiveTab('sets')}
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
                        {t('search.seeAllSets')}
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
                selectedTheme={selectedTheme}
                onSelectTheme={selectTheme}
              />

              <p className="search-results-count" style={{
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                color: '#737373',
                marginBottom: '8px'
              }}>
                {sortedResults.length === 1
                  ? t('search.showing', { shown: String(paginatedResults.length), total: String(sortedResults.length) })
                  : t('search.showingPlural', { shown: String(paginatedResults.length), total: String(sortedResults.length) })}
                {selectedTheme && ` (${displayedResults.length} total)`}
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
                    {t('search.loadMore', { remaining: String(sortedResults.length - displayCount) })}
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

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
  const [activeTab, setActiveTab] = useState<'all' | 'minifigs' | 'sets'>('all');

  // Separate minifigs and sets
  const minifigs = searchResults.filter(item => item.resultType !== 'set');
  const sets = searchResults.filter(item => item.resultType === 'set');

  // Determine which results to show based on active tab
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

        {/* Tabs */}
        {searchResults.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '2px solid #e5e5e5',
            paddingBottom: '0'
          }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '12px 20px',
                fontSize: 'var(--text-sm)',
                fontWeight: '600',
                color: activeTab === 'all' ? '#3b82f6' : '#737373',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'all' ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-2px'
              }}
            >
              All ({searchResults.length})
            </button>
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
              Minifigures ({minifigs.length})
            </button>
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
              Sets ({sets.length})
            </button>
          </div>
        )}
      </div>

      {/* Multiple Results List */}
      {searchResults.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
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
            {sortedResults.length} result{sortedResults.length !== 1 ? 's' : ''} shown
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
            {sortedResults.map((minifig, index) => (
              <MinifigCard
                key={index}
                minifig={minifig}
              />
            ))}
          </div>
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

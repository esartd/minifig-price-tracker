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

  // Extract theme from minifig number
  const getTheme = (no: string): string => {
    const match = no.match(/^[a-z]+/i);
    return match ? match[0].toLowerCase() : 'other';
  };

  // Group results by theme
  const themeGroups = searchResults.reduce((acc, minifig) => {
    const theme = getTheme(minifig.no);
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
    ? searchResults
    : searchResults.filter(minifig => selectedThemes.has(getTheme(minifig.no)));

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
          `/api/collection/temp-pricing?itemNo=${searchResult.no}&condition=new`,
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
      <div className="search-results-header" style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#171717',
          letterSpacing: '-0.01em'
        }}>
          Search Results
        </h2>
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
            fontSize: '15px',
            fontWeight: '500',
            color: '#737373',
            marginBottom: '8px'
          }}>
            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} shown
            {selectedThemes.size > 0 && ` (${searchResults.length} total)`}
          </p>

          <div className="search-results-list" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            {filteredResults.map((minifig, index) => (
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

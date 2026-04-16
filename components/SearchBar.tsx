'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearchResults: (results: any[]) => void;
  onSearchResult: (result: any | null) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export default function SearchBar({ onSearchResults, onSearchResult, searchQuery, onSearchQueryChange }: SearchBarProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  // Clear messages when search query is cleared externally (back to collection)
  useEffect(() => {
    if (!searchQuery) {
      setError('');
      setSuccess('');
    }
  }, [searchQuery]);

  const handleSearch = async (searchTerm?: string) => {
    const term = searchTerm || searchQuery.trim();

    if (!term) {
      setError('Enter a search term');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    onSearchResult(null);
    onSearchResults([]);

    try {
      const response = await fetch(`/api/minifigs/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        // If only 1 result, skip selection and go directly to Add to Collection form
        if (data.data.length === 1) {
          onSearchResult(data.data[0]);
          onSearchResults([]);
        } else {
          // Multiple results - show selection list
          onSearchResults(data.data);
          setSuccess(`Found ${data.data.length} variations`);
        }
      } else {
        setError(data.error || 'Not found. Try different search terms.');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    onSearchQueryChange('');
    onSearchResult(null);
    onSearchResults([]);
    setError('');
    setSuccess('');
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Search Input Container - Google Style */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        height: '48px',
        padding: '0 16px',
        backgroundColor: '#ffffff',
        border: '1px solid #dfe1e5',
        borderRadius: '24px',
        boxSizing: 'border-box',
        boxShadow: 'none',
        transition: 'box-shadow 200ms',
        opacity: loading ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 6px rgba(32,33,36,.28)';
      }}
      onMouseLeave={(e) => {
        if (document.activeElement !== e.currentTarget.querySelector('input')) {
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 6px rgba(32,33,36,.28)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        {/* Search Icon - Fixed 20px */}
        <svg style={{ width: '20px', height: '20px', flexShrink: 0, color: '#9aa0a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Input - Fills remaining space */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for any LEGO minifigure..."
          disabled={loading}
          autoComplete="off"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 'var(--text-base)',
            fontWeight: '400',
            color: '#202124',
            backgroundColor: 'transparent',
            padding: 0
          }}
        />

        {/* Clear button (X) - Google Style */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="search-clear-btn"
            style={{
              width: '20px',
              height: '20px',
              minWidth: '20px',
              minHeight: '20px',
              flexShrink: 0,
              borderRadius: '50%',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f3f4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#70757a"/>
            </svg>
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div style={{
          marginTop: '16px',
          padding: '16px 20px',
          backgroundColor: '#f0fdf4',
          borderRadius: '12px',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          color: '#15803d',
          textAlign: 'center',
          border: '1px solid #bbf7d0'
        }}>
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '16px 20px',
          backgroundColor: '#fee2e2',
          borderRadius: '12px',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          color: '#991b1b',
          textAlign: 'center',
          border: '1px solid #fca5a5'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

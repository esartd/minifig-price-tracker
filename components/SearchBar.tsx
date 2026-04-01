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
    setShowSuggestions(false);
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
    <div style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
      {/* Search Input Container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        height: '64px',
        padding: '0 24px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        boxSizing: 'border-box',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        transition: 'all 0.3s cubic-bezier(0.14, 1, 0.34, 1)',
        opacity: loading ? 0.7 : 1
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 92, 151, 0.3)';
        e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 92, 151, 0.2), 0 0 0 3px rgba(0, 92, 151, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      >
        {/* Search Icon - Fixed 24px */}
        <svg style={{ width: '24px', height: '24px', flexShrink: 0, color: '#005C97' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
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
            fontSize: '17px',
            fontWeight: '500',
            color: '#171717',
            backgroundColor: 'transparent',
            padding: 0
          }}
        />

        {/* Clear button (X) - Fixed 20px */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="search-clear-btn"
            style={{
              width: '24px',
              height: '24px',
              flexShrink: 0,
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 92, 151, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 92, 151, 0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 92, 151, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8 2L2 8M2 2L8 8" stroke="#005C97" strokeWidth="2" strokeLinecap="round" />
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
          fontSize: '14px',
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
          fontSize: '14px',
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

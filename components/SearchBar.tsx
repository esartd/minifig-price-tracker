'use client';

import { useState } from 'react';

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

  const handleSearch = async (searchTerm?: string) => {
    const term = searchTerm || searchQuery.trim();

    if (!term) {
      setError('Please enter a search term');
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
          setSuccess(`Found ${data.data.length} variations - Select one to add to collection`);
        }
      } else {
        setError(data.error || 'Minifigure not found. Try different spelling or use item number.');
      }
    } catch (err) {
      setError('Failed to search minifigures. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-4">
      {/* Smart Search Input */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by Bricklink number (e.g., sw0002, sw1219)..."
          disabled={loading}
          style={{ height: '44px', minHeight: '44px', fontSize: '16px', paddingLeft: '44px', paddingRight: '16px', boxSizing: 'border-box' }}
          className="w-full bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3] transition-all placeholder:text-gray-400 shadow-sm"
        />

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#0071e3] rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm flex items-center gap-2">
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

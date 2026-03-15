'use client';

import { useState } from 'react';
import { CollectionItem } from '@/types';

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<'new' | 'used'>('new');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddToCollection = async (minifig: any) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minifigure_no: minifig.no,
          minifigure_name: minifig.name,
          quantity,
          condition,
          image_url: minifig.image_url,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onAddToCollection(data.data);
        setExpandedId(null);
        setQuantity(1);
        setCondition('new');
      } else {
        setError(data.error || 'Failed to add item to collection');
      }
    } catch (err) {
      setError('Failed to add item to collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (minifig: any) => {
    if (expandedId === minifig.no) {
      // Collapse
      setExpandedId(null);
      setQuantity(1);
      setCondition('new');
      setError('');
    } else {
      // Expand
      setExpandedId(minifig.no);
      setQuantity(1);
      setCondition('new');
      setError('');
    }
  };

  if (!searchResults.length && !searchResult) {
    return null;
  }

  return (
    <div className="apple-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight" style={{ margin: 0 }}>
          Search Results
        </h2>
        <button
          onClick={onClearSearch}
          className="font-medium transition-all"
          style={{
            padding: '14px 24px',
            minHeight: '52px',
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '26px',
            color: '#374151',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
          }}
        >
          ✕ Back to Collection
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm" style={{ marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Search Results List */}
      {searchResults.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 className="font-medium text-sm text-gray-600" style={{ paddingLeft: '4px', marginBottom: '8px' }}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found - Select one to add
          </h3>
          {searchResults.map((minifig, index) => {
            const isExpanded = expandedId === minifig.no;
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                {/* List Item - Click to expand */}
                <div
                  onClick={() => handleToggleExpand(minifig)}
                  className="bg-white cursor-pointer transition-all overflow-hidden flex shadow-sm hover:shadow-md"
                  style={{
                    borderRadius: isExpanded ? '20px 20px 0 0' : '20px',
                    borderBottom: isExpanded ? 'none' : undefined
                  }}
                >
                  {/* Image Section */}
                  <div className="flex-shrink-0 overflow-hidden bg-white flex items-center justify-center" style={{
                    width: '80px',
                    height: '120px',
                    borderTopLeftRadius: '20px',
                    borderBottomLeftRadius: isExpanded ? '0' : '20px'
                  }}>
                    {minifig.image_url ? (
                      <img
                        src={minifig.image_url}
                        alt={minifig.name}
                        style={{ height: '120px', width: 'auto', maxWidth: 'none' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">🧱</span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex items-center" style={{ paddingTop: '24px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px', minWidth: 0 }}>
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <h4 className="font-semibold text-sm text-gray-900 tracking-tight" style={{
                        marginBottom: '8px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {minifig.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-mono">{minifig.no}</p>
                    </div>
                    <div style={{ marginLeft: '16px', color: isExpanded ? '#0071e3' : '#9ca3af' }}>
                      {isExpanded ? '▲' : '▼'}
                    </div>
                  </div>
                </div>

                {/* Expanded Form - Shows inline */}
                {isExpanded && (
                  <div
                    className="bg-white shadow-sm"
                    style={{
                      borderRadius: '0 0 20px 20px',
                      padding: '24px',
                      borderTop: '1px solid #e5e7eb'
                    }}
                  >
                    <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700" style={{ marginBottom: '8px' }}>
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full transition-all"
                          style={{
                            padding: '14px 16px',
                            height: '52px',
                            minHeight: '52px',
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: '26px',
                            fontSize: '16px',
                            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.8)',
                            outline: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'textfield',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700" style={{ marginBottom: '8px' }}>
                          Condition
                        </label>
                        <select
                          value={condition}
                          onChange={(e) => setCondition(e.target.value as 'new' | 'used')}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full appearance-none cursor-pointer transition-all"
                          style={{
                            padding: '14px 16px',
                            height: '52px',
                            minHeight: '52px',
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                            borderRadius: '26px',
                            fontSize: '16px',
                            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.8)',
                            outline: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                            backgroundPosition: 'right 1rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '3rem',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="new">New</option>
                          <option value="used">Used</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCollection(minifig);
                      }}
                      disabled={loading}
                      className="w-full font-medium transition-all"
                      style={{
                        padding: '14px 32px',
                        minHeight: '52px',
                        background: loading ? 'rgba(209, 213, 219, 0.8)' : 'linear-gradient(135deg, rgba(0, 122, 255, 0.95) 0%, rgba(0, 113, 227, 0.95) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '26px',
                        color: '#ffffff',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? 'Adding...' : 'Add to Collection'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Minifig - Add to Collection Form (only for single result flow) */}
      {searchResult && searchResults.length === 0 && (
        <div
          className="overflow-hidden flex"
          style={{
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          }}
        >
          {/* Image Section */}
          <div
            className="flex-shrink-0 overflow-hidden flex items-center justify-center"
            style={{
              width: '120px',
              height: '180px',
              background: 'rgba(245, 245, 247, 0.5)'
            }}
          >
            {searchResult.image_url ? (
              <img
                src={searchResult.image_url}
                alt={searchResult.name}
                style={{ height: '180px', width: 'auto', maxWidth: 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">🧱</span>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="flex-1" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.3)' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 className="font-semibold text-base text-gray-900 tracking-tight" style={{ marginBottom: '4px' }}>
                {searchResult.name}
              </h3>
              <p className="text-xs text-gray-500 font-mono">{searchResult.no}</p>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '16px', marginBottom: '20px' }}>
              <div style={{ flex: '1 1 0', minWidth: 0 }}>
                <label className="block text-xs font-semibold text-gray-700" style={{ marginBottom: '8px' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full transition-all"
                  style={{
                    padding: '14px 16px',
                    height: '52px',
                    minHeight: '52px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '26px',
                    fontSize: '16px',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.8)',
                    outline: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ flex: '1 1 0', minWidth: 0 }}>
                <label className="block text-xs font-semibold text-gray-700" style={{ marginBottom: '8px' }}>
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as 'new' | 'used')}
                  className="w-full appearance-none cursor-pointer transition-all"
                  style={{
                    padding: '14px 16px',
                    height: '52px',
                    minHeight: '52px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '26px',
                    fontSize: '16px',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.8)',
                    outline: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '3rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>

            <button
                onClick={() => handleAddToCollection(searchResult)}
                disabled={loading}
                className="w-full font-medium transition-all"
                style={{
                  padding: '14px 32px',
                  minHeight: '52px',
                  background: loading ? 'rgba(209, 213, 219, 0.8)' : 'linear-gradient(135deg, rgba(0, 122, 255, 0.95) 0%, rgba(0, 113, 227, 0.95) 100%)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '26px',
                  color: '#ffffff',
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(0, 113, 227, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 122, 255, 1) 0%, rgba(0, 119, 237, 1) 100%)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 113, 227, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 122, 255, 0.95) 0%, rgba(0, 113, 227, 0.95) 100%)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 113, 227, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  }
                }}
              >
                {loading ? 'Adding...' : 'Add to Collection'}
              </button>
          </div>
        </div>
      )}
    </div>
  );
}

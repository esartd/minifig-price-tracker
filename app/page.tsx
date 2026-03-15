'use client';

import { useState, useEffect } from 'react';
import { CollectionItem } from '@/types';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import CollectionList from '@/components/CollectionList';

export default function Home() {
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState({ current: 0, total: 0, itemName: '' });
  const [sortOrder, setSortOrder] = useState<'default' | 'price-high' | 'price-low' | 'id'>('price-high');
  const [showDecimals, setShowDecimals] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const initializeCollection = async () => {
      await loadCollection();
      // Auto-refresh pricing after initial load
      if (!refreshing) {
        handleRefreshPricing();
      }
    };
    initializeCollection();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCollection = async () => {
    try {
      const response = await fetch('/api/collection');
      const data = await response.json();
      if (data.success) {
        setCollection(data.data);
      }
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = (newItem: CollectionItem) => {
    setCollection([...collection, newItem]);
    setSelectedItem(newItem);
    setSearchResults([]);
    setSearchResult(null);
    setSearchQuery('');
  };

  const handleSelectMinifig = (minifig: any) => {
    setSearchResult(minifig);
    setSearchResults([]);
  };

  const handleCancelSelection = () => {
    setSearchResult(null);
    // Keep searchResults so we can go back to them
  };

  const handleClearSearch = () => {
    setSearchResult(null);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleItemDeleted = async (id: string) => {
    try {
      const response = await fetch(`/api/collection/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCollection(collection.filter((item) => item.id !== id));
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleItemUpdated = async (id: string, updates: Partial<CollectionItem>) => {
    try {
      const response = await fetch(`/api/collection/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        setCollection(
          collection.map((item) => (item.id === id ? data.data : item))
        );
        if (selectedItem?.id === id) {
          setSelectedItem(data.data);
        }
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleRefreshPricing = async () => {
    setRefreshing(true);
    const items = collection;

    setRefreshProgress({ current: 0, total: items.length, itemName: '' });

    try {
      // Refresh items one at a time from the frontend
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Update progress
        setRefreshProgress({
          current: i + 1,
          total: items.length,
          itemName: item.minifigure_name,
        });

        // Add delay before each request (except first) - 8-12 seconds
        if (i > 0) {
          const delay = 8000 + Math.random() * 4000; // Random 8-12 seconds
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        try {
          // Refresh single item
          const response = await fetch(`/api/collection/${item.id}/refresh-pricing`, {
            method: 'POST',
          });

          const data = await response.json();

          if (data.success) {
            // Update this item in the collection
            setCollection((prevCollection) =>
              prevCollection.map((collectionItem) =>
                collectionItem.id === item.id ? data.data : collectionItem
              )
            );

            // Update selected item if it's the one being refreshed
            if (selectedItem?.id === item.id) {
              setSelectedItem(data.data);
            }
          }
        } catch (error) {
          console.error(`Error refreshing ${item.minifigure_name}:`, error);
        }
      }
    } catch (error) {
      console.error('Error refreshing pricing:', error);
    } finally {
      setRefreshing(false);
      setRefreshProgress({ current: 0, total: 0, itemName: '' });
    }
  };

  // Sort collection based on selected order
  const getSortedCollection = () => {
    const sorted = [...collection];

    if (sortOrder === 'price-high') {
      return sorted.sort((a, b) => {
        const priceA = a.pricing?.suggestedPrice || 0;
        const priceB = b.pricing?.suggestedPrice || 0;
        return priceB - priceA; // High to low
      });
    } else if (sortOrder === 'price-low') {
      return sorted.sort((a, b) => {
        const priceA = a.pricing?.suggestedPrice || 0;
        const priceB = b.pricing?.suggestedPrice || 0;
        return priceA - priceB; // Low to high
      });
    } else if (sortOrder === 'id') {
      return sorted.sort((a, b) => {
        return a.minifigure_no.localeCompare(b.minifigure_no);
      });
    }

    return sorted; // Default order
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header with Title and Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '32px',
        paddingLeft: '24px',
        paddingRight: '24px'
      }}>
        <h1
          onClick={handleClearSearch}
          className="text-2xl font-semibold text-gray-900 tracking-tight"
          style={{
            margin: 0,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          Minifig Price Tracker
        </h1>
        <div style={{ flex: '1', maxWidth: '600px' }}>
          <SearchBar
            onSearchResults={setSearchResults}
            onSearchResult={setSearchResult}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Search Results Section */}
      {(searchResults.length > 0 || searchResult) && (
        <SearchResults
          searchResults={searchResults}
          searchResult={searchResult}
          onSelectMinifig={handleSelectMinifig}
          onAddToCollection={handleItemAdded}
          onCancelSelection={handleCancelSelection}
          onClearSearch={handleClearSearch}
        />
      )}

      {/* Collection Summary */}
      {collection.length > 0 && (
        <div className="apple-card" style={{
          background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.05) 0%, rgba(0, 113, 227, 0.02) 100%)',
          borderColor: 'rgba(0, 113, 227, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>
                Total Collection Value
              </div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#0071e3', letterSpacing: '-0.02em' }}>
                ${collection.reduce((sum, item) => sum + ((item.pricing?.suggestedPrice || 0) * item.quantity), 0).toFixed(2)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>
                  Total Items
                </div>
                <div style={{ fontSize: '28px', fontWeight: 600, color: '#374151' }}>
                  {collection.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>
                  Unique Figures
                </div>
                <div style={{ fontSize: '28px', fontWeight: 600, color: '#374151' }}>
                  {collection.length}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>
                  Avg. Value
                </div>
                <div style={{ fontSize: '28px', fontWeight: 600, color: '#374151' }}>
                  ${collection.length > 0 ? (collection.reduce((sum, item) => sum + (item.pricing?.suggestedPrice || 0), 0) / collection.length).toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collection Section */}
      <div className="apple-card">
        <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight" style={{ margin: 0 }}>
            My Collection <span className="text-gray-400 font-normal">({collection.length})</span>
          </h2>
          {collection.length > 0 && (
            <div className="flex items-center" style={{ gap: '12px' }}>
              <button
                onClick={() => setShowDecimals(!showDecimals)}
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
                {showDecimals ? 'Hide Decimals' : 'Show Decimals'}
              </button>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'default' | 'price-high' | 'price-low' | 'id')}
                className="appearance-none cursor-pointer transition-all"
                style={{
                  padding: '14px 20px',
                  minHeight: '52px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '26px',
                  color: '#374151',
                  fontSize: '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  outline: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '3rem'
                }}
              >
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="id">Bricklink ID</option>
              </select>
            </div>
          )}
        </div>
        {refreshing && (
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#eff6ff',
            borderRadius: '16px',
            border: '1px solid #bfdbfe',
            color: '#1d4ed8',
            fontSize: '14px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            <span>
              {refreshProgress.itemName ? (
                <>Updating {refreshProgress.current}/{refreshProgress.total}: <span className="font-semibold">{refreshProgress.itemName}</span></>
              ) : (
                'Updating prices from Bricklink...'
              )}
            </span>
          </div>
        )}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
            <p className="mt-4 text-gray-500 text-sm">Loading collection...</p>
          </div>
        ) : (
          <CollectionList
            items={getSortedCollection()}
            onItemSelect={setSelectedItem}
            onItemDelete={handleItemDeleted}
            onItemUpdate={handleItemUpdated}
            selectedItemId={selectedItem?.id}
            showDecimals={showDecimals}
          />
        )}
      </div>
    </div>
  );
}

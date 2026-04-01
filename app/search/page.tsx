'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import { SearchResults } from '@/components/search';
import { CollectionItem } from '@/types';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  // Track if search is active (has query or results)
  useEffect(() => {
    setIsSearchActive(searchQuery.length > 0 || searchResults.length > 0 || !!searchResult);
  }, [searchQuery, searchResults, searchResult]);

  // Execute search as user types (instant)
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.length >= 1) {
      setLoading(true);
      setHasSearched(false);
      debounceTimer.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 50); // Very minimal debounce for instant feel
    } else {
      setSearchResults([]);
      setSearchResult(null);
      setLoading(false);
      setHasSearched(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  // Update URL with query param
  useEffect(() => {
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`, { scroll: false });
    } else {
      router.push('/search', { scroll: false });
    }
  }, [searchQuery]);

  const performSearch = async (term: string) => {
    if (!term || term.length < 1) {
      setSearchResults([]);
      setSearchResult(null);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    try {
      const response = await fetch(`/api/minifigs/search?q=${encodeURIComponent(term)}`);
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        if (data.data.length === 1) {
          setSearchResult(data.data[0]);
          setSearchResults([]);
        } else {
          setSearchResults(data.data);
          setSearchResult(null);
        }
      } else {
        setSearchResults([]);
        setSearchResult(null);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setSearchResult(null);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectMinifig = (minifig: any) => {
    setSearchResult(minifig);
    setSearchResults([]);
  };

  const handleCancelSelection = () => {
    setSearchResult(null);
  };

  const handleClearSearch = () => {
    setSearchResult(null);
    setSearchResults([]);
    setSearchQuery('');
    router.push('/search');
  };

  const handleItemAdded = (newItem: CollectionItem) => {
    // After adding, redirect to inventory page
    router.push('/inventory');
  };

  return (
    <div className="min-h-screen" style={{
      overflowX: 'hidden',
      backgroundColor: isSearchActive ? '#fafafa' : 'transparent',
      background: isSearchActive ? '#fafafa' : 'linear-gradient(135deg, #005C97 0%, #363795 100%)',
      position: 'relative',
      transition: 'background 0.4s ease-out'
    }}>
      {/* Floating Background Minifigures - Star Wars Favorites */}
      <>
        {/* Top Left - Darth Vader & Boba Fett */}
        <img src="https://img.bricklink.com/ItemImage/MN/0/sw0209.png" alt="" className={`floating-emoji ${isSearchActive ? 'hidden' : ''}`} style={{ top: '12%', left: '8%', animationDelay: '0s', width: '80px', height: '100px', objectFit: 'contain' }} />
        <img src="https://img.bricklink.com/ItemImage/MN/0/sw0539.png" alt="" className={`floating-emoji-reverse ${isSearchActive ? 'hidden' : ''}`} style={{ top: '35%', left: '15%', animationDelay: '2.5s', width: '70px', height: '90px', objectFit: 'contain' }} />

        {/* Bottom Left - Luke Skywalker & Yoda */}
        <img src="https://img.bricklink.com/ItemImage/MN/0/sw0778.png" alt="" className={`floating-emoji ${isSearchActive ? 'hidden' : ''}`} style={{ top: '65%', left: '10%', animationDelay: '1.5s', width: '75px', height: '95px', objectFit: 'contain' }} />
        <img src="https://img.bricklink.com/ItemImage/MN/0/sw0011a.png" alt="" className={`floating-emoji-reverse ${isSearchActive ? 'hidden' : ''}`} style={{ top: '85%', left: '5%', animationDelay: '4s', width: '70px', height: '90px', objectFit: 'contain' }} />

        {/* Top Right - Princess Leia & Darth Maul */}
        <img src="https://img.bricklink.com/ItemImage/MN/0/sw0341.png" alt="" className={`floating-emoji-reverse ${isSearchActive ? 'hidden' : ''}`} style={{ top: '15%', right: '10%', animationDelay: '1s', width: '75px', height: '95px', objectFit: 'contain' }} />
        <img src="https://img.bricklink.com/ItemImage/MN/0/sw0421.png" alt="" className={`floating-emoji ${isSearchActive ? 'hidden' : ''}`} style={{ top: '38%', right: '12%', animationDelay: '3.5s', width: '70px', height: '90px', objectFit: 'contain' }} />

        {/* Bottom Right - Han Solo & Stormtrooper */}
        <img src="https://img.bricklink.com/ItemImage/MN/0/sw0626.png" alt="" className={`floating-emoji-reverse ${isSearchActive ? 'hidden' : ''}`} style={{ top: '62%', right: '8%', animationDelay: '2s', width: '80px', height: '100px', objectFit: 'contain' }} />
        <img src="https://img.bricklink.com/ItemImage/MN/0/sw0585.png" alt="" className={`floating-emoji ${isSearchActive ? 'hidden' : ''}`} style={{ top: '80%', right: '15%', animationDelay: '3s', width: '75px', height: '95px', objectFit: 'contain' }} />
      </>

      <section className="fun-search-content"
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: 'calc(100vh - 72px)',
          display: 'flex',
          alignItems: isSearchActive ? 'flex-start' : 'center',
          paddingTop: isSearchActive ? '60px' : '0px',
          paddingBottom: isSearchActive ? '80px' : '0px',
          transition: 'all 0.4s ease-out',
          width: '100%'
        }}>
        <div className="search-page-container" style={{
          width: '100%',
          maxWidth: '100vw',
          margin: '0 auto',
          padding: '0 16px',
          boxSizing: 'border-box'
        }}>
          {/* Header Section - Only show when not searching */}
          {!isSearchActive && (
            <div className="search-header-section" style={{
              textAlign: 'center',
              marginBottom: '56px',
              transition: 'all 0.4s ease-out'
            }}>
              <h1 className="fun-header-title" style={{
                fontSize: '72px',
                fontWeight: '600',
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
                marginBottom: '20px'
              }}>
                Track Prices. Sell Smarter.
              </h1>
              <p className="fun-header-subtitle" style={{
                fontSize: '20px',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto',
                color: 'rgba(255, 255, 255, 0.95)'
              }}>
                Know what your minifigs are worth
              </p>
            </div>
          )}

          {/* Search Bar */}
          <div style={{
            margin: isSearchActive ? '0 auto 40px auto' : '0 auto 64px auto',
            padding: '0',
            width: '100%',
            maxWidth: '640px',
            boxSizing: 'border-box',
            transition: 'margin 0.4s ease-out'
          }}>
            <SearchBar
              onSearchResults={setSearchResults}
              onSearchResult={setSearchResult}
              searchQuery={searchQuery}
              onSearchQueryChange={handleSearchQueryChange}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="fun-search-card" style={{
              textAlign: 'center',
              padding: '80px 16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                margin: '0 auto 24px',
                border: '3px solid rgba(0, 92, 151, 0.2)',
                borderTop: '3px solid #005C97',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <p style={{
                fontSize: '16px',
                color: '#737373'
              }}>
                Searching...
              </p>
            </div>
          )}

          {/* No Results State */}
          {!loading && hasSearched && searchQuery.length >= 3 && !searchResult && searchResults.length === 0 && (
            <div className="fun-search-card" style={{
              textAlign: 'center',
              padding: '80px 16px'
            }}>
              <p style={{
                fontSize: '18px',
                color: '#737373'
              }}>
                No results found for "{searchQuery}"
              </p>
            </div>
          )}

          {/* Search Results Section */}
          {!loading && (searchResults.length > 0 || searchResult) && (
            <div style={{
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <SearchResults
                searchResults={searchResults}
                searchResult={searchResult}
                onSelectMinifig={handleSelectMinifig}
                onAddToCollection={handleItemAdded}
                onCancelSelection={handleCancelSelection}
                onClearSearch={handleClearSearch}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e5e5',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

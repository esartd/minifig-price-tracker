'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import { SearchResults } from '@/components/search';
import { CollectionItem } from '@/types';
import FeaturedSets from '@/components/FeaturedSets';
import LeaderboardsSection from '@/components/LeaderboardsSection';
import { useTranslation } from '@/components/TranslationProvider';

// Diverse minifigures from multiple themes (verified to exist in catalog)
const MINIFIG_POOL = [
  // Star Wars - Holy Grail & High-Value
  'sw0107',   // Boba Fett (Cloud City)
  'sw0105',   // Lando Calrissian (Cloud City)
  'sw0103',   // Luke Skywalker (Cloud City)
  'sw0218',   // Chrome Darth Vader (10th Anniversary)
  'sw0315',   // Shadow ARF Trooper
  'sw0547',   // Darth Revan (Polybag)
  'sw0275',   // White Boba Fett
  'sw0450',   // Captain Rex (Phase 2)
  'sw0413',   // Darth Malgus
  'sw0387',   // Queen Amidala
  // Other themes
  'min215',   // Minecraft
  'fort002',  // Fortnite
  'son005',   // Sonic
  'loz004',   // Zelda
  'jw127',    // Jurassic World
  'mk118',    // Monkie Kid
  'drm089',   // DREAMZzz
  'idea239',  // Ideas
  'op011',    // One Piece
  'blu005',   // Bluey
  'gdh003',   // Gabby's Dollhouse
  'wed004',   // Wednesday
  'wck026',   // Wicked
  'nike001',  // Nike
  'ani012',   // Animal Crossing
  'mar0066'   // Super Mario
];

// Generate evenly distributed positions around all edges, avoiding center text/search area
function generateFireworkPositions(count: number) {
  // Shuffle the pool to get random selection each time
  const shuffledPool = [...MINIFIG_POOL].sort(() => Math.random() - 0.5);

  // Define fixed edge zones (all around perimeter, avoiding center)
  const edgeZones = [
    // Top left corner
    { x: 5, y: 5, randomX: 10, randomY: 10 },
    // Top edge (left of center)
    { x: 25, y: 3, randomX: 10, randomY: 8 },
    // Top edge (right of center)
    { x: 65, y: 3, randomX: 10, randomY: 8 },
    // Top right corner
    { x: 88, y: 5, randomX: 10, randomY: 10 },

    // Right edge (upper)
    { x: 90, y: 25, randomX: 6, randomY: 10 },
    // Right edge (lower)
    { x: 90, y: 60, randomX: 6, randomY: 10 },

    // Bottom right corner
    { x: 88, y: 78, randomX: 10, randomY: 8 },
    // Bottom edge (right of center)
    { x: 65, y: 80, randomX: 10, randomY: 6 },
    // Bottom edge (left of center)
    { x: 25, y: 80, randomX: 10, randomY: 6 },
    // Bottom left corner
    { x: 5, y: 78, randomX: 10, randomY: 8 },

    // Left edge (lower)
    { x: 4, y: 60, randomX: 6, randomY: 10 },
    // Left edge (upper)
    { x: 4, y: 25, randomX: 6, randomY: 10 },
  ];

  const positions = edgeZones.slice(0, count).map((zone, index) => {
    // Add slight randomness within each zone for natural feel
    const x = zone.x + (Math.random() * zone.randomX - zone.randomX / 2);
    const y = zone.y + (Math.random() * zone.randomY - zone.randomY / 2);

    return {
      id: shuffledPool[index % shuffledPool.length],
      x: Math.max(1, Math.min(99, x)), // Clamp to edges
      y: Math.max(1, Math.min(99, y)),
      size: 70 + Math.random() * 30, // 70-100px
      delay: Math.random() * 4, // 0-4s animation delay
      reverse: Math.random() > 0.5 // Random animation direction
    };
  });

  return positions;
}

function SearchPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState<string | null>(searchParams.get('category'));
  const [subcategory, setSubcategory] = useState<string | null>(searchParams.get('subcategory'));
  const [categoryName, setCategoryName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  // Generate random minifig positions on client side only (after mount)
  const [minifigPositions, setMinifigPositions] = useState<any[]>([]);

  useEffect(() => {
    // Generate positions only on client to avoid hydration mismatch
    setMinifigPositions(generateFireworkPositions(12));
  }, []);

  // Load category/subcategory browsing on mount
  useEffect(() => {
    const category = searchParams.get('category');
    const sub = searchParams.get('subcategory');
    const q = searchParams.get('q');

    if ((category || sub) && !q) {
      if (sub) setSubcategory(sub);
      if (category) setCategoryId(category);
      setLoading(true);
      performSearch('', category, sub);
    }
  }, []);

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
        performSearch(searchQuery, categoryId, subcategory);
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

  // Update URL with query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (categoryId) params.set('category', categoryId);
    if (subcategory) params.set('subcategory', subcategory);

    const queryString = params.toString();
    router.push(`/search${queryString ? '?' + queryString : ''}`, { scroll: false });
  }, [searchQuery, categoryId, subcategory]);

  const performSearch = async (term: string, category: string | null = null, sub: string | null = null) => {
    // Subcategory-only browsing (no search term)
    if (!term && sub) {
      try {
        const response = await fetch(`/api/minifigs/search?subcategory=${encodeURIComponent(sub)}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setSearchResults(data.data);
          setSearchResult(null);
          setCategoryName(data.category || '');
        } else {
          setSearchResults([]);
          setSearchResult(null);
        }
      } catch (error) {
        console.error('Subcategory browse failed:', error);
        setSearchResults([]);
        setSearchResult(null);
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
      return;
    }

    // Category-only browsing (no search term)
    if (!term && category) {
      try {
        const response = await fetch(`/api/minifigs/search?category=${encodeURIComponent(category)}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setSearchResults(data.data);
          setSearchResult(null);
          setCategoryName(data.category || '');
        } else {
          setSearchResults([]);
          setSearchResult(null);
        }
      } catch (error) {
        console.error('Category browse failed:', error);
        setSearchResults([]);
        setSearchResult(null);
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
      return;
    }

    if (!term || term.length < 1) {
      setSearchResults([]);
      setSearchResult(null);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    try {
      // Use unified search that returns both minifigs and sets
      const params = new URLSearchParams({ q: term });
      if (category) params.set('category', category);

      const response = await fetch(`/api/search-all?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        const minifigs = data.data.minifigs || [];
        const sets = data.data.sets || [];

        // Combine results with type indicator
        const combinedResults = [
          ...minifigs.map((m: any) => ({ ...m, resultType: 'minifig' })),
          ...sets.map((s: any) => ({ ...s, resultType: 'set' }))
        ];

        if (combinedResults.length === 1) {
          setSearchResult(combinedResults[0]);
          setSearchResults([]);
        } else if (combinedResults.length > 0) {
          setSearchResults(combinedResults);
          setSearchResult(null);
        } else {
          setSearchResults([]);
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
      backgroundColor: '#ffffff',
      background: '#ffffff',
      transition: 'background 0.4s ease-out'
    }}>
      {/* Hero Section with Floating Background - Contained */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ffffff'
      }}>
        {/* Floating Background Minifigures - Only in hero section */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}>
          {minifigPositions.map((pos, index) => (
            <img
              key={index}
              src={`/api/images/minifig/${pos.id}`}
              alt=""
              loading="lazy"
              className={`${pos.reverse ? 'floating-emoji-reverse' : 'floating-emoji'} ${isSearchActive ? 'hidden' : ''}`}
              style={{
                position: 'absolute',
                top: `${pos.y}%`,
                left: `${pos.x}%`,
                animationDelay: `${pos.delay}s`,
                width: `${pos.size}px`,
                height: `${pos.size * 1.25}px`,
                objectFit: 'contain'
              }}
            />
          ))}
        </div>

        <section className="fun-search-content"
        style={{
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          minHeight: isSearchActive ? 'calc(100vh - 72px)' : 'min(calc(100vh - 200px), 600px)', // Limit height on mobile
          display: 'flex',
          alignItems: isSearchActive ? 'flex-start' : 'center',
          paddingTop: isSearchActive ? '60px' : '0px',
          paddingBottom: isSearchActive ? '80px' : '0px',
          transition: 'all 0.4s ease-out',
          width: '100%',
          backgroundColor: isSearchActive ? '#fafafa' : 'transparent'
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
                fontSize: 'var(--text-3xl)',
                fontWeight: '600',
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #005C97 0%, #363795 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {t('about.hero.title')}
              </h1>
              <p className="fun-header-subtitle" style={{
                fontSize: 'var(--text-lg)',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto',
                color: '#171717'
              }}>
                {t('about.hero.subtitle')}
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

          {/* Category/Subcategory Browsing Header */}
          {(categoryId || subcategory) && categoryName && !searchQuery && (
            <div style={{
              maxWidth: '800px',
              margin: '0 auto 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                <h2 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: '600',
                  color: '#171717',
                  letterSpacing: '-0.01em',
                  marginBottom: '8px'
                }}>
                  {categoryName}
                </h2>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373'
                }}>
                  {t('common.minifigCount', { count: searchResults.length })}
                </p>
              </div>
              <button
                onClick={() => {
                  setCategoryId(null);
                  setSubcategory(null);
                  setCategoryName('');
                  setSearchResults([]);
                  router.push('/search');
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: '#737373',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.borderColor = '#d4d4d4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#e5e5e5';
                }}
              >
                {t('common.clearFilter')}
              </button>
            </div>
          )}

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
                fontSize: 'var(--text-base)',
                color: '#737373'
              }}>
                {t('common.searching')}
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
                fontSize: 'var(--text-base)',
                color: '#737373'
              }}>
                {t('common.noResultsFor', { query: searchQuery })}
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
      {/* End Hero Section Container */}

      {/* Featured Sets - Only show when not actively searching */}
      {!isSearchActive && (
        <>
          <FeaturedSets />
          <LeaderboardsSection />
        </>
      )}
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

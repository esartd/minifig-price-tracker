'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResults } from '@/components/search';
import Link from 'next/link';
import HeaderSearch from '@/components/HeaderSearch';
import { POPULAR_THEMES } from '@/lib/popular-themes';
import { themeSlug } from '@/lib/theme-slug';
import { getRecentSearches, clearRecentSearches, addRecentSearch } from '@/lib/recent-searches';
import { CollectionItem } from '@/types';
import TrendingMinifigs from '@/components/TrendingMinifigs';
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
  const [searchResults, setSearchResultsState] = useState<any[]>([]);
  const [searchResult, setSearchResultState] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState<string | null>(searchParams.get('category'));
  const [subcategory, setSubcategory] = useState<string | null>(searchParams.get('subcategory'));
  const [categoryName, setCategoryName] = useState<string>('');
  const [loading, setLoadingState] = useState(false);
  const [hasSearched, setHasSearchedState] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  /**
   * Read after mount, never during render: localStorage does not exist on the
   * server, so seeding this in useState would hydrate-mismatch on anyone who
   * has a history.
   */
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => { setRecent(getRecentSearches()); }, []);
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
      setLoadingState(true);
      performSearch('', category, sub);
    }
  }, []);

  /**
   * Keep the input in step with ?q= when the URL changes underneath us.
   *
   * searchQuery is seeded from ?q= in its useState initialiser, which runs
   * once, and Next reuses this component across same-route navigations. Now
   * that the header search box can push /search?q=... while the user is
   * already on /search, that seed is stale on arrival: the results would
   * update and the box would still show the previous term.
   *
   * Only writes when the URL genuinely disagrees, so this does not fight the
   * effect below that writes searchQuery back into the URL.
   */
  useEffect(() => {
    const fromUrl = searchParams.get('q') || '';
    setSearchQuery((current) => (current === fromUrl ? current : fromUrl));
  }, [searchParams]);

  /**
   * Record the committed query, not what is being typed.
   *
   * components/HeaderSearch.tsx records on submit, which covers the header box
   * and the dropdown. It does NOT cover this page's own box: typing here
   * updates searchQuery, and the effect below writes that back into the URL,
   * so nothing ever passes through submitQuery. Verified -- searching from
   * /search left localStorage empty.
   *
   * Keying off the URL's ?q= instead catches every route into a result set,
   * including someone arriving on a shared link, and only fires when the
   * query actually settles rather than on each keystroke.
   */
  useEffect(() => {
    const committed = searchParams.get('q') || '';
    if (committed.trim().length >= 2) addRecentSearch(committed);
  }, [searchParams]);

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
      setLoadingState(true);
      setHasSearchedState(false);
      debounceTimer.current = setTimeout(() => {
        performSearch(searchQuery, categoryId, subcategory);
      // Was 50ms, which fires a request on essentially every keystroke. This
      // endpoint shares one rate-limit bucket with the header search box
      // (both match /api/search), so two boxes at 50ms would burn the budget
      // twice over. 150ms still feels instant.
      }, 150);
    } else {
      setSearchResultsState([]);
      setSearchResultState(null);
      setLoadingState(false);
      setHasSearchedState(false);
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
    // Was `/${queryString}` -- a copy-paste from the homepage that made this
    // page navigate away from itself to the homepage on every keystroke.
    // /search is the canonical search URL: it is what the SearchAction JSON-LD
    // in app/layout.tsx advertises, what app/search/page.tsx's canonical and
    // hreflang tags claim, and now where the header search box sends people.
    //
    // replace, not push: this effect runs on every debounced keystroke, so
    // push would stack one history entry per character and bury whatever page
    // the user came from under a dozen of them.
    router.replace(`/search${queryString ? '?' + queryString : ''}`, { scroll: false });
  }, [searchQuery, categoryId, subcategory]);

  /**
   * Only the most recently started search may write results.
   *
   * Ported from the homepage, which needed it for a real bug: a slow broad
   * query ("6" -- ~11,900 matches) could land after a fast precise one
   * ("662407" -- 1 match) and replace the right answer with thousands of
   * irrelevant rows. The item looked missing even though it was in the
   * catalog, and retyping "fixed" it purely by changing the timing.
   */
  const searchSeq = useRef(0);

  const performSearch = async (term: string, category: string | null = null, sub: string | null = null) => {
    const seq = ++searchSeq.current;
    /** False once a newer search has started; stops this one clobbering it. */
    const isCurrent = () => seq === searchSeq.current;

    // Guarded shadows of the four state setters. Declared here so every write
    // below -- including the ones in catch/finally -- becomes a no-op once a
    // newer search has started, without having to check at each call site.
    const setSearchResults = (v: any) => { if (isCurrent()) setSearchResultsState(v); };
    const setSearchResult = (v: any) => { if (isCurrent()) setSearchResultState(v); };
    const setLoading = (v: boolean) => { if (isCurrent()) setLoadingState(v); };
    const setHasSearched = (v: boolean) => { if (isCurrent()) setHasSearchedState(v); };

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

  const handleSelectMinifig = (minifig: any) => {
    setSearchResultState(minifig);
    setSearchResultsState([]);
  };

  const handleCancelSelection = () => {
    setSearchResultState(null);
  };

  const handleClearSearch = () => {
    setSearchResultState(null);
    setSearchResultsState([]);
    setSearchQuery('');
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
      {/* Floating Background Minifigures - Only in hero section */}
      <div style={{
        position: 'absolute',
        top: '72px',
        left: 0,
        right: 0,
        height: 'calc(100vh - 272px)',
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
            // Hidden on this page in both states now. These float around a
            // central hero search box -- which /search no longer has -- so
            // with nothing in the middle they read as figures scattered at
            // random across an empty screen. app/page.tsx still has the box,
            // and still has them.
            className={`${pos.reverse ? 'floating-emoji-reverse' : 'floating-emoji'} hidden`}
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
          // The empty state is two lines of text now, not a hero with a search
          // box and floating minifigures in it, so it no longer reserves most
          // of the viewport. calc(100vh - 200px) left ~700px of blank screen
          // between the heading and the sections below it.
          // 300px was sized for a heading and one line of text. The search
          // box is back in the empty state, and it needs room under it or it
          // sits flush against Community Leaderboards.
          minHeight: isSearchActive ? 'calc(100vh - 72px)' : '380px',
          display: 'flex',
          alignItems: isSearchActive ? 'flex-start' : 'center',
          paddingTop: isSearchActive ? '60px' : '0px',
          paddingBottom: isSearchActive ? '80px' : '56px',
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
              marginBottom: '0',
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
                {t('search.emptyTitle') || 'Search for Minifigures and Sets'}
              </h1>
              <p className="fun-header-subtitle" style={{
                fontSize: 'var(--text-lg)',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto',
                color: '#171717'
              }}>
                {t('search.emptySubtitle') || 'Try searching by name, number, or theme'}
              </p>
            </div>
          )}

          {/* The search box, empty state only.
              
              This page had one, then lost it when the header gained one on
              every page -- two inputs for one job, about 200px apart. But
              removing it left the empty state with nothing to act on: a
              heading pointing at a box somewhere else, which is what made
              this page look broken.

              It is back for the no-query case ONLY. Once there are results
              the header box is the one in view and this would be the
              duplicate again. Same component as the header's and the
              homepage's, so it inherits the autocomplete, keyboard handling
              and screen-reader wiring rather than being a fourth
              implementation. Typing here still drives the page through ?q=
              (see the searchParams sync effect above). */}
          {!isSearchActive && (
            <div style={{ maxWidth: '640px', margin: '32px auto 0', width: '100%' }}>
              <HeaderSearch
                value={searchQuery}
                onValueChange={setSearchQuery}
                variant="hero"
              />
            </div>
          )}

          {/* Says out loud that a BrickLink ID works here. Sellers arrive
              with an ID in the clipboard more often than a name, and nothing
              on this page admitted that was allowed. Same string the homepage
              uses under its box. */}
          {!isSearchActive && (
            <p style={{
              margin: '12px 0 0',
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              color: '#737373'
            }}>
              {t('search.header.idHint') || 'Try a name, or a BrickLink ID like sw0001 or 75192-1'}
            </p>
          )}

          {/* Recent searches. The most useful thing on a search page: people
              searching a catalogue are usually back for something near what
              they looked up last time. Only rendered when there is a history,
              so a first-time visitor sees nothing. */}
          {!isSearchActive && recent.length > 0 && (
            <div style={{ maxWidth: '640px', margin: '32px auto 0', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600, color: '#525252' }}>
                  {t('search.recentSearches') || 'Recent searches'}
                </h2>
                <button
                  type="button"
                  onClick={() => { clearRecentSearches(); setRecent([]); }}
                  style={{
                    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                    fontSize: 'var(--text-sm)', color: '#737373', fontFamily: 'inherit'
                  }}
                >
                  {t('search.clearRecent') || 'Clear'}
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {recent.map(term => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', height: '32px',
                      padding: '0 14px', borderRadius: '999px', background: '#ffffff',
                      border: '1px solid #e5e5e5', fontSize: 'var(--text-sm)',
                      color: '#171717', textDecoration: 'none'
                    }}
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Browse by theme -- the way in for someone who cannot name what
              they are after. POPULAR_THEMES is shared with the community
              stats endpoint; themeSlug keeps these on the canonical URL form
              so they do not take the 301 added in middleware.ts. */}
          {!isSearchActive && (
            <div style={{ maxWidth: '640px', margin: '32px auto 0', width: '100%' }}>
              <h2 style={{ margin: '0 0 12px', fontSize: 'var(--text-sm)', fontWeight: 600, color: '#525252' }}>
                {t('search.browseByTheme') || 'Browse by theme'}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {POPULAR_THEMES.slice(0, 12).map(theme => (
                  <Link
                    key={theme}
                    href={`/themes/${themeSlug(theme)}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', height: '32px',
                      padding: '0 14px', borderRadius: '999px', background: '#ffffff',
                      border: '1px solid #e5e5e5', fontSize: 'var(--text-sm)',
                      color: '#171717', textDecoration: 'none'
                    }}
                  >
                    {theme}
                  </Link>
                ))}
              </div>
            </div>
          )}

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
                  setSearchResultsState([]);
                  router.push('/');
                }}
                style={{
                  padding: '8px 16px',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: '#737373',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '999px',
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

      {/* Trending only.

          This used to render LeaderboardsSection, TrendingMinifigs and
          RecommendedSets -- inherited from when /search WAS the homepage.
          Measured before removing them: the page was 3,767px, of which the
          search part was 300px. 92% of a search page was homepage.

          Leaderboards ranks collectors by collection size and Recommended
          suggests sets to buy. Neither answers the question someone on this
          page is asking, which is "where is this one figure". Both still
          exist on app/page.tsx, which is where they belong.

          Trending stays because "what other people are looking up" is a real
          answer to "I do not know what to type". */}
      {!isSearchActive && (
        <div className="home-bands">
          <TrendingMinifigs />
        </div>
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

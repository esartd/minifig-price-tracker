'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { RetirementPrediction } from '@/lib/retiring-soon-algorithm';
import RetirementYearSection from './RetirementYearSection';
import Pagination from './Pagination';
import { groupByRetirementYear } from '@/lib/retirement-years';

const PAGE_SIZE = 50;

interface Props {
  initialData: RetirementPrediction[];
  /** Every qualifying set, not just the first page. */
  totalRetiring: number;
  themes: string[];
  initialTheme: string;
  /**
   * Passed from the server rather than read from the clock here, so the SSR
   * render and hydration agree on which years count as overdue.
   */
  currentYear: number;
  translations: any;
}

export default function RetiringSoonClient({
  initialData,
  totalRetiring,
  themes,
  initialTheme = 'all',
  currentYear,
  translations
}: Props) {
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [retiringSets, setRetiringSets] = useState(initialData);
  const [total, setTotal] = useState(totalRetiring);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const wantsScroll = useRef(false);
  // The server already rendered page 1, so the first run of the fetch effect
  // would only re-request what is on screen.
  const isFirstRun = useRef(true);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter themes based on search query
  const filteredThemes = searchQuery
    ? themes.filter(theme =>
        theme.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : themes;

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    // Page 4 of Star Wars is not page 4 of everything. Both setState calls are
    // batched into one render, so the fetch effect below runs once, with the
    // new theme and page 1 together -- not once per changed dependency.
    setPage(1);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const getDisplayTheme = () => {
    if (selectedTheme === 'all') {
      return translations?.filters?.allThemes || 'All Themes';
    }
    return selectedTheme;
  };

  /**
   * One page of results at a time, replacing what is on screen.
   *
   * This used to append: "Show more" fetched the next 50 and added them to the
   * list. It worked -- the request succeeded and the count went up -- but it
   * read as a dead button, because the sets are grouped by retirement year and
   * almost all of them land in the current year's section, which sits at the
   * TOP of the page. Measured on production: clicking it moved the button from
   * y=25052 to y=48017. The 50 new cards were inserted 23,000px above where
   * the click happened, the button shot out from under the cursor, and the
   * viewport showed the same grid of cards it had a moment earlier.
   *
   * Grouped lists cannot grow downward, so they cannot use "load more". Paging
   * replaces the contents instead, which keeps the new sets where the reader is
   * looking. Same component the four collection pages use, so it behaves the
   * way the rest of the site already does.
   */
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setLoading(true);
    const params = new URLSearchParams();
    if (selectedTheme !== 'all') params.set('theme', selectedTheme);
    params.set('offset', String((page - 1) * PAGE_SIZE));
    params.set('limit', String(PAGE_SIZE));

    // Only the theme goes in the URL. The page number stays local state: every
    // ?page= value would be a new crawlable URL serving near-identical cards,
    // and nothing here emits rel=next/prev or a per-page canonical to tell
    // Google how they relate.
    const themeParams = new URLSearchParams();
    if (selectedTheme !== 'all') themeParams.set('theme', selectedTheme);
    const newUrl = themeParams.toString() ? `/retiring-soon?${themeParams}` : '/retiring-soon';
    router.push(newUrl, { scroll: false });

    fetch(`/api/sets/retiring-soon?${params}`)
      .then(res => res.json())
      .then(data => {
        setRetiringSets(data.data || []);
        setTotal(data.meta?.total ?? (data.data?.length || 0));
        setLoading(false);
        // Actually scrolling is left to the effect below. Calling
        // scrollIntoView here does nothing: it runs in the same tick as these
        // setState calls, before React has committed the new cards, so it
        // measures the spinner-height page and lands nowhere. Verified -- the
        // page stayed at y=7774 across a page change.
        wantsScroll.current = true;
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedTheme, page, router]);

  // Runs after the new page is committed to the DOM, so there is something to
  // scroll to. Without this, page 2 opens at whatever offset page 1's
  // pagination control happened to sit at -- thousands of pixels down, showing
  // the middle of a grid the reader has not seen the top of.
  useEffect(() => {
    if (loading || !wantsScroll.current) return;
    wantsScroll.current = false;
    // Instant, not smooth. From the bottom of page 1 this is a ~7,000px trip;
    // animating it is a long disorienting ride through cards the reader has
    // already dismissed, and the animation was measured being interrupted by
    // the re-render anyway -- it crawled 654px and stopped, leaving the reader
    // stranded mid-grid. A page change should just be somewhere new.
    resultsRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [loading, retiringSets]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // "Showing 51-100 of 694" -- where you are in the whole list, not just how
  // many cards happen to be rendered.
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  const countLabel = totalPages > 1 ? `${rangeStart}-${rangeEnd} of ${total}` : String(total);

  return (
    <>
      {/* Filters section. Also the scroll target for a page change: it ends
          with the "Showing 51-100 of 694" line, which is the confirmation that
          the page actually changed, so landing here puts that line and the
          first row of new cards on screen together. */}
      <div ref={resultsRef} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        // Clears the sticky header, measured at 109px, plus a little air.
        // Without it the header lands on top of the "Showing 51-100 of 694"
        // line -- the one thing confirming the page changed.
        scrollMarginTop: '125px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <label style={{
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            color: '#171717'
          }}>
            {translations?.filters?.selectTheme || 'Theme'}:
          </label>

          {/* Searchable dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative', minWidth: '280px' }}>
            {/* A button, not a div. This was a plain <div onClick> with no
                tabIndex, no role and no key handler -- reachable only with a
                mouse. */}
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                if (!isDropdownOpen) {
                  setTimeout(() => inputRef.current?.focus(), 0);
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Escape' && isDropdownOpen) {
                  e.preventDefault();
                  setIsDropdownOpen(false);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: '40px',
                padding: '0 16px',
                fontSize: 'var(--text-sm)',
                textAlign: 'left',
                border: '1px solid #e5e5e5',
                borderRadius: '999px',
                background: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
            >
              <span style={{ color: '#171717' }}>{getDisplayTheme()}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: 'transform 0.2s',
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                left: 0,
                right: 0,
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                maxHeight: '400px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Search input */}
                <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e5e5' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={translations?.filters?.searchThemes || 'Search themes...'}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      fontSize: 'var(--text-sm)',
                      // Matches every other search box on the site: same grey,
                      // same pill. This was #d4d4d4 at 6px -- the only place
                      // using either value.
                      border: '1px solid #e5e5e5',
                      borderRadius: '999px',
                      outline: 'none'
                    }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'}
                  />
                </div>

                {/* Options list */}
                <div style={{
                  overflowY: 'auto',
                  maxHeight: '320px'
                }}>
                  <button
                    type="button"
                    onClick={() => handleThemeSelect('all')}
                    style={{
                      width: '100%',
                      border: 'none',
                      borderRadius: '0',
                      textAlign: 'left',
                      font: 'inherit',
                      padding: '0.75rem 1rem',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      background: selectedTheme === 'all' ? '#f0f9ff' : '#ffffff',
                      color: selectedTheme === 'all' ? '#3b82f6' : '#171717',
                      fontWeight: selectedTheme === 'all' ? '600' : '400',
                      borderBottom: '1px solid #f5f5f5'
                    }}
                    onMouseEnter={e => {
                      if (selectedTheme !== 'all') {
                        e.currentTarget.style.background = '#fafafa';
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedTheme !== 'all') {
                        e.currentTarget.style.background = '#ffffff';
                      }
                    }}
                  >
                    {translations?.filters?.allThemes || 'All Themes'}
                  </button>

                  {filteredThemes.length === 0 ? (
                    <div style={{
                      padding: '2rem 1rem',
                      textAlign: 'center',
                      fontSize: 'var(--text-sm)',
                      color: '#737373'
                    }}>
                      {translations?.filters?.noThemesFound || 'No themes found'}
                    </div>
                  ) : (
                    filteredThemes.map(theme => (
                      <button
                        type="button"
                        key={theme}
                        onClick={() => handleThemeSelect(theme)}
                        style={{
                          width: '100%',
                          border: 'none',
                          borderRadius: '0',
                          textAlign: 'left',
                          font: 'inherit',
                          padding: '0.75rem 1rem',
                          fontSize: 'var(--text-sm)',
                          cursor: 'pointer',
                          background: selectedTheme === theme ? '#f0f9ff' : '#ffffff',
                          color: selectedTheme === theme ? '#3b82f6' : '#171717',
                          fontWeight: selectedTheme === theme ? '600' : '400',
                          borderBottom: '1px solid #f5f5f5'
                        }}
                        onMouseEnter={e => {
                          if (selectedTheme !== theme) {
                            e.currentTarget.style.background = '#fafafa';
                          }
                        }}
                        onMouseLeave={e => {
                          if (selectedTheme !== theme) {
                            e.currentTarget.style.background = '#ffffff';
                          }
                        }}
                      >
                        {theme}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#525252',
          margin: 0
        }}>
          {selectedTheme === 'all'
            ? (translations?.filters?.showingCount || 'Showing {count} sets retiring soon')
                .replace('{count}', countLabel)
            : (translations?.filters?.showingCountInTheme || 'Showing {count} sets retiring soon in {theme}')
              .replace('{count}', countLabel)
              .replace('{theme}', selectedTheme)
          }
        </p>
      </div>

      {/* Set grid or empty state */}
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4rem',
          color: '#525252'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e5e5',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : retiringSets.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: '#fafafa',
          borderRadius: '12px'
        }}>
          <p style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '0.5rem'
          }}>
            {translations?.empty?.noSets || 'No retiring sets found'}
          </p>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373'
          }}>
            {translations?.empty?.tryDifferentFilter || 'Try selecting a different theme or timeline'}
          </p>
        </div>
      ) : (
        <div>
          {groupByRetirementYear(retiringSets, currentYear).map(group => (
            <RetirementYearSection
              key={group.key}
              group={group}
              translations={translations}
            />
          ))}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </>
  );
}

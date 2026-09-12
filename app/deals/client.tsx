'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DealTierSection from '@/components/DealTierSection';
import PageHeading from '@/components/PageHeading';
import { useTranslation } from '@/components/TranslationProvider';

// Remembering the dismissal in localStorage rather than a cookie: nothing on
// the server needs to know, and it keeps the choice per-browser without adding
// a byte to every request.
const DISCLAIMER_KEY = 'intobrick-deals-disclaimer-dismissed';

interface Deal {
  boxNo: string;
  walmartItemId: string;
  name: string;
  theme: string;
  currentPrice: number;
  listPrice: number;
  discountPercent: number;

  imageUrl: string;
  buyUrl: string;
}

interface Theme {
  name: string;
  count: number;
}

export default function LegoSaleClient() {
  const { t } = useTranslation();
  // Collapsed by default: the SEO paragraph is for crawlers, and at full height
  // it pushed the first deal card off the screen.
  const [seoExpanded, setSeoExpanded] = useState(false);
  // Starts SHOWN and is hidden by the effect below, never the other way round.
  // Reading localStorage during render would disagree with the server-rendered
  // HTML and trip a hydration mismatch -- and defaulting to hidden would mean a
  // reader who has never dismissed it might never see it at all if the effect
  // failed to run. Shown-then-hidden fails safe.
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [deals50, setDeals50] = useState<Deal[]>([]);
  const [deals40, setDeals40] = useState<Deal[]>([]);
  const [deals30, setDeals30] = useState<Deal[]>([]);
  const [deals20, setDeals20] = useState<Deal[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('discount');
  const [themeSearch, setThemeSearch] = useState<string>('');

  useEffect(() => {
    try {
      if (localStorage.getItem(DISCLAIMER_KEY) === '1') setShowDisclaimer(false);
    } catch {
      // Storage can throw outright in private browsing. The disclaimer simply
      // stays visible, which is the harmless direction to fail.
    }
  }, []);

  useEffect(() => {
    fetchThemes();
    fetchDeals();
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [selectedTheme, priceRange, sortBy]);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/lego-sale/themes');
      const data = await response.json();
      if (data.success) {
        setThemes(data.themes);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    }
  };

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const { minPrice, maxPrice } = getPriceRangeBounds(priceRange);

      // Fetch all 4 tiers in parallel
      const [res50, res40, res30, res20] = await Promise.all([
        fetch(
          `/api/lego-sale/deals?tier=50&theme=${selectedTheme}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&limit=50`
        ),
        fetch(
          `/api/lego-sale/deals?tier=40&maxTier=50&theme=${selectedTheme}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&limit=50`
        ),
        fetch(
          `/api/lego-sale/deals?tier=30&maxTier=40&theme=${selectedTheme}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&limit=50`
        ),
        fetch(
          `/api/lego-sale/deals?tier=20&maxTier=30&theme=${selectedTheme}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&limit=50`
        ),
      ]);

      const [data50, data40, data30, data20] = await Promise.all([
        res50.json(),
        res40.json(),
        res30.json(),
        res20.json(),
      ]);

      if (data50.success) {
        // Each request now asks for its own band (maxTier), so the tiers cannot
        // overlap and there is nothing to subtract here.
        //
        // The old version asked for a FLOOR four times and filtered afterwards,
        // which silently emptied the bottom band: a request for "20% or more"
        // returns the highest-discount rows first, so all fifty came back at
        // 33-64% and the "20-29%" section rendered "No deals found" while 297
        // sets sat at 20% or better.
        setDeals50(data50.deals);
        setDeals40(data40.deals);
        setDeals30(data30.deals);
        setDeals20(data20.deals);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriceRangeBounds = (range: string) => {
    switch (range) {
      case 'under25':
        return { minPrice: 0, maxPrice: 25 };
      case '25to50':
        return { minPrice: 25, maxPrice: 50 };
      case '50to100':
        return { minPrice: 50, maxPrice: 100 };
      case '100to200':
        return { minPrice: 100, maxPrice: 200 };
      case 'over200':
        return { minPrice: 200, maxPrice: 999999 };
      default:
        return { minPrice: 0, maxPrice: 999999 };
    }
  };

  const filteredThemes = themes.filter((theme) =>
    theme.name.toLowerCase().includes(themeSearch.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <PageHeading
        style={{ background: '#ffffff', borderBottom: '1px solid #e5e5e5' }}
        title={t('legoSale.pageTitle') || 'LEGO Deals'}
        subtitle={t('legoSale.subtitleUpdated') || 'Best Walmart deals, refreshed daily'}
      />

      {/* SEO copy, collapsed to two lines by default.
          It exists for search engines, not for the reader who came here to see
          deals -- at full height it pushed the first deal card below the fold.
          Clamped rather than hidden so the text is still in the HTML and still
          crawlable; only its height is constrained. */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e5e5e5', padding: '20px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: '#525252',
              lineHeight: '1.6',
              margin: 0,
              ...(seoExpanded
                ? {}
                : {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                  }),
            }}
          >
            {t('legoSale.seoParagraph') ||
              "Find LEGO® sets on sale at Walmart. We check thousands of LEGO products every day, match them to our catalogue and show you what has actually dropped in price \u2014 sorted by how big the saving is, across themes like Star Wars, City, Creator and Technic. Filter by theme, price or discount to find what you are after."}
          </p>
          <button
            type="button"
            onClick={() => setSeoExpanded((v) => !v)}
            style={{
              marginTop: '6px',
              padding: 0,
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            {seoExpanded
              ? t('legoSale.readLess') || 'Read less'
              : t('legoSale.readMore') || 'Read more'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e5e5e5', padding: '16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* Theme Filter */}
          <div style={{ flex: '1 1 250px', minWidth: '200px' }}>
            <label style={{ fontSize: '12px', color: '#737373', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              {t('legoSale.filterByTheme') || 'Filter by Theme'}
            </label>
            <input
              type="text"
              placeholder={t('legoSale.searchThemesPlaceholder') || 'Search themes...'}
              value={themeSearch}
              onChange={(e) => setThemeSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '999px',
                fontSize: '14px',
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
            />
            {themeSearch && filteredThemes.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  marginTop: '4px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                {filteredThemes.slice(0, 10).map((theme) => (
                  <div
                    key={theme.name}
                    onClick={() => {
                      setSelectedTheme(theme.name);
                      setThemeSearch('');
                    }}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f5f5f5',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                  >
                    <span style={{ fontSize: '14px', color: '#171717' }}>{theme.name}</span>
                    <span style={{ fontSize: '12px', color: '#737373' }}>({theme.count})</span>
                  </div>
                ))}
              </div>
            )}
            {selectedTheme && (
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#3b82f6',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: '500',
                  }}
                >
                  {selectedTheme}
                  <button
                    onClick={() => setSelectedTheme('')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '0',
                      lineHeight: '1',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div style={{ flex: '0 1 200px' }}>
            <label style={{ fontSize: '12px', color: '#737373', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              {t('legoSale.priceRange') || 'Price Range'}
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: '999px',
                appearance: 'none',
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23737373' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                backgroundSize: '16px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <option value="all">{t('legoSale.allPrices') || 'All Prices'}</option>
              <option value="under25">{t('legoSale.priceUnder25') || 'Under $25'}</option>
              <option value="25to50">{t('legoSale.price25to50') || '$25 - $50'}</option>
              <option value="50to100">{t('legoSale.price50to100') || '$50 - $100'}</option>
              <option value="100to200">{t('legoSale.price100to200') || '$100 - $200'}</option>
              <option value="over200">{t('legoSale.priceOver200') || '$200+'}</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ flex: '0 1 180px' }}>
            <label style={{ fontSize: '12px', color: '#737373', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              {t('legoSale.sortBy') || 'Sort By'}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: '999px',
                appearance: 'none',
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23737373' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                backgroundSize: '16px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <option value="discount">{t('legoSale.sortDiscount') || 'Highest Discount'}</option>
              <option value="price">{t('legoSale.sortPrice') || 'Lowest Price'}</option>
              <option value="name">{t('legoSale.sortName') || 'Name (A-Z)'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price disclaimer. Dismissible, because it is the same sentence on every
          visit and a returning reader has already read it -- but it does have to
          be seen once, so it defaults to shown and only hides after a click.

          The affiliate-earnings sentence used to be tacked on the end and is
          gone: the global footer already carries that disclosure on every page,
          so this said it twice on one screen. What stays is the part that is
          specific to THIS page -- that the prices come from Walmart, are a daily
          snapshot, and that Walmart's own price at checkout is the one that
          counts. */}
      {showDisclaimer && (
        <div style={{ padding: '0 16px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '32px auto 0',
          padding: '14px 16px',
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#92400e',
          lineHeight: '1.6',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}>
          <p style={{ margin: 0, flex: 1 }}>
            <strong>{t('legoSale.priceDisclaimerLabel') || 'Price Disclaimer:'}</strong>{' '}
            {t('legoSale.priceDisclaimerText') ||
              'Prices come from Walmart and are refreshed once a day, so they can change at any time. The price shown on Walmart at checkout is the one that applies.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setShowDisclaimer(false);
              try {
                localStorage.setItem(DISCLAIMER_KEY, '1');
              } catch {
                // Private browsing throws on write. Dismissing for this page
                // view still works; it just comes back next time.
              }
            }}
            aria-label={t('legoSale.dismissDisclaimer') || 'Dismiss'}
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              padding: 0,
              border: 'none',
              borderRadius: '6px',
              background: 'transparent',
              color: '#92400e',
              cursor: 'pointer',
              lineHeight: 0,
            }}
          >
            <XMarkIcon style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
        </div>
      )}

      {/* Deals Content */}
      {/* Same container recipe as every band above: the 16px page gutter goes on
          a FULL-WIDTH wrapper, and the 1200px column sits inside it with no
          padding of its own. Putting the gutter on the 1200px box instead --
          which is what this did -- keeps the box aligned but pushes its contents
          16px inward, so the tier headings and cards no longer lined up with the
          heading and filters above them. */}
      <div style={{ padding: '48px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#737373' }}>
            <p style={{ fontSize: 'var(--text-lg)' }}>{t('legoSale.loadingDeals') || 'Loading deals...'}</p>
          </div>
        ) : (
          <>
            <DealTierSection
              title={t('legoSale.tierUnbelievable50') || 'Unbelievable Deals - 50%+ below market'}
              emoji="💥"
              deals={deals50}
              tierColor="#b91c1c"
              isEmpty={deals50.length === 0}
            />
            <DealTierSection
              title={t('legoSale.tierExcellent40') || 'Excellent Deals - 40%+ below market'}
              emoji="🔥"
              deals={deals40}
              tierColor="#dc2626"
              isEmpty={deals40.length === 0}
            />
            <DealTierSection
              title={t('legoSale.tierGreat30') || 'Great Deals - 30%+ below market'}
              emoji="💰"
              deals={deals30}
              tierColor="#ea580c"
              isEmpty={deals30.length === 0}
            />
            <DealTierSection
              title={t('legoSale.tierGood20') || 'Good Deals - 20%+ below market'}
              emoji="✨"
              deals={deals20}
              tierColor="#16a34a"
              isEmpty={deals20.length === 0}
            />
          </>
        )}
      </div>
      </div>
    </div>
  );
}

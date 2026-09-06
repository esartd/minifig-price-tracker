'use client';

import { useState, useEffect } from 'react';
import DealTierSection from '@/components/DealTierSection';
import { useTranslation } from '@/components/TranslationProvider';

interface Deal {
  boxNo: string;
  asin: string;
  name: string;
  theme: string;
  currentPrice: number;
  listPrice: number;
  discountPercent: number;
  isPrime: boolean;
  imageUrl: string;
  amazonUrl: string;
}

interface Theme {
  name: string;
  count: number;
}

export default function LegoSaleClient() {
  const { t } = useTranslation();
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
          `/api/lego-sale/deals?tier=40&theme=${selectedTheme}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&limit=50`
        ),
        fetch(
          `/api/lego-sale/deals?tier=30&theme=${selectedTheme}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&limit=50`
        ),
        fetch(
          `/api/lego-sale/deals?tier=20&theme=${selectedTheme}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&limit=50`
        ),
      ]);

      const [data50, data40, data30, data20] = await Promise.all([
        res50.json(),
        res40.json(),
        res30.json(),
        res20.json(),
      ]);

      if (data50.success) {
        // Filter out higher tier deals from lower tiers
        const asin50Set = new Set(data50.deals.map((d: Deal) => d.asin));
        const asin40Set = new Set(data40.deals.map((d: Deal) => d.asin));

        setDeals50(data50.deals);
        setDeals40(data40.deals.filter((d: Deal) => !asin50Set.has(d.asin) && d.discountPercent < 50));
        setDeals30(data30.deals.filter((d: Deal) => !asin50Set.has(d.asin) && !asin40Set.has(d.asin) && d.discountPercent < 40));
        setDeals20(data20.deals.filter(
          (d: Deal) =>
            !asin50Set.has(d.asin) &&
            !asin40Set.has(d.asin) &&
            d.discountPercent < 30
        ));
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
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e5e5e5', padding: '24px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '800', color: '#171717', marginBottom: '8px' }}>
            {t('legoSale.pageTitle') || 'LEGO® Sale'}
          </h1>
          <p style={{ fontSize: 'var(--text-base)', color: '#737373' }}>
            {t('legoSale.subtitleUpdated') || 'Best Amazon Deals - Updated Every 6 Hours'}
          </p>
        </div>
      </div>

      {/* SEO Content */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e5e5e5', padding: '24px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: '#525252', lineHeight: '1.6' }}>
            {t('legoSale.seoParagraph') ||
              "Discover the best LEGO® deals on Amazon with discounts up to 50% off. Our LEGO sale page automatically scans thousands of LEGO sets and highlights the biggest savings across popular themes like Star Wars, City, Creator, Technic, and more. Whether you're hunting for rare retired sets or the latest releases, we track Amazon prices every 6 hours to ensure you never miss a great deal. Filter by theme, price range, or discount percentage to find exactly what you're looking for. All deals feature free shipping with Amazon Prime. Start saving on your favorite LEGO sets today!"}
          </p>
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
                borderRadius: '8px',
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
                    borderRadius: '6px',
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
                padding: '10px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                background: '#ffffff',
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
                padding: '10px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                background: '#ffffff',
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

      {/* Amazon Associates Required Disclosure */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px',
        background: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#92400e',
        lineHeight: '1.6'
      }}>
        <strong>{t('legoSale.priceDisclaimerLabel') || 'Price Disclaimer:'}</strong>{' '}
        {t('legoSale.priceDisclaimerText') ||
          'Product prices and availability are accurate as of the date/time indicated and are subject to change. Prices shown are from Amazon at the time of last refresh (updated every 6 hours). Any price and availability information displayed on Amazon at the time of purchase will apply to the purchase of this product. As an Amazon Associate, LEGO Affiliate, eBay Partner, and Whatnot Affiliate, FigTracker earns from qualifying purchases.'}
      </div>

      {/* Deals Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#737373' }}>
            <p style={{ fontSize: 'var(--text-lg)' }}>{t('legoSale.loadingDeals') || 'Loading deals...'}</p>
          </div>
        ) : (
          <>
            <DealTierSection
              title={t('legoSale.tierUnbelievable50') || 'Unbelievable Deals - 50%+ Off'}
              emoji="💥"
              deals={deals50}
              tierColor="#b91c1c"
              isEmpty={deals50.length === 0}
            />
            <DealTierSection
              title={t('legoSale.tierExcellent40') || 'Excellent Deals - 40%+ Off'}
              emoji="🔥"
              deals={deals40}
              tierColor="#dc2626"
              isEmpty={deals40.length === 0}
            />
            <DealTierSection
              title={t('legoSale.tierGreat30') || 'Great Deals - 30%+ Off'}
              emoji="💰"
              deals={deals30}
              tierColor="#ea580c"
              isEmpty={deals30.length === 0}
            />
            <DealTierSection
              title={t('legoSale.tierGood20') || 'Good Deals - 20%+ Off'}
              emoji="✨"
              deals={deals20}
              tierColor="#16a34a"
              isEmpty={deals20.length === 0}
            />
          </>
        )}
      </div>
    </div>
  );
}

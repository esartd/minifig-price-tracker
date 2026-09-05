'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '@/components/TranslationProvider';

interface MarketplaceCard {
  itemNo: string;
  name: string;
  categoryName: string;
  yearReleased: string | null;
  imageUrl: string | null;
  itemType: 'minifig' | 'set';
  ownerCount: number;
  whatnotUrl: string;
}

type ItemType = 'minifig' | 'set';
type SortOption = 'popular' | 'newest' | 'name';

const PAGE_SIZE = 48;

/**
 * 250ms. The endpoint is cached but the catalog scan behind a cold query is
 * real work over ~40,000 items, so firing on every keystroke is wasteful. The
 * sequence guard below — not this delay — is what prevents stale results
 * overwriting fresh ones.
 */
const SEARCH_DEBOUNCE_MS = 250;

export default function MarketplacePageClient() {
  const { t } = useTranslation();

  const [itemType, setItemType] = useState<ItemType>('minifig');
  const [sort, setSort] = useState<SortOption>('popular');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<MarketplaceCard[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [failed, setFailed] = useState(false);

  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Only the most recent request may write results. Without this a slow broad
   * query can land after a fast precise one and replace the right answer —
   * the same bug that made the main site search appear to "lose" items.
   */
  const requestSeq = useRef(0);

  const fetchPage = useCallback(
    async (offset: number) => {
      const seq = ++requestSeq.current;
      if (offset === 0) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams({
          type: itemType,
          sort,
          limit: String(PAGE_SIZE),
          offset: String(offset),
        });
        if (query.trim()) params.set('q', query.trim());

        const response = await fetch(`/api/marketplace?${params}`);
        const json = await response.json();
        if (seq !== requestSeq.current) return;

        if (!json.success) {
          setFailed(true);
          return;
        }

        setFailed(false);
        setItems((previous) =>
          offset === 0 ? json.data.items : [...previous, ...json.data.items]
        );
        setTotal(json.data.total);
        setHasMore(json.data.hasMore);
      } catch {
        if (seq === requestSeq.current) setFailed(true);
      } finally {
        if (seq === requestSeq.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [itemType, sort, query]
  );

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchPage(0), SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [fetchPage]);

  const detailHref = (card: MarketplaceCard) =>
    card.itemType === 'minifig' ? `/minifigs/${card.itemNo}` : `/sets/${card.itemNo}`;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 20px 80px' }}>
      <h1
        style={{
          fontSize: 'var(--text-3xl)',
          fontWeight: 700,
          color: '#171717',
          margin: '0 0 12px',
          letterSpacing: '-0.02em',
        }}
      >
        {t('marketplace.title') || 'Whatnot Marketplace'}
      </h1>
      <p style={{ fontSize: 'var(--text-base)', color: '#737373', margin: '0 0 8px', lineHeight: 1.6 }}>
        {t('marketplace.subtitle') ||
          'Search 18,000 minifigures and 20,000 sets, then jump straight to live Whatnot listings.'}
      </p>
      <p style={{ fontSize: 'var(--text-sm)', color: '#a3a3a3', margin: '0 0 32px' }}>
        {t('marketplace.disclosure') ||
          'We may earn a commission on purchases made through these links.'}
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
        <div style={{ display: 'flex', border: '1px solid #e5e5e5', borderRadius: '8px', overflow: 'hidden' }}>
          {(['minifig', 'set'] as ItemType[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setItemType(option)}
              style={{
                padding: '10px 20px',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: itemType === option ? '#3b82f6' : '#ffffff',
                color: itemType === option ? '#ffffff' : '#171717',
              }}
            >
              {option === 'minifig'
                ? t('marketplace.minifigs') || 'Minifigures'
                : t('marketplace.sets') || 'Sets'}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('marketplace.searchPlaceholder') || 'Search by name or item number...'}
          style={{
            flex: '1 1 240px',
            padding: '10px 14px',
            fontSize: 'var(--text-base)',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            outline: 'none',
          }}
        />

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOption)}
          style={{
            padding: '10px 14px',
            fontSize: 'var(--text-sm)',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            background: '#ffffff',
            cursor: 'pointer',
          }}
        >
          <option value="popular">{t('marketplace.sortPopular') || 'Most collected'}</option>
          <option value="newest">{t('marketplace.sortNewest') || 'Newest first'}</option>
          <option value="name">{t('marketplace.sortName') || 'Name A-Z'}</option>
        </select>
      </div>

      {!loading && !failed && (
        <p style={{ fontSize: 'var(--text-sm)', color: '#737373', margin: '0 0 20px' }}>
          {(t('marketplace.resultCount') || '{count} items').replace(
            '{count}',
            total.toLocaleString()
          )}
        </p>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div
            className="animate-spin"
            style={{
              display: 'inline-block',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              borderBottom: '2px solid #9ca3af',
            }}
          />
        </div>
      ) : failed ? (
        <p style={{ textAlign: 'center', padding: '64px 0', color: '#737373' }}>
          {t('marketplace.error') || "We couldn't load listings right now. Try again in a moment."}
        </p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '64px 0', color: '#737373' }}>
          {t('marketplace.empty') || 'Nothing matched that search.'}
        </p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '16px',
            }}
          >
            {items.map((card) => (
              <div
                key={`${card.itemType}-${card.itemNo}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                {/* The card body goes to our own page — the Whatnot button below
                    is the only thing that sends the visitor off site. */}
                <Link
                  href={detailHref(card)}
                  style={{ textDecoration: 'none', color: 'inherit', padding: '12px 12px 0' }}
                >
                  <div
                    style={{
                      position: 'relative',
                      height: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#525252',
                        background: '#f5f5f5',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {card.itemNo}
                    </span>
                    {card.imageUrl && (
                      // Plain <img>: catalog images come from BrickLink and
                      // next/image is set to unoptimized anyway (next.config.js).
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        loading="lazy"
                        style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'contain' }}
                      />
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: '#171717',
                      margin: '12px 0 4px',
                      lineHeight: 1.4,
                    }}
                  >
                    {card.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 12px' }}>
                    {card.categoryName}
                    {card.yearReleased ? ` · ${card.yearReleased}` : ''}
                  </p>
                </Link>

                <a
                  href={card.whatnotUrl}
                  target="_blank"
                  // sponsored: this is a paid affiliate link and Google expects
                  // it labelled. noopener: never hand window.opener to a
                  // third-party tab.
                  rel="sponsored nofollow noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    margin: 'auto 12px 12px',
                    padding: '9px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#ffffff',
                    background: '#171717',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  <ShoppingBagIcon style={{ width: '15px', height: '15px', color: '#facc15' }} />
                  {t('marketplace.viewOnWhatnot') || 'View on Whatnot'}
                </a>
              </div>
            ))}
          </div>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button
                type="button"
                onClick={() => fetchPage(items.length)}
                disabled={loadingMore}
                style={{
                  padding: '12px 28px',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  color: '#171717',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: loadingMore ? 'default' : 'pointer',
                  opacity: loadingMore ? 0.6 : 1,
                }}
              >
                {loadingMore
                  ? t('marketplace.loading') || 'Loading...'
                  : t('marketplace.loadMore') || 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

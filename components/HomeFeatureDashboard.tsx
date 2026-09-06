'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PlusIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/components/TranslationProvider';
import { addToGuestCollection, getGuestCollection } from '@/lib/guestCollectionStorage';

/**
 * The homepage feature dashboard.
 *
 * Three cards, each one a feature someone can actually use without leaving
 * the page.
 *
 * It exists because the seller tools — the export suite and the Whatnot
 * marketplace, the strongest thing FigTracker has after the price itself —
 * appeared nowhere on the homepage except the footer, 4,000 pixels down.
 *
 * There is deliberately no pricing card: the hero search directly above
 * already does that, and a second search box would just be the same control
 * twice.
 *
 * Two cards work in place and cost nothing to run. The third points at
 * Premium: the identifier calls a paid vision API, and app/api/scan/identify
 * already requires a subscription and caps usage at 30 scans a day. Letting
 * anyone try it from the homepage would be handing out someone else's money.
 *
 * Everything real: real prices, a real guest collection that persists to the
 * export tool, real affiliate links. Nothing here is a mock-up of the product.
 */

interface MarketplaceCard {
  itemNo: string;
  name: string;
  priceUsd: number | null;
  imageUrl: string | null;
  whatnotUrl: string;
  itemType: 'minifig' | 'set';
}

const CARD: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  background: '#ffffff',
  border: '1px solid #e5e5e5',
  borderRadius: '14px',
  overflow: 'hidden',
  minHeight: '300px',
};

const HERO: React.CSSProperties = {
  height: '110px',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: '6px',
  padding: '12px',
  position: 'relative',
};

const TAG: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  left: '12px',
  fontSize: '10px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  background: 'rgba(255,255,255,0.92)',
  color: '#525252',
  padding: '3px 9px',
  borderRadius: '20px',
  fontWeight: 600,
};

const BODY: React.CSSProperties = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const TITLE: React.CSSProperties = {
  fontSize: 'var(--text-base)',
  fontWeight: 700,
  color: '#171717',
  margin: '0 0 4px',
  letterSpacing: '-0.01em',
};

const SUB: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  color: '#737373',
  margin: '0 0 14px',
  lineHeight: 1.5,
};

const PRIMARY: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  border: 'none',
  background: '#171717',
  color: '#ffffff',
  borderRadius: '20px',
  padding: '9px 16px',
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'none',
  alignSelf: 'flex-start',
};

const GHOST: React.CSSProperties = {
  ...PRIMARY,
  background: 'transparent',
  color: '#171717',
  border: '1px solid #d4d4d4',
};

/** A minifig image, or a soft placeholder while one is missing. */
function Fig({ src, alt, height }: { src: string | null; alt: string; height: number }) {
  if (!src) {
    return (
      <span
        style={{ width: '34px', height: `${height}px`, borderRadius: '5px', background: '#e5e5e5' }}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }}
    />
  );
}

export default function HomeFeatureDashboard() {
  const { t } = useTranslation();

  const [popular, setPopular] = useState<MarketplaceCard[]>([]);
  const [listCount, setListCount] = useState(0);
  const [listTotal, setListTotal] = useState(0);
  const [added, setAdded] = useState<string | null>(null);

  // Popular items feed the imagery and the quick-add rows, so one request
  // covers all three cards.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/marketplace?limit=6')
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json?.success) setPopular(json.data.items ?? []);
      })
      .catch(() => {
        /* the cards degrade to placeholders */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshList = useCallback(() => {
    const items = getGuestCollection();
    setListCount(items.length);
    setListTotal(items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0));
  }, []);

  useEffect(refreshList, [refreshList]);

  /** Adds to the same guest collection the export tool reads. */
  const addToList = useCallback(
    (card: MarketplaceCard) => {
      addToGuestCollection({
        itemNo: card.itemNo,
        itemType: card.itemType,
        name: card.name,
        imageUrl: card.imageUrl || '',
        price: card.priceUsd || 0,
        condition: 'new',
        quantity: 1,
        action: 'sell',
      });
      setAdded(card.itemNo);
      refreshList();
      window.setTimeout(() => setAdded(null), 1600);
    },
    [refreshList]
  );

  const listCandidates = popular.slice(0, 3);

  return (
    <section style={{ padding: '8px 20px 56px', background: '#ffffff' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
        }}
      >
        {/* 1 — build a sell list --------------------------------------------- */}
        <div style={CARD}>
          <div style={{ ...HERO, background: '#edf6f1' }}>
            <span style={TAG}>{t('homeDash.free') || 'Free'}</span>
            {(popular.slice(3, 5).length ? popular.slice(3, 5) : [null, null]).map((item, i) => (
              <Fig
                key={item?.itemNo ?? i}
                src={item?.imageUrl ?? null}
                alt={item?.name ?? ''}
                height={[70, 54][i]}
              />
            ))}
          </div>
          <div style={BODY}>
            <p style={TITLE}>{t('homeDash.list.title') || 'Building a sell list?'}</p>
            <p style={SUB}>
              {t('homeDash.list.subtitle') ||
                'Add items and we write the upload file — Whatnot, BrickLink or eBay.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
              {listCandidates.map((item) => (
                <button
                  key={item.itemNo}
                  type="button"
                  onClick={() => addToList(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '6px 8px',
                    fontSize: '12px',
                    background: '#fafafa',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {added === item.itemNo ? (
                    <CheckIcon style={{ width: '14px', height: '14px', color: '#16a34a', flexShrink: 0 }} />
                  ) : (
                    <PlusIcon style={{ width: '14px', height: '14px', color: '#737373', flexShrink: 0 }} />
                  )}
                  <span
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: '#171717',
                    }}
                  >
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 600, color: '#171717' }}>
                    ${item.priceUsd?.toFixed(2) ?? '—'}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 'auto' }}>
              <span
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  color: '#171717',
                  letterSpacing: '-0.02em',
                }}
              >
                ${listTotal.toFixed(2)}
              </span>
              <p style={{ fontSize: '12px', color: '#737373', margin: '4px 0 10px' }}>
                {listCount === 0
                  ? t('homeDash.list.empty') || 'Nothing in your list yet'
                  : (t('homeDash.list.ready') || '{count} items · file ready').replace(
                      '{count}',
                      String(listCount)
                    )}
              </p>
              {listCount > 0 && (
                <Link href="/export" style={{ ...PRIMARY, background: '#0F6E56' }}>
                  {t('homeDash.list.cta') || 'Get the file'}
                  <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 2 — buy on Whatnot ------------------------------------------------ */}
        <div style={CARD}>
          <div style={{ ...HERO, background: '#fbf2e8' }}>
            <span style={TAG}>{t('homeDash.free') || 'Free'}</span>
            {(popular.slice(1, 3).length ? popular.slice(1, 3) : [null, null]).map((item, i) => (
              <Fig
                key={item?.itemNo ?? i}
                src={item?.imageUrl ?? null}
                alt={item?.name ?? ''}
                height={[66, 58][i]}
              />
            ))}
          </div>
          <div style={BODY}>
            <p style={TITLE}>{t('homeDash.buy.title') || 'Want to buy one?'}</p>
            <p style={SUB}>
              {t('homeDash.buy.subtitle') || 'Jump straight to live Whatnot listings.'}
            </p>

            <div style={{ marginBottom: '12px' }}>
              {popular.slice(0, 3).map((item) => (
                <a
                  key={item.itemNo}
                  href={item.whatnotUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '6px 0',
                    fontSize: '12px',
                    borderBottom: '1px solid #f5f5f5',
                    textDecoration: 'none',
                    color: '#171717',
                  }}
                >
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 600, flexShrink: 0 }}>
                    ${item.priceUsd?.toFixed(2) ?? '—'}
                  </span>
                </a>
              ))}
            </div>

            <Link href="/marketplace" style={{ ...GHOST, marginTop: 'auto' }}>
              {t('homeDash.buy.cta') || 'Browse marketplace'}
              <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>
        </div>

        {/* 3 — identify (Premium) -------------------------------------------- */}
        <div style={CARD}>
          <div style={{ ...HERO, background: '#f4f1fb' }}>
            <span style={{ ...TAG, background: '#fef3c7', color: '#92400e' }}>
              {t('homeDash.premium') || 'Premium'}
            </span>
            <Fig
              src={popular[5]?.imageUrl ?? popular[0]?.imageUrl ?? null}
              alt={popular[5]?.name ?? ''}
              height={68}
            />
          </div>
          <div style={BODY}>
            <p style={TITLE}>{t('homeDash.identify.title') || "Don't know what it is?"}</p>
            <p style={SUB}>
              {t('homeDash.identify.subtitle') ||
                'Photograph a minifigure and we name it, price it and add it to your list.'}
            </p>

            <div
              style={{
                border: '1px dashed #d4d4d4',
                borderRadius: '9px',
                padding: '18px 12px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#a3a3a3',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
              }}
            >
              <SparklesIcon style={{ width: '15px', height: '15px' }} />
              {t('homeDash.identify.hint') || 'Photo in, minifigure out'}
            </div>

            <div style={{ marginTop: 'auto' }}>
              <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 10px' }}>
                {t('homeDash.identify.note') || 'Included with Premium · 30 scans a day'}
              </p>
              <Link href="/premium" style={PRIMARY}>
                {t('homeDash.identify.cta') || 'See Premium'}
                <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

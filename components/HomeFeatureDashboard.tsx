'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '@/components/TranslationProvider';
import { getGuestCollection } from '@/lib/guestCollectionStorage';

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
 * already requires a subscription, and the daily ceiling behind it is an
 * abuse guard set far above real use rather than a product limit. Letting
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
  minHeight: '264px',
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

/**
 * The site's button, not a new one.
 *
 * These cards previously used 20px pills in three one-off colours, which made
 * them the only elements on the homepage not sharing its 8px radius, and gave
 * three side-by-side actions equal visual weight — so none of them read as the
 * primary one. Blue #3b82f6 at 8px is the same button as Sign Up in the header.
 */
const PRIMARY: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  border: '1px solid transparent',
  background: '#3b82f6',
  color: '#ffffff',
  borderRadius: '8px',
  padding: '10px 18px',
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

/**
 * A miniature of the file this card writes.
 *
 * The header used to be two minifigures floating on a tint, which looked
 * pleasant and said nothing — a sell-list card should show a sell list. This
 * is a cropped sheet of rows, sitting slightly below the fold of the header so
 * it reads as a document continuing past the edge rather than a widget.
 */
function ListPreview({ items }: { items: MarketplaceCard[] }) {
  const rows = items.length ? items.slice(0, 3) : [null, null, null];

  return (
    <div
      style={{
        position: 'absolute',
        left: '22px',
        right: '22px',
        bottom: 0,
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderBottom: 'none',
        borderRadius: '7px 7px 0 0',
        padding: '7px 9px 0',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}
    >
      {rows.map((item, i) => (
        <div
          key={item?.itemNo ?? i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '3px 0',
            borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none',
            fontSize: '10px',
            color: '#525252',
          }}
        >
          {item?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              loading="lazy"
              style={{ width: '14px', height: '15px', objectFit: 'contain', flexShrink: 0 }}
            />
          ) : (
            <span style={{ width: '14px', height: '15px', background: '#eee', borderRadius: '2px', flexShrink: 0 }} />
          )}
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item?.name ?? '\u00a0'}
          </span>
          <span style={{ fontWeight: 600, color: '#171717', flexShrink: 0 }}>
            {item?.priceUsd != null ? `$${item.priceUsd.toFixed(2)}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}


/**
 * A miniature of a pair of marketplace listings.
 *
 * Same reasoning as ListPreview: two minifigures floating on a tint said
 * nothing about what the card does. A "buy one" card should show something you
 * could buy, so this is a cropped pair of result tiles.
 *
 * Deliberately NOT dressed as live Whatnot listings. The price is our own
 * blend out of priceCache and the link is a Whatnot search, not a listing —
 * there is no Whatnot feed to read (see CLAUDE.md). An earlier version carried
 * a red LIVE badge, which promised seller inventory we cannot see.
 */
function ListingPreview({ items }: { items: MarketplaceCard[] }) {
  const tiles = items.length ? items.slice(0, 2) : [null, null];

  return (
    <div
      style={{
        position: 'absolute',
        left: '22px',
        right: '22px',
        bottom: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
      }}
    >
      {tiles.map((item, i) => (
        <div
          key={item?.itemNo ?? i}
          style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderBottom: 'none',
            borderRadius: '7px 7px 0 0',
            padding: '7px 8px 0',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            position: 'relative',
            // Without this the nowrap name forces the grid column wider than
            // 1fr and the two tiles overlap.
            minWidth: 0,
          }}
        >
          <div style={{ height: '34px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            {item?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt=""
                loading="lazy"
                style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ width: '20px', height: '30px', background: '#eee', borderRadius: '2px' }} />
            )}
          </div>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '9px',
              color: '#525252',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item?.name ?? '\u00a0'}
          </p>
          <p style={{ margin: '1px 0 5px', fontSize: '11px', fontWeight: 700, color: '#171717' }}>
            {item?.priceUsd != null ? `$${item.priceUsd.toFixed(2)}` : '\u00a0'}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * A miniature of what a scan gives back.
 *
 * The header showed a lone minifigure, which is the *input* to the identifier,
 * not the output — it looked identical to every other minifigure on the page.
 * This is the result card instead: the match, its catalogue number and its
 * price, which is the thing worth paying for. No confidence percentage: we
 * would be inventing the number, and an invented accuracy claim is not
 * decoration.
 */
function IdentifyPreview({ item, label }: { item: MarketplaceCard | null; label: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '22px',
        right: '22px',
        bottom: 0,
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderBottom: 'none',
        borderRadius: '7px 7px 0 0',
        padding: '9px 10px 10px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {item?.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          style={{ height: '42px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
        />
      ) : (
        <span style={{ width: '26px', height: '42px', background: '#eee', borderRadius: '2px', flexShrink: 0 }} />
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '8px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#15803d',
            background: '#f0fdf4',
            borderRadius: '20px',
            padding: '2px 6px',
          }}
        >
          <CheckCircleIcon style={{ width: '9px', height: '9px' }} />
          {label}
        </span>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: '10px',
            color: '#525252',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.name ?? '\u00a0'}
        </p>
        <p style={{ margin: '1px 0 0', fontSize: '12px', fontWeight: 700, color: '#171717' }}>
          {item?.priceUsd != null ? `$${item.priceUsd.toFixed(2)}` : '\u00a0'}
        </p>
      </div>
    </div>
  );
}

export default function HomeFeatureDashboard() {
  const { t } = useTranslation();

  const [popular, setPopular] = useState<MarketplaceCard[]>([]);
  const [listCount, setListCount] = useState(0);

  // Popular items feed the imagery on all three cards, so one request covers
  // the whole dashboard. They are illustration only — never something we ask
  // the visitor to add, since nobody wants a stranger's minifigures on their
  // own sell list.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/marketplace?limit=8')
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
    setListCount(getGuestCollection().length);
  }, []);

  useEffect(refreshList, [refreshList]);

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
          <div style={{ ...HERO, background: '#edf6f1', overflow: 'hidden' }}>
            <span style={{ ...TAG, zIndex: 1 }}>{t('homeDash.free') || 'Free'}</span>
            <ListPreview items={popular} />
          </div>
          <div style={BODY}>
            <p style={TITLE}>{t('homeDash.list.title') || 'Sell 20 figures without typing 20 listings'}</p>
            <p style={SUB}>
              {t('homeDash.list.subtitle') ||
                'Add your items — we write the upload file for Whatnot, BrickLink or eBay.'}
            </p>

            <div style={{ marginTop: 'auto' }}>
              {listCount > 0 && (
                <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 10px' }}>
                  {(t('homeDash.list.ready') || '{count} items · file ready').replace(
                    '{count}',
                    String(listCount)
                  )}
                </p>
              )}
              <Link href="/export" style={PRIMARY}>
                {listCount > 0
                  ? t('homeDash.list.cta') || 'Get the file'
                  : t('homeDash.list.ctaEmpty') || 'Build my sell list'}
                <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
          </div>
        </div>

        {/* 2 — buy on Whatnot ------------------------------------------------ */}
        <div style={CARD}>
          <div style={{ ...HERO, background: '#fbf2e8', overflow: 'hidden' }}>
            <span style={{ ...TAG, zIndex: 1 }}>{t('homeDash.free') || 'Free'}</span>
            <ListingPreview items={popular.slice(3, 5)} />
          </div>
          <div style={BODY}>
            <p style={TITLE}>{t('homeDash.buy.title') || 'Find one to buy on Whatnot'}</p>
            <p style={SUB}>
              {t('homeDash.buy.subtitle') || 'Search Whatnot for any minifigure or set.'}
            </p>

            <Link href="/marketplace" style={{ ...GHOST, marginTop: 'auto' }}>
              {t('homeDash.buy.cta') || 'Search Whatnot'}
              <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>
        </div>

        {/* 3 — identify (Premium) -------------------------------------------- */}
        <div style={CARD}>
          <div style={{ ...HERO, background: '#f4f1fb', overflow: 'hidden' }}>
            <span style={{ ...TAG, background: '#fef3c7', color: '#92400e', zIndex: 1 }}>
              {t('homeDash.premium') || 'Premium'}
            </span>
            <IdentifyPreview
              item={popular[5] ?? popular[0] ?? null}
              label={t('homeDash.identify.badge') || 'Identified'}
            />
          </div>
          <div style={BODY}>
            <p style={TITLE}>{t('homeDash.identify.title') || 'Name any minifigure from a photo'}</p>
            <p style={SUB}>
              {t('homeDash.identify.subtitle') ||
                'We tell you what it is and what it\'s worth.'}
            </p>

            <div style={{ marginTop: 'auto' }}>
              <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 10px' }}>
                {t('homeDash.identify.note') || 'Included with Premium · unlimited scans'}
              </p>
              {/* /identify, not /premium: the label promises the tool, so it has to
                  land on the tool. That page shows the widget to subscribers and
                  the upgrade teaser to everyone else, so the paywall still does
                  its job without the button lying about where it goes. */}
              <Link href="/identify" style={GHOST}>
                {t('homeDash.identify.cta') || 'Try the identifier'}
                <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

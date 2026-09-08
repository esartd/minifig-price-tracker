'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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
 * marketplace, the strongest thing IntoBrick has after the price itself —
 * appeared nowhere on the homepage except the footer, 4,000 pixels down.
 *
 * There is deliberately no pricing card: the hero search directly above
 * already does that, and a second search box would just be the same control
 * twice.
 *
 * All three cards work in place, signed out, and cost nothing to run. That is
 * the entry condition for this group, not a nice-to-have: the heading says no
 * account is needed, so a card that needs one cannot go here. The photo
 * identifier is Premium-only and lives in HomeMoreFeatures for exactly that
 * reason; the collection card took its place.
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
  height: '150px',
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
  borderRadius: '999px',
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
        // Anchored to the top, not the bottom: hanging off the bottom left a
        // band of dead tint above each mock-up whose height varied per card.
        // Starting just under the tag shows more of the artwork and lines the
        // three cards up with one another.
        top: '42px',
        bottom: 0,
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderBottom: 'none',
        borderRadius: '7px 7px 0 0',
        padding: '9px 11px 0',
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
            padding: '5px 0',
            borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none',
            fontSize: '11px',
            color: '#525252',
          }}
        >
          {item?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt=""
              loading="lazy"
              style={{ width: '18px', height: '20px', objectFit: 'contain', flexShrink: 0 }}
            />
          ) : (
            <span style={{ width: '18px', height: '20px', background: '#eee', borderRadius: '2px', flexShrink: 0 }} />
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
 * A miniature of the collection page's running total.
 *
 * Deliberately NOT ListPreview, which the sell-list card uses. Both cards are
 * about "your items", so sharing one mock-up made them read as the same
 * feature twice -- the same three rows, the same tint, two different headings.
 * The collection page's actual subject is the total across everything you own,
 * so that is what this shows: the stat row from app/collection/page.tsx, with
 * a couple of rows beneath to say what is being counted.
 *
 * The figures are summed from the same real prices the other cards use, so the
 * number is arithmetic on live data rather than a designed-in placeholder.
 */
function CollectionPreview({ items, labels }: {
  items: MarketplaceCard[];
  labels: { total: string; count: string; avg: string };
}) {
  const priced = items.filter((i) => i.priceUsd != null);
  const total = priced.reduce((sum, i) => sum + (i.priceUsd ?? 0), 0);
  const avg = priced.length ? total / priced.length : 0;
  const rows = items.slice(0, 2);

  // With no priced items this used to render "TOTAL VALUE $0.00", which reads
  // as "your collection is worth nothing" rather than "we have not priced
  // anything yet". /api/marketplace returns priceUsd: null whenever the price
  // cache is cold or the BrickLink budget is spent, so this is a state the
  // homepage really can hit. An em dash says "no figure" without asserting a
  // figure.
  const money = (n: number) => (priced.length ? `$${n.toFixed(2)}` : '—');

  const STAT_LABEL = {
    margin: 0,
    fontSize: '8px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    color: '#737373',
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: '22px',
        right: '22px',
        top: '42px',
        bottom: 0,
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderBottom: 'none',
        borderRadius: '7px 7px 0 0',
        padding: '10px 12px 0',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 auto' }}>
          <p style={STAT_LABEL}>{labels.total}</p>
          <p style={{ margin: '1px 0 0', fontSize: '20px', fontWeight: 700, color: '#171717', lineHeight: 1.1 }}>
            {money(total)}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={STAT_LABEL}>{labels.count}</p>
          <p style={{ margin: '1px 0 0', fontSize: '12px', fontWeight: 700, color: '#171717' }}>
            {priced.length || '—'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={STAT_LABEL}>{labels.avg}</p>
          <p style={{ margin: '1px 0 0', fontSize: '12px', fontWeight: 700, color: '#171717' }}>
            {money(avg)}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '8px', borderTop: '1px solid #f5f5f5', paddingTop: '6px' }}>
        {rows.map((item, i) => (
          <div
            key={item?.itemNo ?? i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '3px 0',
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
                style={{ width: '15px', height: '17px', objectFit: 'contain', flexShrink: 0 }}
              />
            ) : (
              <span style={{ width: '15px', height: '17px', background: '#eee', borderRadius: '2px', flexShrink: 0 }} />
            )}
            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item?.name ?? '\u00a0'}
            </span>
            <span style={{ fontWeight: 600, color: '#171717', flexShrink: 0 }}>
              {item?.priceUsd != null ? `$${item.priceUsd.toFixed(2)}` : ''}
            </span>
          </div>
        ))}
      </div>
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
        // Anchored to the top, not the bottom: hanging off the bottom left a
        // band of dead tint above each mock-up whose height varied per card.
        // Starting just under the tag shows more of the artwork and lines the
        // three cards up with one another.
        top: '42px',
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
          <div style={{ height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            {item?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt=""
                loading="lazy"
                style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ width: '28px', height: '42px', background: '#eee', borderRadius: '2px' }} />
            )}
          </div>
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
          <p style={{ margin: '2px 0 7px', fontSize: '12px', fontWeight: 700, color: '#171717' }}>
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
        // Anchored to the top, not the bottom: hanging off the bottom left a
        // band of dead tint above each mock-up whose height varied per card.
        // Starting just under the tag shows more of the artwork and lines the
        // three cards up with one another.
        top: '42px',
        bottom: 0,
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderBottom: 'none',
        borderRadius: '7px 7px 0 0',
        padding: '11px 12px 13px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}
    >
      {item?.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          // Sized to fill the sheet: at 58px the identify card left 38px of
          // blank sheet below it while the other two cards filled theirs.
          style={{ height: '92px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
        />
      ) : (
        <span style={{ width: '58px', height: '92px', background: '#eee', borderRadius: '2px', flexShrink: 0 }} />
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
            fontSize: '11px',
            color: '#525252',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item?.name ?? '\u00a0'}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 700, color: '#171717' }}>
          {item?.priceUsd != null ? `$${item.priceUsd.toFixed(2)}` : '\u00a0'}
        </p>
      </div>
    </div>
  );
}

export default function HomeFeatureDashboard() {
  const { t } = useTranslation();
  /**
   * The heading claims "no account needed", which is a selling point to a
   * stranger and simply untrue once you are signed in -- it read as though the
   * site had forgotten who you were. Same three cards either way; only the
   * framing changes.
   */
  const { status } = useSession();
  const signedIn = status === 'authenticated';

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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* All three cards below genuinely work signed out: the sell list and
            the collection are both held in guest storage, and Whatnot search
            is a deep link. That is the whole basis for the heading, so nothing
            may be added here that needs an account.

            The photo identifier used to be a third card, under a comment
            claiming it "has a free tier". It does not -- app/api/scan/identify
            returns PREMIUM_REQUIRED without a subscription -- so it now lives
            in HomeMoreFeatures. A Premium tag on the card does not license a
            heading that promises no account is needed. */}
        <h2
          style={{
            margin: '0 0 20px',
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            color: '#171717',
            letterSpacing: '-0.01em',
          }}
        >
          {signedIn
            ? t('homeGroups.tryItSignedIn') || 'What you can do right now'
            : t('homeGroups.tryIt') || 'Try it now — no account needed'}
        </h2>

        <div
          style={{
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

        {/* 3 — build a collection --------------------------------------------
            Swapped in where the Premium identifier used to be. This one
            actually meets the heading's promise: a guest collection lives in
            localStorage via lib/guestCollectionStorage.ts and carries through
            to the export tool, so a stranger can build one and get something
            out of it before deciding whether to sign up. */}
        <div style={CARD}>
          {/* Indigo, not another green. The sell-list card is #edf6f1 and this
              was #ecfdf5 -- two tints four hex digits apart, side by side, on
              the two cards that already shared a mock-up. */}
          <div style={{ ...HERO, background: '#eef2ff', overflow: 'hidden' }}>
            <span style={{ ...TAG, zIndex: 1 }}>{t('homeDash.free') || 'Free'}</span>
            <CollectionPreview
              items={popular.slice(5, 8)}
              labels={{
                total: t('collection.totalValue') || 'Total Value',
                count: t('collection.totalItems') || 'Total Items',
                avg: t('collection.avgValue') || 'Avg Value',
              }}
            />
          </div>
          <div style={BODY}>
            <p style={TITLE}>
              {t('homeDash.collection.title') || 'Know what your collection is worth'}
            </p>
            <p style={SUB}>
              {t('homeDash.collection.subtitle') ||
                'Add your minifigures and sets once and we keep a running total.'}
            </p>

            <div style={{ marginTop: 'auto' }}>
              <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 10px' }}>
                {t('homeDash.collection.note') ||
                  'Starts working before you sign up — we keep it on this device.'}
              </p>
              <Link href="/collection" style={GHOST}>
                {t('homeDash.collection.cta') || 'Start a collection'}
                <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

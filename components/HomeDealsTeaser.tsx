'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DealSetCard from '@/components/DealSetCard';
import { useTranslation } from './TranslationProvider';
import { Section, sectionHeadingStyle } from '@/lib/design-system';

/**
 * Four live Walmart deals at the foot of the home page, leading to /deals.
 *
 * Replaces RecommendedSets, which put a "Shop on Amazon" button under every
 * card. Those buttons carried no price and produced clicks and no sales --
 * which is the reason the Walmart feed exists at all.
 *
 * What makes this worth the space is the bar a row has to clear to appear:
 * Walmart must be flagging a real sale AND our own suggested price must agree
 * the asking price is below what the set is worth. See the where clause in
 * app/api/lego-sale/deals/route.ts for why either signal alone gives a bad
 * page.
 */

const CACHE_KEY = 'home_deals_teaser';
// An hour. The underlying feed only refreshes once a day, so a shorter window
// would just spend database connections -- and CLAUDE.md is explicit that this
// host has a hard cap on those.
const CACHE_TTL_MS = 60 * 60 * 1000;

const COUNT = 4;

interface TeaserDeal {
  boxNo: string;
  walmartItemId: string;
  name: string;
  theme: string;
  currentPrice: number;
  listPrice: number | null;
  discountPercent: number;
  pctBelowOurPrice?: number | null;
  ourPrice?: number | null;
  currency?: string | null;
  retailer?: 'walmart' | 'amazon' | null;
  imageUrl: string;
  buyUrl: string;
}

export default function HomeDealsTeaser() {
  const { t } = useTranslation();
  const [deals, setDeals] = useState<TeaserDeal[]>([]);
  const [mode, setMode] = useState<'walmart' | 'amazon'>('walmart');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp, mode: cachedMode } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          setDeals(data);
          setMode(cachedMode === 'amazon' ? 'amazon' : 'walmart');
          setLoading(false);
          return;
        }
      }
    } catch {
      // sessionStorage is unavailable in private mode. Just fetch.
    }

    /**
     * One request, and the SERVER decides what comes back.
     *
     * It reads the visitor's country from Cloudflare and returns Walmart deals
     * in the US, or the same sets against Amazon everywhere else -- Walmart's
     * affiliate feed is US-only, while Amazon's OneLink sends each visitor to
     * their own storefront.
     *
     * The country deliberately never reaches the browser as a cookie:
     * cache-handler.js stores rendered routes in MySQL, so a cached response
     * carrying one visitor's country would be served to the next.
     */
    fetch('/api/home-deals')
      .then((res) => res.json())
      .then((data) => {
        const rows: TeaserDeal[] = (data?.items ?? []).slice(0, COUNT);
        setDeals(rows);
        setMode(data?.mode === 'amazon' ? 'amazon' : 'walmart');
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data: rows, mode: data?.mode, timestamp: Date.now() })
          );
        } catch {
          // ignore storage errors
        }
      })
      .catch(() => {
        // A failed deals lookup should cost the home page nothing. The section
        // simply does not render.
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Renders nothing while loading and nothing when empty -- no skeleton.
   *
   * app/page.tsx bands its sections by DOM position (.home-bands in
   * globals.css) rather than per-component, precisely so a section that drops
   * out lets the survivors re-alternate. A skeleton would hold the band open
   * and leave a grey gap on a page that might have no deals at all.
   */
  if (loading || deals.length === 0) return null;

  return (
    <section
      style={{
        padding: Section.padding,
        backgroundColor: Section.bg.alt,
      }}
    >
      <div style={{ maxWidth: Section.maxWidth, margin: '0 auto' }}>
        <h2 style={{ ...sectionHeadingStyle, marginBottom: '12px' }}>
          {mode === 'amazon'
            ? t('home.deals.titleAmazon') || 'Worth knowing right now'
            : t('home.deals.title') || 'On sale right now'}
        </h2>
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            marginBottom: '40px',
          }}
        >
          {mode === 'amazon'
            ? t('home.deals.subtitleAmazon') ||
              'Sets going cheap somewhere right now. We show what each is worth — check the price in your own store.'
            : t('home.deals.subtitle') ||
              'Sets Walmart has discounted, that our own price agrees are worth more than they are asking.'}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {deals.map((deal) => (
            // Same card as /deals: one link straight to Walmart, tracked, new
            // tab. Rebuilding it here would mean two cards to keep in step.
            <DealSetCard key={deal.boxNo} deal={deal} tierColor="#b91c1c" />
          ))}
        </div>

        {/* /deals is the Walmart list, so it is only offered where Walmart can
            actually be used. Sending a British reader there is the same dead
            end this whole change exists to remove. */}
        {mode === 'walmart' && (
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link
            href="/deals"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '999px',
              border: '1px solid #d4d4d4',
              background: '#ffffff',
              color: '#171717',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {t('home.deals.seeAll') || 'See all deals'}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        )}
      </div>
    </section>
  );
}

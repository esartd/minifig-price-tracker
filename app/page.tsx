'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import HeaderSearch from '@/components/HeaderSearch';
import HomeDealsTeaser from '@/components/HomeDealsTeaser';
import LeaderboardsSection from '@/components/LeaderboardsSection';
import TrendingMinifigs from '@/components/TrendingMinifigs';
import HomeWhyThisExists from '@/components/HomeWhyThisExists';
import HomeClosing from '@/components/HomeClosing';
import HomeFeatureDashboard from '@/components/HomeFeatureDashboard';
import HomeMoreFeatures from '@/components/HomeMoreFeatures';
import { useTranslation } from '@/components/TranslationProvider';

/**
 * The homepage.
 *
 * This used to BE the search page -- a component literally named
 * SearchPageContent that ran queries, rendered a result grid, and unmounted
 * every promotional section the moment anyone typed a single character. That
 * was defensible while the hero box was the only way to search the site. It
 * is not any more: there is a search box in the header of every page now, so
 * the homepage is free to do a homepage's job and say what this thing does.
 *
 * The hero box stays, because a big obvious search box is what a first-time
 * visitor looks for. It just navigates to /search instead of taking the page
 * over -- and it is the same component as the header's, so it gets the same
 * autocomplete, keyboard handling and screen-reader wiring rather than a
 * second, worse implementation of all three.
 */

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
function HomePageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Generate random minifig positions on client side only (after mount)
  const [minifigPositions, setMinifigPositions] = useState<any[]>([]);

  useEffect(() => {
    // Generate positions only on client to avoid hydration mismatch
    setMinifigPositions(generateFireworkPositions(12));
  }, []);

  /**
   * Forward the old query URLs to /search.
   *
   * While this page ran searches it answered /?q=, /?category= and
   * /?subcategory= itself. Nothing in the app links to those any more, but
   * they are sitting in browser histories, bookmarks and anything already
   * shared, and /search understands all three verbatim. replace, not push, so
   * Back does not bounce off the redirect.
   */
  useEffect(() => {
    if (searchParams.get('q') || searchParams.get('category') || searchParams.get('subcategory')) {
      router.replace(`/search?${searchParams.toString()}`);
    }
  }, [searchParams, router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff'
    }}>
      {/* Floating Background Minifigures - Only in hero section */}
      <div style={{
        position: 'absolute',
        // Clears the header rather than tucking under it. This was 72px, the
        // height of the old single-row header; the two-row header is 109px on
        // desktop and 121px on mobile, so the topmost figures -- placed at
        // 3-8% of this container -- ended up behind a sticky, opaque header and
        // looked sliced off at the nav's bottom edge. 136px clears the taller
        // of the two with room for the figure's head.
        top: '136px',
        left: 0,
        right: 0,
        // Bottom edge stays where it was: 136 + (100vh - 336) == 100vh - 200.
        height: 'calc(100vh - 336px)',
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
            className={pos.reverse ? 'floating-emoji-reverse' : 'floating-emoji'}
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
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}>
        <div className="search-page-container" style={{
          width: '100%',
          maxWidth: '100vw',
          margin: '0 auto',
          padding: '0 16px',
          boxSizing: 'border-box'
        }}>
          <div className="search-header-section" style={{
            textAlign: 'center',
            marginBottom: '56px'
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

          {/* The hero box. Same component as the header's, so Enter goes to
              /search and the dropdown behaves identically -- and, unlike the
              old one, typing in it no longer unmounts the entire page below. */}
          <div style={{
            margin: '0 auto 64px auto',
            padding: '0',
            width: '100%',
            maxWidth: '640px',
            boxSizing: 'border-box'
          }}>
            <HeaderSearch
              value={searchQuery}
              onValueChange={setSearchQuery}
              variant="hero"
            />

            {/* Says out loud that a BrickLink item number works here. Sellers
                arrive with an ID in the clipboard far more often than a name,
                and nothing on the page admitted that was allowed. Deliberately
                a line under the box rather than placeholder text: a
                placeholder is gone the moment you start typing, and it got
                clipped mid-word in this box below about 500px wide. */}
            <p className="hero-search-hint" style={{
              margin: '12px 0 0',
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              color: '#737373'
            }}>
              {t('search.header.idHint') || 'Try a name, or a BrickLink ID like sw0001 or 75192-1'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats. Always mounted now -- this whole block used to be torn down
          the moment anyone typed a character into the hero box. */}
      <div style={{
        maxWidth: '1000px',
        margin: '-32px auto 48px',
        padding: '0 16px'
      }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            textAlign: 'center',
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '24px 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}>
            <div>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: '700',
                color: '#171717',
                marginBottom: '4px'
              }}>
                18,000+
              </div>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: '#737373'
              }}>
                {t('homepage.stats.minifigsTracked')}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: '700',
                color: '#171717',
                marginBottom: '4px'
              }}>
                20,000+
              </div>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: '#737373'
              }}>
                {t('homepage.stats.setsInCatalog')}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: '700',
                color: '#171717',
                marginBottom: '4px'
              }}>
                {t('homepage.stats.realTime')}
              </div>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: '#737373'
              }}>
                {t('homepage.stats.bricklinkPricing')}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: '700',
                color: '#171717',
                marginBottom: '4px'
              }}>
                {t('homepage.stats.free')}
              </div>
              <div style={{
                fontSize: 'var(--text-xs)',
                color: '#737373'
              }}>
                {t('homepage.stats.forCollectorsSellers')}
              </div>
            </div>
          </div>
        </div>

      {/* Two labelled groups, in the order a stranger reads them.

          First, the things that work with no account at all -- the guest sell
          list, Whatnot search and the photo identifier. Those are what someone
          who has never heard of this site can actually try, so they lead.

          Then the reasons to come back. Leaderboards and recommended sets go
          last on purpose: both rank or suggest against a collection the
          first-time visitor has not built yet, so they mean nothing until the
          groups above have done their job. */}
      {/* Why any of this exists, before the features it explains. A stranger
          has no reason to care that we compute a price until they know what
          is wrong with the price they have been using. */}
      <HomeWhyThisExists />

      {/* Tonal banding is positional, not per-component -- see .home-bands in
          globals.css. TrendingMinifigs and HomeDealsTeaser both return null
          when they have no data, so hard-coding a tone into each component
          left two identical bands touching whenever one dropped out. Keyed off
          DOM position, the survivors just re-alternate. */}
      <div className="home-bands">
        <HomeFeatureDashboard />
        <HomeMoreFeatures />
        <LeaderboardsSection />
        {/* Trending sits directly under the deals: someone who has just read a
            row of discounted sets is already in a browsing mood, and "what
            everyone is looking at" is the natural next thing to show them.
            No background to set here -- the banding rule below re-alternates
            on DOM position, so moving a section retones it and its
            neighbours automatically. */}
        <HomeDealsTeaser />
        <TrendingMinifigs />
      </div>

      {/* The page's ending. Outside .home-bands on purpose: it shares the
          statement band's tint rather than joining the white/#fafafa
          alternation, so the two sections that ask something of the reader
          bookend the six that inform. */}
      <HomeClosing />
    </div>
  );
}

export default function HomePage() {
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
      <HomePageContent />
    </Suspense>
  );
}

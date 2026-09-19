import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import PopularThemesSection from './stats-client';
import { getAllMinifigs } from '@/lib/catalog-static';
import { headers } from 'next/headers';
import translations from '@/translations-backup/en.json';
import translationsDe from '@/translations-backup/de.json';
import translationsFr from '@/translations-backup/fr.json';
import translationsEs from '@/translations-backup/es.json';
import { formatCompactNumberSmart } from '@/lib/format-number';
import AffiliateDashboardButtons from '@/components/AffiliateDashboardButtons';
import { ADMIN_EMAILS, isAdminEmail } from '@/lib/admin-auth';
import { getTrafficSummary } from '@/lib/visitor-countries';

function getTranslations(locale: string) {
  switch (locale) {
    case 'de': return translationsDe;
    case 'fr': return translationsFr;
    case 'es': return translationsEs;
    default: return translations;
  }
}

// Admin email - only this user can access

export default async function AdminStatsPage() {
  const session = await auth();

  // Check if user is logged in and is admin
  if (!session || !isAdminEmail(session.user?.email)) {
    redirect('/');
  }

  const headersList = await headers();
  const host = headersList.get('host') || '';
  const locale = host.startsWith('de.') ? 'de' : host.startsWith('fr.') ? 'fr' : host.startsWith('es.') ? 'es' : 'en';
  const t = getTranslations(locale).adminStats;

  // Date ranges for click stats
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  /**
   * Admin accounts, excluded from the click and funnel stats below.
   *
   * Compared against `userId`, which despite the name stores an EMAIL on
   * AffiliateClick and MonetizationEvent -- verified against 218 non-null rows,
   * every one an address and not a cuid. Do not "fix" it to a user ID: that
   * comparison never matches and silently counts our own testing in every
   * figure on this page.
   */
  const adminEmailPlaceholders = ADMIN_EMAILS.map(() => '?').join(', ') || "''";

  // Get catalog count
  const catalog = await getAllMinifigs();
  const catalogCount = catalog.length;

  // Get all the stats (excluding admin account)
  const [
    totalUsers,
    totalCollectionItems,
    totalPersonalItems,
    totalPriceCache,
    recentUsers,
    allUsers,
    totalClicks,
    clicks24h,
    clicks7d,
    clicks30d,
    topClickedProducts,
    clicksByPlatform,
    unreadFeedback,
  ] = await Promise.all([
    prisma.user.count({
      where: { email: { notIn: ADMIN_EMAILS } }
    }),
    prisma.collectionItem.count({
      where: { User: { email: { notIn: ADMIN_EMAILS } } }
    }),
    prisma.personalCollectionItem.count({
      where: { User: { email: { notIn: ADMIN_EMAILS } } }
    }),
    prisma.priceCache.count(),
    prisma.user.findMany({
      where: { email: { notIn: ADMIN_EMAILS } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            CollectionItem: true,
            PersonalCollectionItem: true,
          }
        }
      }
    }),
    // Fetch all users to sort by TOTAL items (not just one collection type)
    prisma.user.findMany({
      where: { email: { notIn: ADMIN_EMAILS } },
      select: {
        email: true,
        name: true,
        _count: {
          select: {
            CollectionItem: true,
            PersonalCollectionItem: true,
          }
        }
      }
    }),
    // Affiliate click stats (excluding admin clicks)
    prisma.affiliateClick.count({
      where: {
        userId: { notIn: ADMIN_EMAILS }
      }
    }),
    prisma.affiliateClick.count({
      where: {
        clickedAt: { gte: last24Hours },
        userId: { notIn: ADMIN_EMAILS }
      }
    }),
    prisma.affiliateClick.count({
      where: {
        clickedAt: { gte: last7Days },
        userId: { notIn: ADMIN_EMAILS }
      }
    }),
    prisma.affiliateClick.count({
      where: {
        clickedAt: { gte: last30Days },
        userId: { notIn: ADMIN_EMAILS }
      }
    }),
    // Top clicked products (excluding admin)
    prisma.affiliateClick.groupBy({
      by: ['productId', 'productName', 'platform', 'productType'],
      where: {
        userId: { notIn: ADMIN_EMAILS }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    // Clicks by platform breakdown
    prisma.affiliateClick.groupBy({
      by: ['platform'],
      where: {
        userId: { notIn: ADMIN_EMAILS }
      },
      _count: { id: true },
    }),
    // Nothing emails when a feedback row lands -- this badge is the only
    // nudge, which is why it ships with the widget rather than after it.
    prisma.feedback.count({ where: { readAt: null } }),
  ]);

  // Sort by total items (PersonalCollectionItem + CollectionItem)
  const topCollectors = allUsers
    .map((user: any) => ({
      ...user,
      totalItems: user._count.CollectionItem + user._count.PersonalCollectionItem
    }))
    .filter((user: any) => user.totalItems > 0)
    .sort((a: any, b: any) => b.totalItems - a.totalItems)
    .slice(0, 20);

  const totalUserItems = totalCollectionItems + totalPersonalItems;

  // Conversion Funnel Metrics
  // Note: These queries assume MonetizationEvent table exists
  // If table doesn't exist, metrics will show 0
  let donationFunnelMetrics = {
    pricing_viewed: 0,
    inline_link_clicked: 0,
    nav_support_clicked: 0,
    support_page_viewed: 0,
    donated: 0,
  };

  let affiliateFunnelMetrics = {
    pricing_viewed: 0,
    affiliate_clicked: 0,
  };

  try {
    // Donation funnel
    const donationFunnelData = await prisma.$queryRawUnsafe<Array<{ eventType: string; count: bigint }>>(`
      SELECT eventType, COUNT(*) as count
      FROM MonetizationEvent
      WHERE eventType IN ('pricing_viewed', 'inline_link_clicked', 'nav_support_clicked', 'support_page_viewed', 'donated')
      AND (userId IS NULL OR userId NOT IN (${adminEmailPlaceholders}))
      GROUP BY eventType
    `, ...ADMIN_EMAILS);

    donationFunnelData.forEach((row: { eventType: string; count: bigint }) => {
      if (row.eventType in donationFunnelMetrics) {
        donationFunnelMetrics[row.eventType as keyof typeof donationFunnelMetrics] = Number(row.count);
      }
    });

    // Affiliate funnel
    const affiliateFunnelData = await prisma.$queryRawUnsafe<Array<{ eventType: string; count: bigint }>>(`
      SELECT eventType, COUNT(*) as count
      FROM MonetizationEvent
      WHERE eventType IN ('pricing_viewed', 'affiliate_clicked')
      AND (userId IS NULL OR userId NOT IN (${adminEmailPlaceholders}))
      GROUP BY eventType
    `, ...ADMIN_EMAILS);

    affiliateFunnelData.forEach((row: { eventType: string; count: bigint }) => {
      if (row.eventType in affiliateFunnelMetrics) {
        affiliateFunnelMetrics[row.eventType as keyof typeof affiliateFunnelMetrics] = Number(row.count);
      }
    });
  } catch (error) {
    // Table doesn't exist or query failed - use default zeros
    console.log('[Admin Stats] MonetizationEvent table not available:', error);
  }

  // Set Contents System Stats
  const { getSetContentsStats } = await import('@/lib/set-contents');
  const setContentsStats = await getSetContentsStats();

  // Get API call stats for today
  const today = new Date().toISOString().split('T')[0];
  const { PrismaClient } = await import('@prisma/client-hostinger');
  const prismaHostinger = new PrismaClient();

  const apiCallsToday = await prismaHostinger.apiCallTracker.findUnique({
    where: { date: today }
  });

  await prismaHostinger.$disconnect();

  const apiUsageToday = apiCallsToday?.call_count || 0;
  const apiUsagePercent = Math.round((apiUsageToday / 5000) * 100);

  /**
   * The funnel, and the things that quietly break it.
   *
   * Everything here is one Promise.all rather than a run of awaits. The page
   * already batched its original queries for a reason: this database is the
   * shared Hostinger instance with a 500-connections-per-hour cap, and it went
   * down under load on 15 September 2026.
   *
   * Traffic comes from GA rather than a database counter. The alternative was
   * writing a row per page view, which is one INSERT per visit including every
   * crawler hit -- and a crawler is what took the site down that same day.
   * getTrafficSummary caches for six hours in module scope, so this costs a GA
   * call once per process, not once per page load.
   */
  const [
    traffic,
    signups30d,
    signups7d,
    premiumCount,
    digestOptIns,
    setInventoryCount,
    setPersonalCount,
    wishlistCount,
    setWishlistCount,
    priceAlertCount,
    listingsCount,
    scansCount,
    unresolvedFailures,
    walmartDealCount,
    walmartNewest,
    ebayCallsToday,
  ] = await Promise.all([
    getTrafficSummary(),
    prisma.user.count({ where: { email: { notIn: ADMIN_EMAILS }, createdAt: { gte: last30Days } } }),
    prisma.user.count({ where: { email: { notIn: ADMIN_EMAILS }, createdAt: { gte: last7Days } } }),
    // Same status list the deals-digest cron uses, so "Premium" means the same
    // thing in both places.
    prisma.user.count({ where: { subscriptionStatus: { in: ['active', 'trialing'] } } }),
    prisma.user.count({ where: { dealsDigest: true } }),
    // Sets were invisible on this page entirely. They are over half the
    // collection data.
    prisma.setInventoryItem.count(),
    prisma.setPersonalCollectionItem.count(),
    prisma.wishlistItem.count(),
    prisma.setWishlistItem.count(),
    prisma.priceAlert.count(),
    prisma.listing.count(),
    prisma.scanHistory.count(),
    prisma.priceFetchFailure.groupBy({
      by: ['error_type'],
      where: { resolved: false },
      _count: { id: true },
    }),
    prisma.walmartDeal.count(),
    prisma.walmartDeal.findFirst({ orderBy: { lastUpdated: 'desc' }, select: { lastUpdated: true } }),
    // eBay rows are keyed `ebay-<date>`; BrickLink rows are the bare date.
    prisma.apiCallTracker.findUnique({ where: { date: `ebay-${today}` } }).catch(() => null),
  ]);

  const visitors30d = traffic?.last30Days.users ?? 0;
  const visitors7d = traffic?.last7Days.users ?? 0;
  /**
   * Organic, not total, as the conversion denominator.
   *
   * Direct traffic here is overwhelmingly automated -- 950 of 1,348 sessions
   * on 15 September, landing straight on /auth/signin and bouncing at 98%.
   * Dividing signups by the all-channel total reported 0.15% and read like a
   * broken site; against organic it is nearer 0.5%, which is ordinary for a
   * site that gives away its whole value without an account.
   */
  const organic30d = traffic?.last30Days.organicSessions ?? 0;
  const organic7d = traffic?.last7Days.organicSessions ?? 0;
  const nonOrganic30d = Math.max(0, (traffic?.last30Days.sessions ?? 0) - organic30d);
  // Guarded: a GA outage returns null and must not render NaN%.
  const signupRate30d = organic30d > 0 ? (signups30d / organic30d) * 100 : null;
  const premiumRate = totalUsers > 0 ? (premiumCount / totalUsers) * 100 : null;
  const MONTHLY_PRICE_USD = 4.99;

  const setItemsTotal = setInventoryCount + setPersonalCount;
  const minifigItemsTotal = totalCollectionItems + totalPersonalItems;

  const failuresTotal = unresolvedFailures.reduce((sum, row) => sum + row._count.id, 0);
  const walmartFeedAgeHours = walmartNewest?.lastUpdated
    ? Math.round((Date.now() - walmartNewest.lastUpdated.getTime()) / 36e5)
    : null;
  const ebayUsageToday = ebayCallsToday?.call_count || 0;

  /**
   * Which outbound platforms actually pay us.
   *
   * BrickLink is the most-clicked destination on the site and has no affiliate
   * programme at all -- it shut down after the LEGO acquisition, as
   * lib/affiliate-links.ts says in its own comment. Showing click counts
   * without this makes the biggest number on the page look like the best news
   * on the page.
   */
  const PLATFORM_EARNS: Record<string, boolean> = {
    amazon: true,
    ebay: true,
    walmart: true,
    whatnot: true,
    lego: true,
    bricklink: false,
  };
  const clicksTotal = clicksByPlatform.reduce((sum, p) => sum + p._count.id, 0);
  const clicksEarningNothing = clicksByPlatform
    .filter((p) => PLATFORM_EARNS[String(p.platform).toLowerCase()] === false)
    .reduce((sum, p) => sum + p._count.id, 0);
  const wastedClickShare = clicksTotal > 0 ? (clicksEarningNothing / clicksTotal) * 100 : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      padding: 'var(--space-4) 0',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 var(--space-4)',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: 'var(--space-1)',
              letterSpacing: '-0.02em',
            }}>
              {t.title}
            </h1>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: '#737373',
            }}>
              {t.subtitle}
            </p>
          </div>
          {/* Was a mailto: with every user in BCC. Two problems: 64 addresses
              URL-encoded overflows what mail clients accept, and the overflow
              is silent -- some users just never receive it and nothing reports
              an error. It also sent from a personal address rather than the
              authenticated hello@intobrick.com. This goes to the compose page
              instead, which sends one message per person with its own
              unsubscribe link. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* The only thing that tells anyone a feedback report exists.
              Nothing is emailed when one lands, so if this goes unread the
              queue goes unread -- which is why the badge shipped with the
              widget rather than being left for later. */}
          <a
            href="/admin/feedback"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: unreadFeedback > 0 ? '#dc2626' : '#ffffff',
              color: unreadFeedback > 0 ? '#ffffff' : '#404040',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              borderRadius: '999px',
              textDecoration: 'none',
              border: unreadFeedback > 0 ? 'none' : '1px solid #e5e5e5',
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {unreadFeedback > 0 ? `Feedback (${unreadFeedback} unread)` : 'Feedback'}
          </a>
          <a
            href="/admin/announcements"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: '#3b82f6',
              color: '#ffffff',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              borderRadius: '999px',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t.emailAllUsers.replace('{count}', totalUsers.toString())}
          </a>
          </div>
        </div>

        {/* The funnel, first because it is the question the rest answers:
            traffic -> signups -> Premium -> clicks that pay. Isolated totals
            cannot show where the chain leaks, and the leak is the whole point. */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: '#171717', margin: 0 }}>
              Money funnel
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: '#737373' }}>
              last 30 days · measured against search traffic, not the all-channel
              total, because direct here is mostly automated
              {traffic ? '' : ' — traffic unavailable, check GA4 credentials'}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--space-2)',
          }}>
            <FunnelStage
              label="Search visitors"
              value={organic30d ? formatCompactNumberSmart(organic30d) : '—'}
              note={
                traffic
                  ? `${organic7d} in 7d · ${formatCompactNumberSmart(nonOrganic30d)} direct/other excluded`
                  : 'no GA data'
              }
            />
            <FunnelStage
              label="Signups"
              value={signups30d}
              note={
                signupRate30d === null
                  ? '—'
                  : `${signupRate30d.toFixed(2)}% of search visitors`
              }
              tone={signupRate30d !== null && signupRate30d < 0.3 ? 'bad' : 'ok'}
            />
            <FunnelStage
              label="Premium"
              value={premiumCount}
              note={premiumRate === null ? '—' : `${premiumRate.toFixed(1)}% of all users`}
            />
            <FunnelStage
              label="Affiliate clicks"
              value={clicks30d}
              note={`${clicks7d} in 7d`}
            />
            <FunnelStage
              label="Est. monthly revenue"
              value={`$${(premiumCount * MONTHLY_PRICE_USD).toFixed(2)}`}
              note="subscriptions only — affiliate earnings are not reported back to us"
            />
          </div>

          {clicksEarningNothing > 0 && (
            <div style={{
              marginTop: 'var(--space-3)',
              padding: '12px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: 'var(--text-sm)',
              color: '#7f1d1d',
              lineHeight: 1.5,
            }}>
              <strong>{wastedClickShare.toFixed(0)}% of outbound clicks earn nothing.</strong>{' '}
              {clicksEarningNothing} of {clicksTotal} go to BrickLink, which has no
              affiliate programme. It is the most-clicked destination on the site.
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
        }}>
          <StatCard
            label={t.totalUsers}
            value={totalUsers}
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="#3b82f6"
          />
          <StatCard
            label={t.userCollections}
            /* Minifigs AND sets. This card counted minifigs only, so 559 set
               items -- more than half the collection data on the site -- did
               not appear anywhere on this page. */
            value={minifigItemsTotal + setItemsTotal}
            subtitle={`${minifigItemsTotal} minifigs · ${setItemsTotal} sets`}
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            color="#10b981"
          />
          <StatCard
            label={t.catalogItems}
            value={formatCompactNumberSmart(catalogCount)}
            subtitle={t.catalogSubtitle}
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            color="#8b5cf6"
          />
          <StatCard
            label="Affiliate Clicks (all platforms)"
            value={totalClicks}
            subtitle={t.totalAdClicksSubtitle.replace('{today}', clicks24h.toString()).replace('{thisWeek}', clicks7d.toString())}
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            }
            color="#f59e0b"
          />
        </div>

        {/* Set Contents System Stats */}
        <div className="admin-card" style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: 'var(--space-1)',
          }}>
            Set Contents System
          </h2>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            marginBottom: 'var(--space-4)',
          }}>
            Tracks which minifigs appear in which sets (Phase 1-3 complete)
          </p>

          {/* Coverage Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>Total Sets Fetched</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717' }}>
                {setContentsStats.totalSetsFetched || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>Total Minifig Mappings</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717' }}>
                {setContentsStats.totalMinifigMappings || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>User-Triggered</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#3b82f6' }}>
                {setContentsStats.bySource?.user_view || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#737373', marginTop: '4px' }}>
                Phase 2: Set pages auto-fetch
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>Cron-Seeded</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#10b981' }}>
                {setContentsStats.bySource?.cron_seed || 0}
              </div>
              <div style={{ fontSize: '11px', color: '#737373', marginTop: '4px' }}>
                Phase 4: Background seeding (target: 1,000)
              </div>
            </div>
          </div>

          {/* API Usage Today */}
          <div style={{
            background: '#fafafa',
            borderRadius: '8px',
            padding: 'var(--space-3)',
            marginBottom: 'var(--space-3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#171717' }}>
                BrickLink API Usage Today
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: apiUsagePercent > 80 ? '#ef4444' : apiUsagePercent > 50 ? '#f59e0b' : '#10b981' }}>
                {apiUsageToday} / 5,000 ({apiUsagePercent}%)
              </div>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e5e5e5',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(apiUsagePercent, 100)}%`,
                height: '100%',
                background: apiUsagePercent > 80 ? '#ef4444' : apiUsagePercent > 50 ? '#f59e0b' : '#10b981',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>

          {/* Things that break the top of the funnel without announcing it.
              The BrickLink budget bar above already existed; these did not. */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-3)',
          }}>
            <div style={{ padding: 'var(--space-3)', background: '#fafafa', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '6px' }}>eBay API calls today</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: '#171717' }}>
                {ebayUsageToday}
              </div>
              <div style={{ fontSize: '11px', color: '#737373', marginTop: '4px' }}>
                tracked separately from BrickLink
              </div>
            </div>

            <div style={{ padding: 'var(--space-3)', background: '#fafafa', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '6px' }}>Unresolved price failures</div>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                color: failuresTotal > 0 ? '#f59e0b' : '#10b981',
              }}>
                {failuresTotal}
              </div>
              <div style={{ fontSize: '11px', color: '#737373', marginTop: '4px' }}>
                {unresolvedFailures.length > 0
                  ? unresolvedFailures.map((f) => `${f._count.id} ${f.error_type}`).join(', ')
                  : 'none outstanding'}
              </div>
            </div>

            <div style={{ padding: 'var(--space-3)', background: '#fafafa', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '6px' }}>Walmart deals feed</div>
              <div style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                /* The sync runs daily at 09:00 UTC. Past about a day and a half
                   it has missed a run, and /deals is quietly serving stale
                   prices with nothing on the page to say so. */
                color: walmartFeedAgeHours !== null && walmartFeedAgeHours > 36 ? '#ef4444' : '#171717',
              }}>
                {formatCompactNumberSmart(walmartDealCount)}
              </div>
              <div style={{ fontSize: '11px', color: '#737373', marginTop: '4px' }}>
                {walmartFeedAgeHours === null
                  ? 'never synced'
                  : `refreshed ${walmartFeedAgeHours}h ago`}
              </div>
            </div>
          </div>

          {/* Cron Controls */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
          }}>
            <a
              href="/api/cron/seed-set-contents"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: '#10b981',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '600',
                borderRadius: '999px',
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Trigger Cron Manually (seeds 200 sets)
            </a>
            <div style={{
              padding: '10px 16px',
              background: '#f5f5f5',
              color: '#737373',
              fontSize: '12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
            }}>
              <svg style={{ width: '14px', height: '14px', marginRight: '6px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Scheduled: Daily at 3am (200 sets/day, ~10min runtime)
            </div>
          </div>
        </div>

        {/* Affiliate Click Stats */}
        <div className="admin-card" style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: 'var(--space-3)',
          }}>
            {t.affiliateClickPerformance}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>{t.last24Hours}</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717' }}>{clicks24h}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>{t.last7Days}</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717' }}>{clicks7d}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>{t.last30Days}</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717' }}>{clicks30d}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>{t.allTime}</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717' }}>{totalClicks}</div>
            </div>
          </div>

          {/* Platform Breakdown */}
          <div style={{
            padding: 'var(--space-3)',
            background: '#fafafa',
            borderRadius: '8px',
            marginBottom: 'var(--space-4)',
          }}>
            <h3 style={{
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: '#737373',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-2)',
            }}>
              Clicks by Platform
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 'var(--space-3)',
            }}>
              {clicksByPlatform.map((item: any) => (
                <div key={item.platform} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      background: item.platform === 'amazon' ? '#ff990015' : item.platform === 'ebay' ? '#e5322015' : '#3b82f615',
                      color: item.platform === 'amazon' ? '#ff9900' : item.platform === 'ebay' ? '#e53220' : '#3b82f6',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                    }}>
                      {item.platform}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      color: '#171717',
                    }}>
                      {item._count.id}
                    </div>
                    {/* A click count is only good news if the destination pays.
                        BrickLink is the biggest number here and earns nothing. */}
                    {PLATFORM_EARNS[String(item.platform).toLowerCase()] === false && (
                      <div style={{ fontSize: '11px', color: '#b91c1c', fontWeight: 600 }}>
                        earns $0
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {clicksByPlatform.length === 0 && (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  color: '#737373',
                  fontSize: '14px',
                  padding: 'var(--space-2)',
                }}>
                  No clicks tracked yet
                </div>
              )}
            </div>
          </div>

          <AffiliateDashboardButtons />

          {topClickedProducts.length > 0 && (
            <>
              <div style={{ height: '1px', background: '#e5e5e5', margin: 'var(--space-4) 0' }} />
              <h3 style={{
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: 'var(--space-2)',
              }}>
                {t.topClickedProducts}
              </h3>
              <div>
                {/* Desktop table */}
                <div style={{ display: 'none' }} className="desktop-table">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                        <th style={{
                          padding: '12px 8px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#737373',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          {t.product}
                        </th>
                        <th style={{
                          padding: '12px 8px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#737373',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          {t.type}
                        </th>
                        <th style={{
                          padding: '12px 8px',
                          textAlign: 'right',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#737373',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          {t.clicks}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topClickedProducts.map((product: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '12px 8px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#171717', marginBottom: '4px' }}>
                              {product.productName || product.productId}
                            </div>
                            <div style={{ fontSize: '12px', color: '#737373', fontFamily: 'monospace' }}>
                              {product.productId}
                            </div>
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              background: product.platform === 'amazon' ? '#ff990015' : '#3b82f615',
                              color: product.platform === 'amazon' ? '#ff9900' : '#3b82f6',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}>
                              {product.platform}
                            </span>
                          </td>
                          <td style={{
                            padding: '12px 8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#171717',
                            textAlign: 'right',
                          }}>
                            {product._count.id}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} className="mobile-cards">
                  {topClickedProducts.map((product: any, idx: number) => (
                    <div key={idx} className="mobile-card-item" style={{
                      padding: 'var(--space-3)',
                      background: '#fafafa',
                      borderRadius: '8px',
                      border: '1px solid #e5e5e5',
                    }}>
                      <div style={{ marginBottom: 'var(--space-2)' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#171717', marginBottom: '4px' }}>
                          {product.productName || product.productId}
                        </div>
                        <div style={{ fontSize: '12px', color: '#737373', fontFamily: 'monospace' }}>
                          {product.productId}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          background: product.platform === 'amazon' ? '#ff990015' : '#3b82f615',
                          color: product.platform === 'amazon' ? '#ff9900' : '#3b82f6',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {product.platform}
                        </span>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: '#171717' }}>
                          {t.clicksCount.replace('{count}', product._count.id.toString())}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <style>{`
                @media (max-width: 767px) {
                  .admin-card {
                    padding: var(--space-2) !important;
                  }
                  .mobile-card-item {
                    padding: var(--space-2) !important;
                  }
                }
                @media (min-width: 768px) {
                  .desktop-table { display: block !important; }
                  .mobile-cards { display: none !important; }
                }
              `}</style>
            </>
          )}
        </div>

        {/* Conversion Funnels */}
        <div className="admin-card" style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: 'var(--space-3)',
          }}>
            Conversion Funnels
          </h2>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: '#737373',
            marginTop: '-8px',
            marginBottom: 'var(--space-3)',
            lineHeight: 1.5,
          }}>
            Counting from 15 September 2026. Event tracking was broken before
            that — three faults stacked in /api/track-event meant every event
            except one was discarded, so the history here is genuinely absent
            rather than genuinely zero.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            {/* Donation Funnel */}
            <div>
              <h3 style={{
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: 'var(--space-3)',
              }}>
                Donation Funnel
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}>
                <FunnelStep
                  label="Pricing Viewed"
                  count={donationFunnelMetrics.pricing_viewed}
                  percentage={100}
                  isFirst
                />
                <FunnelStep
                  label="Inline Link Clicked"
                  count={donationFunnelMetrics.inline_link_clicked}
                  percentage={donationFunnelMetrics.pricing_viewed > 0
                    ? (donationFunnelMetrics.inline_link_clicked / donationFunnelMetrics.pricing_viewed) * 100
                    : 0}
                />
                <FunnelStep
                  label="Nav Support Clicked"
                  count={donationFunnelMetrics.nav_support_clicked}
                  percentage={donationFunnelMetrics.pricing_viewed > 0
                    ? (donationFunnelMetrics.nav_support_clicked / donationFunnelMetrics.pricing_viewed) * 100
                    : 0}
                />
                <FunnelStep
                  label="Support Page Viewed"
                  count={donationFunnelMetrics.support_page_viewed}
                  percentage={donationFunnelMetrics.pricing_viewed > 0
                    ? (donationFunnelMetrics.support_page_viewed / donationFunnelMetrics.pricing_viewed) * 100
                    : 0}
                />
                <FunnelStep
                  label="Donated"
                  count={donationFunnelMetrics.donated}
                  percentage={donationFunnelMetrics.pricing_viewed > 0
                    ? (donationFunnelMetrics.donated / donationFunnelMetrics.pricing_viewed) * 100
                    : 0}
                  isLast
                />
              </div>
            </div>

            {/* Affiliate Funnel */}
            <div>
              <h3 style={{
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: 'var(--space-3)',
              }}>
                Affiliate Funnel
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}>
                <FunnelStep
                  label="Pricing Viewed"
                  count={affiliateFunnelMetrics.pricing_viewed}
                  percentage={100}
                  isFirst
                />
                <FunnelStep
                  label="Affiliate Clicked"
                  count={affiliateFunnelMetrics.affiliate_clicked}
                  percentage={affiliateFunnelMetrics.pricing_viewed > 0
                    ? (affiliateFunnelMetrics.affiliate_clicked / affiliateFunnelMetrics.pricing_viewed) * 100
                    : 0}
                  isLast
                />
              </div>
            </div>
          </div>
        </div>

        {/* What people actually use. A feature at zero is a finding, not a
            blank -- so the zeros are shown rather than omitted. */}
        <div className="admin-card" style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: 'var(--space-3)',
          }}>
            Feature usage
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--space-3)',
          }}>
            {[
              { label: 'Wishlist items', value: wishlistCount + setWishlistCount, note: `${wishlistCount} minifigs · ${setWishlistCount} sets` },
              { label: 'Price alerts', value: priceAlertCount, note: 'across both kinds' },
              { label: 'Deals digest opt-ins', value: digestOptIns, note: 'Premium perk' },
              { label: 'Listings generated', value: listingsCount, note: 'listing generator' },
              { label: 'Scans', value: scansCount, note: 'Premium minifig scan' },
            ].map((f) => (
              <div key={f.label} style={{ padding: 'var(--space-3)', background: '#fafafa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#737373', marginBottom: '6px' }}>{f.label}</div>
                <div style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 600,
                  color: f.value === 0 ? '#a3a3a3' : '#171717',
                }}>
                  {f.value}
                </div>
                <div style={{ fontSize: '11px', color: f.value === 0 ? '#b91c1c' : '#737373', marginTop: '4px' }}>
                  {f.value === 0 ? 'never used' : f.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Themes - loaded client-side */}
        <PopularThemesSection />

        {/* Database Info */}
        <div className="admin-card" style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: 'var(--space-3)',
          }}>
            {t.databaseOverview}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            <DatabaseInfo
              title="Hostinger MySQL"
              bandwidth={t.unlimitedBandwidth}
              status={t.active}
              statusColor="#10b981"
              items={[
                t.users.replace('{count}', formatCompactNumberSmart(totalUsers)),
                t.collectionItems.replace('{count}', formatCompactNumberSmart(totalCollectionItems)),
                t.personalItems.replace('{count}', formatCompactNumberSmart(totalPersonalItems)),
                t.priceCache.replace('{count}', formatCompactNumberSmart(totalPriceCache)),
                t.affiliateClicks.replace('{count}', formatCompactNumberSmart(totalClicks)),
                t.catalog.replace('{count}', formatCompactNumberSmart(catalogCount)),
              ]}
            />
          </div>
        </div>

        {/* Recent Users */}
        <div className="admin-card" style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: 'var(--space-3)',
          }}>
            {t.recentSignups}
          </h2>
          <div>
            {/* Desktop table */}
            <div style={{ display: 'none' }} className="desktop-table">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                    <th style={{
                      padding: 'var(--space-2)',
                      textAlign: 'left',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {t.user}
                    </th>
                    <th style={{
                      padding: 'var(--space-2)',
                      textAlign: 'left',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {t.joined}
                    </th>
                    <th style={{
                      padding: 'var(--space-2)',
                      textAlign: 'right',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {t.items}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: 'var(--space-2)' }}>
                        <div style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: '500',
                          color: '#171717',
                          marginBottom: 'var(--space-0-5)',
                        }}>
                          {user.name || t.anonymous}
                        </div>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: '#737373',
                        }}>
                          {user.email}
                        </div>
                      </td>
                      <td style={{
                        padding: 'var(--space-2)',
                        fontSize: 'var(--text-sm)',
                        color: '#525252',
                      }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{
                        padding: 'var(--space-2)',
                        fontSize: 'var(--text-sm)',
                        color: '#525252',
                        textAlign: 'right',
                      }}>
                        {user._count.CollectionItem + user._count.PersonalCollectionItem}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} className="mobile-cards">
              {recentUsers.map((user: any, idx: number) => (
                <div key={idx} className="mobile-card-item" style={{
                  padding: 'var(--space-3)',
                  background: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                }}>
                  <div style={{ marginBottom: 'var(--space-2)' }}>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: '#171717',
                      marginBottom: 'var(--space-0-5)',
                    }}>
                      {user.name || 'Anonymous'}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: '#737373',
                    }}>
                      {user.email}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: '#737373' }}>
                    <span>{t.joined} {new Date(user.createdAt).toLocaleDateString()}</span>
                    <span style={{ fontWeight: '600', color: '#171717' }}>
                      {user._count.CollectionItem + user._count.PersonalCollectionItem} {t.items.toLowerCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Collectors */}
        <div className="admin-card" style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5',
          padding: 'var(--space-3)',
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: 'var(--space-3)',
          }}>
            {t.topCollectors}
          </h2>
          <div>
            {/* Desktop table */}
            <div style={{ display: 'none' }} className="desktop-table">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e5e5' }}>
                    <th style={{
                      padding: 'var(--space-2)',
                      textAlign: 'left',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: '60px',
                    }}>
                      {t.rank}
                    </th>
                    <th style={{
                      padding: 'var(--space-2)',
                      textAlign: 'left',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {t.user}
                    </th>
                    <th style={{
                      padding: 'var(--space-2)',
                      textAlign: 'right',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {t.totalItems}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCollectors.map((user: any, idx: number) => {
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{
                          padding: 'var(--space-2)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: '600',
                          color: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7f32' : '#525252',
                        }}>
                          #{idx + 1}
                        </td>
                        <td style={{ padding: 'var(--space-2)' }}>
                          <div style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: '500',
                            color: '#171717',
                            marginBottom: 'var(--space-0-5)',
                          }}>
                            {user.name || t.anonymous}
                          </div>
                          <div style={{
                            fontSize: 'var(--text-xs)',
                            color: '#737373',
                          }}>
                            {user.email}
                          </div>
                        </td>
                        <td style={{
                          padding: 'var(--space-2)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: '600',
                          color: '#171717',
                          textAlign: 'right',
                        }}>
                          {user.totalItems}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} className="mobile-cards">
              {topCollectors.map((user: any, idx: number) => (
                <div key={idx} className="mobile-card-item" style={{
                  padding: 'var(--space-3)',
                  background: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}>
                  <div style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7f32' : '#525252',
                    minWidth: '32px',
                  }}>
                    #{idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: '#171717',
                      marginBottom: 'var(--space-0-5)',
                    }}>
                      {user.name || 'Anonymous'}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: '#737373',
                    }}>
                      {user.email}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: '#171717',
                  }}>
                    {user.totalItems}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * One stage of the funnel: a number, and what share of the stage above it is.
 *
 * The share is the reason this exists. "2 signups" says nothing on its own;
 * "2 signups, 0.15% of visitors" says the site is being read and not joined,
 * which is a different problem with a different fix.
 */
function FunnelStage({
  label,
  value,
  note,
  tone = 'ok',
}: {
  label: string;
  value: number | string;
  note?: string;
  tone?: 'ok' | 'bad';
}) {
  return (
    <div style={{
      padding: 'var(--space-3)',
      background: '#fafafa',
      border: '1px solid #e5e5e5',
      borderRadius: '8px',
    }}>
      <div style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        color: '#737373',
        marginBottom: '6px',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 'var(--text-2xl)',
        fontWeight: 700,
        color: tone === 'bad' ? '#b91c1c' : '#171717',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      {note && (
        <div style={{
          marginTop: '4px',
          fontSize: 'var(--text-xs)',
          color: tone === 'bad' ? '#b91c1c' : '#737373',
          lineHeight: 1.4,
        }}>
          {note}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e5e5',
      padding: 'var(--space-3)',
      transition: 'all 0.2s',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-2)',
      }}>
        <div style={{
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          color: '#737373',
        }}>
          {label}
        </div>
        <div style={{
          color: color,
        }}>
          {icon}
        </div>
      </div>
      <div style={{
        fontSize: 'var(--text-2xl)',
        fontWeight: '600',
        color: '#171717',
        marginBottom: subtitle ? 'var(--space-1)' : '0',
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      {subtitle && (
        <div style={{
          fontSize: 'var(--text-xs)',
          color: '#737373',
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function DatabaseInfo({
  title,
  bandwidth,
  status,
  statusColor,
  items,
}: {
  title: string;
  bandwidth: string;
  status: string;
  statusColor: string;
  items: string[];
}) {
  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-2)',
      }}>
        <h3 style={{
          fontSize: 'var(--text-base)',
          fontWeight: '600',
          color: '#171717',
        }}>
          {title}
        </h3>
        <div style={{
          padding: '6px 20px',
          background: statusColor + '15',
          color: statusColor,
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
        }}>
          {status}
        </div>
      </div>
      <div style={{
        fontSize: 'var(--text-sm)',
        color: '#737373',
        marginBottom: 'var(--space-2)',
      }}>
        {bandwidth}
      </div>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}>
        {items.map((item, idx) => (
          <li key={idx} style={{
            fontSize: 'var(--text-sm)',
            color: '#525252',
            marginBottom: 'var(--space-1)',
            paddingLeft: 'var(--space-2)',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              color: '#d4d4d4',
            }}>
              •
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FunnelStep({
  label,
  count,
  percentage,
  isFirst = false,
  isLast = false,
}: {
  label: string;
  count: number;
  percentage: number;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const color = isLast ? '#10b981' : isFirst ? '#3b82f6' : '#737373';
  const bgColor = isLast ? '#10b98115' : isFirst ? '#3b82f615' : '#f5f5f5';

  return (
    <div style={{
      position: 'relative',
      paddingLeft: 'var(--space-3)',
    }}>
      {!isFirst && (
        <div style={{
          position: 'absolute',
          left: '6px',
          top: '-12px',
          width: '2px',
          height: '12px',
          background: '#e5e5e5',
        }} />
      )}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-2)',
        background: bgColor,
        borderRadius: '8px',
        border: `1px solid ${isFirst || isLast ? color + '30' : '#e5e5e5'}`,
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            color: '#171717',
            marginBottom: '2px',
          }}>
            {label}
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: '#737373',
          }}>
            {count.toLocaleString()} events
            {!isFirst && ` (${percentage.toFixed(1)}%)`}
          </div>
        </div>
        <div style={{
          fontSize: 'var(--text-lg)',
          fontWeight: '600',
          color: color,
        }}>
          {count}
        </div>
      </div>
    </div>
  );
}

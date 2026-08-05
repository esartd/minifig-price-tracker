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

function getTranslations(locale: string) {
  switch (locale) {
    case 'de': return translationsDe;
    case 'fr': return translationsFr;
    case 'es': return translationsEs;
    default: return translations;
  }
}

// Admin email - only this user can access
const ADMIN_EMAIL = 'erickkosysu@gmail.com';

export default async function AdminStatsPage() {
  const session = await auth();

  // Check if user is logged in and is admin
  if (!session || session.user?.email !== ADMIN_EMAIL) {
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

  // Admin email to exclude from click stats
  // Note: AffiliateClick.userId stores email, not user ID

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
  ] = await Promise.all([
    prisma.user.count({
      where: { email: { not: ADMIN_EMAIL } }
    }),
    prisma.collectionItem.count({
      where: { User: { email: { not: ADMIN_EMAIL } } }
    }),
    prisma.personalCollectionItem.count({
      where: { User: { email: { not: ADMIN_EMAIL } } }
    }),
    prisma.priceCache.count(),
    prisma.user.findMany({
      where: { email: { not: ADMIN_EMAIL } },
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
      where: { email: { not: ADMIN_EMAIL } },
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
        userId: { not: ADMIN_EMAIL }
      }
    }),
    prisma.affiliateClick.count({
      where: {
        clickedAt: { gte: last24Hours },
        userId: { not: ADMIN_EMAIL }
      }
    }),
    prisma.affiliateClick.count({
      where: {
        clickedAt: { gte: last7Days },
        userId: { not: ADMIN_EMAIL }
      }
    }),
    prisma.affiliateClick.count({
      where: {
        clickedAt: { gte: last30Days },
        userId: { not: ADMIN_EMAIL }
      }
    }),
    // Top clicked products (excluding admin)
    prisma.affiliateClick.groupBy({
      by: ['productId', 'productName', 'platform', 'productType'],
      where: {
        userId: { not: ADMIN_EMAIL }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    // Clicks by platform breakdown
    prisma.affiliateClick.groupBy({
      by: ['platform'],
      where: {
        userId: { not: ADMIN_EMAIL }
      },
      _count: { id: true },
    }),
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
      AND userId != ?
      GROUP BY eventType
    `, ADMIN_EMAIL);

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
      AND userId != ?
      GROUP BY eventType
    `, ADMIN_EMAIL);

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
          <a
            href={`mailto:${ADMIN_EMAIL}?bcc=${encodeURIComponent(allUsers.map((u: any) => u.email).join(','))}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: '#3b82f6',
              color: '#ffffff',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              borderRadius: '8px',
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
            value={totalUserItems}
            subtitle={t.userCollectionsSubtitle.replace('{selling}', totalCollectionItems.toString()).replace('{personal}', totalPersonalItems.toString())}
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
            label="Affiliate Clicks (Amazon + eBay)"
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
                borderRadius: '8px',
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
                  <div style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '600',
                    color: '#171717',
                  }}>
                    {item._count.id}
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

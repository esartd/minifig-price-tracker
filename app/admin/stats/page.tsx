import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma, prismaPublic } from '@/lib/prisma';
import PopularThemesSection from './stats-client';
import { getAllMinifigs } from '@/lib/catalog-static';

// Admin email - only this user can access
const ADMIN_EMAIL = 'erickkosysu@gmail.com';

export default async function AdminStatsPage() {
  const session = await auth();

  // Check if user is logged in and is admin
  if (!session || session.user?.email !== ADMIN_EMAIL) {
    redirect('/');
  }

  // Date ranges for click stats
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get admin user ID to exclude from click stats
  const adminUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    select: { id: true }
  });

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
    // Affiliate click stats (excluding admin)
    prisma.affiliateClick.count({
      where: {
        OR: [
          { userId: null },
          { userId: { not: adminUser?.id } }
        ]
      }
    }),
    prisma.affiliateClick.count({
      where: {
        clickedAt: { gte: last24Hours },
        OR: [
          { userId: null },
          { userId: { not: adminUser?.id } }
        ]
      }
    }),
    prisma.affiliateClick.count({
      where: {
        clickedAt: { gte: last7Days },
        OR: [
          { userId: null },
          { userId: { not: adminUser?.id } }
        ]
      }
    }),
    prisma.affiliateClick.count({
      where: {
        clickedAt: { gte: last30Days },
        OR: [
          { userId: null },
          { userId: { not: adminUser?.id } }
        ]
      }
    }),
    // Top clicked products (excluding admin)
    prisma.affiliateClick.groupBy({
      by: ['productId', 'productName', 'platform', 'productType'],
      where: {
        OR: [
          { userId: null },
          { userId: { not: adminUser?.id } }
        ]
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
  ]);

  // Sort by total items (PersonalCollectionItem + CollectionItem)
  const topCollectors = allUsers
    .map(user => ({
      ...user,
      totalItems: user._count.CollectionItem + user._count.PersonalCollectionItem
    }))
    .filter(user => user.totalItems > 0)
    .sort((a, b) => b.totalItems - a.totalItems)
    .slice(0, 20);

  const totalUserItems = totalCollectionItems + totalPersonalItems;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      padding: 'var(--space-6) var(--space-2)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
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
              Admin Dashboard
            </h1>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: '#737373',
            }}>
              Overview of your FigTracker platform
            </p>
          </div>
          <a
            href={`mailto:${ADMIN_EMAIL}?bcc=${allUsers.map(u => u.email).join(',')}`}
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
            Email All Users ({totalUsers})
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
            label="Total Users"
            value={totalUsers}
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            color="#3b82f6"
          />
          <StatCard
            label="User Collections"
            value={totalUserItems}
            subtitle={`${totalCollectionItems} selling, ${totalPersonalItems} personal`}
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            color="#10b981"
          />
          <StatCard
            label="Catalog Items"
            value={catalogCount.toLocaleString()}
            subtitle="Static JSON"
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            color="#8b5cf6"
          />
          <StatCard
            label="Total Ad Clicks"
            value={totalClicks}
            subtitle={`${clicks24h} today, ${clicks7d} this week`}
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            }
            color="#f59e0b"
          />
        </div>

        {/* Affiliate Click Stats */}
        <div style={{
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
            Affiliate Click Performance
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)',
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>Last 24 Hours</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717' }}>{clicks24h}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>Last 7 Days</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717' }}>{clicks7d}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>Last 30 Days</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717' }}>{clicks30d}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>All Time</div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: '#171717' }}>{totalClicks}</div>
            </div>
          </div>

          {topClickedProducts.length > 0 && (
            <>
              <div style={{ height: '1px', background: '#e5e5e5', margin: 'var(--space-4) 0' }} />
              <h3 style={{
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: 'var(--space-2)',
              }}>
                Top Clicked Products
              </h3>
              <div style={{ overflowX: 'auto' }}>
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
                        Product
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
                        Type
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
                        Clicks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topClickedProducts.map((product, idx) => (
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
            </>
          )}
        </div>

        {/* Popular Themes - loaded client-side */}
        <PopularThemesSection />

        {/* Database Info */}
        <div style={{
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
            Database Overview
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            <DatabaseInfo
              title="Hostinger MySQL"
              bandwidth="Unlimited bandwidth"
              status="Active"
              statusColor="#10b981"
              items={[
                `Users: ${totalUsers}`,
                `Collection Items: ${totalCollectionItems}`,
                `Personal Items: ${totalPersonalItems}`,
                `Price Cache: ${totalPriceCache.toLocaleString()} entries`,
                `Affiliate Clicks: ${totalClicks}`,
                `Catalog: ${catalogCount.toLocaleString()} items`,
              ]}
            />
          </div>
        </div>

        {/* Recent Users */}
        <div style={{
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
            Recent Signups
          </h2>
          <div style={{ overflowX: 'auto' }}>
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
                    User
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
                    Joined
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
                    Items
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: 'var(--space-2)' }}>
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
        </div>

        {/* Top Collectors */}
        <div style={{
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
            Top Collectors
          </h2>
          <div style={{ overflowX: 'auto' }}>
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
                    Rank
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
                    User
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
                    Total Items
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCollectors.map((user, idx) => {
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
                          {user.name || 'Anonymous'}
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

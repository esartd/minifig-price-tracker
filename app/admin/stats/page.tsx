import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma, prismaPublic } from '@/lib/prisma';

// Admin email - only this user can access
const ADMIN_EMAIL = 'erickkosysu@gmail.com';

export default async function AdminStatsPage() {
  const session = await auth();

  // Check if user is logged in and is admin
  if (!session || session.user?.email !== ADMIN_EMAIL) {
    redirect('/');
  }

  // Get all the stats
  const [
    totalUsers,
    totalCollectionItems,
    totalPersonalItems,
    totalCatalogItems,
    totalPriceCache,
    recentUsers,
    allUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.collectionItem.count(),
    prisma.personalCollectionItem.count(),
    prismaPublic.minifigCatalog.count(),
    prismaPublic.priceCache.count(),
    prisma.user.findMany({
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
        <div style={{ marginBottom: 'var(--space-6)' }}>
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
            value={totalCatalogItems.toLocaleString()}
            subtitle="On Supabase"
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            color="#8b5cf6"
          />
          <StatCard
            label="Price Cache"
            value={totalPriceCache.toLocaleString()}
            subtitle="Cached prices"
            icon={
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="#f59e0b"
          />
        </div>

        {/* Database Split Info */}
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
            Database Split Overview
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            <DatabaseInfo
              title="Neon"
              bandwidth="5GB/month"
              status="Low usage"
              statusColor="#10b981"
              items={[
                `Users: ${totalUsers}`,
                `Collection Items: ${totalCollectionItems}`,
                `Personal Items: ${totalPersonalItems}`,
              ]}
            />
            <DatabaseInfo
              title="Supabase"
              bandwidth="50GB/month"
              status="Handles traffic"
              statusColor="#3b82f6"
              items={[
                `Catalog: ${totalCatalogItems.toLocaleString()} items`,
                `Price Cache: ${totalPriceCache.toLocaleString()} entries`,
                `API Call Tracker`,
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

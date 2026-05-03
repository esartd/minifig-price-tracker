'use client';

import { useEffect, useState } from 'react';
import { UserIcon, CubeIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useTranslation } from './TranslationProvider';

interface Collector {
  displayName: string;
  count: number;
  rank: number;
}

interface Donor {
  displayName: string;
  totalAmount: number;
  rank: number;
}

export default function LeaderboardsSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'quarterly' | 'alltime'>('quarterly');
  const [minifigCollectors, setMinifigCollectors] = useState<Collector[]>([]);
  const [setCollectors, setSetCollectors] = useState<Collector[]>([]);
  const [topDonors, setTopDonors] = useState<Donor[]>([]);
  const [season, setSeason] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const period = activeTab === 'quarterly' ? 'quarterly' : 'alltime';

    // Reset loading state when tab changes to prevent flash of old data
    setLoading(true);

    // Fetch all leaderboards in a SINGLE API call to reduce database connections
    // Previously: 3 parallel calls = 3 DB connections
    // Now: 1 call = 1 DB connection (with batched queries)
    fetch(`/api/leaderboards/all?period=${period}`)
      .then(res => res.json())
      .then((response) => {
        if (response.success) {
          const data = response.data;
          setMinifigCollectors(data.minifigCollectors);
          setSetCollectors(data.setCollectors);
          setTopDonors(data.topDonors);
          setSeason(data.season);
          setDateRange(data.dateRange);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch leaderboards:', error);
        setLoading(false);
      });
  }, [activeTab]);

  // Don't render while loading
  if (loading) return null;

  return (
    <section
      style={{
        padding: '60px 20px 80px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e5e5',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Title */}
        <h2
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '700',
            color: '#171717',
            textAlign: 'center',
            marginBottom: '24px',
            letterSpacing: '-0.01em',
          }}
        >
          {t('leaderboards.title')}
        </h2>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '32px',
          }}
        >
          <button
            onClick={() => setActiveTab('quarterly')}
            style={{
              padding: '10px 24px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: activeTab === 'quarterly' ? '#3b82f6' : '#737373',
              background: activeTab === 'quarterly' ? '#eff6ff' : 'transparent',
              border: activeTab === 'quarterly' ? '1px solid #3b82f6' : '1px solid #e5e5e5',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'quarterly') {
                e.currentTarget.style.borderColor = '#d4d4d4';
                e.currentTarget.style.background = '#fafafa';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'quarterly') {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {t('leaderboards.tabQuarterly')}
          </button>
          <button
            onClick={() => setActiveTab('alltime')}
            style={{
              padding: '10px 24px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: activeTab === 'alltime' ? '#3b82f6' : '#737373',
              background: activeTab === 'alltime' ? '#eff6ff' : 'transparent',
              border: activeTab === 'alltime' ? '1px solid #3b82f6' : '1px solid #e5e5e5',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'alltime') {
                e.currentTarget.style.borderColor = '#d4d4d4';
                e.currentTarget.style.background = '#fafafa';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'alltime') {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {t('leaderboards.tabAllTime')}
          </button>
        </div>

        {/* Period Info */}
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          {activeTab === 'quarterly'
            ? t('leaderboards.quarterlyDescription', { dateRange, season })
            : t('leaderboards.alltimeDescription')
          }
        </p>

        {/* 3-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
          }}
        >
          {/* Minifig Collectors */}
          {minifigCollectors.length > 0 && (
            <LeaderboardColumn
              title={t('leaderboards.topMinifigCollectors')}
              icon={<UserIcon style={{ width: '20px', height: '20px', color: '#f59e0b' }} />}
              items={minifigCollectors}
              type="collector"
              itemType="minifigs"
              t={t}
            />
          )}

          {/* Set Collectors */}
          {setCollectors.length > 0 && (
            <LeaderboardColumn
              title={t('leaderboards.topSetCollectors')}
              icon={<CubeIcon style={{ width: '20px', height: '20px', color: '#3b82f6' }} />}
              items={setCollectors}
              type="collector"
              itemType="sets"
              t={t}
            />
          )}

          {/* Donors - Always show */}
          <DonorsColumn items={topDonors} t={t} />
        </div>
      </div>
    </section>
  );
}

// Donors Column - Always shows with empty placeholders
function DonorsColumn({ items, t }: { items: Donor[]; t: any }) {
  // Pad with empty slots to always show 5
  const paddedItems = [...items];
  while (paddedItems.length < 5) {
    paddedItems.push({
      displayName: '',
      totalAmount: 0,
      rank: paddedItems.length + 1,
    });
  }

  const isEmpty = items.length === 0;

  return (
    <div>
      <h3
        style={{
          fontSize: 'var(--text-lg)',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '20px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <HeartIcon style={{ width: '20px', height: '20px', color: '#ef4444' }} />
        {t('leaderboards.topSupporters')}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {paddedItems.map((item) => (
          item.displayName ? (
            <LeaderboardCard
              key={item.rank}
              item={item}
              type="donor"
              t={t}
            />
          ) : (
            <EmptyDonorSlot key={item.rank} rank={item.rank} t={t} />
          )
        ))}

        {/* Donate Button */}
        <a
          href="/support"
          style={{
            display: 'block',
            marginTop: '12px',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #1488cc 0%, #2b32b2 100%)',
            color: '#ffffff',
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            textAlign: 'center',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(20, 136, 204, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 136, 204, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(20, 136, 204, 0.3)';
          }}
        >
          {isEmpty ? t('leaderboards.beFirstToDonate') : t('leaderboards.supportFigTracker')}
        </a>
      </div>
    </div>
  );
}

// Empty donor slot placeholder
function EmptyDonorSlot({ rank, t }: { rank: number; t: any }) {
  return (
    <div
      style={{
        background: '#fafafa',
        borderRadius: '12px',
        padding: '16px',
        border: '1px dashed #d4d4d4',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: 0.6,
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#a3a3a3',
          minWidth: '32px',
          textAlign: 'center',
        }}
      >
        #{rank}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            color: '#a3a3a3',
            fontStyle: 'italic',
          }}
        >
          {t('leaderboards.noSupporterYet')}
        </div>
      </div>
    </div>
  );
}

// Individual Leaderboard Column
function LeaderboardColumn({
  title,
  icon,
  items,
  type,
  itemType,
  t,
}: {
  title: string;
  icon: React.ReactNode;
  items: (Collector | Donor)[];
  type: 'collector' | 'donor';
  itemType?: 'minifigs' | 'sets';
  t: any;
}) {
  return (
    <div>
      <h3
        style={{
          fontSize: 'var(--text-lg)',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '20px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {icon}
        {title}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item) => (
          <LeaderboardCard
            key={item.rank}
            item={item}
            type={type}
            itemType={itemType}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

// Individual Card
function LeaderboardCard({
  item,
  type,
  itemType,
  t,
}: {
  item: Collector | Donor;
  type: 'collector' | 'donor';
  itemType?: 'minifigs' | 'sets';
  t: any;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Get trophy emoji for top 3
  const getTrophyEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const trophy = getTrophyEmoji(item.rank);

  // Get translated item type label
  const getItemTypeLabel = () => {
    if (itemType === 'minifigs') return t('leaderboards.minifigs');
    if (itemType === 'sets') return t('leaderboards.sets');
    return 'items';
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #e5e5e5',
        boxShadow: isHovered
          ? '0 4px 12px rgba(0, 0, 0, 0.08)'
          : '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trophy or Rank */}
      <div
        style={{
          fontSize: trophy ? '24px' : '14px',
          fontWeight: trophy ? 'normal' : '600',
          color: trophy ? 'inherit' : '#737373',
          minWidth: '32px',
          textAlign: 'center',
        }}
      >
        {trophy || `#${item.rank}`}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '4px',
          }}
        >
          {item.displayName}
        </div>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            color: '#3b82f6',
          }}
        >
          {type === 'collector'
            ? `${(item as Collector).count} ${getItemTypeLabel()}`
            : `$${(item as Donor).totalAmount.toFixed(2)}`
          }
        </div>
      </div>
    </div>
  );
}

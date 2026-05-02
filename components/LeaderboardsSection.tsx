'use client';

import { useEffect, useState } from 'react';
import { TrophyIcon, CubeIcon, HeartIcon } from '@heroicons/react/24/solid';

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
  const [minifigCollectors, setMinifigCollectors] = useState<Collector[]>([]);
  const [setCollectors, setSetCollectors] = useState<Collector[]>([]);
  const [topDonors, setTopDonors] = useState<Donor[]>([]);
  const [season, setSeason] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all three leaderboards in parallel
    Promise.all([
      fetch('/api/leaderboards/minifig-collectors').then(res => res.json()),
      fetch('/api/leaderboards/set-collectors').then(res => res.json()),
      fetch('/api/donations/leaderboard').then(res => res.json()),
    ])
      .then(([minifigData, setData, donorData]) => {
        if (minifigData.success) {
          setMinifigCollectors(minifigData.data.topCollectors);
          setSeason(minifigData.data.season);
          setDateRange(minifigData.data.dateRange);
        }
        if (setData.success) {
          setSetCollectors(setData.data.topCollectors);
        }
        if (donorData.success) {
          setTopDonors(donorData.data.topDonors);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch leaderboards:', error);
        setLoading(false);
      });
  }, []);

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
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section Title */}
        <h2
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '700',
            color: '#171717',
            textAlign: 'center',
            marginBottom: '12px',
            letterSpacing: '-0.01em',
          }}
        >
          Community Leaderboards
        </h2>
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            textAlign: 'center',
            marginBottom: '4px',
            fontWeight: '600',
          }}
        >
          Items Added This Quarter Only
        </p>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: '#a3a3a3',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          {dateRange} ({season}) • Resets quarterly
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
              title="Top Minifig Collectors"
              icon={<TrophyIcon style={{ width: '20px', height: '20px', color: '#f59e0b' }} />}
              items={minifigCollectors}
              type="collector"
            />
          )}

          {/* Set Collectors */}
          {setCollectors.length > 0 && (
            <LeaderboardColumn
              title="Top Set Collectors"
              icon={<CubeIcon style={{ width: '20px', height: '20px', color: '#3b82f6' }} />}
              items={setCollectors}
              type="collector"
            />
          )}

          {/* Donors - Always show */}
          <DonorsColumn items={topDonors} />
        </div>
      </div>
    </section>
  );
}

// Donors Column - Always shows with empty placeholders
function DonorsColumn({ items }: { items: Donor[] }) {
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
        Top Supporters
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {paddedItems.map((item) => (
          item.displayName ? (
            <LeaderboardCard
              key={item.rank}
              item={item}
              type="donor"
            />
          ) : (
            <EmptyDonorSlot key={item.rank} rank={item.rank} />
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
          {isEmpty ? 'Be the First to Donate!' : 'Support FigTracker'}
        </a>
      </div>
    </div>
  );
}

// Empty donor slot placeholder
function EmptyDonorSlot({ rank }: { rank: number }) {
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
          No supporter yet
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
}: {
  title: string;
  icon: React.ReactNode;
  items: (Collector | Donor)[];
  type: 'collector' | 'donor';
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
}: {
  item: Collector | Donor;
  type: 'collector' | 'donor';
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Get trophy color for top 3
  const getTrophyColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#fbbf24'; // Gold
      case 2:
        return '#9ca3af'; // Silver
      case 3:
        return '#d97706'; // Bronze
      default:
        return null;
    }
  };

  const trophyColor = getTrophyColor(item.rank);

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
          minWidth: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {trophyColor ? (
          <TrophyIcon style={{ width: '24px', height: '24px', color: trophyColor }} />
        ) : (
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#737373' }}>
            #{item.rank}
          </span>
        )}
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
            ? `${(item as Collector).count} items`
            : `$${(item as Donor).totalAmount.toFixed(2)}`
          }
        </div>
      </div>
    </div>
  );
}

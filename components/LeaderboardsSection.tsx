'use client';

import { useEffect, useState } from 'react';

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

  // Don't render if all leaderboards are empty
  if (loading) return null;
  if (minifigCollectors.length === 0 && setCollectors.length === 0 && topDonors.length === 0) {
    return null;
  }

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
            fontSize: 'var(--text-sm)',
            color: '#737373',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          Top collectors and supporters this quarter ({season})
        </p>
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: '#a3a3a3',
            textAlign: 'center',
            marginBottom: '40px',
            fontWeight: '500',
          }}
        >
          {dateRange} • Resets quarterly
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
              title="🏆 Top Minifig Collectors"
              items={minifigCollectors}
              type="collector"
            />
          )}

          {/* Set Collectors */}
          {setCollectors.length > 0 && (
            <LeaderboardColumn
              title="📦 Top Set Collectors"
              items={setCollectors}
              type="collector"
            />
          )}

          {/* Donors */}
          {topDonors.length > 0 && (
            <LeaderboardColumn
              title="💙 Top Supporters"
              items={topDonors}
              type="donor"
            />
          )}
        </div>
      </div>
    </section>
  );
}

// Individual Leaderboard Column
function LeaderboardColumn({
  title,
  items,
  type,
}: {
  title: string;
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
        }}
      >
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

  // Get trophy icon for top 3
  const getTrophyIcon = (rank: number) => {
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

  const trophy = getTrophyIcon(item.rank);

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
            ? `${(item as Collector).count} items`
            : `$${(item as Donor).totalAmount.toFixed(2)}`
          }
        </div>
      </div>
    </div>
  );
}

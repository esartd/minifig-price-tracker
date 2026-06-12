'use client';

import { useEffect, useState } from 'react';

interface TopDonor {
  displayName: string;
  totalAmount: number;
  rank: number;
}

export default function DonationLeaderboard() {
  const [topDonors, setTopDonors] = useState<TopDonor[]>([]);
  const [season, setSeason] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/donations/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.topDonors.length > 0) {
          setTopDonors(data.data.topDonors);
          setSeason(data.data.season);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch leaderboard:', error);
        setLoading(false);
      });
  }, []);

  // Don't render anything while loading or if no donors
  if (loading || topDonors.length === 0) return null;

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
            marginBottom: '12px',
            letterSpacing: '-0.01em',
          }}
        >
          Top Supporters
        </h2>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: '#737373',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Thank you to our generous supporters this quarter ({season})
        </p>

        {/* Donor Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {topDonors.map((donor) => (
            <DonorCard key={donor.rank} donor={donor} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Individual Donor Card Component
function DonorCard({ donor }: { donor: TopDonor }) {
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

  const trophy = getTrophyIcon(donor.rank);

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e5e5',
        boxShadow: isHovered
          ? '0 8px 16px rgba(0, 0, 0, 0.1)'
          : '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        textAlign: 'center',
        height: '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trophy Icon (if top 3) */}
      {trophy && (
        <div
          style={{
            fontSize: '32px',
            marginBottom: '12px',
          }}
        >
          {trophy}
        </div>
      )}

      {/* Rank (if not top 3) */}
      {!trophy && (
        <div
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            color: '#737373',
            marginBottom: '12px',
          }}
        >
          #{donor.rank}
        </div>
      )}

      {/* Display Name */}
      <h3
        style={{
          fontSize: 'var(--text-lg)',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '8px',
          wordBreak: 'break-word',
        }}
      >
        {donor.displayName}
      </h3>

      {/* Donation Amount */}
      <p
        style={{
          fontSize: 'var(--text-xl)',
          fontWeight: '600',
          color: '#3b82f6',
          marginBottom: '0',
        }}
      >
        ${donor.totalAmount.toFixed(2)}
      </p>
    </div>
  );
}

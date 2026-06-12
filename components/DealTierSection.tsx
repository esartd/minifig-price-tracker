'use client';

import DealSetCard from './DealSetCard';

interface Deal {
  boxNo: string;
  asin: string;
  name: string;
  theme: string;
  currentPrice: number;
  listPrice: number;
  discountPercent: number;
  isPrime: boolean;
  imageUrl: string;
  amazonUrl: string;
}

interface DealTierSectionProps {
  title: string;
  emoji: string;
  deals: Deal[];
  tierColor: string;
  isEmpty?: boolean;
}

export default function DealTierSection({
  title,
  emoji,
  deals,
  tierColor,
  isEmpty = false,
}: DealTierSectionProps) {
  if (isEmpty || deals.length === 0) {
    return (
      <div style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: '700',
            color: '#171717',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '28px' }}>{emoji}</span>
          {title}
        </h2>
        <div
          style={{
            background: '#fafafa',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 'var(--text-base)', color: '#737373' }}>
            No deals found in this category
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2
        style={{
          fontSize: 'var(--text-xl)',
          fontWeight: '700',
          color: '#171717',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '28px' }}>{emoji}</span>
        {title}
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {deals.map((deal) => (
          <DealSetCard key={deal.boxNo} deal={deal} tierColor={tierColor} />
        ))}
      </div>
    </div>
  );
}

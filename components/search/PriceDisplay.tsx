interface PriceDisplayProps {
  loading: boolean;
  price?: number;
  compact?: boolean;
}

export default function PriceDisplay({ loading, price, compact = false }: PriceDisplayProps) {
  if (loading) {
    return (
      <div style={{
        fontSize: 'var(--text-sm)',
        color: '#a3a3a3'
      }}>
        Loading price...
      </div>
    );
  }

  if (!price || price === 0) {
    return (
      <div style={{ marginTop: '12px' }}>
        <div style={{
          fontSize: 'var(--text-xs)',
          fontWeight: '500',
          color: '#737373',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '8px'
        }}>
          Suggested Price
        </div>
        <div style={{
          fontSize: 'var(--text-base)',
          fontWeight: '500',
          color: '#a3a3a3',
          fontStyle: 'italic'
        }}>
          Price data unavailable
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div style={{
        textAlign: 'right',
        marginLeft: '12px'
      }}>
        <div style={{
          fontSize: 'var(--text-xs)',
          fontWeight: '500',
          color: '#737373',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '4px'
        }}>
          Suggested Price
        </div>
        <div style={{
          fontSize: 'var(--text-base)',
          fontWeight: '600',
          color: '#171717'
        }}>
          ${price.toFixed(2)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{
        fontSize: 'var(--text-xs)',
        fontWeight: '500',
        color: '#737373',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '8px'
      }}>
        Suggested Price
      </div>
      <div style={{
        fontSize: 'var(--text-2xl)',
        fontWeight: '600',
        color: '#171717',
        letterSpacing: '-0.01em'
      }}>
        ${price.toFixed(2)}
      </div>
    </div>
  );
}

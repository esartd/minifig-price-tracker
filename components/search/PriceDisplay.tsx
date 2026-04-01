interface PriceDisplayProps {
  loading: boolean;
  price?: number;
  compact?: boolean;
}

export default function PriceDisplay({ loading, price, compact = false }: PriceDisplayProps) {
  if (loading) {
    return (
      <div style={{
        fontSize: '14px',
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
          fontSize: '12px',
          fontWeight: '500',
          color: '#737373',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '8px'
        }}>
          Suggested Price
        </div>
        <div style={{
          fontSize: '16px',
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
          fontSize: '12px',
          fontWeight: '500',
          color: '#737373',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '4px'
        }}>
          Suggested Price
        </div>
        <div style={{
          fontSize: '18px',
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
        fontSize: '12px',
        fontWeight: '500',
        color: '#737373',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '8px'
      }}>
        Suggested Price
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: '600',
        color: '#171717',
        letterSpacing: '-0.01em'
      }}>
        ${price.toFixed(2)}
      </div>
    </div>
  );
}

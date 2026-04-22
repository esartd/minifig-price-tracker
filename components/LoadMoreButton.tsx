'use client';

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  loading?: boolean;
  hasMore: boolean;
  currentCount: number;
  totalCount: number;
}

export default function LoadMoreButton({ onLoadMore, loading, hasMore, currentCount, totalCount }: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '32px 16px'
    }}>
      <p style={{
        fontSize: 'var(--text-sm)',
        color: '#737373'
      }}>
        Showing {currentCount} of {totalCount} items
      </p>
      <button
        onClick={onLoadMore}
        disabled={loading}
        style={{
          padding: '12px 32px',
          fontSize: 'var(--text-base)',
          fontWeight: '600',
          color: '#ffffff',
          background: loading ? '#a3a3a3' : '#3b82f6',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.background = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          }
        }}
      >
        {loading ? 'Loading...' : 'Show More'}
      </button>
    </div>
  );
}

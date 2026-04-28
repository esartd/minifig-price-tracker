'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '64px 16px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: 'var(--text-3xl)',
        marginBottom: '24px'
      }}>
        ⚠️
      </div>

      <h2 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: '600',
        color: '#171717',
        marginBottom: '16px',
        letterSpacing: '-0.01em'
      }}>
        Something went wrong
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: '#737373',
        lineHeight: '1.6',
        marginBottom: '32px'
      }}>
        We couldn't load this minifigure. This might be a temporary issue.
      </p>

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={reset}
          style={{
            padding: '12px 24px',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            color: '#ffffff',
            background: '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#3b82f6';
          }}
        >
          Try again
        </button>

        <a
          href="/search"
          style={{
            padding: '12px 24px',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            color: '#171717',
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
          }}
        >
          Back to search
        </a>
      </div>
    </div>
  );
}

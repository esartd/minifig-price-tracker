import Link from 'next/link';

export default function NotFound() {
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
        404
      </div>

      <h2 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: '600',
        color: '#171717',
        marginBottom: '16px',
        letterSpacing: '-0.01em'
      }}>
        Page not found
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: '#737373',
        lineHeight: '1.6',
        marginBottom: '32px'
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        href="/"
        style={{
          padding: '12px 24px',
          fontSize: 'var(--text-base)',
          fontWeight: '600',
          color: '#ffffff',
          background: '#3b82f6',
          border: 'none',
          borderRadius: '8px',
          textDecoration: 'none',
          display: 'inline-block',
          transition: 'all 0.2s'
        }}
      >
        Go home
      </Link>
    </div>
  );
}

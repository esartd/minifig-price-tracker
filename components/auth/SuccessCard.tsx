import Link from 'next/link';

interface SuccessCardProps {
  title: string;
  message: string | React.ReactNode;
  actionText: string;
  actionHref: string;
}

export default function SuccessCard({ title, message, actionText, actionHref }: SuccessCardProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '64px',
        height: '64px',
        background: '#d1fae5',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px'
      }}>
        <svg style={{ width: '32px', height: '32px', color: '#059669' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#171717',
        marginBottom: '12px',
        letterSpacing: '-0.01em'
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: '16px',
        color: '#737373',
        lineHeight: '1.6',
        marginBottom: '32px'
      }}>
        {message}
      </p>
      <Link
        href={actionHref}
        style={{
          display: 'block',
          width: '100%',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '600',
          color: '#ffffff',
          background: '#3b82f6',
          border: 'none',
          borderRadius: '8px',
          textDecoration: 'none',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {actionText}
      </Link>
    </div>
  );
}

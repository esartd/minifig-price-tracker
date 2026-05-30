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
        width: 'var(--icon-3xl)',
        height: 'var(--icon-3xl)',
        background: '#d1fae5',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px'
      }}>
        <svg style={{ width: 'var(--icon-xl)', height: 'var(--icon-xl)', color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="var(--icon-stroke)" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: '700',
        color: '#171717',
        marginBottom: '12px',
        letterSpacing: '-0.01em'
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: 'var(--text-base)',
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
          fontSize: 'var(--text-base)',
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

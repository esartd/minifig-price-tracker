'use client';

import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

export default function NotFound() {
  const { t } = useTranslation();

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
        🔍
      </div>

      <h2 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: '600',
        color: '#171717',
        marginBottom: '16px',
        letterSpacing: '-0.01em'
      }}>
        {t('minifigNotFound.heading') || 'Minifigure not found'}
      </h2>

      <p style={{
        fontSize: 'var(--text-base)',
        color: '#737373',
        lineHeight: '1.6',
        marginBottom: '32px'
      }}>
        {t('minifigNotFound.body') || "We couldn't find this minifigure in our catalog. It might not exist or the item number might be incorrect."}
      </p>

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
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
          {t('minifigNotFound.searchMinifigures') || 'Search minifigures'}
        </Link>

        <Link
          href="/"
          style={{
            padding: '12px 24px',
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            color: '#171717',
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'all 0.2s'
          }}
        >
          {t('notFound.goHome') || 'Go home'}
        </Link>
      </div>
    </div>
  );
}

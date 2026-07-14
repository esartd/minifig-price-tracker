'use client';

import { useTranslation } from '@/components/TranslationProvider';

export function DividerOr() {
  const { t } = useTranslation();
  return (
    <div style={{
      margin: '24px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{
        height: '1px',
        flex: 1,
        background: '#e5e7eb'
      }} />
      <div style={{
        fontSize: 'var(--text-xs)',
        fontWeight: '500',
        color: '#737373',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {t('auth.orDivider') || 'OR'}
      </div>
      <div style={{
        height: '1px',
        flex: 1,
        background: '#e5e7eb'
      }} />
    </div>
  )
}

'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/components/TranslationProvider'

export function AccountLinkedToast() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('account_linked') === 'true') {
      setShow(true)

      // Remove query param from URL
      const url = new URL(window.location.href)
      url.searchParams.delete('account_linked')
      router.replace(url.pathname + url.search)

      // Auto-hide after 5 seconds
      setTimeout(() => setShow(false), 5000)
    }
  }, [searchParams, router])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#10b981',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{t('auth.accountLinked.title') || 'Account Linked!'}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {t('auth.accountLinked.message') || 'Your Google account is now connected to FigTracker.'}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client';

import { useState, useEffect } from 'react';
import { useGuestCollection } from '@/hooks/useGuestCollection';
import { formatPrice } from '@/lib/format-price';
import SaveCollectionModal from '@/components/SaveCollectionModal';
import { useTranslation } from '@/components/TranslationProvider';

export default function GuestCollectionBadge() {
  const { t } = useTranslation();
  const { count, total } = useGuestCollection();
  const [showModal, setShowModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  // Auto-show modal after 3 items (only once per session)
  useEffect(() => {
    if (count >= 3 && !hasShownModal) {
      // Small delay so user sees the badge update first
      const timer = setTimeout(() => {
        setShowModal(true);
        setHasShownModal(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [count, hasShownModal]);

  if (count === 0) return null;

  return (
    <>
      {/* Floating Badge */}
      <div
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          zIndex: 9997,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: '180px',
          transition: 'all 0.3s ease',
          animation: 'slideInUp 0.4s ease-out'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 14px 30px rgba(59, 130, 246, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15)';
        }}
      >
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          opacity: 0.9
        }}>
          {t('guestCollectionBadge.title') || 'Your Collection'}
        </div>
        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          letterSpacing: '-0.01em'
        }}>
          {formatPrice(total, 'USD')}
        </div>
        <div style={{
          fontSize: '13px',
          opacity: 0.95,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{t('guestCollectionBadge.itemCount', { count, itemWord: count === 1 ? 'item' : 'items' }) || `${count} ${count === 1 ? 'item' : 'items'}`}</span>
          <span style={{ fontSize: '11px', textDecoration: 'underline' }}>{t('guestCollectionBadge.saveCta') || 'Save →'}</span>
        </div>
      </div>

      {/* Save Collection Modal */}
      <SaveCollectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        itemCount={count}
        totalValue={total}
        currencyCode="USD"
      />

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

'use client';

import { useTranslation } from '@/components/TranslationProvider';
import { formatPrice } from '@/lib/format-price';

interface SaveCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
  totalValue: number;
  currencyCode?: string;
}

export default function SaveCollectionModal({
  isOpen,
  onClose,
  itemCount,
  totalValue,
  currencyCode = 'USD'
}: SaveCollectionModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSaveCollection = () => {
    // Store intent to migrate guest collection after signup
    if (typeof window !== 'undefined') {
      localStorage.setItem('figtracker_migrate_guest_collection', 'true');
    }
    // Redirect to signup with callback to current page
    window.location.href = `/auth/signup?callbackUrl=${encodeURIComponent(window.location.href)}`;
  };

  const handleContinue = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                Your collection is worth {formatPrice(totalValue, currencyCode)}
              </h2>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: '#737373',
                lineHeight: '1.5'
              }}>
                You've tracked {itemCount} {itemCount === 1 ? 'item' : 'items'}. Create a free account to save it permanently.
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '4px',
                color: '#a3a3a3',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                lineHeight: '1',
                transition: 'color 0.2s',
                marginLeft: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#525252'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a3a3a3'}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Value highlight */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '8px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: '500', opacity: 0.9, marginBottom: '4px' }}>
              TOTAL VALUE
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.02em' }}>
              {formatPrice(totalValue, currencyCode)}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9, marginTop: '4px' }}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'} tracked
            </div>
          </div>

          {/* Benefits */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{ fontSize: 'var(--text-sm)', color: '#171717', fontWeight: '500', lineHeight: '1.5' }}>
                Never lose this collection
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{ fontSize: 'var(--text-sm)', color: '#171717', fontWeight: '500', lineHeight: '1.5' }}>
                Get automatic price updates
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{ fontSize: 'var(--text-sm)', color: '#171717', fontWeight: '500', lineHeight: '1.5' }}>
                Generate listings instantly
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <button
            onClick={handleSaveCollection}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              color: 'white',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            Save My Collection
          </button>

          <button
            onClick={handleContinue}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              color: '#737373',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            Continue as Guest
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
}

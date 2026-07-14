'use client';

import { useTranslation } from '@/components/TranslationProvider';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName?: string;
  itemType?: 'minifig' | 'set';
}

export default function AuthRequiredModal({ isOpen, onClose, itemName, itemType = 'minifig' }: AuthRequiredModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleEmailSignUp = () => {
    window.location.href = `/auth/signup?callbackUrl=${encodeURIComponent(window.location.href)}`;
  };

  const handleSignIn = () => {
    window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`;
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
            <div>
              <h2 style={{
                fontSize: 'var(--text-xl)',
                fontWeight: '600',
                color: '#171717',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}>
                {t('authRequiredModal.heading') || 'Track This in Your Collection'}
              </h2>
              {itemName && (
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373',
                  lineHeight: '1.5'
                }}>
                  {t('authRequiredModal.subheading', { itemName }) || `Sign up to start tracking "${itemName}"`}
                </p>
              )}
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
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#525252'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#a3a3a3'}
            >
              ×
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{ fontSize: 'var(--text-sm)', color: '#171717', fontWeight: '500', lineHeight: '1.5' }}>
                {t('authRequiredModal.benefitSavePermanently') || 'Save this item permanently'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{ fontSize: 'var(--text-sm)', color: '#171717', fontWeight: '500', lineHeight: '1.5' }}>
                {t('authRequiredModal.benefitTrackPrices') || 'Track prices automatically'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{ fontSize: 'var(--text-sm)', color: '#171717', fontWeight: '500', lineHeight: '1.5' }}>
                {t('authRequiredModal.benefitGenerateListings') || 'Generate eBay/Facebook listings instantly'}
              </span>
            </div>
          </div>

          {/* Sign-up button */}
          <button
            onClick={handleEmailSignUp}
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
            {t('authRequiredModal.createAccountButton') || 'Create Free Account'}
          </button>

          {/* Sign in link */}
          <p style={{
            textAlign: 'center',
            fontSize: 'var(--text-sm)',
            color: '#737373',
            marginTop: '8px'
          }}>
            {t('authRequiredModal.alreadyHaveAccount') || 'Already have an account?'}{' '}
            <button
              onClick={handleSignIn}
              style={{
                color: '#3b82f6',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
            >
              {t('authRequiredModal.signInButton') || 'Sign In'}
            </button>
          </p>
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

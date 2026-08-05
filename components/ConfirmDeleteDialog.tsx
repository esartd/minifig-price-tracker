'use client';

import { useTranslation } from '@/components/TranslationProvider';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

/**
 * In-app replacement for window.confirm() ahead of delete actions.
 *
 * Native confirm() is unreliable across embedded browsers, PWAs, and some
 * in-app/automation contexts - it can silently resolve to false (or never
 * appear at all) without the user seeing any dialog, making a delete
 * button look like it does nothing. This renders a real, styled modal
 * instead, matching the delete-confirmation dialogs already used on the
 * minifig/set detail pages.
 */
export default function ConfirmDeleteDialog({ isOpen, onClose, onConfirm, message }: ConfirmDeleteDialogProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#171717',
          marginBottom: '20px',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              color: '#171717',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {t('common.cancel') || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {t('common.delete') || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

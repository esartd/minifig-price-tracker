'use client';

import { useTranslation } from '@/components/TranslationProvider';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

/**
 * In-app replacement for window.alert().
 *
 * Same reliability problem as window.confirm() (see ConfirmDeleteDialog) --
 * native alert() can silently no-op in embedded browsers, PWAs, and some
 * automation/preview contexts, so success/error feedback never reaches the
 * user and an action can look like it did nothing even though it worked (or
 * failed). Renders a real, styled modal instead. Preserves newlines in the
 * message (native alert() renders them; a plain <p> collapses them).
 */
export default function AlertDialog({ isOpen, onClose, message }: AlertDialogProps) {
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
          maxWidth: '420px',
          width: '90%',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#171717',
          marginBottom: '20px',
          lineHeight: '1.5',
          whiteSpace: 'pre-line'
        }}>
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            color: '#ffffff',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {t('common.ok') || 'OK'}
        </button>
      </div>
    </div>
  );
}

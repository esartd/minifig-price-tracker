'use client';

import { useState } from 'react';

interface MoveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  maxQuantity: number;
  direction: 'to-inventory' | 'to-collection';
  onConfirm: (quantity: number) => Promise<void>;
}

export default function MoveDialog({
  isOpen,
  onClose,
  itemName,
  maxQuantity,
  direction,
  onConfirm
}: MoveDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const title = direction === 'to-inventory' ? 'Move to Inventory' : 'Move to Your Collection';
  const description = direction === 'to-inventory'
    ? 'This will move the item to your selling inventory.'
    : 'This will move the item to your personal collection.';

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm(quantity);
      onClose();
      setQuantity(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move item');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setQuantity(1);
      setError(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={handleClose}
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
        {/* Header */}
        <h2 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#171717'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#737373',
          marginBottom: '16px'
        }}>
          {description}
        </p>

        {/* Item Name */}
        <div style={{
          padding: '12px',
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p style={{
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            color: '#171717'
          }}>
            {itemName}
          </p>
        </div>

        {/* Quantity Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            color: '#171717',
            marginBottom: '8px'
          }}>
            Quantity to move
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || loading}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: quantity <= 1 ? '#fafafa' : '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                cursor: quantity <= 1 || loading ? 'not-allowed' : 'pointer',
                color: quantity <= 1 ? '#d4d4d4' : '#171717',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1 && val <= maxQuantity) {
                  setQuantity(val);
                }
              }}
              min={1}
              max={maxQuantity}
              disabled={loading}
              style={{
                flex: 1,
                height: '36px',
                textAlign: 'center',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                backgroundColor: loading ? '#fafafa' : '#ffffff',
                color: '#171717'
              }}
            />
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity || loading}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: quantity >= maxQuantity ? '#fafafa' : '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                cursor: quantity >= maxQuantity || loading ? 'not-allowed' : 'pointer',
                color: quantity >= maxQuantity ? '#d4d4d4' : '#171717',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              +
            </button>
          </div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: '#737373',
            marginTop: '6px'
          }}>
            Maximum: {maxQuantity}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <p style={{
              fontSize: 'var(--text-sm)',
              color: '#dc2626'
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={handleClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              color: '#171717',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || quantity < 1 || quantity > maxQuantity}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              color: '#ffffff',
              backgroundColor: loading ? '#a3a3a3' : '#171717',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Moving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

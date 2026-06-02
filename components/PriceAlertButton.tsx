'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface PriceAlertButtonProps {
  itemNo: string;
  itemType: 'MINIFIG' | 'SET';
  itemName: string;
  condition: 'new' | 'used';
  currentPrice: number;
  currencyCode: string;
}

export default function PriceAlertButton({
  itemNo,
  itemType,
  itemName,
  condition,
  currentPrice,
  currencyCode,
}: PriceAlertButtonProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [hasAlert, setHasAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currencySymbol = currencyCode === 'USD' ? '$' : currencyCode === 'EUR' ? '€' : currencyCode === 'GBP' ? '£' : currencyCode;

  // Check if user already has alert for this item
  useEffect(() => {
    if (session?.user && isOpen) {
      checkExistingAlert();
    }
  }, [session, isOpen]);

  const checkExistingAlert = async () => {
    try {
      const response = await fetch('/api/alerts');
      if (response.ok) {
        const data = await response.json();
        const existingAlert = data.data?.find(
          (alert: any) =>
            alert.item_no === itemNo &&
            alert.item_type === itemType &&
            alert.condition === condition &&
            alert.active
        );
        if (existingAlert) {
          setHasAlert(true);
          setTargetPrice(existingAlert.target_price.toString());
        }
      }
    } catch (error) {
      console.error('Error checking existing alert:', error);
    }
  };

  const handleSetAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid price' });
      setIsLoading(false);
      return;
    }

    if (price >= currentPrice) {
      setMessage({ type: 'error', text: `Target price must be below current price (${currencySymbol}${currentPrice})` });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_no: itemNo,
          item_type: itemType,
          item_name: itemName,
          condition,
          target_price: price,
          currency_code: currencyCode,
        }),
      });

      if (response.ok) {
        setHasAlert(true);
        setMessage({ type: 'success', text: '✓ Price alert set! You\'ll receive an email when the price drops.' });
        setTimeout(() => {
          setIsOpen(false);
          setMessage(null);
        }, 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to set alert' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to set alert. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') return null;
  if (!session) return null;
  if (currentPrice <= 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          fontSize: '13px',
          fontWeight: '500',
          color: hasAlert ? '#2563eb' : '#525252',
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fafafa';
          e.currentTarget.style.borderColor = '#d4d4d4';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.borderColor = '#e5e5e5';
        }}
        title="Set price alert"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={hasAlert ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span>Price Alert</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              maxWidth: '400px',
              width: '100%',
              padding: '24px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#171717',
                    margin: '0 0 4px 0',
                    letterSpacing: '-0.01em'
                  }}>
                    Set Price Alert
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#737373',
                    margin: 0
                  }}>
                    {itemName}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '4px',
                    color: '#a3a3a3',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.color = '#525252';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#a3a3a3';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSetAlert}>
              {/* Current Price */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  padding: '12px',
                  background: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#737373',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px'
                  }}>
                    Current Price
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#171717'
                  }}>
                    {currencySymbol}{currentPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Target Price Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#525252',
                  marginBottom: '8px'
                }}>
                  Notify me when price drops to:
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '14px',
                    color: '#737373',
                    pointerEvents: 'none'
                  }}>
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      paddingLeft: '32px',
                      paddingRight: '12px',
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      fontSize: '14px',
                      color: '#171717',
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
                <p style={{
                  fontSize: '11px',
                  color: '#a3a3a3',
                  margin: '6px 0 0 0'
                }}>
                  Set a target price below the current price
                </p>
              </div>

              {/* Message */}
              {message && (
                <div style={{
                  marginBottom: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: message.type === 'success' ? '#166534' : '#991b1b',
                  border: '1px solid',
                  borderColor: message.type === 'success' ? '#86efac' : '#fca5a5'
                }}>
                  {message.text}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#525252',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#ffffff',
                    background: isLoading ? '#93c5fd' : '#3b82f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.currentTarget.style.background = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) e.currentTarget.style.background = '#3b82f6';
                  }}
                >
                  {isLoading ? 'Setting...' : 'Set Alert'}
                </button>
              </div>
            </form>

            {/* Footer Note */}
            <p style={{
              fontSize: '11px',
              color: '#a3a3a3',
              margin: '16px 0 0 0',
              lineHeight: '1.5'
            }}>
              You'll receive an email when the price drops to or below your target. The alert will be automatically deactivated after triggering.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

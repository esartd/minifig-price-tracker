'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/components/TranslationProvider';
import { BellIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';

interface PriceAlertButtonProps {
  itemNo: string;
  itemType: 'MINIFIG' | 'SET';
  itemName: string;
  condition: 'new' | 'used';
  currentPrice: number;
  currencyCode: string;
  /**
   * Walmart's current price for this set, when it has one. Passed down rather
   * than fetched here: the set page already has it, and a second request for a
   * number the parent is holding would be waste.
   */
  walmartPrice?: number | null;
  /** Also passed down -- set-detail-client already knows. */
  isPremium?: boolean;
}

export default function PriceAlertButton({
  itemNo,
  itemType,
  itemName,
  condition,
  currentPrice,
  currencyCode,
  walmartPrice = null,
  isPremium = false,
}: PriceAlertButtonProps) {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [hasAlert, setHasAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  /**
   * Which price the alert watches. Minifigures have no Walmart data at all
   * (WalmartDeal is keyed by box number), so the choice only appears for sets
   * we actually have a Walmart price for.
   */
  const [source, setSource] = useState<'market' | 'walmart'>('market');
  const canChooseSource = itemType === 'SET' && walmartPrice !== null && walmartPrice > 0;
  // The price the chosen alert is measured against -- and what the "must be
  // below current" check compares to. Using the market price for a Walmart
  // alert would reject perfectly good targets.
  const referencePrice = source === 'walmart' && walmartPrice ? walmartPrice : currentPrice;

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
            (alert.source || 'market') === source &&
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
      setMessage({ type: 'error', text: t('priceAlert.invalidPrice') || 'Please enter a valid price' });
      setIsLoading(false);
      return;
    }

    if (price >= referencePrice) {
      setMessage({
        type: 'error',
        text: t('priceAlert.targetBelowCurrent', { price: `${currencySymbol}${referencePrice}` }) || `Target price must be below current price (${currencySymbol}${referencePrice})`,
      });
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
          source,
          target_price: price,
          currency_code: currencyCode,
        }),
      });

      if (response.ok) {
        setHasAlert(true);
        setMessage({ type: 'success', text: t('priceAlert.setSuccess') || '✓ Price alert set! You\'ll receive an email when the price drops.' });
        setTimeout(() => {
          setIsOpen(false);
          setMessage(null);
        }, 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || t('priceAlert.setFailed') || 'Failed to set alert' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('priceAlert.setFailedRetry') || 'Failed to set alert. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlert = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/alerts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_no: itemNo,
          item_type: itemType,
          condition,
        }),
      });

      if (response.ok) {
        setHasAlert(false);
        setTargetPrice('');
        setMessage({ type: 'success', text: t('priceAlert.deleteSuccess') || '✓ Price alert deleted' });
        setTimeout(() => {
          setIsOpen(false);
          setMessage(null);
        }, 1500);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || t('priceAlert.deleteFailed') || 'Failed to delete alert' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('priceAlert.deleteFailedRetry') || 'Failed to delete alert. Please try again.' });
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
          borderRadius: '999px',
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
        title={t('priceAlert.buttonTooltip') || 'Set price alert'}
      >
        {hasAlert
          ? <BellSolidIcon style={{ width: '16px', height: '16px' }} />
          : <BellIcon style={{ width: '16px', height: '16px' }} />}
        <span>{t('priceAlert.buttonLabel') || 'Price Alert'}</span>
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
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#171717',
                margin: '0 0 4px 0',
                letterSpacing: '-0.01em'
              }}>
                {t('priceAlert.modalTitle') || 'Set Price Alert'}
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#737373',
                margin: 0
              }}>
                {itemName}
              </p>
            </div>

            {!hasAlert ? (
              /* CREATE MODE - No alert exists yet */
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
                      {/* Names the source once a choice exists, because the
                          two prices differ and a bare "Current Price" next to
                          a Walmart toggle is ambiguous. */}
                      {canChooseSource
                        ? (source === 'walmart'
                            ? (t('priceAlert.currentWalmartPrice') || 'Current Walmart price')
                            : (t('priceAlert.currentMarketPrice') || 'Current market price'))
                        : (t('priceAlert.currentPrice') || 'Current Price')}
                    </div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#171717'
                    }}>
                      {/* referencePrice, not currentPrice: this has to be the
                          number the target is actually measured against. It
                          showed the market price while the Walmart alert was
                          selected, so a target could be rejected for being
                          above a price that was never on screen. */}
                      {currencySymbol}{referencePrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Which price to watch. Shown to free users with the Walmart
                    option locked rather than hidden -- a perk nobody can see
                    is a perk nobody buys. The server refuses the request
                    regardless, so this is presentation, not enforcement. */}
                {canChooseSource && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '500',
                      color: '#525252', marginBottom: '8px'
                    }}>
                      {t('priceAlert.sourceLabel') || 'Watch which price?'}
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setSource('market')}
                        style={{
                          flex: 1, padding: '10px 12px', fontSize: '13px', fontWeight: 600,
                          borderRadius: '999px', cursor: 'pointer', textAlign: 'center',
                          border: source === 'market' ? '1px solid #3b82f6' : '1px solid #e5e5e5',
                          background: source === 'market' ? '#eff6ff' : '#ffffff',
                          color: source === 'market' ? '#1d4ed8' : '#525252',
                        }}
                      >
                        {t('priceAlert.sourceMarket') || 'Market price'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { if (isPremium) setSource('walmart'); }}
                        // Not `disabled`: a disabled button is silent, and this
                        // one has something to say.
                        title={isPremium ? undefined : (t('priceAlert.walmartPremiumHint') || 'Premium feature')}
                        style={{
                          flex: 1, padding: '10px 12px', fontSize: '13px', fontWeight: 600,
                          borderRadius: '999px', textAlign: 'center',
                          cursor: isPremium ? 'pointer' : 'not-allowed',
                          border: source === 'walmart' ? '1px solid #3b82f6' : '1px solid #e5e5e5',
                          background: source === 'walmart' ? '#eff6ff' : '#ffffff',
                          color: !isPremium ? '#a3a3a3' : source === 'walmart' ? '#1d4ed8' : '#525252',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                        }}
                      >
                        {t('priceAlert.sourceWalmart') || 'Walmart price'}
                        {!isPremium && <LockClosedIcon style={{ width: '13px', height: '13px', flexShrink: 0 }} />}
                      </button>
                    </div>
                    {!isPremium && (
                      <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#737373' }}>
                        {t('priceAlert.walmartPremiumUpsell') || 'Walmart deal alerts are a Premium feature.'}{' '}
                        <a href="/premium" style={{ color: '#3b82f6', fontWeight: 600 }}>
                          {t('priceAlert.learnMore') || 'Learn more'}
                        </a>
                      </p>
                    )}
                  </div>
                )}

                {/* Target Price Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#525252',
                    marginBottom: '8px'
                  }}>
                    {t('priceAlert.notifyLabel') || 'Notify me when price drops to:'}
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
                    {t('priceAlert.targetHint') || 'Set a target price below the current price'}
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
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
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
                      borderRadius: '999px',
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
                    {t('priceAlert.cancel') || 'Cancel'}
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
                      borderRadius: '999px',
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
                    {isLoading ? (t('priceAlert.setting') || 'Setting...') : (t('priceAlert.setAlert') || 'Set Alert')}
                  </button>
                </div>

                {/* Footer Note */}
                <div style={{
                  padding: '12px',
                  background: '#fafafa',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#737373',
                  lineHeight: '1.5',
                  marginBottom: '12px'
                }}>
                  {t('priceAlert.footerNote') || "You'll receive an email when the price drops to or below your target. The alert will be automatically deactivated after triggering."}
                </div>

                {/* View All Alerts Link */}
                <a
                  href="/account/alerts"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#3b82f6';
                  }}
                >
                  {t('priceAlert.viewAllAlerts') || 'View all alerts'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </form>
            ) : (
              /* MANAGE MODE - Alert already exists */
              <div>
                {!isEditingPrice ? (
                  <>
                    {/* Current Alert Status */}
                    <div style={{
                      padding: '16px',
                      background: '#dbeafe',
                      borderRadius: '8px',
                      border: '1px solid #93c5fd',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px'
                      }}>
                        <BellSolidIcon style={{ width: '18px', height: '18px', color: '#2563eb' }} />
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#1e40af'
                        }}>
                          {t('priceAlert.alertActive') || 'Alert Active'}
                        </div>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px'
                      }}>
                        <div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '4px'
                          }}>
                            {t('priceAlert.currentPrice') || 'Current Price'}
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1e40af'
                          }}>
                            {currencySymbol}{currentPrice.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            color: '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '4px'
                          }}>
                            {t('priceAlert.alertTarget') || 'Alert Target'}
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1e40af'
                          }}>
                            {currencySymbol}{parseFloat(targetPrice).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* EDIT MODE */
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
                          {t('priceAlert.currentPrice') || 'Current Price'}
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
                        {t('priceAlert.notifyLabel') || 'Notify me when price drops to:'}
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
                        {t('priceAlert.targetHint') || 'Set a target price below the current price'}
                      </p>
                    </div>
                  </form>
                )}

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

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {!isEditingPrice ? (
                    <>
                      <button
                        onClick={handleDeleteAlert}
                        disabled={isLoading}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#dc2626',
                          background: '#ffffff',
                          border: '1px solid #fca5a5',
                          borderRadius: '999px',
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          if (!isLoading) {
                            e.currentTarget.style.background = '#fee2e2';
                            e.currentTarget.style.borderColor = '#ef4444';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isLoading) {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.borderColor = '#fca5a5';
                          }
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        {isLoading ? (t('priceAlert.deleting') || 'Deleting...') : (t('priceAlert.deleteAlert') || 'Delete Alert')}
                      </button>
                      <button
                        onClick={() => setIsEditingPrice(true)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#ffffff',
                          background: '#3b82f6',
                          border: 'none',
                          borderRadius: '999px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#3b82f6';
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        {t('priceAlert.editTarget') || 'Edit Target'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingPrice(false);
                          checkExistingAlert(); // Reset to original price
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#525252',
                          background: '#ffffff',
                          border: '1px solid #e5e5e5',
                          borderRadius: '999px',
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
                        {t('priceAlert.cancel') || 'Cancel'}
                      </button>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          await handleSetAlert(e as any);
                          setIsEditingPrice(false);
                        }}
                        disabled={isLoading}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#ffffff',
                          background: isLoading ? '#93c5fd' : '#3b82f6',
                          border: 'none',
                          borderRadius: '999px',
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
                        {isLoading ? (t('priceAlert.saving') || 'Saving...') : (t('priceAlert.save') || 'Save')}
                      </button>
                    </>
                  )}
                </div>

                {/* View All Alerts Link */}
                <a
                  href="/account/alerts"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#3b82f6',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#3b82f6';
                  }}
                >
                  {t('priceAlert.viewAllAlerts') || 'View all alerts'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

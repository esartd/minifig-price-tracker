'use client';

import { useState, useEffect } from 'react';
import { ShareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTranslation } from './TranslationProvider';

type CollectionType = 'inventory' | 'collection' | 'sets-inventory' | 'sets-collection';

interface ShareCollectionButtonProps {
  type: CollectionType;
}

export default function ShareCollectionButton({ type }: ShareCollectionButtonProps) {
  const { t } = useTranslation();
  const [shareEnabled, setShareEnabled] = useState(false);
  const [sharePricing, setSharePricing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingShare, setLoadingShare] = useState(false);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    loadShareStatus();
  }, [type]);

  const loadShareStatus = async () => {
    try {
      const response = await fetch(`/api/collection/share?type=${type}`);
      const data = await response.json();
      if (data.success) {
        setShareEnabled(data.shareEnabled);
        setSharePricing(data.sharePricing ?? false);
        setShareUrl(data.shareUrl || '');
      }
    } catch (error) {
      console.error('Failed to load share status:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const toggleShare = async () => {
    console.log('Toggle share clicked, type:', type);
    setLoadingShare(true);
    try {
      const response = await fetch(`/api/collection/share?type=${type}`, {
        method: 'PATCH'
      });
      const data = await response.json();
      console.log('Toggle share response:', data);
      if (data.success) {
        setShareEnabled(data.shareEnabled);
        setSharePricing(data.sharePricing ?? false);
        setShareUrl(data.shareUrl || '');
      } else {
        console.error('Toggle failed:', data.error);
      }
    } catch (error) {
      console.error('Failed to toggle sharing:', error);
    } finally {
      setLoadingShare(false);
    }
  };

  const togglePricing = async () => {
    console.log('Toggle pricing clicked, current:', sharePricing);
    setLoadingPricing(true);
    try {
      const response = await fetch(`/api/collection/share/pricing?type=${type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sharePricing: !sharePricing })
      });
      const data = await response.json();
      console.log('Toggle pricing response:', data);
      if (data.success) {
        setSharePricing(data.sharePricing);
      } else {
        console.error('Pricing toggle failed:', data.error);
      }
    } catch (error) {
      console.error('Failed to toggle pricing:', error);
    } finally {
      setLoadingPricing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (initialLoading) return null;

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          fontSize: 'var(--text-sm)',
          fontWeight: '500',
          color: '#525252',
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#d4d4d4';
          e.currentTarget.style.color = '#171717';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e5e5';
          e.currentTarget.style.color = '#525252';
        }}
      >
        <ShareIcon style={{ width: '18px', height: '18px' }} />
        {t('common.share')}
      </button>

      {/* Dialog */}
      {showDialog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowDialog(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '16px'
            }}>
              Share Your Collection
            </h2>
            <p style={{
              fontSize: 'var(--text-base)',
              color: '#737373',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              Generate a public link to share your collection and inventory with potential buyers. They'll see a read-only view with no access to edit.
            </p>

            {/* Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: '#fafafa',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: '#171717'
              }}>
                Enable Sharing
              </span>
              <button
                onClick={toggleShare}
                disabled={loadingShare}
                style={{
                  position: 'relative',
                  width: '44px',
                  height: '24px',
                  background: shareEnabled ? '#3b82f6' : '#d1d5db',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: loadingShare ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  opacity: loadingShare ? 0.6 : 1,
                  flexShrink: 0
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: shareEnabled ? '22px' : '2px',
                  width: '20px',
                  height: '20px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)'
                }} />
              </button>
            </div>

            {/* Show Pricing Toggle */}
            {shareEnabled && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#fafafa',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  color: '#171717'
                }}>
                  Show Pricing
                </span>
                <button
                  onClick={togglePricing}
                  disabled={loadingPricing}
                  style={{
                    position: 'relative',
                    width: '44px',
                    height: '24px',
                    background: sharePricing ? '#3b82f6' : '#d1d5db',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: loadingPricing ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    opacity: loadingPricing ? 0.6 : 1,
                    flexShrink: 0
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: sharePricing ? '22px' : '2px',
                    width: '20px',
                    height: '20px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)'
                  }} />
                </button>
              </div>
            )}

            {/* Share Link */}
            {shareEnabled && shareUrl && (
              <div style={{
                marginBottom: '24px'
              }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '8px'
                }}>
                  Share Link
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '12px',
                      fontSize: 'var(--text-sm)',
                      color: '#171717',
                      background: '#f5f5f5',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px'
                    }}
                  />
                  <button
                    onClick={copyLink}
                    style={{
                      padding: '12px 16px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      color: copied ? '#3b82f6' : '#171717',
                      background: '#ffffff',
                      border: '1px solid',
                      borderColor: copied ? '#3b82f6' : '#e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {copied ? (
                      <>
                        <CheckIcon style={{ width: '16px', height: '16px' }} />
                        Copied
                      </>
                    ) : (
                      <>
                        <ClipboardIcon style={{ width: '16px', height: '16px' }} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setShowDialog(false)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: '#171717',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

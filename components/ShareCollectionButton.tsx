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
  const [shareEnabledPublic, setShareEnabledPublic] = useState(false);
  const [shareUrlPublic, setShareUrlPublic] = useState('');
  const [shareEnabledPrivate, setShareEnabledPrivate] = useState(false);
  const [shareUrlPrivate, setShareUrlPrivate] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedPrivate, setCopiedPrivate] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    loadShareStatus();
  }, [type]);

  const loadShareStatus = async () => {
    try {
      const response = await fetch(`/api/collection/share?type=${type}`);
      const data = await response.json();
      if (data.success) {
        setShareEnabledPublic(data.shareEnabledPublic || false);
        setShareUrlPublic(data.shareUrlPublic || '');
        setShareEnabledPrivate(data.shareEnabledPrivate || false);
        setShareUrlPrivate(data.shareUrlPrivate || '');
      }
    } catch (error) {
      console.error('Failed to load share status:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const togglePublicShare = async () => {
    try {
      const response = await fetch(`/api/collection/share?type=${type}&mode=public`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (data.success) {
        setShareEnabledPublic(data.shareEnabled);
        setShareUrlPublic(data.shareUrl || '');
      }
    } catch (error) {
      console.error('Failed to toggle public sharing:', error);
    }
  };

  const togglePrivateShare = async () => {
    try {
      const response = await fetch(`/api/collection/share?type=${type}&mode=private`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (data.success) {
        setShareEnabledPrivate(data.shareEnabled);
        setShareUrlPrivate(data.shareUrl || '');
      }
    } catch (error) {
      console.error('Failed to toggle private sharing:', error);
    }
  };

  const copyLink = (url: string, isPublic: boolean) => {
    navigator.clipboard.writeText(url);
    if (isPublic) {
      setCopiedPublic(true);
      setTimeout(() => setCopiedPublic(false), 2000);
    } else {
      setCopiedPrivate(true);
      setTimeout(() => setCopiedPrivate(false), 2000);
    }
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
              padding: '24px',
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
              Create two types of shareable links: Public (with pricing to flex your collection value) and Private (without pricing for buyers).
            </p>

            {/* Public Share Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: '#fafafa',
              borderRadius: '8px',
              marginBottom: '16px',
              gap: '12px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '4px'
                }}>
                  Public Link (with pricing)
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373'
                }}>
                  Showcase your collection value
                </div>
              </div>
              <button
                onClick={togglePublicShare}
                style={{
                  position: 'relative',
                  width: '48px',
                  height: '24px',
                  minHeight: '24px',
                  maxHeight: '24px',
                  background: shareEnabledPublic ? '#3b82f6' : '#d1d5db',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  flexShrink: 0,
                  padding: 0,
                  margin: 0,
                  boxSizing: 'border-box'
                } as React.CSSProperties}
              >
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: shareEnabledPublic ? '26px' : '2px',
                  width: '20px',
                  height: '20px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }} />
              </button>
            </div>

            {/* Public Share Link */}
            {shareEnabledPublic && shareUrlPublic && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '8px'
                }}>
                  Public Link
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={shareUrlPublic}
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
                    onClick={() => copyLink(shareUrlPublic, true)}
                    style={{
                      padding: '12px 16px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      color: copiedPublic ? '#3b82f6' : '#171717',
                      background: '#ffffff',
                      border: '1px solid',
                      borderColor: copiedPublic ? '#3b82f6' : '#e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {copiedPublic ? (
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

            {/* Private Share Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: '#fafafa',
              borderRadius: '8px',
              marginBottom: '16px',
              gap: '12px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '4px'
                }}>
                  Private Link (no pricing)
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: '#737373'
                }}>
                  Share with buyers without revealing prices
                </div>
              </div>
              <button
                onClick={togglePrivateShare}
                style={{
                  position: 'relative',
                  width: '48px',
                  height: '24px',
                  minHeight: '24px',
                  maxHeight: '24px',
                  background: shareEnabledPrivate ? '#3b82f6' : '#d1d5db',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  flexShrink: 0,
                  padding: 0,
                  margin: 0,
                  boxSizing: 'border-box'
                } as React.CSSProperties}
              >
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: shareEnabledPrivate ? '26px' : '2px',
                  width: '20px',
                  height: '20px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }} />
              </button>
            </div>

            {/* Private Share Link */}
            {shareEnabledPrivate && shareUrlPrivate && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '8px'
                }}>
                  Private Link
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={shareUrlPrivate}
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
                    onClick={() => copyLink(shareUrlPrivate, false)}
                    style={{
                      padding: '12px 16px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
                      color: copiedPrivate ? '#3b82f6' : '#171717',
                      background: '#ffffff',
                      border: '1px solid',
                      borderColor: copiedPrivate ? '#3b82f6' : '#e5e5e5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {copiedPrivate ? (
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

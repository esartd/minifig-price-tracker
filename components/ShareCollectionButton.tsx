'use client';

import { useState, useEffect } from 'react';
import { ShareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function ShareCollectionButton() {
  const [shareEnabled, setShareEnabled] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    loadShareStatus();
  }, []);

  const loadShareStatus = async () => {
    try {
      const response = await fetch('/api/collection/share');
      const data = await response.json();
      if (data.success) {
        setShareEnabled(data.shareEnabled);
        setShareUrl(data.shareUrl || '');
      }
    } catch (error) {
      console.error('Failed to load share status:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleShare = async () => {
    try {
      const response = await fetch('/api/collection/share', {
        method: 'PATCH'
      });
      const data = await response.json();
      if (data.success) {
        setShareEnabled(data.shareEnabled);
        setShareUrl(data.shareUrl || '');
      }
    } catch (error) {
      console.error('Failed to toggle sharing:', error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return null;

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
          fontWeight: '600',
          color: shareEnabled ? '#ffffff' : '#171717',
          background: shareEnabled ? '#10b981' : '#ffffff',
          border: '1px solid',
          borderColor: shareEnabled ? '#10b981' : '#e5e5e5',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          if (!shareEnabled) {
            e.currentTarget.style.background = '#f5f5f5';
          }
        }}
        onMouseLeave={(e) => {
          if (!shareEnabled) {
            e.currentTarget.style.background = '#ffffff';
          }
        }}
      >
        <ShareIcon style={{ width: '16px', height: '16px' }} />
        {shareEnabled ? 'Sharing Enabled' : 'Share Collection'}
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
                style={{
                  position: 'relative',
                  width: '48px',
                  height: '28px',
                  background: shareEnabled ? '#10b981' : '#d1d5db',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: shareEnabled ? '22px' : '2px',
                  width: '24px',
                  height: '24px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  transition: 'left 0.2s'
                }} />
              </button>
            </div>

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
                      color: copied ? '#10b981' : '#171717',
                      background: '#ffffff',
                      border: '1px solid',
                      borderColor: copied ? '#10b981' : '#e5e5e5',
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

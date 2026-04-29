'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { generateAmazonMinifigLink, generateBrickLinkMinifigLink } from '@/lib/affiliate-links';
import { useTranslation } from '@/components/TranslationProvider';

interface WishlistItem {
  id: string;
  minifigure_no: string;
  minifigure_name: string;
  image_url: string | null;
  date_added: string;
}

export default function WishlistPage() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      loadWishlist();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, router]);

  const loadWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      if (data.success) {
        setWishlist(data.data);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlist(wishlist.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleBuyClick = async (platform: 'amazon' | 'bricklink', item: WishlistItem, url: string) => {
    try {
      // Track the click
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          productType: 'minifig',
          productId: item.minifigure_no,
          productName: item.minifigure_name,
          redirectUrl: url,
        }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e5e5',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    );
  }

  // Show sign-in prompt for unauthenticated users
  if (status === 'unauthenticated') {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 16px',
        minHeight: 'calc(100vh - 72px)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '80px 32px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5'
        }}>
          <HeartIcon style={{
            width: '64px',
            height: '64px',
            color: '#171717',
            margin: '0 auto 24px'
          }} />
          <p style={{
            fontSize: 'var(--text-xl)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '12px'
          }}>
            {t('wishlist.signInTitle')}
          </p>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            marginBottom: '32px',
            lineHeight: '1.6',
            maxWidth: '500px',
            margin: '0 auto 32px'
          }}>
            {t('wishlist.signInDescription')}
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link
              href="/auth/signin"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: '#ffffff',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6';
              }}
            >
              {t('navigation.signIn')}
            </Link>
            <Link
              href="/auth/signup"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                fontSize: 'var(--text-base)',
                fontWeight: '600',
                color: '#171717',
                background: '#ffffff',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.borderColor = '#d4d4d4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}
            >
              {t('wishlist.createAccount')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 16px',
      minHeight: 'calc(100vh - 72px)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <HeartIcon style={{ width: '32px', height: '32px', color: '#171717' }} />
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: '600',
            color: '#171717',
            letterSpacing: '-0.02em'
          }}>
            {t('wishlist.title')}
          </h1>
        </div>
        <p style={{
          fontSize: 'var(--text-base)',
          color: '#737373',
          lineHeight: '1.6'
        }}>
          {t('wishlist.itemsSaved', { count: wishlist.length })}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 32px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e5e5'
        }}>
          <HeartIcon style={{
            width: '64px',
            height: '64px',
            color: '#d4d4d4',
            margin: '0 auto 24px'
          }} />
          <p style={{
            fontSize: 'var(--text-base)',
            fontWeight: '600',
            color: '#171717',
            marginBottom: '8px'
          }}>
            {t('wishlist.emptyTitle')}
          </p>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            {t('wishlist.emptyDescription')}
          </p>
          <Link
            href="/search"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: '#ffffff',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            {t('wishlist.browseButton')}
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px'
        }}>
          {wishlist.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e5e5',
                overflow: 'hidden',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#d4d4d4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e5e5';
              }}
            >
              <Link
                href={`/minifigs/${item.minifigure_no}`}
                style={{
                  display: 'block',
                  padding: '16px',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  background: '#ffffff',
                  borderRadius: '8px'
                }}>
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.minifigure_name}
                      width={140}
                      height={175}
                      style={{
                        width: 'auto',
                        height: '160px',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '48px' }}>🧱</span>
                  )}
                </div>
                <h3 style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: '600',
                  color: '#171717',
                  marginBottom: '6px',
                  lineHeight: '1.4',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {item.minifigure_name}
                </h3>
                <p style={{
                  fontSize: 'var(--text-xs)',
                  color: '#737373',
                  fontFamily: 'monospace',
                  marginBottom: '12px'
                }}>
                  {item.minifigure_no}
                </p>
              </Link>

              {/* Buy Buttons */}
              <div style={{
                padding: '0 16px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const bricklinkUrl = generateBrickLinkMinifigLink(item.minifigure_no);
                    handleBuyClick('bricklink', item, bricklinkUrl);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '600',
                    color: '#ffffff',
                    background: '#3b82f6',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <ShoppingCartIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('wishlist.buyBrickLink')}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const amazonUrl = generateAmazonMinifigLink(item.minifigure_no, item.minifigure_name);
                    handleBuyClick('amazon', item, amazonUrl);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    color: '#737373',
                    background: '#ffffff',
                    border: '1px solid #d4d4d4',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.borderColor = '#a3a3a3';
                    e.currentTarget.style.color = '#171717';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#d4d4d4';
                    e.currentTarget.style.color = '#737373';
                  }}
                >
                  <ShoppingCartIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('wishlist.buyAmazon')}</span>
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item.id);
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: '#737373'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fef2f2';
                  e.currentTarget.style.borderColor = '#fecaca';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.color = '#737373';
                }}
              >
                <TrashIcon style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

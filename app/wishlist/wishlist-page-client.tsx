'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { generateAmazonMinifigLink, generateBrickLinkMinifigLink, generateAmazonLegoSetLink, generateBrickLinkAffiliateLink } from '@/lib/affiliate-links';
import { generateEbaySetLink } from '@/lib/ebay-affiliate-links';
import { useTranslation } from '@/components/TranslationProvider';
import SegmentedControl from '@/components/ui/SegmentedControl';

interface MinifigWishlistItem {
  id: string;
  minifigure_no: string;
  minifigure_name: string;
  image_url: string | null;
  date_added: string;
}

interface WalmartDeal {
  currentPrice: number;
  listPrice: number | null;
  discountPercent: number;
  productUrl: string;
}

interface SetWishlistItem {
  id: string;
  box_no: string;
  set_name: string;
  image_url: string | null;
  date_added: string;
}

export default function WishlistPage() {
  const { t, translations } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [minifigWishlist, setMinifigWishlist] = useState<MinifigWishlistItem[]>([]);
  const [setWishlist, setSetWishlist] = useState<SetWishlistItem[]>([]);
  /**
   * Walmart price per box number, for the sets on this wishlist.
   *
   * Sets only. WalmartDeal is keyed by box number and the Impact catalogue
   * matches boxed sets, not individual minifigures -- so minifig cards keep
   * their Amazon search link, which is the best that exists for them.
   */
  const [walmartDeals, setWalmartDeals] = useState<Record<string, WalmartDeal>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'minifigs' | 'sets'>('minifigs');

  const buyOnEbayLabel = translations?.buyButtons?.ebay?.buyOn || 'Buy on eBay';
  const amazonLabel = translations?.buyButtons?.amazon?.name || 'Amazon';

  useEffect(() => {
    if (status === 'authenticated') {
      loadWishlists();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, router]);

  const loadWalmartDeals = async (sets: SetWishlistItem[]) => {
    const boxNos = sets.map((s) => s.box_no).filter(Boolean);
    if (boxNos.length === 0) return;
    try {
      const res = await fetch(
        `/api/walmart-deals/lookup?boxNos=${encodeURIComponent(boxNos.join(','))}`
      );
      const data = await res.json();
      if (data.deals) setWalmartDeals(data.deals);
    } catch (error) {
      // No Walmart buttons is a fine outcome; the rest of the card still works.
      console.error('Error loading Walmart prices:', error);
    }
  };

  const loadWishlists = async () => {
    try {
      const [minifigResponse, setResponse] = await Promise.all([
        fetch('/api/wishlist'),
        fetch('/api/set-wishlist')
      ]);

      const minifigData = await minifigResponse.json();
      const setData = await setResponse.json();

      if (minifigData.success) {
        setMinifigWishlist(minifigData.data);
      }
      if (setData.success) {
        setSetWishlist(setData.data);
        // One request for every set on the list rather than one per card.
        // Deliberately not awaited with the two above: a slow or failed price
        // lookup must not hold up rendering the wishlist itself.
        loadWalmartDeals(setData.data as SetWishlistItem[]);
      }
    } catch (error) {
      console.error('Error loading wishlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMinifig = async (id: string) => {
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMinifigWishlist(minifigWishlist.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleRemoveSet = async (id: string) => {
    try {
      const response = await fetch(`/api/set-wishlist/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSetWishlist(setWishlist.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleBuyClick = async (platform: 'amazon' | 'bricklink' | 'ebay' | 'walmart', productType: 'minifig' | 'set', productId: string, productName: string, url: string) => {
    try {
      // Track the click
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          productType,
          productId,
          productName,
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
                borderRadius: '999px',
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

  const totalItems = minifigWishlist.length + setWishlist.length;
  const currentWishlist = activeTab === 'minifigs' ? minifigWishlist : setWishlist;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      // 32px above the heading, matching every other page. See
      // components/PageHeading.tsx -- this page keeps its own markup because
      // the h1 is paired with an icon, but it uses the same spacing.
      padding: '32px 16px 48px',
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
            fontWeight: '700',
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
          {t('wishlist.itemsSaved', { count: totalItems })}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <SegmentedControl
          ariaLabel={t('wishlist.tabs.minifigures')}
          value={activeTab}
          onChange={(v) => setActiveTab(v as 'minifigs' | 'sets')}
          options={[
            { value: 'minifigs', label: t('wishlist.tabs.minifigures'), count: minifigWishlist.length },
            { value: 'sets', label: t('wishlist.tabs.sets'), count: setWishlist.length },
          ]}
        />
      </div>

      {/* Empty state */}
      {currentWishlist.length === 0 ? (
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
            {activeTab === 'minifigs' ? t('wishlist.emptyMinifigs') : t('wishlist.emptySets')}
          </p>
          <p style={{
            fontSize: 'var(--text-base)',
            color: '#737373',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            {activeTab === 'minifigs'
              ? t('wishlist.emptyMinifigsHint')
              : t('wishlist.emptySetsHint')}
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: '#ffffff',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '999px',
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
          {activeTab === 'minifigs' ? (
            // Minifigs Grid
            minifigWishlist.map((item) => (
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
                    <Image
                      src={`/api/images/minifig/${item.minifigure_no}`}
                      alt={item.minifigure_name}
                      width={140}
                      height={175}
                      style={{
                        width: 'auto',
                        height: '160px',
                        maxWidth: '100%',
                        objectFit: 'contain'
                      }}
                      unoptimized
                    />
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
                      handleBuyClick('bricklink', 'minifig', item.minifigure_no, item.minifigure_name, bricklinkUrl);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
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
                      handleBuyClick('amazon', 'minifig', item.minifigure_no, item.minifigure_name, amazonUrl);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: '#737373',
                      background: '#ffffff',
                      border: '1px solid #d4d4d4',
                      // Pill, matching the BrickLink button directly above it.
                      // These two sit stacked in the same card; one rounded
                      // rectangle under one pill reads as a mistake.
                      borderRadius: '999px',
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
                    handleRemoveMinifig(item.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    minWidth: '32px',
                    minHeight: '32px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: '#737373',
                    flexShrink: 0
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
            ))
          ) : (
            // Sets Grid
            setWishlist.map((item) => (
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
                  href={`/sets/${item.box_no}`}
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
                    borderRadius: '8px',
                    position: 'relative'
                  }}>
                    {/* Discount rides on the image, like the /deals cards. In
                        the buy button it shared a narrow row with the label and
                        truncated it to "Walma...". */}
                    {walmartDeals[item.box_no]?.discountPercent >= 10 && (
                      <span style={{
                        position: 'absolute',
                        top: 0,
                        // Left, not right: the remove button sits top-right of
                        // this card and the two overlapped.
                        left: 0,
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        color: '#ffffff',
                        background: '#b91c1c',
                        borderRadius: '999px',
                        padding: '2px 8px',
                      }}>
                        {walmartDeals[item.box_no].discountPercent}% off
                      </span>
                    )}
                    {/* No <Image> at all when there is no URL. It used to pass
                        `item.image_url || ''`, and next/image rejects an empty
                        src -- console errors on every render plus a browser
                        refetch of the whole page, for a set row whose image is
                        simply not known yet. */}
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.set_name}
                        width={160}
                        height={160}
                        style={{
                          width: 'auto',
                          height: 'auto',
                          maxWidth: '100%',
                          maxHeight: '160px',
                          objectFit: 'contain'
                        }}
                        unoptimized
                      />
                    ) : (
                      <span style={{ fontSize: 'var(--text-xs)', color: '#a3a3a3' }}>
                        {item.box_no}
                      </span>
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
                    {item.set_name}
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-xs)',
                    color: '#737373',
                    fontFamily: 'monospace',
                    marginBottom: '12px'
                  }}>
                    {item.box_no}
                  </p>
                </Link>

                {/* Buy Buttons for Sets */}
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
                      const ebayUrl = generateEbaySetLink(item.box_no, item.set_name);
                      handleBuyClick('ebay', 'set', item.box_no, item.set_name, ebayUrl);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '600',
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
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <ShoppingCartIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{buyOnEbayLabel}</span>
                  </button>
                  {/* Walmart when we have a real price for this set, Amazon
                      otherwise. Amazon is a bare search link with no price on
                      it -- the whole reason this exists is that a button
                      carrying "$49.95, 64% off" is worth clicking and a button
                      saying "Amazon" is not. Sets only: WalmartDeal is keyed by
                      box number, so minifig cards keep their Amazon link. */}
                  {walmartDeals[item.box_no] ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBuyClick(
                          'walmart',
                          'set',
                          item.box_no,
                          item.set_name,
                          walmartDeals[item.box_no].productUrl
                        );
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '600',
                        color: '#171717',
                        background: '#ffffff',
                        border: '1px solid #d4d4d4',
                        borderRadius: '999px',
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
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.borderColor = '#d4d4d4';
                      }}
                    >
                      {/* No cart icon here, unlike the button above: the card
                          leaves ~150px of usable width and "Walmart $49.95"
                          plus an icon truncated to "Walmart $49....". Naming
                          the retailer beats a second cart glyph. */}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Walmart ${walmartDeals[item.box_no].currentPrice.toFixed(2)}
                      </span>
                    </button>
                  ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const amazonUrl = generateAmazonLegoSetLink(item.box_no, item.set_name);
                      handleBuyClick('amazon', 'set', item.box_no, item.set_name, amazonUrl);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: '#737373',
                      background: '#ffffff',
                      border: '1px solid #d4d4d4',
                      // Pill, matching the BrickLink button directly above it.
                      // These two sit stacked in the same card; one rounded
                      // rectangle under one pill reads as a mistake.
                      borderRadius: '999px',
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
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{amazonLabel}</span>
                  </button>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSet(item.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    minWidth: '32px',
                    minHeight: '32px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: '#737373',
                    flexShrink: 0
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
            ))
          )}
        </div>
      )}
    </div>
  );
}

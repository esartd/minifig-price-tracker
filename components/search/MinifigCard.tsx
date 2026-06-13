'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getSensitiveImageStyles } from '@/lib/minifig-filters';
import { generateAmazonMinifigLink, generateAmazonLegoSetLink } from '@/lib/affiliate-links';
import { trackAffiliateClick } from '@/lib/analytics';
import { useTranslation } from '@/components/TranslationProvider';

interface MinifigCardProps {
  minifig: any;
}

interface AmazonPrice {
  currentPrice: number;
  listPrice: number;
  discountPercent: number;
  isPrime: boolean;
}

export default function MinifigCard({
  minifig
}: MinifigCardProps) {
  const router = useRouter();
  const { translations } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [amazonPrice, setAmazonPrice] = useState<AmazonPrice | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const viewDetailsLabel = translations?.common?.viewDetails || 'View Details';
  const shopOnAmazonLabel = translations?.buyButtons?.amazon?.shopOn || 'Shop on Amazon';
  const amazonLabel = translations?.buyButtons?.amazon?.name || 'Amazon';

  // Detect if this is a set or minifig
  const isSet = minifig.resultType === 'set' || minifig.box_no;

  // Fetch Amazon price for sets
  // DISABLED: Feature temporarily disabled to prevent database connection exhaustion
  // Will re-enable once ASIN database is populated via populate-asins script
  // useEffect(() => {
  //   if (!isSet) return; // Only fetch for sets

  //   const fetchPrice = async () => {
  //     setLoadingPrice(true);
  //     try {
  //       const boxNo = minifig.box_no;
  //       const response = await fetch(`/api/amazon/set-price/${boxNo}`);
  //       const data = await response.json();

  //       if (data.success && data.data) {
  //         setAmazonPrice(data.data);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch Amazon price:', error);
  //     } finally {
  //       setLoadingPrice(false);
  //     }
  //   };

  //   fetchPrice();
  // }, [isSet, minifig.box_no]);

  // Display full minifig name from BrickLink (no modifications)
  const getDisplayName = (fullName: string): string => {
    const decodeHTML = (html: string) => {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    };

    let cleaned = decodeHTML(fullName);
    const parts = cleaned.split(',');
    return parts.length > 1 ? parts[0].trim() : cleaned.trim();
  };

  const handleClick = () => {
    if (isSet) {
      router.push(`/sets/${minifig.box_no}`);
    } else {
      router.push(`/minifigs/${minifig.minifigure_no || minifig.no}`);
    }
  };

  // Get image URL - use provided image_url or construct from minifigure number
  const getImageUrl = () => {
    const itemNo = isSet ? minifig.box_no : (minifig.minifigure_no || minifig.no);

    // First try: use provided image_url
    if (minifig.image_url) {
      return minifig.image_url;
    }

    // Debug: Log when fallback is used
    if (!minifig.image_url && itemNo) {
      console.warn(`[MinifigCard] No image_url for ${itemNo}, using fallback`);
    }

    // Fallback: construct BrickLink image URL from item number
    if (itemNo) {
      return isSet
        ? `https://img.bricklink.com/ItemImage/ON/0/${itemNo}.png` // ON = Original Normal for sets
        : `https://img.bricklink.com/ItemImage/MN/0/${itemNo}.png`; // MN = Minifig Normal
    }

    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div
      className="minifig-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e5e5',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top Section: Image + Content + Buttons */}
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          flex: 1,
          cursor: 'pointer'
        }}
      >
      {/* Image */}
      <div
        className="minifig-card-image-container"
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isSet ? '160px' : '100px',
          minHeight: '140px',
          padding: isSet ? '16px' : '8px 0',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          overflow: 'hidden'
        }}
      >
        {imageUrl && !imageError ? (
          <Image
            className="minifig-card-image"
            src={imageUrl}
            alt={minifig.name}
            width={isSet ? 160 : 100}
            height={140}
            style={{
              height: '140px',
              width: isSet ? '100%' : 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
              ...getSensitiveImageStyles(minifig.minifigure_no || minifig.no, minifig.name)
            }}
            unoptimized
            onError={(e) => {
              // If ON format fails for sets, try SN format
              if (isSet && imageUrl.includes('/ON/')) {
                const snUrl = imageUrl.replace('/ON/', '/SN/');
                if (e.currentTarget.src !== snUrl) {
                  e.currentTarget.src = snUrl;
                  return;
                }
              }
              setImageError(true);
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-2xl)'
          }}>
            🧱
          </div>
        )}
      </div>

        {/* Content */}
        <div className="minifig-card-content" style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '32px',
          minWidth: 0
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Year Eyebrow */}
            {minifig.year_released && minifig.year_released !== '?' && (
              <div style={{
                fontSize: 'var(--text-xs)',
                fontWeight: '600',
                color: '#737373',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '4px'
              }}>
                {minifig.year_released}
              </div>
            )}

            <h4 className="minifig-card-title" style={{
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              color: '#171717',
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: '6px'
            }}>
              {getDisplayName(minifig.name)}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <p className="minifig-card-id" style={{
                fontSize: 'var(--text-sm)',
                color: '#737373',
                fontFamily: 'inherit',
                margin: 0
              }}>
                {isSet ? minifig.box_no : (minifig.minifigure_no || minifig.no)}
              </p>
              {isSet && (
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: '600',
                  color: '#3b82f6',
                  background: '#eff6ff',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  SET
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons - Desktop only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }} className="minifig-card-buttons-desktop">
            {/* View Details Button */}
            <button
              onClick={handleClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#3b82f6',
                color: 'white',
                borderRadius: '6px',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6';
              }}
            >
              {viewDetailsLabel}
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>

            {/* Amazon Buy Button */}
            <Link
              href={isSet
                ? generateAmazonLegoSetLink(minifig.box_no, minifig.name)
                : generateAmazonMinifigLink(minifig.minifigure_no || minifig.no, minifig.name)
              }
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card navigation
                trackAffiliateClick(
                  'amazon',
                  isSet ? minifig.box_no : (minifig.minifigure_no || minifig.no),
                  'search-results'
                );
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '2px',
                padding: amazonPrice ? '6px 14px' : '8px 14px',
                background: amazonPrice?.discountPercent ? '#FFF7ED' : 'white',
                color: '#525252',
                borderRadius: '6px',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                border: amazonPrice?.discountPercent ? '1px solid #fb923c' : '1px solid #e5e5e5',
                cursor: 'pointer',
                minWidth: amazonPrice ? '120px' : 'auto'
              }}
              onMouseEnter={(e) => {
                if (amazonPrice?.discountPercent) {
                  e.currentTarget.style.background = '#FFEDD5';
                  e.currentTarget.style.borderColor = '#f97316';
                } else {
                  e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.style.borderColor = '#d4d4d4';
                }
              }}
              onMouseLeave={(e) => {
                if (amazonPrice?.discountPercent) {
                  e.currentTarget.style.background = '#FFF7ED';
                  e.currentTarget.style.borderColor = '#fb923c';
                } else {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e5e5e5';
                }
              }}
            >
              {loadingPrice && isSet ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', border: '2px solid #e5e5e5', borderTop: '2px solid #525252', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <span>{amazonLabel}</span>
                </div>
              ) : amazonPrice ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: '#737373' }}>{amazonLabel}</span>
                    {amazonPrice.isPrime && (
                      <span style={{ fontSize: '10px', fontWeight: '600', color: '#00a8e1', background: '#e6f7ff', padding: '1px 4px', borderRadius: '3px' }}>Prime</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: '#171717' }}>
                      ${amazonPrice.currentPrice.toFixed(2)}
                    </span>
                    {amazonPrice.discountPercent > 0 && (
                      <>
                        <span style={{ fontSize: 'var(--text-xs)', color: '#737373', textDecoration: 'line-through' }}>
                          ${amazonPrice.listPrice.toFixed(2)}
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: '#f97316' }}>
                          -{amazonPrice.discountPercent}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span>{shopOnAmazonLabel}</span>
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Action Buttons - Mobile only (below content) */}
      <div className="minifig-card-buttons-mobile" style={{
        display: 'none',
        flexDirection: 'row',
        gap: '0',
        borderTop: '1px solid #e5e5e5'
      }}>
        {/* View Details Button */}
        <button
          onClick={handleClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px 16px',
            background: '#3b82f6',
            color: 'white',
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: 'none',
            borderRight: '1px solid #2563eb',
            cursor: 'pointer',
            flex: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#3b82f6';
          }}
        >
          {viewDetailsLabel}
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>

        {/* Amazon Buy Button */}
        <Link
          href={isSet
            ? generateAmazonLegoSetLink(minifig.box_no, minifig.name)
            : generateAmazonMinifigLink(minifig.minifigure_no || minifig.no, minifig.name)
          }
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card navigation
            trackAffiliateClick(
              'amazon',
              isSet ? minifig.box_no : (minifig.minifigure_no || minifig.no),
              'search-results'
            );
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: amazonPrice ? '2px' : '6px',
            padding: '12px 16px',
            background: amazonPrice?.discountPercent ? '#FFF7ED' : 'white',
            color: '#525252',
            fontSize: 'var(--text-sm)',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'all 0.2s',
            border: 'none',
            borderLeft: amazonPrice?.discountPercent ? '1px solid #fb923c' : 'none',
            cursor: 'pointer',
            flex: 1
          }}
          onMouseEnter={(e) => {
            if (amazonPrice?.discountPercent) {
              e.currentTarget.style.background = '#FFEDD5';
            } else {
              e.currentTarget.style.background = '#fafafa';
            }
          }}
          onMouseLeave={(e) => {
            if (amazonPrice?.discountPercent) {
              e.currentTarget.style.background = '#FFF7ED';
            } else {
              e.currentTarget.style.background = 'white';
            }
          }}
        >
          {amazonPrice ? (
            <>
              <span style={{ fontSize: 'var(--text-xs)', color: '#737373' }}>
                {amazonLabel} {amazonPrice.isPrime && '⚡'}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: '700', color: '#171717' }}>
                  ${amazonPrice.currentPrice.toFixed(2)}
                </span>
                {amazonPrice.discountPercent > 0 && (
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: '#f97316' }}>
                    -{amazonPrice.discountPercent}%
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {shopOnAmazonLabel}
            </>
          )}
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSensitiveImageStyles } from '@/lib/minifig-filters';

interface MinifigCardProps {
  minifig: any;
}

export default function MinifigCard({
  minifig
}: MinifigCardProps) {
  const router = useRouter();

  // Detect if this is a set or minifig
  const isSet = minifig.resultType === 'set' || minifig.box_no;

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
    // First try: use provided image_url
    if (minifig.image_url) {
      return minifig.image_url;
    }

    // Fallback: construct BrickLink image URL from item number
    const itemNo = isSet ? minifig.box_no : (minifig.minifigure_no || minifig.no);
    if (itemNo) {
      const fallbackUrl = isSet
        ? `https://img.bricklink.com/ItemImage/SN/0/${itemNo}.png`
        : `https://img.bricklink.com/ItemImage/MN/0/${itemNo}.png`;
      console.log('[MinifigCard] Using fallback URL for', itemNo, ':', fallbackUrl);
      return fallbackUrl;
    }

    console.warn('[MinifigCard] No image URL available for:', minifig);
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div
      className="minifig-card"
      onClick={handleClick}
      style={{
        display: 'flex',
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
      {/* Image */}
      <div
        className="minifig-card-image-container"
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100px',
          minHeight: '140px',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          overflow: 'hidden'
        }}
      >
        {imageUrl ? (
          <Image
            className="minifig-card-image"
            src={imageUrl}
            alt={minifig.name}
            width={100}
            height={140}
            style={{
              height: '140px',
              width: 'auto',
              maxWidth: 'none',
              objectFit: 'contain',
              ...getSensitiveImageStyles(minifig.minifigure_no || minifig.no, minifig.name)
            }}
            unoptimized
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

        <div className="minifig-card-arrow" style={{
          marginLeft: '16px',
          color: '#a3a3a3'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="var(--icon-stroke)" stroke="currentColor" style={{ width: 'var(--icon-base)', height: 'var(--icon-base)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/components/TranslationProvider';

interface DealSetCardProps {
  deal: {
    boxNo: string;
    walmartItemId: string;
    name: string;
    theme: string;
    currentPrice: number;
    listPrice: number | null;
    discountPercent: number;
  
    imageUrl: string;
    buyUrl: string;
  };
  tierColor: string;
}

export default function DealSetCard({ deal, tierColor }: DealSetCardProps) {
  const { translations, t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(deal.imageUrl);

  // Walmart, not Amazon. The deals data moved over; these two labels were the
  // last thing still naming the old retailer on the card.
  const sponsoredLabel = translations?.buyButtons?.walmart?.sponsored || translations?.buyButtons?.ebay?.sponsored || 'Sponsored';
  const buyLabel = translations?.buyButtons?.walmart?.buyOn || 'Buy at Walmart';

  const handleImageError = () => {
    // Try fallback: switch between /ON/ and /SN/ image URLs
    if (currentImageUrl.includes('/ON/')) {
      const snUrl = currentImageUrl.replace('/ON/', '/SN/');
      setCurrentImageUrl(snUrl);
    } else {
      setImageError(true);
    }
  };

  return (
    /**
     * The whole card is the link, because the card has exactly one call to
     * action and it is "Buy at Walmart". Sending a click on the image or the
     * title to our own set page instead put a page in front of the only thing
     * the card offers -- on a deals page, where the reader's intent is to buy
     * the deal, that is a step backwards.
     *
     * This is why the inner Links to /sets/{boxNo} are gone rather than kept
     * alongside: an <a> inside an <a> is invalid HTML, and browsers recover
     * from it unpredictably. The set page is still reachable from search and
     * from every browse page.
     */
    <a
      href={deal.buyUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        background: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e5e5e5',
        transition: 'all 0.2s',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Discount Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: tierColor,
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '8px',
          fontWeight: '700',
          fontSize: '14px',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        {deal.discountPercent}% {t('deals.off') || 'OFF'}
      </div>

      {/* Sponsored Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: '#f5f5f5',
          color: '#525252',
          padding: '4px 8px',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '11px',
          zIndex: 10,
        }}
      >
        {sponsoredLabel}
      </div>

      {/* Set Image */}
      <div>
        <div
          style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            background: '#ffffff',
          }}
        >
          {!imageError ? (
            <Image
              src={currentImageUrl}
              alt={deal.name}
              width={200}
              height={200}
              style={{
                maxHeight: '180px',
                width: 'auto',
                objectFit: 'contain',
              }}
              unoptimized
              onError={handleImageError}
            />
          ) : (
            <div style={{ fontSize: '48px', opacity: 0.3 }}>📦</div>
          )}
        </div>
      </div>

      {/* Set Info */}
      <div style={{ padding: '16px' }}>
        <div>
          <p
            style={{
              fontSize: '12px',
              color: '#737373',
              marginBottom: '4px',
              fontWeight: '500',
            }}
          >
            {deal.boxNo}
          </p>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#171717',
              marginBottom: '8px',
              lineHeight: '1.4',
              minHeight: '42px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {deal.name}
          </h3>
        </div>

        {/* Theme Badge */}
        <div
          style={{
            display: 'inline-block',
            background: '#f5f5f5',
            color: '#525252',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '500',
            marginBottom: '12px',
          }}
        >
          {deal.theme}
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#171717',
              }}
            >
              ${deal.currentPrice.toFixed(2)}
            </span>
            {/* Only when Walmart is actually discounting. listPrice is null on
                undiscounted items -- most of them -- and the old Amazon version
                assumed it was always present, so this would have crashed on the
                first full-price set. */}
            {deal.listPrice !== null && deal.listPrice > deal.currentPrice && (
              <span
                style={{
                  fontSize: '14px',
                  color: '#737373',
                  textDecoration: 'line-through',
                }}
              >
                ${deal.listPrice.toFixed(2)}
              </span>
            )}
          </div>
          {deal.listPrice !== null && deal.listPrice > deal.currentPrice && (
            <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
              {t('deals.save') || 'Save'} ${(deal.listPrice - deal.currentPrice).toFixed(2)}
            </p>
          )}
        </div>

        {/* Looks like a button, is not a link. The whole card is already the
            anchor, and an <a> nested inside an <a> is invalid HTML that
            browsers recover from in their own ways -- some drop the inner one,
            some split the outer. Rendering it as a span keeps the affordance
            and leaves exactly one link on the card. */}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: '44px',
            padding: '12px 16px',
            background: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: '600',
            textAlign: 'center',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#3b82f6';
          }}
        >
          {buyLabel}
        </span>
      </div>
    </a>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/components/TranslationProvider';

interface DealSetCardProps {
  deal: {
    boxNo: string;
    asin: string;
    name: string;
    theme: string;
    currentPrice: number;
    listPrice: number;
    discountPercent: number;
    isPrime: boolean;
    imageUrl: string;
    amazonUrl: string;
  };
  tierColor: string;
}

export default function DealSetCard({ deal, tierColor }: DealSetCardProps) {
  const { translations } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(deal.imageUrl);

  const sponsoredLabel = translations?.buyButtons?.amazon?.sponsored || translations?.buyButtons?.ebay?.sponsored || 'Sponsored';
  const buyOnAmazonLabel = translations?.buyButtons?.amazon?.buyOn || 'Buy on Amazon';

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
    <div
      style={{
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
        {deal.discountPercent}% OFF
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
      <Link href={`/sets/${deal.boxNo}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>

      {/* Set Info */}
      <div style={{ padding: '16px' }}>
        <Link
          href={`/sets/${deal.boxNo}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
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
        </Link>

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
            <span
              style={{
                fontSize: '14px',
                color: '#737373',
                textDecoration: 'line-through',
              }}
            >
              ${deal.listPrice.toFixed(2)}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
            Save ${(deal.listPrice - deal.currentPrice).toFixed(2)}
          </p>
        </div>

        {/* View Deal Button */}
        <a
          href={deal.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
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
            borderRadius: '8px',
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
          {buyOnAmazonLabel}
        </a>
      </div>
    </div>
  );
}

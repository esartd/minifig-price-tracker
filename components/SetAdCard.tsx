'use client';

import Image from 'next/image';
import { generateAmazonLegoSetLink } from '@/lib/affiliate-links';

interface SetAdCardProps {
  setNumber: string;
  setName: string;
  imageUrl: string;
  year?: number;
  amazonUrl?: string; // Optional direct Amazon affiliate URL
}

/**
 * Ad card component for LEGO sets with Amazon affiliate links
 * Designed to blend naturally into the minifig grid
 * Supports both auto-generated and direct Amazon URLs
 */
export default function SetAdCard({ setNumber, setName, imageUrl, year, amazonUrl }: SetAdCardProps) {
  // Generate Amazon affiliate link
  const amazonLink = amazonUrl || generateAmazonLegoSetLink(setNumber, setName);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const redirectUrl = amazonLink;

    try {
      // Track the click
      await fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'amazon',
          productType: 'set',
          productId: setNumber,
          productName: setName,
          redirectUrl,
        }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    // Open link
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href={amazonLink}
      onClick={handleClick}
      rel="noopener noreferrer sponsored"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        border: '2px solid #3b82f6',
        borderRadius: '12px',
        padding: '16px',
        overflow: 'hidden',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        alignItems: 'center',
        height: '100%',
        textDecoration: 'none',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.12)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e5e5';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Set Image - Square on left side */}
      <div style={{
        position: 'relative',
        width: '140px',
        height: '140px',
        flexShrink: 0,
        background: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <Image
          src={imageUrl}
          alt={setName}
          fill
          sizes="140px"
          style={{
            objectFit: 'contain',
            padding: '8px'
          }}
          unoptimized
        />
      </div>

      {/* Set Info - Flex column on right */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
        <div>
          {/* Sponsored Badge */}
          <div style={{
            display: 'inline-block',
            fontSize: '10px',
            fontWeight: '600',
            color: '#3b82f6',
            background: '#eff6ff',
            padding: '4px 8px',
            borderRadius: '4px',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Sponsored
          </div>

          {/* Set Name */}
          <h3 style={{
            fontSize: 'var(--text-base)',
            fontWeight: '700',
            color: '#171717',
            lineHeight: '1.3',
            marginBottom: '4px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {setName}
          </h3>

          {/* Set Number */}
          <p style={{
            fontSize: 'var(--text-xs)',
            color: '#737373',
            fontFamily: 'monospace',
            marginBottom: '0'
          }}>
            {setNumber}
          </p>
        </div>

        {/* Buy Button - Visual indicator (entire card is clickable) */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: '#ffffff',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              textAlign: 'center',
              textDecoration: 'none',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              pointerEvents: 'none' // Entire card is clickable, button is just visual
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Buy on Amazon
          </div>
        </div>
      </div>
    </a>
  );
}

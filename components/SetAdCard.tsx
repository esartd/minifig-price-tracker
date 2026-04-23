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
    <div
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        padding: '16px',
        overflow: 'hidden',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr auto', // Badge, Image, Info, Buttons
        height: '100%'
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
      {/* Featured Set Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        background: 'rgba(59, 130, 246, 0.95)',
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '4px 8px',
        borderRadius: '4px',
        zIndex: 1,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        Featured Set
      </div>

      {/* Set Image - Match minifig card structure */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%', // Creates 1:1 aspect ratio like minifig cards
        marginBottom: '12px',
        background: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <Image
          src={imageUrl}
          alt={setName}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 180px"
          style={{
            objectFit: 'contain',
            padding: '8px'
          }}
          unoptimized
        />
      </div>

      {/* Set Info */}
      <div style={{ marginBottom: '16px' }}>
        {/* Set Number */}
        <p style={{
          fontSize: 'var(--text-xs)',
          color: '#737373',
          fontFamily: 'monospace',
          marginBottom: '4px'
        }}>
          {setNumber}
        </p>

        {/* Set Name */}
        <h3 style={{
          fontSize: 'var(--text-sm)',
          fontWeight: '600',
          color: '#171717',
          lineHeight: '1.4',
          marginBottom: '0',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {setName}
        </h3>
      </div>

      {/* Buy Button - Amazon only (no LEGO.com affiliate program) */}
      <div style={{
        alignSelf: 'end'
      }}>
          <a
            href={amazonLink}
            onClick={handleClick}
            rel="noopener noreferrer sponsored"
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 16px',
              fontSize: 'var(--text-xs)',
              fontWeight: '600',
              color: '#ffffff',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              textAlign: 'center',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Buy on Amazon
          </a>
        </div>
    </div>
  );
}

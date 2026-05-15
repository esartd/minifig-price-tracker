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
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
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
      {/* Sponsored Badge */}
      <div style={{
        display: 'inline-block',
        fontSize: '9px',
        fontWeight: '600',
        color: '#3b82f6',
        background: '#eff6ff',
        padding: '3px 6px',
        borderRadius: '4px',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        alignSelf: 'flex-start'
      }}>
        Sponsored
      </div>

      {/* Set Image - Landscape ratio for shorter height */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '60%',
        marginBottom: '12px',
        background: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <Image
          src={imageUrl}
          alt={setName}
          fill
          sizes="(max-width: 768px) 50vw, 400px"
          style={{
            objectFit: 'contain',
            padding: '12px'
          }}
          unoptimized
        />
      </div>

      {/* Set Name */}
      <h3 style={{
        fontSize: 'var(--text-sm)',
        fontWeight: '600',
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
        fontSize: '11px',
        color: '#737373',
        fontFamily: 'monospace',
        marginBottom: '12px'
      }}>
        {setNumber}
      </p>

      {/* Check Price Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#ffffff',
          background: '#3b82f6',
          border: 'none',
          borderRadius: '6px',
          textAlign: 'center',
          textDecoration: 'none',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
          marginTop: 'auto',
          pointerEvents: 'none'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20"></path>
        </svg>
        Check Price
      </div>
    </a>
  );
}

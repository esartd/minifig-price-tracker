'use client';

import Image from 'next/image';
import PriceDisplay from './PriceDisplay';
import AddToCollectionForm from './AddToCollectionForm';
import { Session } from 'next-auth';
import { getSensitiveImageStyles } from '@/lib/minifig-filters';

interface SingleResultCardProps {
  minifig: any;
  onImageClick: (imageUrl: string, name: string, e: React.MouseEvent) => void;
  onAddToCollection: (quantity: number) => void;
  loading: boolean;
  pricingData?: { suggestedPrice: number; loading: boolean };
  session: Session | null;
}

export default function SingleResultCard({
  minifig,
  onImageClick,
  onAddToCollection,
  loading,
  pricingData,
  session
}: SingleResultCardProps) {
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

  return (
    <div
      style={{
        display: 'flex',
        overflow: 'hidden',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e5e5',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Image Section */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '160px',
          minHeight: '220px',
          backgroundColor: '#ffffff',
          cursor: minifig.image_url ? 'zoom-in' : 'default'
        }}
      >
        {minifig.image_url ? (
          <Image
            src={minifig.image_url}
            alt={minifig.name}
            onClick={(e) => onImageClick(minifig.image_url, minifig.name, e)}
            width={160}
            height={220}
            style={{
              height: '220px',
              width: 'auto',
              maxWidth: 'none',
              objectFit: 'contain',
              ...getSensitiveImageStyles(minifig.no, minifig.name)
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
            fontSize: '48px'
          }}>
            🧱
          </div>
        )}
      </div>

      {/* Form Section */}
      <div style={{
        flex: 1,
        padding: '48px'
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#171717',
            letterSpacing: '-0.01em',
            marginBottom: '8px'
          }}>
            {getDisplayName(minifig.name)}
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#737373',
            fontFamily: 'inherit',
            marginBottom: '16px'
          }}>
            {minifig.no}
          </p>

          <PriceDisplay
            loading={pricingData?.loading || false}
            price={pricingData?.suggestedPrice}
          />
        </div>

        <AddToCollectionForm
          onAdd={onAddToCollection}
          loading={loading}
          session={session}
        />
      </div>
    </div>
  );
}

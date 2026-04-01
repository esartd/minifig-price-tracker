'use client';

import { useRouter } from 'next/navigation';

interface MinifigCardProps {
  minifig: any;
}

export default function MinifigCard({
  minifig
}: MinifigCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/minifig/${minifig.no}`);
  };

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
          backgroundColor: '#fafafa',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          overflow: 'hidden'
        }}
      >
        {minifig.image_url ? (
          <img
            className="minifig-card-image"
            src={minifig.image_url}
            alt={minifig.name}
            style={{
              height: '140px',
              width: 'auto',
              maxWidth: 'none'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
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
          <h4 className="minifig-card-title" style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#171717',
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: '8px'
          }}>
            {minifig.name}
          </h4>
          <p className="minifig-card-id" style={{
            fontSize: '14px',
            color: '#737373',
            fontFamily: 'monospace'
          }}>
            {minifig.no}
          </p>
        </div>

        <div className="minifig-card-arrow" style={{
          marginLeft: '16px',
          color: '#a3a3a3'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

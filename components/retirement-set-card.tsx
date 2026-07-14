'use client';

import Link from 'next/link';
import type { RetirementPrediction } from '@/lib/retiring-soon-algorithm';

interface Props {
  set: RetirementPrediction;
  translations: any;
}

export default function RetirementSetCard({ set, translations }: Props) {
  // Confidence badge colors
  const confidenceColors = {
    high: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    medium: { bg: '#fef3c7', text: '#92400e', border: '#fde047' },
    low: { bg: '#f3f4f6', text: '#4b5563', border: '#d1d5db' }
  };

  const colors = confidenceColors[set.confidence];

  return (
    <Link
      href={`/sets/${set.boxNo}`}
      style={{
        display: 'block',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.2s',
        textDecoration: 'none',
        color: 'inherit'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Set image */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '75%', // 4:3 aspect ratio
        background: '#fafafa',
        overflow: 'hidden'
      }}>
        {set.imageUrl ? (
          <img
            src={set.imageUrl}
            alt={set.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '1rem'
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#d4d4d4',
            fontSize: 'var(--text-sm)'
          }}>
            {translations?.setCard?.noImage || 'No image'}
          </div>
        )}

        {/* Confidence badge (top right) */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          padding: '0.25rem 0.75rem',
          fontSize: 'var(--text-xs)',
          fontWeight: '600',
          background: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: '6px'
        }}>
          {translations?.confidence?.[set.confidence] || set.confidence}
        </div>
      </div>

      {/* Card content */}
      <div style={{ padding: '1rem' }}>
        {/* Set number */}
        <p style={{
          fontSize: 'var(--text-xs)',
          color: '#737373',
          marginBottom: '0.25rem'
        }}>
          {set.boxNo}
        </p>

        {/* Set name */}
        <h3 style={{
          fontSize: 'var(--text-base)',
          fontWeight: '600',
          color: '#171717',
          marginBottom: '0.5rem',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {set.name}
        </h3>

        {/* Theme */}
        <p style={{
          fontSize: 'var(--text-sm)',
          color: '#525252',
          marginBottom: '0.75rem'
        }}>
          {set.theme}
        </p>

        {/* Age indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem',
          padding: '0.5rem',
          background: '#fafafa',
          borderRadius: '6px'
        }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#525252"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{
            fontSize: 'var(--text-sm)',
            color: '#525252'
          }}>
            {(translations?.setCard?.released || 'Released {year}').replace('{year}', String(set.yearReleased))}
            {' • '}
            {(translations?.setCard?.ageYears || '{age} years old').replace('{age}', String(set.ageYears))}
          </span>
        </div>

        {/* Price increase indicator (if available) */}
        {set.priceIncrease && set.priceIncrease > 5 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            padding: '0.5rem',
            background: set.priceIncrease > 20 ? '#fee2e2' : '#fef3c7',
            border: `1px solid ${set.priceIncrease > 20 ? '#fca5a5' : '#fde047'}`,
            borderRadius: '6px'
          }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={set.priceIncrease > 20 ? '#dc2626' : '#d97706'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span style={{
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              color: set.priceIncrease > 20 ? '#dc2626' : '#d97706'
            }}>
              {(translations?.setCard?.priceIncrease || '+{percent}% price increase').replace('{percent}', set.priceIncrease.toFixed(0))}
            </span>
          </div>
        )}

        {/* Estimated retirement */}
        <div style={{
          padding: '0.75rem',
          background: '#fef3c7',
          border: '1px solid #fde047',
          borderRadius: '8px',
          marginBottom: '0.75rem'
        }}>
          <p style={{
            fontSize: 'var(--text-sm)',
            fontWeight: '600',
            color: '#92400e',
            margin: 0
          }}>
            {(translations?.setCard?.estimatedRetirement || 'Est. retirement: {quarter}')
              .replace('{quarter}', set.estimatedRetirementQuarter || 'Unknown')}
          </p>
        </div>

        {/* Retirement score (progress bar) */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.25rem'
          }}>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: '#737373'
            }}>
              {translations?.setCard?.retirementScore || 'Retirement Score'}
            </span>
            <span style={{
              fontSize: 'var(--text-xs)',
              fontWeight: '600',
              color: '#171717'
            }}>
              {Math.round(set.retirementScore)}/100
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: '#e5e5e5',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${set.retirementScore}%`,
              height: '100%',
              background: set.retirementScore > 70 ? '#ef4444' : set.retirementScore > 50 ? '#f59e0b' : '#84cc16',
              transition: 'width 0.3s'
            }}></div>
          </div>
        </div>

        {/* CTA button */}
        <button style={{
          width: '100%',
          padding: '0.75rem',
          marginTop: '0.75rem',
          fontSize: 'var(--text-sm)',
          fontWeight: '600',
          background: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#2563eb';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#3b82f6';
        }}>
          {translations?.setCard?.viewDetails || 'View Details'}
        </button>
      </div>
    </Link>
  );
}

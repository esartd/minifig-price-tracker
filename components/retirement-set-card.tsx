'use client';

import Link from 'next/link';
import type { RetirementPrediction } from '@/lib/retiring-soon-algorithm';

/**
 * Exported so RetirementYearSection can tint its header chip from the same
 * source. When a whole section shares one confidence the chip replaces the
 * per-card badges, and the two must not drift apart.
 */
export const CONFIDENCE_COLORS: Record<
  RetirementPrediction['confidence'],
  { bg: string; text: string; border: string }
> = {
  high: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  medium: { bg: '#fef3c7', text: '#92400e', border: '#fde047' },
  low: { bg: '#f3f4f6', text: '#4b5563', border: '#d1d5db' }
};

interface Props {
  set: RetirementPrediction;
  translations: any;
  /**
   * False when the surrounding section already states the confidence in its
   * header -- every card in it agrees, so repeating the badge on each one is
   * the noise this redesign exists to remove. Defaults true so the card is
   * still correct on its own.
   */
  showConfidence?: boolean;
}

export default function RetirementSetCard({ set, translations, showConfidence = true }: Props) {
  const colors = CONFIDENCE_COLORS[set.confidence];

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

        {/* Hidden when the whole section shares one confidence and the
            section header states it once instead. */}
        {showConfidence && (
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
        )}
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
            {/* Just the release year. The age used to be appended here too
                ("Released 2023 • 3 years old"), which now repeats the age line
                below it ("3 of an expected 2.5 years"). That line says more,
                because it carries the comparison. */}
            {(translations?.setCard?.released || 'Released {year}').replace('{year}', String(set.yearReleased))}
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

        {/* How far through its expected life this set is.

            This replaced "Retirement Score N/100". That score is
            Math.min(100, ageScore + priceScore + availabilityScore), and
            ageScore alone already reaches 100 for anything at or past its
            lifespan -- so it read exactly 100 on most cards and could not
            separate them, which is misleading on a list sorted by it. The
            ratio below is the uncapped input and genuinely differs per set. */}
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: '#525252',
            margin: '0 0 0.25rem'
          }}>
            {(translations?.setCard?.ageOfExpected || '{age} of an expected {expected} years')
              .replace('{age}', String(Math.round(set.ageYears * 10) / 10))
              .replace('{expected}', String(Math.round(set.expectedLifespanYears * 10) / 10))}
          </p>
          <div style={{
            width: '100%',
            height: '4px',
            background: '#e5e5e5',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(100, (set.ageYears / Math.max(set.expectedLifespanYears, 0.1)) * 100)}%`,
              height: '100%',
              background: set.ageYears >= set.expectedLifespanYears ? '#ef4444'
                : set.ageYears >= set.expectedLifespanYears * 0.75 ? '#f59e0b' : '#84cc16',
              transition: 'width 0.3s'
            }}></div>
          </div>
        </div>

        {/* A span, not a button. The whole card is already a <Link>, and a
            <button> inside an <a> is invalid HTML that the parser does not
            repair: it survived to the DOM as a second tab stop per card that
            swallowed the anchor's activation semantics for keyboard and
            screen-reader users. Same look, no nested interactive element. */}
        <span style={{
          display: 'block',
          width: '100%',
          padding: '0.75rem',
          marginTop: '0.75rem',
          fontSize: 'var(--text-sm)',
          fontWeight: '600',
          textAlign: 'center',
          background: '#3b82f6',
          color: '#ffffff',
          borderRadius: '999px',
          boxSizing: 'border-box'
        }}>
          {translations?.setCard?.viewDetails || 'View Details'}{' '}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

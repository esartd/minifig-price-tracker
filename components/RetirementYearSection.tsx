'use client';

import RetirementSetCard, { CONFIDENCE_COLORS } from './retirement-set-card';
import type { YearGroup } from '@/lib/retirement-years';
import type { RetirementPrediction } from '@/lib/retiring-soon-algorithm';

/**
 * One titled section of the /retiring-soon grid.
 *
 * Follows components/DealTierSection.tsx -- same block wrapper, same heading
 * shape, same auto-fill grid -- so the two grouped listings on the site look
 * like siblings.
 *
 * Takes `translations` as a prop rather than calling useTranslation(). The
 * whole retiring-soon family threads `t.retiringSoon` down from the server
 * page, and mixing two translation mechanisms inside one feature is worse than
 * following the local convention.
 */

interface Props {
  group: YearGroup<RetirementPrediction>;
  translations: any;
}

export default function RetirementYearSection({ group, translations }: Props) {
  const heading =
    group.kind === 'overdue'
      ? translations?.yearGroups?.overdue || 'Likely already retired'
      : group.kind === 'unknown'
        ? translations?.yearGroups?.unknown || 'Date not estimated'
        : (translations?.yearGroups?.heading || 'Expected to retire in {year}')
            .replace('{year}', String(group.year));

  const count =
    group.count === 1
      ? translations?.yearGroups?.setCountOne || '1 set'
      : (translations?.yearGroups?.setCount || '{count} sets').replace('{count}', String(group.count));

  // Only shown when every set in the section agrees. A mixed section falls
  // back to per-card badges, so the information is never lost -- it just stops
  // being repeated on every card when it is the same throughout.
  const chipColors = group.uniformConfidence ? CONFIDENCE_COLORS[group.uniformConfidence] : null;

  return (
    <section style={{ marginBottom: '3rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #e5e5e5'
      }}>
        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: '700',
          color: '#171717',
          margin: 0
        }}>
          {heading}
        </h2>
        <span style={{ fontSize: 'var(--text-sm)', color: '#737373' }}>{count}</span>

        {group.uniformConfidence && chipColors && (
          <span style={{
            marginLeft: 'auto',
            padding: '0.25rem 0.75rem',
            fontSize: 'var(--text-xs)',
            fontWeight: '600',
            background: chipColors.bg,
            color: chipColors.text,
            border: `1px solid ${chipColors.border}`,
            borderRadius: '6px'
          }}>
            {translations?.confidence?.[group.uniformConfidence] || group.uniformConfidence}
          </span>
        )}
      </div>

      {/* Plain block wrappers above this point on purpose: a grid nested inside
          a flex or grid parent gets min-width:auto, which lets the 280px track
          push past the container and overflow horizontally on narrow screens. */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {group.sets.map(set => (
          <RetirementSetCard
            key={set.boxNo}
            set={set}
            translations={translations}
            showConfidence={group.uniformConfidence === null}
          />
        ))}
      </div>
    </section>
  );
}

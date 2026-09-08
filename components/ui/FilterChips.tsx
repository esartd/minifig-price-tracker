'use client';

import React from 'react';
import { Colors, ControlHeight, Radius } from '@/lib/design-system';

/**
 * A wrapping row of single-select filter chips.
 *
 * The third and last member of the toggle family, and it exists for one
 * structural reason: SegmentedControl is a JOINED track -- one border, one
 * radius, children clipped -- and a joined track cannot wrap. The article
 * category list is built from whatever categories exist in the database, so
 * its length is unknown at design time and it must be allowed to run onto a
 * second line. Forcing that into a segmented control gives you a track that
 * either overflows the container or breaks its own border mid-pill.
 *
 * So the chips are separate elements. They are NOT a separate design: the
 * active state is the same solid accent fill a selected segment gets, at the
 * same height and the same pill radius, so a chip row and a segmented control
 * read as the same family. What was here before -- a 2px blue border over a
 * pale blue fill at 8px -- was a fourth distinct "selected" recipe.
 */

export interface ChipOption<V extends string> {
  value: V;
  label: string;
  count?: number;
}

interface Props<V extends string> {
  options: ChipOption<V>[];
  value: V;
  onChange?: (value: V) => void;
  ariaLabel?: string;
  className?: string;
}

export default function FilterChips<V extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: Props<V>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={['ib-chips', className].filter(Boolean).join(' ')}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange?.(option.value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: ControlHeight.standard,
              padding: '0 16px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              fontFamily: 'inherit',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              // Standalone controls, so each carries its own pill.
              borderRadius: Radius.pill,
              // Neutral, like the segmented control's thumb: blue is reserved
              // for things you can act on. A chip row is a filter, not a call
              // to action, and it should not outshout the page's one button.
              border: `1px solid ${active ? Colors.text : Colors.border}`,
              background: active ? Colors.text : Colors.surface,
              color: active ? '#ffffff' : Colors.textSubtle,
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = Colors.disabledBg;
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = Colors.surface;
            }}
          >
            {option.label}
            {typeof option.count === 'number' ? ` (${option.count})` : null}
          </button>
        );
      })}
    </div>
  );
}

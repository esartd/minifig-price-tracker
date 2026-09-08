'use client';

import Link from 'next/link';
import React from 'react';
import { Colors } from '@/lib/design-system';

/**
 * Tabs that switch between VIEWS of a page -- search results by type, the
 * sections of a collector profile, the header's own navigation.
 *
 * Kept separate from SegmentedControl on purpose. Tabs navigate; segmented
 * controls set a value. Every major design system draws the same line, and
 * merging them makes a filter look like navigation.
 *
 * No radius here at all: the active state is an underline, so there is no
 * filled shape to round. That is why the pill rule does not reach these.
 */

export interface TabOption<V extends string> {
  value: V;
  label: string;
  /** Rendered as "(n)" after the label. */
  count?: number;
  /** Hide entirely when the count is zero -- the search tabs do this. */
  hideWhenEmpty?: boolean;
  href?: string;
}

interface Props<V extends string> {
  options: TabOption<V>[];
  value: V;
  onChange?: (value: V) => void;
  /** The collector profile uses near-black rather than the accent blue. */
  activeColor?: string;
  ariaLabel?: string;
  className?: string;
}

export default function UnderlineTabs<V extends string>({
  options,
  value,
  onChange,
  activeColor = Colors.accent,
  ariaLabel,
  className,
}: Props<V>) {
  const visible = options.filter(
    (o) => !(o.hideWhenEmpty && (o.count === undefined || o.count === 0))
  );

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: 'flex',
        gap: '8px',
        borderBottom: `2px solid ${Colors.border}`,
        overflowX: 'auto',
      }}
    >
      {visible.map((option) => {
        const active = option.value === value;
        const style: React.CSSProperties = {
          padding: '12px 20px',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          background: 'transparent',
          border: 'none',
          borderBottom: `2px solid ${active ? activeColor : 'transparent'}`,
          marginBottom: '-2px',
          color: active ? activeColor : Colors.textSubtle,
          cursor: 'pointer',
          transition: 'color 0.2s, border-color 0.2s',
        };

        const body = (
          <>
            {option.label}
            {typeof option.count === 'number' ? ` (${option.count})` : null}
          </>
        );

        if (option.href) {
          return (
            <Link key={option.value} href={option.href} role="tab" aria-selected={active} style={style}>
              {body}
            </Link>
          );
        }

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(option.value)}
            style={style}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}

'use client';

import Link from 'next/link';
import React from 'react';
import { Colors, ControlHeight, Radius } from '@/lib/design-system';

/**
 * A row of options where exactly one is chosen, and choosing one sets a value
 * inside the current view -- a filter, a mode, a sort.
 *
 * NOT for switching between views. That is UnderlineTabs, and the split is
 * deliberate: Material Design, Apple's HIG, IBM Carbon, Polaris and GOV.UK all
 * separate segmented controls from tabs, because a filter that looks like
 * navigation reads as navigation. The site had eleven different toggle designs
 * before this; collapsing them into ONE component would have needed six
 * variants and three sizes, which is not a component, it is a switch statement
 * with a wrapper.
 *
 * SHAPE. The track owns the radius and clips its children, so the group reads
 * as one control -- the same rule the quantity steppers already followed. The
 * options themselves get no radius.
 */

export interface SegmentedOption<V extends string> {
  value: V;
  label: string;
  /** Shown instead of `label` under 768px, via the CSS class below. */
  shortLabel?: string;
  /** Appended as "(n)". Several toggles carry counts in their labels. */
  count?: number;
  /** Renders a Link rather than a button -- some toggles route. */
  href?: string;
}

interface Props<V extends string> {
  options: SegmentedOption<V>[];
  value: V;
  onChange?: (value: V) => void;
  /** Escape hatch: the retired urgency tabs coloured each option differently. */
  activeColor?: string;
  size?: 'standard' | 'small';
  ariaLabel?: string;
  className?: string;
}

export default function SegmentedControl<V extends string>({
  options,
  value,
  onChange,
  activeColor = Colors.accent,
  size = 'standard',
  ariaLabel,
  className,
}: Props<V>) {
  const height = size === 'small' ? '32px' : ControlHeight.standard;
  const padding = size === 'small' ? '0 14px' : '0 20px';
  const fontSize = size === 'small' ? 'var(--text-xs)' : 'var(--text-sm)';

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: 'inline-flex',
        height,
        // Never squeezed by a flex row. Measured at 375px, the widest condition
        // filter is Polish (Wszystkie/Nowe/Uzywane) at 230px against 327px of
        // available width -- close enough that a shrinkable track would start
        // clipping "Uzywane" before the heading beside it gave any ground.
        flexShrink: 0,
        border: `1px solid ${Colors.border}`,
        // The track carries the shape; options below are square and clipped.
        borderRadius: Radius.pill,
        overflow: 'hidden',
        background: Colors.surface,
      }}
    >
      {options.map((option) => {
        const active = option.value === value;
        const style: React.CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding,
          fontSize,
          fontWeight: 600,
          fontFamily: 'inherit',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          border: 'none',
          borderRadius: Radius.none,
          cursor: 'pointer',
          transition: 'background 0.2s, color 0.2s',
          background: active ? activeColor : 'transparent',
          color: active ? '#ffffff' : Colors.textMuted,
          // The track clips its children, so a focus ring drawn outside the
          // segment gets sliced off -- on the end segments it shows as a stray
          // arc following the pill. Pull it inside and it stays whole.
          outlineOffset: '-2px',
        };

        const body = (
          <>
            {option.shortLabel ? (
              <>
                <span className="segmented-label-full">{option.label}</span>
                <span className="segmented-label-short">{option.shortLabel}</span>
              </>
            ) : (
              option.label
            )}
            {typeof option.count === 'number' ? ` (${option.count})` : null}
          </>
        );

        if (option.href) {
          return (
            <Link key={option.value} href={option.href} style={style} aria-current={active ? 'true' : undefined}>
              {body}
            </Link>
          );
        }

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
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

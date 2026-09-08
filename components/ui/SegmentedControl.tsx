'use client';

import Link from 'next/link';
import React from 'react';
import { Colors, ControlHeight, Radius, THUMB_SHADOW } from '@/lib/design-system';

/**
 * A row of options where exactly one is chosen, and choosing one sets a value
 * inside the current view -- a filter, a mode, a sort.
 *
 * NOT for switching between views. That is UnderlineTabs, and the split is
 * deliberate: Material Design, Apple's HIG, IBM Carbon, Polaris and GOV.UK all
 * separate segmented controls from tabs, because a filter that looks like
 * navigation reads as navigation.
 *
 * SHAPE. A grey track with an inset white thumb, which is the platform
 * standard and the one design the site already had before this component
 * existed. The thumb is INSET -- it sits inside 3px of track padding rather
 * than being clipped flush by it -- so unlike a segment in a full-bleed track
 * it carries its own pill radius. That is not a violation of "the outer
 * control carries the shape"; that rule exists to stop a 999px radius biting
 * 23px arcs out of a 45px menu row, and a thumb sized to fit its own track has
 * no such problem.
 *
 * COLOUR. Selection is shown by elevation, not by hue. Blue is reserved for
 * things you can act on -- buttons, links -- so that a page full of filters
 * does not compete with the one control that actually does something. Four
 * separate "selected" recipes used to exist here; a filled blue segment was
 * simply the loudest of them.
 *
 * HEIGHT. 40px, and 44px under 768px. The 44 is not a preference: globals.css
 * puts a `min-height: 44px` touch floor on every button below that breakpoint,
 * so a 40px track there holds 44px children and clips 4px off them, which
 * pushes every label 2px below centre.
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
  /**
   * Escape hatch for a filter whose options mean different things -- the
   * retired urgency tabs coloured each one. Fills the thumb and flips the
   * label to white. Leave unset for the neutral default.
   */
  activeColor?: string;
  size?: 'standard' | 'small';
  ariaLabel?: string;
  className?: string;
}

export default function SegmentedControl<V extends string>({
  options,
  value,
  onChange,
  activeColor,
  size = 'standard',
  ariaLabel,
  className,
}: Props<V>) {
  const height = size === 'small' ? '32px' : ControlHeight.standard;
  const padding = size === 'small' ? '0 12px' : '0 18px';
  const fontSize = size === 'small' ? 'var(--text-xs)' : 'var(--text-sm)';

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      // ib-segmented carries the mobile height; see globals.css.
      className={['ib-segmented', className].filter(Boolean).join(' ')}
      style={{
        display: 'inline-flex',
        alignItems: 'stretch',
        height,
        // Never squeezed by a flex row. Measured at 375px, the widest condition
        // filter is Polish (Wszystkie/Nowe/Uzywane) at 230px against 327px of
        // available width -- close enough that a shrinkable track would start
        // clipping "Uzywane" before the heading beside it gave any ground.
        flexShrink: 0,
        padding: '3px',
        border: `1px solid ${Colors.border}`,
        borderRadius: Radius.pill,
        background: Colors.trackBg,
        boxSizing: 'border-box',
      }}
    >
      {options.map((option) => {
        const active = option.value === value;
        const style: React.CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
          padding,
          fontSize,
          fontWeight: 600,
          fontFamily: 'inherit',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          border: 'none',
          borderRadius: Radius.pill,
          cursor: 'pointer',
          transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
          background: active ? activeColor || Colors.surface : 'transparent',
          color: active ? (activeColor ? '#ffffff' : Colors.text) : Colors.textSubtle,
          boxShadow: active && !activeColor ? THUMB_SHADOW : 'none',
          outlineOffset: '1px',
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

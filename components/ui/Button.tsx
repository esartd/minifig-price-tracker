'use client';

import Link from 'next/link';
import React from 'react';
import { Colors, ControlHeight, Radius } from '@/lib/design-system';

/**
 * The button.
 *
 * Counted before this existed: 405 button-like elements carrying 255 distinct
 * style signatures -- roughly 1.6 buttons per unique style -- across seven
 * corner radii, two competing "primary" fills (#3b82f6 and #171717 used for
 * the same modal-confirm role in different files), two destructive reds, and
 * five disabled greys, two of which appeared on the same screen.
 *
 * Variants cover the icon arrangements (none, leading, trailing, both, or
 * icon-only) so they look and feel identical rather than being restyled by
 * hand at each call site.
 *
 * SHAPE. Standalone buttons are pills. An icon-only button is square, so a
 * pill radius makes it a circle -- that is the intent, not an accident. What
 * this component deliberately does NOT cover is a button that is one segment
 * of a joined control: a quantity stepper's -/+, a segmented toggle's options,
 * a row inside a dropdown panel. Those take their shape from the wrapper that
 * clips them and must stay square; see the note at the top of design-system.ts.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'standard' | 'small';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon before the label. */
  leadingIcon?: React.ReactNode;
  /** Icon after the label -- the "→" on card CTAs, a chevron, etc. */
  trailingIcon?: React.ReactNode;
  /** No label. Renders a circle; requires aria-label for a name. */
  iconOnly?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const SIZES: Record<ButtonSize, { height: string; padding: string; fontSize: string; gap: string; iconBox: string }> = {
  standard: { height: ControlHeight.standard, padding: '0 20px', fontSize: 'var(--text-sm)', gap: '8px', iconBox: '40px' },
  small: { height: '32px', padding: '0 14px', fontSize: 'var(--text-xs)', gap: '6px', iconBox: '32px' },
};

const VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: Colors.accent,
    color: '#ffffff',
    border: '1px solid transparent',
  },
  secondary: {
    background: Colors.surface,
    color: Colors.text,
    border: `1px solid ${Colors.border}`,
  },
  ghost: {
    background: 'transparent',
    color: Colors.accent,
    border: '1px solid transparent',
  },
  danger: {
    background: Colors.danger,
    color: '#ffffff',
    border: '1px solid transparent',
  },
};

const HOVER: Record<ButtonVariant, string> = {
  primary: Colors.accentHover,
  secondary: Colors.disabledBg,
  ghost: Colors.accentSoft,
  danger: Colors.dangerHover,
};

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'standard',
    leadingIcon,
    trailingIcon,
    iconOnly = false,
    fullWidth = false,
    children,
    style,
    ...rest
  } = props as BaseProps & Record<string, any>;

  const s = SIZES[size];
  const v = VARIANTS[variant];
  const disabled = 'disabled' in rest ? Boolean(rest.disabled) : false;

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: iconOnly ? 0 : s.gap,
    height: s.height,
    // Square when there is no label, so the pill radius yields a circle.
    width: iconOnly ? s.iconBox : fullWidth ? '100%' : undefined,
    padding: iconOnly ? 0 : s.padding,
    fontSize: s.fontSize,
    fontWeight: 600,
    fontFamily: 'inherit',
    lineHeight: 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    borderRadius: Radius.pill,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s, border-color 0.2s, color 0.2s',
    boxSizing: 'border-box',
    outline: 'none',
    ...v,
    // One disabled treatment, replacing the five greys that were in use.
    ...(disabled ? { background: Colors.disabledBg, color: Colors.disabled, borderColor: 'transparent' } : null),
    ...style,
  };

  const hoverHandlers = disabled
    ? {}
    : {
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.background = HOVER[variant];
        },
        onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
          e.currentTarget.style.background = (v.background as string) ?? 'transparent';
        },
      };

  const content = (
    <>
      {leadingIcon}
      {!iconOnly && children}
      {trailingIcon}
    </>
  );

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as Record<string, any>;
    return (
      <Link href={href} style={base} {...hoverHandlers} {...anchorRest}>
        {content}
      </Link>
    );
  }

  return (
    <button style={base} {...hoverHandlers} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}

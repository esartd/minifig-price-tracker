/**
 * The one place the shape and colour of a control is decided.
 *
 * This file existed before and had ZERO importers -- every button, toggle and
 * dropdown on the site was styled at its own call site instead. The result,
 * counted: 405 button-like elements carrying 255 distinct style signatures,
 * seven different corner radii, three panel shadows, five disabled greys and
 * two competing "primary" fills. Nothing enforced anything, so nothing stayed
 * consistent.
 *
 * Two rules make the rest of this file make sense.
 *
 * 1. THE OUTER CONTROL CARRIES THE SHAPE. A joined control -- a quantity
 *    stepper, a segmented toggle -- puts the radius and `overflow: hidden` on
 *    its wrapper, and its children get NO radius of their own; they are
 *    clipped by the parent. Same for menu rows inside a rounded panel. This is
 *    not an exception list, it is why a 238x45 menu row must not be a pill: a
 *    999px radius would bite 23px arcs out of each end.
 *
 * 2. CONTROLS THAT SHARE A ROW SHARE A HEIGHT AND A RADIUS. The /marketplace
 *    filter row is the case that proved it -- toggle, search and select, all
 *    41.5px tall with the same border, but 8px / 999px / 8px corners. One pill
 *    between two rectangles.
 */

/** Corner radii. `pill` is the default for any standalone control. */
export const Radius = {
  /** Standalone controls: buttons, inputs, dropdown triggers, toggles. */
  pill: '999px',
  /** Floating surfaces: dropdown panels, dialogs, cards. */
  panel: '12px',
  /** Children of a joined control -- they are clipped, so they need none. */
  none: '0',
} as const;

/**
 * Two control heights, matching the search boxes already shipped: 40px on
 * desktop, 44px anywhere a thumb has to reach it (the design system's touch
 * minimum, and the global floor set in globals.css for max-width 767px).
 */
export const ControlHeight = {
  standard: '40px',
  touch: '44px',
} as const;

export const Colors = {
  /** The one accent. Fills, focus rings, active states. */
  accent: '#3b82f6',
  accentHover: '#2563eb',
  /** Tinted accent background for selected rows and quiet active states. */
  accentSoft: '#eff6ff',
  /** The one control border. */
  border: '#e5e5e5',
  borderHover: '#d4d4d4',
  /** Destructive. One red, not the two that were in use. */
  danger: '#ef4444',
  dangerHover: '#dc2626',
  /** The one disabled grey, replacing five. */
  disabled: '#a3a3a3',
  disabledBg: '#f5f5f5',
  surface: '#ffffff',
  text: '#171717',
  textMuted: '#525252',
  textSubtle: '#737373',
} as const;

/**
 * One shadow for every floating panel. Three were in use: this one (7 places),
 * `0 4px 12px` (3) and `0 4px 24px` (1, on the avatar menu, which also had no
 * zIndex at all).
 */
export const PANEL_SHADOW = '0 10px 40px rgba(0, 0, 0, 0.1)';
export const PANEL_Z_INDEX = 1000;

/** A floating dropdown / menu surface. */
export const panelStyle: React.CSSProperties = {
  position: 'absolute',
  background: Colors.surface,
  border: `1px solid ${Colors.border}`,
  borderRadius: Radius.panel,
  boxShadow: PANEL_SHADOW,
  zIndex: PANEL_Z_INDEX,
  overflow: 'hidden',
};

/**
 * A row inside a panel. Square on purpose -- rule 1: the panel owns the shape.
 */
export const panelRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '12px 16px',
  background: 'transparent',
  border: 'none',
  borderRadius: Radius.none,
  textAlign: 'left',
  fontSize: 'var(--text-sm)',
  color: Colors.text,
  cursor: 'pointer',
};

/**
 * A dropdown trigger -- native <select> or a custom button that opens a panel.
 *
 * `paddingRight` is deliberately generous: it reserves room for the chevron.
 * The one select on the site that kept the native arrow with only 14px of
 * right padding is the reason the /marketplace sort control looked clipped.
 */
export const triggerStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  height: ControlHeight.standard,
  padding: '0 40px 0 16px',
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: Colors.text,
  background: Colors.surface,
  border: `1px solid ${Colors.border}`,
  borderRadius: Radius.pill,
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  boxSizing: 'border-box',
};

export const focusRing = {
  borderColor: Colors.accent,
  boxShadow: `0 0 0 3px rgba(59, 130, 246, 0.15)`,
} as const;

/** Focus/blur handlers for any bordered control. */
export const controlFocusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = Colors.accent;
  },
  onBlur: (e: React.FocusEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = Colors.border;
  },
};

/** Kept for the input helpers that already reference it. */
export const inputFocusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = Colors.accent;
    e.currentTarget.style.boxShadow = focusRing.boxShadow;
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = Colors.border;
    e.currentTarget.style.boxShadow = 'none';
  },
};

export const DesignSystem = {
  radius: Radius,
  height: ControlHeight,
  colors: Colors,
  panel: panelStyle,
  panelRow: panelRowStyle,
  trigger: triggerStyle,
  focus: { ring: focusRing },
  merge: (...styles: any[]) => Object.assign({}, ...styles),
};

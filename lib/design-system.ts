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

/**
 * PAGE RHYTHM -- section padding, tone and heading treatment.
 *
 * Measured on the homepage before this existed, at 1280px, top to bottom:
 *
 *   section            heading            padding    background
 *   hero               56px / 600 / ctr   0 / 0      --
 *   why this exists    --                 112 / 112  #171717
 *   what you can do    28px / 600 / left  8 / 56     #ffffff
 *   more ways          28px / 600 / left  8 / 56     #ffffff
 *   trending           40px / 700 / left  60 / 80    #ffffff
 *   leaderboards       40px / 700 / ctr   60 / 80    #ffffff
 *   recommended        40px / 600 / ctr   60 / 80    #fafafa
 *
 * Four different heading treatments for sections that are all peers, and the
 * hierarchy ran BACKWARDS: the two groups a first-time visitor is meant to
 * act on had the smallest headings, while trending, leaderboards and
 * recommended -- which rank or suggest against a collection that visitor has
 * not built yet -- shouted at 40px/700.
 *
 * The padding had no scale either. Two sections opened on 8px, so they were
 * glued to whatever sat above them, while others got 60px.
 *
 * And nearly half the page was one tone: ~2,400px of unbroken #ffffff between
 * the dark band and `recommended`, across four consecutive sections. That is
 * what made the page read as a stack of separate widgets.
 *
 * So: one heading rule, one padding rule, and alternating tone. Import these
 * rather than hand-writing a section header, or the four treatments come back.
 */
export const Section = {
  /** Default vertical rhythm for a homepage-level section. */
  padding: '80px 20px',
  /**
   * The statement band only. It carries the page's single tone change and is
   * the one section allowed more air than its neighbours.
   */
  paddingFeature: 'clamp(72px, 8vw, 96px) 20px',
  /** Content width shared by every section below the hero. */
  maxWidth: '1200px',
  /** Alternating ground. No more than two adjacent sections share a tone. */
  bg: {
    base: '#ffffff',
    alt: '#fafafa',
    /**
     * The statement band. A soft cool tint, NOT a dark slab.
     *
     * This was #171717 first. It separated the section, but on a page whose
     * hero is a blue gradient over near-white and whose other six sections
     * are #ffffff / #fafafa, a black band is the only heavy thing on the page
     * -- it reads as pasted in rather than as part of the system. This tint is
     * cool enough to be clearly distinct from the neutral #fafafa next to it
     * while staying in the same light family as everything else, and it keeps
     * the text dark, so the #3b82f6 accent works here like it does elsewhere.
     */
    statement: '#f2f6fc',
  },
} as const;

/**
 * One treatment for every peer section heading: 30px, weight 600, left.
 *
 * Left-aligned because the content under these headings is left-aligned card
 * grids; centring the heading over a left-aligned grid was half the reason
 * the page looked assembled rather than designed.
 */
export const sectionHeadingStyle: React.CSSProperties = {
  margin: '0 0 24px',
  fontSize: '30px',
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: '#171717',
  textAlign: 'left',
};

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
  /** The recessed track a segmented control's thumb slides on. */
  trackBg: '#f5f5f5',
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

/**
 * The lift on a segmented control's selected thumb. Selection is shown by
 * elevation rather than by hue, so blue stays reserved for things you can act
 * on and a screen full of filters does not shout over its one real button.
 */
export const THUMB_SHADOW = '0 1px 3px rgba(0, 0, 0, 0.12)';
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

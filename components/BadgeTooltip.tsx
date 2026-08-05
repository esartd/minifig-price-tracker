'use client';

import { useState, useRef, CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface BadgeTooltipProps {
  text: string;
  children: ReactNode;
  style: CSSProperties;
}

/**
 * Wraps a small badge (the owned-quantity / set-contents "×N" pills) and
 * shows a tooltip on hover, instantly (no native-title-style ~1s delay).
 *
 * The badge itself renders in place, absolutely positioned within its card
 * exactly like before. The tooltip text is portaled to document.body and
 * positioned with `fixed` coordinates computed from the badge's own
 * bounding rect - it is NOT a descendant of the card, so the card's
 * `overflow: hidden` (used everywhere for rounded corners) can never clip
 * it, no matter how long the text or how close the badge sits to a card
 * edge.
 */
export default function BadgeTooltip({ text, children, style }: BadgeTooltipProps) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 6, left: rect.left + rect.width / 2 });
    }
    setShow(true);
  };

  return (
    <div ref={ref} style={style} onMouseEnter={handleEnter} onMouseLeave={() => setShow(false)}>
      {children}
      {show && typeof document !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          transform: 'translateX(-50%)',
          background: '#171717',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 500,
          lineHeight: 1.3,
          padding: '4px 8px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          zIndex: 9999,
          pointerEvents: 'none',
        }}>
          {text}
        </div>,
        document.body
      )}
    </div>
  );
}

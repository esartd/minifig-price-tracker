'use client';

import { useRef, useState, useCallback } from 'react';

/**
 * Shows the country name when the pointer is over a shape on the visitor map.
 *
 * The map itself stays a SERVER component and is passed in as `children`. That
 * is the whole point of this split: lib/world-map-paths.ts is 344KB of SVG
 * path data, and a client component that imported it would ship every byte as
 * JavaScript. Handed down as already-rendered markup it costs nothing, and the
 * only thing that ships is the few lines below.
 *
 * One listener on the wrapper rather than one per shape. There are 223 paths;
 * 223 React event props is 223 more things for hydration to attach, for
 * behaviour that is identical to reading the name off whatever the pointer
 * happens to be over.
 *
 * Not an SVG <title>, which would have been free: browsers render those as a
 * native OS tooltip after a ~1s delay, in a style nothing else on the page
 * uses. On a map, where the whole interaction is sweeping across shapes, that
 * delay makes it feel broken. The paths still carry aria-label for screen
 * readers, which is what <title> would really have been doing.
 */
export default function MapHoverLabel({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Element;
    const name = target?.getAttribute?.('data-name');
    if (!name) {
      setLabel(null);
      return;
    }
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    setPos({ x: e.clientX - box.left, y: e.clientY - box.top });
    setLabel(name);
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative' }}
      onMouseMove={onMove}
      onMouseLeave={() => setLabel(null)}
    >
      {children}

      {label && (
        <div
          // Pointer-events off, or the tooltip sits under the cursor, becomes
          // the event target, reports no data-name, and the label flickers off
          // and on as it chases itself around.
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, calc(-100% - 10px))',
            pointerEvents: 'none',
            padding: '5px 10px',
            background: '#171717',
            color: '#ffffff',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            zIndex: 2,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

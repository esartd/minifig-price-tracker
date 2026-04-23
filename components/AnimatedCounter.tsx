'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatFn?: (value: number) => string;
}

export default function AnimatedCounter({ value, duration = 800, formatFn }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const prevValue = prevValueRef.current;

    // If value hasn't changed, don't animate
    if (prevValue === value) {
      return;
    }

    const startTime = Date.now();
    const diff = value - prevValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const current = prevValue + (diff * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
        prevValueRef.current = value;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  const formattedValue = formatFn ? formatFn(displayValue) : displayValue.toFixed(2);

  return <>{formattedValue}</>;
}

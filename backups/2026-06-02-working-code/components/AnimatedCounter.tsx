'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatFn?: (value: number) => string;
  isUpdating?: boolean; // New prop to disable animation during updates
}

export default function AnimatedCounter({ value, duration = 800, formatFn, isUpdating = false }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // If currently updating, just show the value without animation
    if (isUpdating) {
      setDisplayValue(value);
      return;
    }

    // Get the current display value (not the previous prop value)
    const startValue = displayValue;

    // If value hasn't changed, don't animate
    if (startValue === value) {
      return;
    }

    const startTime = Date.now();
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const current = startValue + (diff * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration, isUpdating]);

  const formattedValue = formatFn ? formatFn(displayValue) : displayValue.toFixed(2);

  return <>{formattedValue}</>;
}

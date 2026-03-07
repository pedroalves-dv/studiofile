'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start loading
    setIsLoading(true);
    setProgress(10);

    // Increment progress at decreasing intervals
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 30;
        const next = prev + increment;
        return next > 90 ? 90 : next;
      });
    }, 300);

    // Reset on route change complete
    timeoutRef.current = setTimeout(() => {
      setProgress(100);
      const hideTimeout = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(hideTimeout);
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, searchParams]);

  if (!isLoading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-accent z-50 transition-all ease-out"
      style={{
        width: `${progress}%`,
        opacity: progress === 100 ? 0 : 1,
        transition:
          progress === 100
            ? 'opacity 0.3s ease-out'
            : 'width 0.3s ease-out, opacity 0.3s ease-out',
      }}
    />
  );
}

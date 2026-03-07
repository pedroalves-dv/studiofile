'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect scroll position
 * Returns Y scroll position and whether scrolled past threshold
 */
export function useScroll(threshold = 60) {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      setIsScrolled(currentScroll > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return { scrollY, isScrolled };
}

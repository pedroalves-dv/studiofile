'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap';

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export function RevealOnScroll({
  children,
  delay = 0,
  y = 40,
  className,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(ref.current, {
      y,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        once: true,
      },
    });
  }, { scope: ref, dependencies: [delay, y] });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Re-export ScrollTrigger to prevent tree-shaking issues
export { ScrollTrigger };

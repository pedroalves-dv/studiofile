'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

export function HeroContent() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const el = headingRef.current;
    if (!el) return;

    const words = el.innerText.split(' ');
    el.innerHTML = words
      .map(
        (w) =>
          `<span style="display:inline-block; overflow:hidden"><span class="word-inner" style="display:inline-block">${w}</span></span>`
      )
      .join(' ');

    gsap.from(el.querySelectorAll('.word-inner'), {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.08,
    });

    gsap.from([subtextRef.current, ctaRef.current], {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.7,
    });
  }, { scope: headingRef });

  return (
    <div className="max-w-2xl">
      <h1
        ref={headingRef}
        className="font-display text-6xl md:text-7xl leading-tight text-ink mb-6"
      >
        Objects made to last.
      </h1>
      <p ref={subtextRef} className="text-lg text-muted mb-8 max-w-md">
        Modular, functional home decor and furniture crafted through precision 3D printing.
        Designed in Paris, made to order.
      </p>
      <div ref={ctaRef} className="flex gap-4 flex-wrap">
        <Link href="/shop">
          <Button variant="primary">Shop All</Button>
        </Link>
        <Link href="/collections">
          <Button variant="ghost">View Collections</Button>
        </Link>
      </div>
    </div>
  );
}

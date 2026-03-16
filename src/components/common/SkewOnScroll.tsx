// components/common/SkewOnScroll.tsx
"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

// You'll need to expose your Lenis instance — see note below
export function SkewOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentSkew = 0;
    let rafId: number;

    function update() {
      // Read velocity from Lenis (see SmoothScroll note below)
      const velocity = (window as any).__lenis?.velocity ?? 0;
      const target = Math.max(-8, Math.min(8, velocity * 0.08));
      // Lerp toward target for smooth falloff
      currentSkew += (target - currentSkew) * 0.1;

      if (ref.current) {
        ref.current.style.transform = `skewY(${currentSkew}deg)`;
      }
      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <div ref={ref}>{children}</div>;
}

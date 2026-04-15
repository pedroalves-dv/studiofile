"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  // Scroll to top on every client-side navigation.
  // The layout doesn't remount between routes, so this effect re-runs on
  // pathname change — the only reliable hook point for Lenis-owned scroll.
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const instance = new Lenis({
      duration: reduced ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
    });

    // Prevent Lenis from recalculating scroll limits on height-only resize events
    // (iOS address bar appearing/disappearing changes window.innerHeight but not
    // window.innerWidth). Without this guard, Lenis shifts its scroll progress
    // every time the address bar toggles, causing visible content jumps.
    const originalResize = instance.resize.bind(instance);
    let prevResizeWidth = window.innerWidth;
    instance.resize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth === prevResizeWidth) return;
      prevResizeWidth = currentWidth;
      originalResize();
    };

    setLenis(instance);

    // ✅ FIX: track running state so the recursive RAF stops on unmount
    let rafId: number;
    let running = true;

    function raf(time: number) {
      if (!running) return;
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      running = false; // ✅ stops the recursive loop
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

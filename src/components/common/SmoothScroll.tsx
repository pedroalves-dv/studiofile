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
    // (iOS address bar showing/hiding changes window.innerHeight but not width).
    //
    // Lenis stores `debouncedResize = debounce(this.resize, 250)` at Dimensions
    // construction time and registers *that* as the window listener. Patching
    // `instance.resize` after the fact does nothing — the listener already holds
    // a reference to debouncedResize. We must remove and replace it directly.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debouncedResize = (instance.dimensions as any).debouncedResize as (
      ...args: unknown[]
    ) => void;
    window.removeEventListener("resize", debouncedResize as EventListener);
    let prevResizeWidth = window.innerWidth;
    const guardedResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth === prevResizeWidth) return;
      prevResizeWidth = currentWidth;
      debouncedResize();
    };
    window.addEventListener("resize", guardedResize);

    setLenis(instance);

    let rafId: number;
    let running = true;

    function raf(time: number) {
      if (!running) return;
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("resize", guardedResize);
      running = false;
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useLenis } from "@/components/common/SmoothScroll";

export function ScrollSnapProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const isSnapping = useRef(false);
  const isProgrammaticScroll = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeSection = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!lenis) return;

    // Helper to reset the snapping state safely from anywhere
    const releaseLock = () => {
      isSnapping.current = false;
      isProgrammaticScroll.current = false;
      document.body.removeAttribute("data-snapping");
    };

    /**
     * INTERRUPT HANDLING:
     * If Lenis is stopped (by CartDrawer, etc.), we MUST release the lock.
     */
    // @ts-ignore
    lenis.on("stop", releaseLock);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            activeSection.current = entry.target as HTMLElement;
          }
        });
      },
      { threshold: [0.5] },
    );

    document
      .querySelectorAll("[data-snap]")
      .forEach((el) => observer.observe(el));

    const performSnap = () => {
      if (!activeSection.current || isSnapping.current) return;

      const header = document.querySelector("header");
      const headerHeight = header?.offsetHeight || 0;
      const rect = activeSection.current.getBoundingClientRect();
      const distanceToHeader = Math.abs(rect.top - headerHeight);
      const snapThresholdPx = 150;

      if (distanceToHeader > snapThresholdPx) return;

      if (distanceToHeader > 5) {
        isSnapping.current = true;
        isProgrammaticScroll.current = true;
        document.body.setAttribute("data-snapping", "true");

        lenis.scrollTo(activeSection.current, {
          offset: -headerHeight,
          duration: 0.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            // Short delay to allow the physics to settle before unlocking
            setTimeout(releaseLock, 100);
          },
        });

        /**
         * EMERGENCY FAILSAFE
         * If for any reason onComplete doesn't fire (browser lag, etc.),
         * force release the lock after 1.2s so the UI never stays "frozen".
         */
        setTimeout(() => {
          if (isSnapping.current) releaseLock();
        }, 1200);
      }
    };

    const handleScroll = () => {
      // 1. If the user scrolls manually while a snap is in progress, release lock immediately
      if (
        lenis.velocity !== 0 &&
        isSnapping.current &&
        !isProgrammaticScroll.current
      ) {
        releaseLock();
      }

      if (isSnapping.current) return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Wait for 550ms of stillness before attempting a snap
      timeoutRef.current = setTimeout(() => {
        if (Math.abs(lenis.velocity) < 0.05) {
          performSnap();
        }
      }, 550);
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
      // @ts-ignore
      lenis.off("stop", releaseLock); // Critical cleanup
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      releaseLock(); // Clean up body attribute on unmount
    };
  }, [lenis]);

  return <>{children}</>;
}

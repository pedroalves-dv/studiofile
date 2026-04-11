"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useLenis } from "@/components/common/SmoothScroll";

export function ScrollSnapProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const isSnapping = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeSection = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!lenis) return;

    /**
     * SENSOR: Intersection Observer
     * threshold: 0.5 ensures that as soon as a section takes up more than half
     * the screen, it is marked as the "active" target.
     */
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

    /**
     * MAGNET LOGIC: performSnap
     * This is where we decide if the user is "close enough" to merit a snap.
     */
    const performSnap = () => {
      if (!activeSection.current || isSnapping.current) return;

      const header = document.querySelector("header");
      const headerHeight = header?.offsetHeight || 0;
      const rect = activeSection.current.getBoundingClientRect();

      // Distance between the target alignment and current position
      const distanceToHeader = Math.abs(rect.top - headerHeight);

      // snapThresholdPx: Only trigger if the user is within 150px of the top.
      // This prevents the "fighting" feeling if they stop in the middle.
      const snapThresholdPx = 150;

      if (distanceToHeader > snapThresholdPx) {
        return;
      }

      if (distanceToHeader > 5) {
        isSnapping.current = true;
        document.body.setAttribute("data-snapping", "true"); // LOCK ON

        lenis.scrollTo(activeSection.current, {
          offset: -headerHeight,
          duration: 0.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            setTimeout(() => {
              isSnapping.current = false;
              document.body.removeAttribute("data-snapping"); // LOCK OFF
            }, 50);
          },
        });
      }
    };

    const handleScroll = () => {
      if (isSnapping.current) return;

      // Clear previous timeout while user is actively moving
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Reset snapping lock if user manually interrupts a snap
      if (lenis.velocity !== 0 && isSnapping.current) {
        isSnapping.current = false;
      }

      // Wait for 550ms of stillness before attempting a snap
      timeoutRef.current = setTimeout(() => {
        if (lenis.velocity === 0) {
          performSnap();
        }
      }, 550);
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [lenis]);

  return <>{children}</>;
}

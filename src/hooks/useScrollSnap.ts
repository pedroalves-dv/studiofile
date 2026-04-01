// src/hooks/useScrollSnap.ts
"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/common/SmoothScroll";

export function useScrollSnap({
  threshold = 50, // px — how close to a snap point before it pulls you in
  debounce = 160, // ms — how long after scroll stops before snapping
  duration = 0.9, // Lenis scroll duration for the snap animation
} = {}) {
  const lenis = useLenis();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!lenis) return;

    const handleScroll = ({ scroll }: { scroll: number }) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        // if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        // Read the CSS variable once per snap attempt
        const rootFontSize = parseFloat(
          getComputedStyle(document.documentElement).fontSize,
        );
        const headerHeight =
          parseFloat(
            getComputedStyle(document.documentElement)
              .getPropertyValue("--header-height")
              .trim(),
          ) * rootFontSize;
        const snapEls = document.querySelectorAll<HTMLElement>("[data-snap]");
        let best: { top: number; distance: number } | null = null;

        snapEls.forEach((el) => {
          // getBoundingClientRect().top is relative to viewport,
          // adding scroll gives us the document-absolute top
          const top = el.getBoundingClientRect().top + scroll;
          const distance = Math.abs(scroll - top);

          if (distance < threshold && (!best || distance < best.distance)) {
            best = { top, distance };
          }
        });

        if (best) {
          lenis.scrollTo(best.top - headerHeight, { duration });
        }
      }, debounce);
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lenis, threshold, debounce, duration]);
}

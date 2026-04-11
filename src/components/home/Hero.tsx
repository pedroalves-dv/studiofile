"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";
import { HeroContent } from "@/components/home/HeroContent";

/**
 * Number of 100dvh rows that make up the desktop parallax section.
 * Drives both the section height (set imperatively) and the parallax
 * transform range. When you add or remove rows, update this constant
 * AND the column row structure below together.
 */
const SCROLL_ROWS = 3;

/**
 * Must stay in sync with Tailwind's `md` breakpoint (768px) and with
 * the same constant in HeroContent. Consider moving both to a shared
 * constants file (e.g. lib/constants.ts) if this grows.
 */
const MOBILE_BREAKPOINT = 768;

// ─── Sub-components ──────────────────────────────────────────────────────────

// Defined outside Hero so React doesn't treat it as a new component type
// on every render, which would cause unnecessary DOM unmount/remount.
function RowSpacer() {
  return (
    <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full" />
  );
}

interface ParallaxProps {
  scrollYProgress: MotionValue<number>;
  /** Real scrollable distance of the section in px, updated on resize. */
  scrollDistance: number;
  className: string;
  speed?: number;
}

function ParallaxBox({
  scrollYProgress,
  scrollDistance,
  className,
  speed = 0.3,
}: ParallaxProps) {
  // scrollDistance replaces the old hardcoded 800px magic number.
  // It is the section's actual scrollable distance (offsetHeight − viewport),
  // so the parallax range is always proportional to the real scroll travel.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0px", `-${speed * scrollDistance}px`],
  );
  return <motion.div style={{ y }} className={className} />;
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      if (!el) return;

      const isDesktop = window.innerWidth >= MOBILE_BREAKPOINT;

      // Drive section height from SCROLL_ROWS imperatively on desktop.
      // This avoids a hardcoded Tailwind arbitrary value (md:h-[400dvh])
      // that can't reference the constant. On mobile, clear it so the
      // stacked mobile image column dictates the natural height.
      el.style.height = isDesktop ? `${SCROLL_ROWS * 100}dvh` : "";

      // Measure after height is applied so offsetHeight is accurate.
      setScrollDistance(isDesktop ? window.innerHeight : 0);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Spread into every ParallaxBox to avoid repetition.
  const parallaxProps = { scrollYProgress, scrollDistance };

  return (
    <section ref={containerRef} className="relative w-full">
      {/* ── BACKGROUND LAYER ── */}
      <div className="hidden md:flex absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Column 1 */}
        <div className="flex-1 flex flex-col">
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.3}
              className="absolute h-[450px] w-[350px] bg-red-500 top-52 left-5"
            />
          </div>
          <RowSpacer />
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.5}
              className="absolute h-[650px] w-[450px] bg-red-500 top-16 left-6"
            />
          </div>
          <RowSpacer />
        </div>

        {/* Column 2 */}
        <div className="flex-1 flex flex-col">
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.5}
              className="absolute h-[300px] w-[200px] bg-red-500 bottom-20 left-12"
            />
          </div>
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.4}
              className="absolute h-[420px] w-[320px] bg-red-500 bottom-8 left-10"
            />
          </div>
          <RowSpacer />
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.6}
              className="absolute h-[360px] w-[280px] bg-red-500 bottom-10 right-8"
            />
          </div>
        </div>

        {/* Column 3 (XL only) */}
        <div className="hidden xl:flex flex-1 flex-col">
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.2}
              className="absolute h-[350px] w-[500px] bg-red-500 -bottom-8 right-5"
            />
          </div>
          <RowSpacer />
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.4}
              className="absolute h-[360px] w-[280px] bg-red-500 bottom-10 right-8"
            />
          </div>
          <RowSpacer />
        </div>
      </div>

      {/* ── STICKY CONTENT (The "TOTEM" type) ── */}
      <div className="sticky top-[var(--header-height)] h-[calc(100dvh-var(--header-height))] w-full z-10 overflow-hidden">
        <div className="relative w-full h-full">
          <HeroContent />
        </div>
      </div>

      {/* ── FRONT LAYER ── */}
      <div className="hidden md:flex absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Column 1 */}
        <div className="flex-1 flex flex-col">
          <RowSpacer />
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.2}
              className="absolute h-[300px] w-[200px] bg-red-500 bottom-24 right-4"
            />
          </div>
          <RowSpacer />
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.45}
              className="absolute h-[460px] w-[320px] bg-red-500 top-10 right-8"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex-1 flex flex-col">
          <RowSpacer />
          <RowSpacer />
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.25}
              className="absolute h-[380px] w-[300px] bg-red-500 bottom-20 -left-20"
            />
          </div>
          <RowSpacer />
        </div>

        {/* Column 3 (XL only) */}
        <div className="hidden xl:flex flex-1 flex-col">
          <RowSpacer />
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.55}
              className="absolute h-[380px] w-[280px] bg-red-500 top-24 -left-6"
            />
          </div>
          <RowSpacer />
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.8}
              className="absolute h-[320px] w-[250px] bg-red-500 top-10 left-0"
            />
          </div>
        </div>
      </div>

      {/* ── MOBILE IMAGE COLUMN ── */}
      <div aria-hidden="true" className="md:hidden pointer-events-none">
        <div className="relative w-full h-[100dvh] bg-red-500" />
        <div className="relative w-full h-[100dvh] bg-blue-500" />
        <div className="relative w-full h-[100dvh] bg-red-200" />
      </div>
    </section>
  );
}

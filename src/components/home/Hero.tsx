// src/components/home/Hero.tsx

"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";
import Image from "next/image";
import { HeroContent } from "@/components/home/HeroContent";

/**
 * Number of 100svh rows that make up the desktop parallax section.
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

/** Swap these out for real Shopify CDN URLs when product photos are ready. */
const PLACEHOLDER = "https://placehold.co/600x800/fcaeae/78c0ff";

// ─── Sub-components ──────────────────────────────────────────────────────────

// Defined outside Hero so React doesn't treat it as a new component type
// on every render, which would cause unnecessary DOM unmount/remount.
function RowSpacer() {
  return <div className="relative section-min-h w-full" />;
}

interface ParallaxProps {
  scrollYProgress: MotionValue<number>;
  /** Real scrollable distance of the section in px, updated on resize. */
  scrollDistance: number;
  className: string;
  speed?: number;
  src: string;
  priority?: boolean;
}

function ParallaxBox({
  scrollYProgress,
  scrollDistance,
  className,
  speed = 0.3,
  src,
  priority = false,
}: ParallaxProps) {
  // scrollDistance replaces the old hardcoded 800px magic number.
  // It is the section's actual scrollable distance (offsetHeight − viewport),
  // so the parallax range is always proportional to the real scroll travel.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0px", `-${speed * scrollDistance}px`],
  );
  // The motion.div is `absolute` (for parallax placement) so it can't also be
  // `relative` for <Image fill> anchoring — those are mutually exclusive CSS
  // positions. The inner div inherits the outer box's fixed h-/w- dimensions
  // via `h-full w-full` and gives fill a proper positioned ancestor.
  return (
    <motion.div style={{ y }} className={`overflow-hidden ${className}`}>
      <div className="relative w-full h-full">
        <Image
          src={src}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          alt=""
          priority={priority}
          unoptimized
        />
      </div>
    </motion.div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);

  useEffect(() => {
    let rafId: number;
    let prevWidth = window.innerWidth;

    const update = () => {
      const el = containerRef.current;
      if (!el) return;

      const isDesktop = window.innerWidth >= MOBILE_BREAKPOINT;

      // Desktop: set an explicit height so useScroll has a known range.
      // Uses dvh so the parallax columns scale naturally on desktop resize.
      // Mobile: no explicit height — children (mobile images) determine it.
      el.style.height = isDesktop ? `${SCROLL_ROWS * 100}svh` : "";

      setScrollDistance(isDesktop ? window.innerHeight : 0);
    };

    // Only fire on WIDTH changes (real resize / device rotation).
    // iOS bar appear/hide changes only innerHeight — deliberately ignored
    // to prevent layout recalculation and Lenis jump.
    const onResize = () => {
      const newWidth = window.innerWidth;
      if (newWidth === prevWidth) return;
      prevWidth = newWidth;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
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
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.3}
              className="absolute h-[450px] w-[350px] top-52 left-5"
              src={PLACEHOLDER}
              priority
            />
          </div>
          <RowSpacer />
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.5}
              className="absolute h-[650px] w-[450px] top-16 left-6"
              src={PLACEHOLDER}
            />
          </div>
          <RowSpacer />
        </div>

        {/* Column 2 */}
        <div className="flex-1 flex flex-col">
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.5}
              className="absolute h-[300px] w-[200px] bottom-20 left-12"
              src={PLACEHOLDER}
              priority
            />
          </div>
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.4}
              className="absolute h-[420px] w-[320px] bottom-8 left-10"
              src={PLACEHOLDER}
            />
          </div>
          <RowSpacer />
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.6}
              className="absolute h-[360px] w-[280px] bottom-10 right-8"
              src={PLACEHOLDER}
            />
          </div>
        </div>

        {/* Column 3 (xl only) */}
        <div className="hidden xl:flex flex-1 flex-col">
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.2}
              className="absolute h-[350px] w-[500px] -bottom-8 right-5"
              src={PLACEHOLDER}
              priority
            />
          </div>
          <RowSpacer />
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.4}
              className="absolute h-[360px] w-[280px] bottom-10 right-8"
              src={PLACEHOLDER}
            />
          </div>
          <RowSpacer />
        </div>
      </div>

      {/* ── STICKY CONTENT (The "TOTEM" type) ── */}
      <div className="sticky top-[var(--header-height)] sticky-hero-h w-full z-10 overflow-hidden">
        <div className="relative w-full h-full">
          <HeroContent />
        </div>
      </div>

      {/* ── FRONT LAYER ── */}
      <div className="hidden md:flex absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Column 1 */}
        <div className="flex-1 flex flex-col">
          <RowSpacer />
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.2}
              className="absolute h-[300px] w-[200px] bottom-24 right-4"
              src={PLACEHOLDER}
            />
          </div>
          <RowSpacer />
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.45}
              className="absolute h-[460px] w-[320px] top-10 right-8"
              src={PLACEHOLDER}
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex-1 flex flex-col">
          <RowSpacer />
          <RowSpacer />
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.25}
              className="absolute h-[380px] w-[300px] bottom-20 -left-20"
              src={PLACEHOLDER}
            />
          </div>
          <RowSpacer />
        </div>

        {/* Column 3 (XL only) */}
        <div className="hidden xl:flex flex-1 flex-col">
          <RowSpacer />
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.55}
              className="absolute h-[380px] w-[280px] top-24 -left-6"
              src={PLACEHOLDER}
            />
          </div>
          <RowSpacer />
          <div className="relative section-min-h w-full">
            <ParallaxBox
              {...parallaxProps}
              speed={0.8}
              className="absolute h-[320px] w-[250px] top-10 left-0"
              src={PLACEHOLDER}
            />
          </div>
        </div>
      </div>

      {/* ── MOBILE IMAGE COLUMN ── */}
      <div aria-hidden="true" className="md:hidden pointer-events-none">
        <div className="relative w-full h-screen-safe overflow-hidden">
          <Image
            src={PLACEHOLDER}
            fill
            sizes="(max-width: 768px) 100dvw, 50dvw"
            className="object-cover"
            alt=""
            priority
            unoptimized
          />
        </div>
        <div className="relative w-full h-screen-safe overflow-hidden">
          <Image
            src={PLACEHOLDER}
            fill
            sizes="(max-width: 768px) 100dvw, 50dvw"
            className="object-cover"
            alt=""
            unoptimized
          />
        </div>
        <div className="relative w-full h-screen-safe overflow-hidden">
          <Image
            src={PLACEHOLDER}
            fill
            sizes="(max-width: 768px) 100dvw, 50dvw"
            className="object-cover"
            alt=""
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}

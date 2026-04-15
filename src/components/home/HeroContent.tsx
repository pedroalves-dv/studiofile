// src/components/home/HeroContent.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useAnimationControls } from "motion/react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils/cn";

const LETTERS = ["T", "O", "T", "E", "M"] as const;
const STACK_Y = [44, 32, 21, 10, 0] as const;
const EM_LETTER_SPACING = "-0.046em";
const MOBILE_BREAKPOINT = 768;

export function HeroContent() {
  const controls = useAnimationControls();
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [marginLeft, setMarginLeft] = useState(0);
  // Locked once at mount — Chrome iOS recalculates svh when the address bar
  // appears/disappears despite svh being spec'd as stable. We measure the
  // container's actual rendered height (bars always visible at page load) and
  // derive the font size from it. Inline styles override the CSS svh calc and
  // never update, so the type stays the same size during scroll.
  const [mobileLayout, setMobileLayout] = useState<{
    height: number;
    fontSize: number;
  } | null>(null);

  const h1Ref = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  /**
   * Measures true glyph ink width at 100px and scales it
   * to perfectly fill the container content width.
   */
  const computeLayout = useCallback(() => {
    const measure = measureRef.current;
    const container = containerRef.current;
    if (!measure || !container) return null;

    const contentWidth = container.clientWidth;

    const getInkRect = (el: Element): DOMRect => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect();
    };

    const spans = measure.querySelectorAll("span");
    if (!spans.length) return null;

    const measureRect = measure.getBoundingClientRect();
    const tInk = getInkRect(spans[0]);
    const mInk = getInkRect(spans[spans.length - 1]);

    const inkWidth100 = mInk.right - tInk.left;
    const leftBearing100 = tInk.left - measureRect.left;

    if (inkWidth100 <= 0) return null;

    const fs = (100 * contentWidth) / inkWidth100;
    const ml = -(leftBearing100 * (fs / 100));

    return { fontSize: fs, marginLeft: ml };
  }, []);

  /**
   * Resize recalculation without triggering FLIP
   */
  const lastWidth = useRef(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  // Lock mobile font size + container height once at mount.
  useIsomorphicLayoutEffect(() => {
    if (window.innerWidth >= MOBILE_BREAKPOINT) return;
    const container = containerRef.current;
    if (!container) return;
    const h = container.getBoundingClientRect().height;
    const remPx =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    setMobileLayout({ height: h, fontSize: ((h + 8 * remPx) / 5) * 0.92 });
  }, []);

  useIsomorphicLayoutEffect(() => {
    const h1 = h1Ref.current;
    if (!h1) return;

    // Mobile font size is handled entirely by CSS (.hero-stack-fit uses svh calc).
    // Only the desktop FLIP case needs JS to measure exact glyph ink width.
    const onResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth === lastWidth.current) return;
      lastWidth.current = currentWidth;

      if (isHorizontal) {
        const layout = computeLayout();
        if (layout) {
          h1.style.fontSize = `${layout.fontSize}px`;
          h1.style.marginLeft = `${layout.marginLeft}px`;
        }
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isHorizontal, computeLayout]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      // Phase 1: Initial Staggered Drop
      await controls.start((i: number) => ({
        opacity: 1,
        y: [null, STACK_Y[i], STACK_Y[i] - 6, STACK_Y[i]],
        scaleY: [null, 0.92, 1.04, 1],
        scaleX: [null, 1.06, 0.97, 1],
        transition: {
          opacity: { duration: 0.01, delay: i * 0.13 },
          default: {
            delay: i * 0.13,
            duration: 0.78,
            times: [0, 0.42, 0.62, 1],
            ease: ["easeIn", "easeOut", "easeOut"],
          },
        },
      }));

      if (!isMounted) return;

      // Phase 2: Settle
      await controls.start({
        y: 0,
        scaleY: 1,
        scaleX: 1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 30,
          mass: 0.8,
        },
      });

      if (!isMounted) return;

      // Phase 3: The Flip (Desktop Only)
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        // Short pause to appreciate the spring before flipping
        await new Promise((resolve) => setTimeout(resolve, 400));

        const layout = computeLayout();
        if (layout && isMounted) {
          setFontSize(layout.fontSize);
          setMarginLeft(layout.marginLeft);
          setIsHorizontal(true);
        }
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [controls, computeLayout]);

  return (
    <motion.div
      ref={containerRef}
      // ml and mr are needed to align the text on the website padding (px-site)
      // Because the side bearings of the letters create different paddings inside their bounding boxes.
      className={cn(
        "relative overflow-hidden ml-[10px] mr-[5px] flex flex-col justify-center",

        // sticky-hero-h gives an explicit svh-based height matching the sticky parent.
        // Using h-full here caused Motion's layout projection to snapshot 0px on initial
        // mount (% heights resolve late), then animate to the real height — producing the
        // ghost gap above the type on load.
        isHorizontal ? "h-full justify-start" : "sticky-hero-h",
      )}
      // On mobile, override the svh-based CSS height with the px value locked at
      // mount. Chrome iOS recalculates svh when the toolbar shows/hides; the
      // inline style takes precedence and never updates.
      style={
        mobileLayout && !isHorizontal
          ? { height: `${mobileLayout.height}px` }
          : undefined
      }
    >
      {/* Measurement element (hidden) */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="font-display leading-none"
        style={{
          position: "absolute",
          inset: 0,
          visibility: "hidden",
          pointerEvents: "none",
          display: "inline-flex",
          whiteSpace: "nowrap",
          fontSize: "100px",
          letterSpacing: "-0.04em",
        }}
      >
        {LETTERS.map((letter, i) => {
          const isLast = i === LETTERS.length - 1;
          const isBeforeLast = i === LETTERS.length - 2;

          return (
            <span
              key={i}
              style={
                isLast
                  ? {
                      letterSpacing: 0,
                    }
                  : isBeforeLast
                    ? {
                        letterSpacing: EM_LETTER_SPACING,
                      }
                    : undefined
              }
            >
              {letter}
            </span>
          );
        })}
      </div>

      <motion.h1
        layout
        ref={h1Ref}
        className={`flex leading-none text-ink font-display hero-stack-fit ${
          isHorizontal
            ? "flex-row"
            : "flex-col items-center mx-auto text-10xl sm:text-11xl -space-y-6 sm:-space-y-8"
        }`}
        style={
          fontSize
            ? {
                fontSize: `${fontSize}px`,
                letterSpacing: "-0.04em",
                marginLeft: `${marginLeft}px`,
                whiteSpace: "nowrap",
                fontVariantLigatures: "none",
                textRendering: "geometricPrecision",
              }
            : mobileLayout && !isHorizontal
              ? { fontSize: `${mobileLayout.fontSize}px` }
              : {}
        }
      >
        {LETTERS.map((letter, i) => {
          const isLast = i === LETTERS.length - 1;
          const isBeforeLast = i === LETTERS.length - 2;
          const letterSpacing = isLast
            ? 0
            : isHorizontal && isBeforeLast
              ? EM_LETTER_SPACING
              : undefined;

          return (
            <motion.span
              key={i}
              layout
              animate={controls}
              initial={{
                y: -260,
                opacity: 0,
                scaleY: 1.06,
                scaleX: 0.95,
              }}
              custom={i}
              className="h-[0.85em]"
              style={{
                willChange: "transform, opacity",
                WebkitFontSmoothing: "antialiased",
                ...(letterSpacing !== undefined
                  ? {
                      letterSpacing,
                    }
                  : {}),
              }}
            >
              {letter}
            </motion.span>
          );
        })}
      </motion.h1>
    </motion.div>
  );
}

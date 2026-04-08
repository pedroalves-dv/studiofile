"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { motion, useAnimationControls } from "motion/react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils/cn";

const LETTERS = ["T", "O", "T", "E", "M"] as const;
const STACK_Y = [44, 32, 21, 10, 0] as const;

// Letter-spacing overrides per index in horizontal mode.
// Index 3 = E: tighten to close the E→M gap caused by font kerning.
// Index 4 = M: always 0 to strip trailing advance space.
// Tweak EM_LETTER_SPACING until the gap looks right for your font.
const EM_LETTER_SPACING = "-0.046em";
const MOBILE_BREAKPOINT = 768;

export function HeroContent() {
  const controls = useAnimationControls();
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [marginLeft, setMarginLeft] = useState(0);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  /**
   * Uses the Range API to get actual ink (glyph) bounds from measureRef at 100px.
   * - fontSize: scales ink span (T left → M right) to fill viewportWidth − 2×TARGET_MARGIN
   * - marginLeft: shifts h1 so T's ink left edge lands exactly at TARGET_MARGIN
   *   M's ink right edge then lands at viewportWidth − TARGET_MARGIN by arithmetic.
   * Both values are applied in one batched render so Motion's FLIP captures the
   * correct final positions — no post-animation correction needed.
   */
  const computeLayout = useCallback(() => {
    const measure = measureRef.current;
    if (!measure) return null;

    const TARGET_MARGIN = 12;
    const viewportWidth = window.innerWidth;
    const availableInkWidth = viewportWidth - TARGET_MARGIN * 2;

    const getInkRect = (el: Element): DOMRect => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect();
    };

    const spans = measure.querySelectorAll("span");
    const tInk = getInkRect(spans[0]);
    const mInk = getInkRect(spans[spans.length - 1]);
    const inkWidth100 = mInk.right - tInk.left;

    if (inkWidth100 <= 0) return null;

    const fs = (100 * availableInkWidth) / inkWidth100;

    // Measure T's actual left bearing at fs directly — avoids linear-scaling error from 100px.
    measure.style.fontSize = `${fs}px`;
    const tInkAtFs = getInkRect(spans[0]);
    const measureLeft = measure.getBoundingClientRect().left;
    measure.style.fontSize = "100px";

    const ml = TARGET_MARGIN - (tInkAtFs.left - measureLeft);

    return { fontSize: fs, marginLeft: ml };
  }, []);

  // Compensate for extra whitespace below M glyph — must run after layout changes.
  useIsomorphicLayoutEffect(() => {
    const mSpan = h1Ref.current?.querySelectorAll("span")[4];
    if (!mSpan) return;
    const elBottom = mSpan.getBoundingClientRect().bottom;
    const inkBottom = (() => {
      const r = document.createRange();
      r.selectNodeContents(mSpan);
      return r.getBoundingClientRect().bottom;
    })();
    mSpan.style.marginBottom = `${-(elBottom - inkBottom)}px`;
  }, [isHorizontal, fontSize]);

  // Recalculate on resize — direct DOM update to avoid triggering FLIP
  useIsomorphicLayoutEffect(() => {
    if (!isHorizontal) return;
    const onResize = () => {
      const layout = computeLayout();
      if (!layout || !h1Ref.current) return;
      h1Ref.current.style.fontSize = `${layout.fontSize}px`;
      h1Ref.current.style.marginLeft = `${layout.marginLeft}px`;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isHorizontal, computeLayout]);

  useEffect(() => {
    const run = async () => {
      await controls.start((i: number) => ({
        opacity: 1,
        y: [null, STACK_Y[i], STACK_Y[i] - 6, STACK_Y[i]],
        scaleY: [null, 0.92, 1.04, 1],
        scaleX: [null, 1.06, 0.97, 1],
        transition: {
          opacity: { duration: 0.01, delay: i * 0.13 },
          y: {
            delay: i * 0.13,
            duration: 0.78,
            times: [0, 0.42, 0.62, 1],
            ease: ["easeIn", "easeOut", "easeOut"],
          },
          scaleY: {
            delay: i * 0.13,
            duration: 0.78,
            times: [0, 0.42, 0.62, 1],
            ease: ["easeIn", "easeOut", "easeOut"],
          },
          scaleX: {
            delay: i * 0.13,
            duration: 0.78,
            times: [0, 0.42, 0.62, 1],
            ease: ["easeIn", "easeOut", "easeOut"],
          },
        },
      }));

      await controls.start({
        y: 0,
        scaleY: 1,
        scaleX: 1,
        transition: { type: "spring", stiffness: 110, damping: 26, mass: 1.2 },
      });

      if (window.innerWidth < MOBILE_BREAKPOINT) return;

      await Promise.all([
        document.fonts.ready,
        new Promise<void>((resolve) => setTimeout(resolve, 500)),
      ]);

      const layout = computeLayout();
      if (!layout) return;

      // Batch all state updates in one render so FLIP captures the
      // fully-corrected endpoint — no second adjustment after animation.
      setFontSize(layout.fontSize);
      setMarginLeft(layout.marginLeft);
      setIsHorizontal(true);
    };

    const raf = requestAnimationFrame(() => run());
    return () => cancelAnimationFrame(raf);
  }, [controls, computeLayout]);

  return (
    <motion.div
      layout // This ensures the transition from center to top is animated
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        isHorizontal ? "h-full" : "section-centered pt-4"
      )}
    >
      {/* Hidden element for ink-width measurement at 100px.
          Mirrors h1's horizontal letter-spacing exactly (including EM_LETTER_SPACING on E)
          so computeLayout() can pre-compute the full correction before the FLIP starts. */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="font-display leading-none"
        style={{
          display: "flex",
          position: "fixed",
          visibility: "hidden",
          pointerEvents: "none",
          fontSize: "100px",
          letterSpacing: "-0.04em",
          top: 0,
          left: 0,
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
                  ? { letterSpacing: 0 }
                  : isBeforeLast
                    ? { letterSpacing: EM_LETTER_SPACING }
                    : undefined
              }
            >
              {letter}
            </span>
          );
        })}
      </div>

      <motion.h1
        ref={h1Ref}
        className={`flex leading-none text-ink font-display ${
          isHorizontal
            ? "flex-row w-full"
            : "flex-col items-center mx-auto text-10xl sm:text-11xl -space-y-8 sm:-space-y-10"
        }`}
        style={
          fontSize
            ? {
                fontSize: `${fontSize}px`,
                letterSpacing: "-0.04em",
                marginLeft: `${marginLeft}px`,
              }
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
              initial={{ y: -260, opacity: 0, scaleY: 1.06, scaleX: 0.95 }}
              custom={i}
              style={{
                willChange: "transform, opacity",
                ...(letterSpacing !== undefined ? { letterSpacing } : {}),
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

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

    // Before change
    // const padding = parseFloat(getComputedStyle(container).paddingLeft);
    // const contentWidth = container.clientWidth - padding * 2;
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

    // Before change
    // return {
    //   fontSize: Math.round(fs * 1000) / 1000,
    //   marginLeft: Math.round(ml),
    // };
    return { fontSize: fs, marginLeft: ml };
  }, []);

  /**
   * Resize recalculation without triggering FLIP
   */
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
      layout
      ref={containerRef}
      // ml and mr are needed to align the text on the website padding (px-site)
      // Because the side bearings of the letters create different paddings inside their bounding boxes.
      className={cn(
        "relative overflow-hidden ml-[10px] mr-[5px]",
        // padding top "pt" is another hack to vertically center the animation up to phase 2,
        // h-full and section centered arent enough. further fixing might be required
        isHorizontal ? "h-full" : "section-centered pt-5",
      )}
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
        className={`flex leading-none text-ink font-display ${
          isHorizontal
            ? "flex-row"
            : "flex-col items-center mx-auto text-10xl sm:text-11xl -space-y-8 sm:-space-y-10"
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

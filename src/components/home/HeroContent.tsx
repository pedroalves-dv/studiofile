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

    const padding = parseFloat(getComputedStyle(container).paddingLeft);

    const contentWidth = container.clientWidth - padding * 2;

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

    return {
      fontSize: Math.round(fs * 1000) / 1000,
      marginLeft: Math.round(ml),
    };
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
    const run = async () => {
      await controls.start((i: number) => ({
        opacity: 1,
        y: [null, STACK_Y[i], STACK_Y[i] - 6, STACK_Y[i]],
        scaleY: [null, 0.92, 1.04, 1],
        scaleX: [null, 1.06, 0.97, 1],
        transition: {
          opacity: {
            duration: 0.01,
            delay: i * 0.13,
          },
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
        transition: {
          type: "spring",
          stiffness: 110,
          damping: 26,
          mass: 1.2,
        },
      });

      if (window.innerWidth < MOBILE_BREAKPOINT) return;

      await Promise.all([
        document.fonts.ready,
        new Promise<void>((resolve) => setTimeout(resolve, 500)),
      ]);

      const layout = computeLayout();

      if (!layout) return;

      setFontSize(layout.fontSize);
      setMarginLeft(layout.marginLeft);
      setIsHorizontal(true);
    };

    const raf = requestAnimationFrame(run);

    return () => cancelAnimationFrame(raf);
  }, [controls, computeLayout]);

  return (
    <motion.div
      layout
      ref={containerRef}
      className={cn(
        "relative overflow-hidden ml-[8px] mr-[4px]",
        isHorizontal ? "h-full" : "section-centered pt-4",
      )}
    >
      {/* Measurement element */}
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
        ref={h1Ref}
        className={`flex leading-none text-ink font-display -mt-[5px] ${
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

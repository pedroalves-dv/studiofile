"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { motion, useAnimationControls } from "motion/react";

const LETTERS = ["T", "O", "T", "E", "M"] as const;
const STACK_Y = [44, 32, 21, 10, 0] as const;

// Letter-spacing overrides per index in horizontal mode.
// Index 3 = E: tighten to close the E→M gap caused by font kerning.
// Index 4 = M: always 0 to strip trailing advance space.
// Tweak EM_LETTER_SPACING until the gap looks right for your font.
const EM_LETTER_SPACING = "-0.046em";

export function HeroContent() {
  const controls = useAnimationControls();
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const scaleWrapRef = useRef<HTMLDivElement>(null);

  const getAvailableWidth = useCallback(() => {
    if (!containerRef.current) return window.innerWidth;
    const style = window.getComputedStyle(containerRef.current);
    return (
      containerRef.current.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight)
    );
  }, []);

  /**
   * Uses the Range API to get actual ink (glyph) bounds — not the advance box —
   * for the first (T) and last (M) spans, then applies scaleX + translateX so that
   * T's ink left aligns with the container's left padding edge, and M's ink right
   * aligns with the container's right padding edge. No gaps on either side.
   */
  const applyScaleCorrection = useCallback(() => {
    const wrap = scaleWrapRef.current;
    const h1 = h1Ref.current;
    const container = containerRef.current;
    if (!wrap || !h1 || !container) return;

    // Reset so all measurements are in unscaled space
    wrap.style.transform = "none";

    const cRect = container.getBoundingClientRect();
    const cStyle = window.getComputedStyle(container);
    const padL = parseFloat(cStyle.paddingLeft);
    const padR = parseFloat(cStyle.paddingRight);
    const targetLeft = cRect.left + padL;
    const targetRight = cRect.right - padR;
    const available = targetRight - targetLeft;

    // Range.getBoundingClientRect() on a text node returns ink/glyph bounds,
    // not the advance box — exactly what we need to eliminate side-bearing gaps.
    const getInkRect = (el: Element): DOMRect => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect();
    };

    const spans = h1.querySelectorAll("span");
    const tRect = getInkRect(spans[0]); // T — first letter
    const mRect = getInkRect(spans[spans.length - 1]); // M — last letter

    const inkLeft = tRect.left;
    const inkRight = mRect.right;
    const inkWidth = inkRight - inkLeft;

    if (inkWidth <= 0) return;

    const scaleX = available / inkWidth;
    const wrapLeft = wrap.getBoundingClientRect().left;

    // Set transform-origin at T's ink-left edge (in wrapper-local coords).
    // Scaling from there keeps inkLeft fixed, so inkRight lands exactly on targetRight.
    // The translateX then shifts the whole thing so inkLeft lands on targetLeft.
    wrap.style.transformOrigin = `${inkLeft - wrapLeft}px 0`;
    wrap.style.transform = `translateX(${targetLeft - inkLeft}px) scaleX(${scaleX})`;
  }, []);

  // Recalculate on resize
  useLayoutEffect(() => {
    if (!isHorizontal) return;
    const onResize = () => {
      if (!measureRef.current || !h1Ref.current) return;
      const W100 = measureRef.current.offsetWidth;
      const available = getAvailableWidth();
      h1Ref.current.style.fontSize = `${(100 * available) / W100}px`;
      applyScaleCorrection();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isHorizontal, applyScaleCorrection, getAvailableWidth]);

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
        transition: { type: "spring", stiffness: 110, damping: 20, mass: 1.2 },
      });

      await new Promise<void>((resolve) => setTimeout(resolve, 500));
      await document.fonts.ready;

      const W100 = measureRef.current!.offsetWidth;
      const available = getAvailableWidth();
      const fs = (100 * available) / W100;

      setFontSize(fs);
      setIsHorizontal(true);
    };

    const raf = requestAnimationFrame(() => run());
    return () => cancelAnimationFrame(raf);
  }, [controls, getAvailableWidth]);

  return (
    <div
      ref={containerRef}
      className="section-centered overflow-hidden pl-2 pr-1"
    >
      {/* Hidden element for advance-width measurement at 100px */}
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
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            style={i === LETTERS.length - 1 ? { letterSpacing: 0 } : undefined}
          >
            {letter}
          </span>
        ))}
      </div>

      <div ref={scaleWrapRef} style={{ transformOrigin: "0 0" }}>
        <motion.h1
          ref={h1Ref}
          layout
          onLayoutAnimationComplete={applyScaleCorrection}
          className={`flex leading-none text-ink font-display ${
            isHorizontal
              ? "flex-row"
              : "flex-col items-center mx-auto text-9xl sm:text-10xl -space-y-6 sm:-space-y-8"
          }`}
          style={
            fontSize
              ? { fontSize: `${fontSize}px`, letterSpacing: "-0.04em" }
              : {}
          }
        >
          {LETTERS.map((letter, i) => {
            const isLast = i === LETTERS.length - 1;
            const isBeforeLast = i === LETTERS.length - 2; // E

            // In horizontal mode, tighten E's letter-spacing to close the E→M gap.
            // letter-spacing applies after the character, so this only affects the
            // space between E and M — nothing else changes.
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
                className="origin-bottom"
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
      </div>
    </div>
  );
}

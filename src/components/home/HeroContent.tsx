"use client";

import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { motion, useAnimationControls } from "motion/react";

const LETTERS = ["T", "O", "T", "E", "M"] as const;
const STACK_Y = [44, 32, 21, 10, 0] as const;

export function HeroContent() {
  const controls = useAnimationControls();
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [targetFontSize, setTargetFontSize] = useState<number | null>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  // Hidden off-screen span used to measure "TOTEM" at a known size without
  // interfering with the animated h1. offsetWidth ignores CSS transforms and
  // is unaffected by any flex-container width constraints on the h1.
  const measureRef = useRef<HTMLSpanElement>(null);

  // Keep font size synced to viewport width on resize (direct DOM mutation —
  // avoids a React re-render that would restart motion's layout FLIP).
  useLayoutEffect(() => {
    if (!isHorizontal) return;
    const fit = () => {
      if (!measureRef.current || !h1Ref.current) return;
      const refWidth = measureRef.current.offsetWidth;
      if (refWidth > 0) {
        h1Ref.current.style.fontSize = `${Math.round((100 * window.innerWidth) / refWidth)}px`;
      }
    };
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [isHorizontal]);

  useEffect(() => {
    const run = async () => {
      // Phase 1: letters fall in staggered
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

      // Phase 2: spring to readable vertical stack
      await controls.start({
        y: 0,
        scaleY: 1,
        scaleX: 1,
        transition: { type: "spring", stiffness: 110, damping: 20, mass: 1.2 },
      });

      // Phase 3: compute target font size, then unfold horizontally.
      // Both setState calls are batched by React 18 into one render, so
      // motion's layout FLIP captures the correct large end-state in one pass —
      // no second-render conflict.
      await new Promise<void>((resolve) => setTimeout(resolve, 500));
      const refWidth = measureRef.current?.offsetWidth ?? 0;
      if (refWidth > 0) {
        setTargetFontSize(Math.round((100 * window.innerWidth) / refWidth));
      }
      setIsHorizontal(true);
    };

    const raf = requestAnimationFrame(() => run());
    return () => cancelAnimationFrame(raf);
  }, [controls]);

  return (
    <div className="section-centered overflow-hidden">
      {/* Off-screen reference: measures the true intrinsic width of "TOTEM"
          in font-display at 100 px, free from any container width constraints. */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="font-display leading-none"
        style={{
          position: "fixed",
          visibility: "hidden",
          pointerEvents: "none",
          fontSize: "100px",
          letterSpacing: "-0.04em",
          whiteSpace: "nowrap",
          top: 0,
          left: 0,
        }}
      >
        TOTEM
      </span>

      {/* Single persistent tree — layout animates between vertical and horizontal */}
      <motion.h1
        ref={h1Ref}
        layout
        className={`flex leading-none text-ink font-display
          ${
            isHorizontal
              ? "flex-row"
              : "flex-col items-center mx-auto text-9xl sm:text-10xl -space-y-6 sm:-space-y-8"
          }`}
        style={
          targetFontSize
            ? { fontSize: `${targetFontSize}px`, letterSpacing: "-0.04em" }
            : {}
        }
      >
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            layout // ← drives the FLIP between vertical and horizontal
            animate={controls}
            initial={{ y: -260, opacity: 0, scaleY: 1.06, scaleX: 0.95 }}
            custom={i}
            className="origin-bottom"
            style={{ willChange: "transform, opacity" }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}

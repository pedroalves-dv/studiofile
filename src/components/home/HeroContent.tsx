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

  /** Measure the h1's actual rendered width, then scaleX the wrapper to fit. */
  const applyScaleCorrection = useCallback(() => {
    const h1 = h1Ref.current;
    const wrap = scaleWrapRef.current;
    if (!h1 || !wrap) return;

    // Reset so getBoundingClientRect returns unscaled width
    wrap.style.transform = "scaleX(1)";
    const available = getAvailableWidth();
    const rendered = h1.getBoundingClientRect().width;
    if (rendered > 0) {
      wrap.style.transform = `scaleX(${available / rendered})`;
    }
  }, [getAvailableWidth]);

  // Resize: recalculate base font-size + scaleX correction
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

  // scaleX is applied via onLayoutAnimationComplete on the h1 — not here
  // (measuring mid-FLIP gives wrong width and causes black-block glitch)

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

      // Wait for web fonts to be fully active before measuring
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
    <div ref={containerRef} className="section-centered overflow-hidden">
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

      {/* Wrapper for scaleX correction — keeps motion's layout transforms separate */}
      <div ref={scaleWrapRef} style={{ transformOrigin: "0 0" }}>
        <motion.h1
          ref={h1Ref}
          layout
          onLayoutAnimationComplete={() => applyScaleCorrection()}
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
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              layout
              animate={controls}
              initial={{ y: -260, opacity: 0, scaleY: 1.06, scaleX: 0.95 }}
              custom={i}
              className="origin-bottom"
              style={
                i === LETTERS.length - 1
                  ? { willChange: "transform, opacity", letterSpacing: 0 }
                  : { willChange: "transform, opacity" }
              }
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { motion, useAnimationControls } from "motion/react";

const LETTERS = ["T", "O", "T", "E", "M"] as const;
const STACK_Y = [44, 32, 21, 10, 0] as const;

const GRID_OVERLAY = {
  backgroundImage:
    "linear-gradient(rgba(255,218,167,0.04) 1px, transparent 1px), " +
    "linear-gradient(90deg, rgba(255,218,167,0.04) 1px, transparent 1px)",
  backgroundSize: "80px 80px",
} as const;

export function LandingHero() {
  const controls = useAnimationControls();

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

      controls.start({
        y: 0,
        scaleY: 1,
        scaleX: 1,
        transition: {
          type: "spring",
          stiffness: 110,
          damping: 20,
          mass: 1.2,
        },
      });
    };

    const raf = requestAnimationFrame(() => run());
    return () => cancelAnimationFrame(raf);
  }, [controls]);

  return (
    <section
      className="relative w-full bg-black overflow-hidden border-b border-accent/10"
      style={{
        minHeight: "calc(100dvh - var(--header-height))",
        ...GRID_OVERLAY,
      }}
    >
      <div
        className="relative z-10 flex flex-col items-center justify-center gap-10
          w-full px-6 md:px-12 py-10 md:py-14"
        style={{ minHeight: "calc(100dvh - var(--header-height))" }}
      >
        {/* Top label */}
        {/* <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent/70">
          Collection 01 — Ceiling Lighting
        </p> */}

        {/* TOTEM title */}
        <h1
          className="flex flex-col items-center leading-none text-canvas
                text-9xl sm:text-10xl font-display -space-y-4 sm:-space-y-6 mx-auto"
        >
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              animate={controls}
              initial={{ y: -260, opacity: 0, scaleY: 1.06, scaleX: 0.95 }}
              custom={i}
              className="origin-bottom"
              style={{ willChange: "transform, opacity" }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Description */}
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="font-body text-canvas/55 text-sm leading-relaxed">
            A modular lighting system built from stackable shapes.
            <br />
            Made to order. Ships worldwide.
          </p>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted/60">
            3D printed on demand · Designed in Paris
          </p>
        </div>
      </div>
    </section>
  );
}

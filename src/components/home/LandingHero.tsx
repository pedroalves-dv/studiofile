"use client";

import { useEffect } from "react";
import { motion, useAnimationControls } from "motion/react";

const LETTERS = ["T", "O", "T", "E", "M"] as const;
const STACK_Y = [44, 32, 21, 10, 0] as const;

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
      id="landing-hero"
      className="relative w-full bg-canvas overflow-hidden border-b border-accent/10 section-centered"
      // style={{ minHeight: "100dvh" }}
    >
      <div
        className="relative z-10 flex flex-col items-center justify-center gap-10
          w-full px-6 md:px-12 py-10 md:py-14 section-centered"
        // style={{ minHeight: "100dvh" }}
      >
        {/* TOTEM title */}
        <h1
          className="flex flex-col items-center leading-none text-ink
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
      </div>
    </section>
  );
}

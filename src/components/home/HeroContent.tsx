"use client";

import { useEffect } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { motion, useAnimationControls } from "motion/react";

const LETTERS = ["T", "O", "T", "E", "M"] as const;
// Downward offset (px) each letter lands at relative to its final position.
// Top bead (T) compresses the most; bottom bead (M) is the anchor.
const STACK_Y = [44, 32, 21, 10, 0] as const;

export function HeroContent() {
  const controls = useAnimationControls();

  useEffect(() => {
    const run = async () => {
      // Phase 1: letters fall in staggered, each landing at its stacked position
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

      // Phase 2: all letters simultaneously spring to their readable positions
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
    <div className="section-centered">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-20 items-center w-full max-w-7xl">
        {/* Left — desktop only */}
        <div className="hidden sm:block px-4 py-4 self-start "></div>
        {/* Center — TOTEM title, always visible */}
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

        {/* Right — desktop only */}
        <div className="hidden sm:flex flex-col items-start gap-1">
          <div className="backdrop-blur-xl px-6 py-4 rounded-lg">
            <p className="">$33 — $149</p>
          </div>
          <ArrowButton
            href="/shop"
            label="Shop"
            glowColor="var(--color-black)"
            className="h-12 px-8 py-4 bg-ink font-light text-md text-white
            rounded-lg flex items-center justify-center"
          />
        </div>
      </div>

      {/* Mobile-only button — below the title */}
      <ArrowButton
        href="/shop"
        label="Shop"
        glowColor="var(--color-black)"
        className="sm:hidden mt-12 h-12 w-24 px-8 py-3 bg-ink text-white text-xs
        tracking-display font-mono rounded-xl flex items-center justify-center"
      />
    </div>
  );
}

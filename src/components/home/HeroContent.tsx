"use client";

import { useEffect } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { m, useAnimationControls } from "motion/react";

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

    const raf = requestAnimationFrame(() => run()); // 👈 wrap here
    return () => cancelAnimationFrame(raf); // 👈 and cleanup
  }, [controls]);

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: "calc(100dvh - var(--header-height))" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-20 items-center w-full max-w-7xl">
        {/* Left — desktop only */}
        <div className="px-4 py-4 self-start ">
          {/* <p className="hidden sm:block italic font-serif text-8xl text-ink text-right tracking-tighter">
            Introducing
          </p> */}
        </div>
        {/* Center — TOTEM title, always visible */}
        <h1
          className="flex flex-col items-center leading-none text-ink
        text-9xl sm:text-10xl font-display -space-y-4 sm:-space-y-6 mx-auto"
        >
          {LETTERS.map((letter, i) => (
            <m.span
              key={i}
              animate={controls}
              initial={{ y: -260, opacity: 0, scaleY: 1.06, scaleX: 0.95 }}
              custom={i}
              className="origin-bottom"
              style={{ willChange: "transform, opacity" }}
            >
              {letter}
            </m.span>
          ))}
        </h1>

        {/* Right — desktop only */}
        <div className="hidden sm:flex flex-col items-start gap-1">
          <div className="backdrop-blur-xl px-6 py-4 rounded-2xl">
            <p className="font-mono font-bold text-xl text-ink tracking-tight">
              $33 — $149
            </p>
          </div>
          <ArrowButton
            href="/shop"
            label="Shop"
            glowColor="var(--color-black)"
            className="h-12 px-8 py-4 bg-ink text-white text-sm
            tracking-display font-mono rounded-xl flex items-center justify-center"
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

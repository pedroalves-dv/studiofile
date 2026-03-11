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

    run();
  }, [controls]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col relative">
        {/* <h1
          className="font-display text-6xl sm:text-8xl leading-none
          text-ink tracking-tight mt-20"
        >
          TOTEM{" "}
          <span
            className="inline-block align-top font-mono text-xl
          sm:text-2xl mt-1 -ml-2 sm:-ml-3 sm:mt-2"
          >
            ©
          </span>
        </h1> */}

        <h1
          className="mt-16 flex flex-col items-center leading-none text-ink
          text-9xl sm:text-10xl font-display w-fit
          -space-y-4 sm:-space-y-6 mx-auto"
        >
          {LETTERS.map((letter, i) => (
            <motion.span
              // biome-ignore lint/suspicious/noArrayIndexKey: static array, order never changes
              key={i}
              animate={controls}
              initial={{ y: -260, opacity: 0, scaleY: 1.06, scaleX: 0.95 }}
              custom={i}
              className="origin-bottom"
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        <ArrowButton
          href="/shop"
          label="Shop"
          glowColor="var(--color-black)"
          className="mt-12 h-12 w-24 px-8 py-3 bg-ink text-white text-xs
          tracking-display font-mono rounded-xl flex items-center
          justify-center self-start mx-auto sm:absolute sm:top-[13rem] sm:right-[16rem]"
        />
      </div>

      <p
        className="mt-[30rem] font-serif text-5xl sm:text-6xl text-light text-right md:w-3/4
      lg:w-2/3 self-end tracking-(space-xsm)"
      >
        Introducting
        <span
          className="inline-block font-display tracking-tight text-[4.2rem]
        text-ink pl-4 pr-2"
        >
          {" "}
          TOTEM
        </span>
        , a fully <span className="italic text-ink pr-3">modular lamp</span>
        that adapts to you.
      </p>
    </div>
  );
}

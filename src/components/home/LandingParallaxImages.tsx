"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useAnimationControls,
  type MotionValue,
} from "motion/react";

// ── TOTEM animation constants ────────────────────────────────────────
const LETTERS = ["T", "O", "T", "E", "M"] as const;
const STACK_Y = [44, 32, 21, 10, 0] as const;

// ── Image cards ──────────────────────────────────────────────────────
const CARDS = [
  { id: "01", bg: "bg-ink", label: "Modular system" },
  { id: "02", bg: "bg-accent", label: "Made to order" },
  { id: "03", bg: "bg-stone-200", label: "Ships worldwide" },
  { id: "04", bg: "bg-ink/75", label: "Paris" },
] as const;

// Approximate header height: py-5 (40px) + logo 2.2rem (35px) + border (1px)
const HEADER_H = 64;

// ── Scroll-animated card ─────────────────────────────────────────────
function Card({
  card,
  index,
  total,
  scrollYProgress,
  vh,
  reduced,
}: {
  card: (typeof CARDS)[number];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  vh: number;
  reduced: boolean;
}) {
  // Window 0 = initial TOTEM-only view. Cards arrive in windows 1…N.
  const step = 1 / (total + 1);
  const start = (index + 1) * step;
  const end = (index + 2) * step;

  const y = useTransform(
    scrollYProgress,
    [start, end],
    reduced ? [0, 0] : [vh + 100, 0],
  );

  const textColor = card.bg.includes("stone")
    ? "text-ink/30"
    : "text-canvas/30";

  return (
    <motion.div
      style={{
        position: "absolute",
        right: 48, // matches md:px-12
        top: HEADER_H,
        y,
        width: "clamp(220px, 38vw, 540px)",
        aspectRatio: "3 / 4",
        zIndex: index + 1,
      }}
      className={`${card.bg} flex flex-col justify-between p-5`}
    >
      <span
        className={`font-mono text-[9px] tracking-[0.2em] uppercase self-end ${textColor}`}
      >
        {card.id}
      </span>
      <p
        className={`font-mono text-[9px] tracking-[0.2em] uppercase ${textColor}`}
      >
        {card.label}
      </p>
    </motion.div>
  );
}

// ── Desktop: unified sticky scroll sequence ──────────────────────────
function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [vh, setVh] = useState(900);
  const controls = useAnimationControls();

  useEffect(() => {
    setVh(window.innerHeight);
  }, []);

  // TOTEM letter animation — plays on mount
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    // Outer: tall container — provides scroll travel space.
    // Height = (N + 2) × 100vh so each card arrives exactly 1 screen apart.
    <div
      ref={containerRef}
      style={{ height: `${(CARDS.length + 2) * 100}vh`, position: "relative" }}
    >
      {/* Sticky viewport — pins to top while user scrolls through the outer container */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* TOTEM — centered in the sticky viewport */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
          }}
        >
          <h1
            className="flex flex-col items-center leading-none text-ink
              text-9xl sm:text-10xl font-display -space-y-4 sm:-space-y-6"
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

        {/* Cards — all same size, right-aligned, stacking (later = higher z) */}
        {CARDS.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            index={i}
            total={CARDS.length}
            scrollYProgress={scrollYProgress}
            vh={vh}
            reduced={reduced}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────
export function LandingParallaxImages() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="bg-canvas">
      {/* Desktop: full scroll sequence */}
      <div className="hidden md:block">
        {mounted ? (
          <ScrollSequence />
        ) : (
          <div style={{ height: `${(CARDS.length + 2) * 100}vh` }} />
        )}
      </div>

      {/* Mobile: static TOTEM + card grid */}
      <div className="md:hidden px-6 py-16 flex flex-col items-center gap-12">
        <h1
          className="flex flex-col items-center leading-none text-ink
            text-9xl font-display -space-y-4"
        >
          {LETTERS.map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </h1>

        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-3 items-start">
            <div className="bg-ink flex-1 aspect-[3/4] flex items-end p-4">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-canvas/30">
                01 / Modular
              </span>
            </div>
            <div className="bg-accent mt-10 w-2/5 aspect-[2/3] flex items-end p-3">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-canvas/30">
                02
              </span>
            </div>
          </div>
          <div className="flex gap-3 items-end">
            <div className="bg-stone-200 w-2/5 aspect-[3/4] flex items-end p-3">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink/30">
                03
              </span>
            </div>
            <div className="bg-ink/75 flex-1 aspect-[2/3] flex items-end p-4">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-canvas/20">
                04
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

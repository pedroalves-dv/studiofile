"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue, // ← add this back
  useScroll,
  useTransform,
  useAnimationControls,
  type MotionValue,
} from "motion/react";
import { useLenis } from "@/components/common/SmoothScroll";

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

const HEADER_H = 64;

// ── Scroll-animated card ─────────────────────────────────────────────
function Card({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: (typeof CARDS)[number];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const step = 1 / (total + 1);
  const start = (index + 0.3) * step;
  const end = (index + 1.3) * step;

  // FIX: use a transform function instead of [vh+100, 0].
  // This reads window.innerHeight live, so SSR/resize can't break it.
  // It also gives us free control over easing.
  const y = useTransform(scrollYProgress, (p: number) => {
    if (p <= start) return window.innerHeight + 100;
    if (p >= end) return 0;
    const t = (p - start) / (end - start);
    const eased = 1 - Math.pow(1 - t, 3);
    return (1 - eased) * (window.innerHeight + 100);
  });

  const textColor = card.bg.includes("stone")
    ? "text-ink/30"
    : "text-canvas/30";

  return (
    <motion.div
      style={{
        position: "absolute",
        right: 48,
        top: HEADER_H,
        y,
        width: "clamp(220px, 38vw, 540px)",
        aspectRatio: "3 / 4",
        zIndex: index + 1,
      }}
      className={`${card.bg} flex flex-col justify-between p-5`}
    >
      <span
        className={`text-md font-medium tracking-tight  self-end ${textColor}`}
      >
        {card.id}
      </span>
      <p className={`text-md font-medium tracking-tight  ${textColor}`}>
        {card.label}
      </p>
    </motion.div>
  );
}
// ── TEXT SCROLL ──────────────────────────
function TextBlock({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  // Matches card index 1 timing
  const total = CARDS.length;
  const step = 1 / (total + 1);
  const start = 1.3 * step;
  const end = 2.3 * step;

  const y = useTransform(scrollYProgress, (p: number) => {
    if (p <= start) return window.innerHeight + 100;
    if (p >= end) return 0;
    const t = (p - start) / (end - start);
    const eased = 1 - Math.pow(1 - t, 3);
    return (1 - eased) * (window.innerHeight + 100);
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 48,
        top: HEADER_H,
        y,
        width: "clamp(180px, 25vw, 320px)",
        zIndex: 10,
      }}
      className="flex flex-col gap-4 pt-6"
    >
      <p className="text-md tracking  text-muted">01 / Concept</p>
      <h2 className="text-ink text-9xl font-semibold leading-[100px] tracking-[-5px] ligatures">
        Light,
        <br />
        stacked.
      </h2>
      <p className="text-muted text-md tracking-tight leading-5">
        A modular ceiling system built from 3D-printed shapes. Stack as many as
        you want, in any order.
      </p>
    </motion.div>
  );
}
// ── Desktop: unified sticky scroll sequence ──────────────────────────
function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  const rawScrollY = useMotionValue(0);
  const [scrollRange, setScrollRange] = useState([0, 1]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.offsetTop;
    const scrollable = el.offsetHeight - window.innerHeight;
    setScrollRange([top, top + scrollable]);
  }, []);

  // Feed Lenis scroll position into our motion value
  const lenis = useLenis();
  // console.log("lenis instance:", lenis);

  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ scroll }: { scroll: number }) => rawScrollY.set(scroll);
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, rawScrollY]);

  const scrollYProgress = useTransform(rawScrollY, scrollRange, [0, 1], {
    clamp: true,
  });
  // useEffect(() => {
  //   return scrollYProgress.on("change", (v) => console.log("scroll:", v));
  // }, [scrollYProgress]);

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
        transition: { type: "spring", stiffness: 110, damping: 20, mass: 1.2 },
      });
    };

    const raf = requestAnimationFrame(() => run());
    return () => cancelAnimationFrame(raf);
  }, [controls]);

  return (
    // Outer: tall container — provides scroll travel space.
    // (N + 2) × 100vh: 1 screen for initial TOTEM view, 1 per card, 1 for breathing room.
    <div
      ref={containerRef}
      style={{ height: `${(CARDS.length + 2) * 100}vh`, position: "relative" }}
    >
      {/* Sticky viewport — pins while user scrolls through the outer container */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* TOTEM — centered */}
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

        <TextBlock scrollYProgress={scrollYProgress} />
        {/* Cards — right-aligned, stacking (later = higher z) */}
        {CARDS.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            index={i}
            total={CARDS.length}
            scrollYProgress={scrollYProgress}
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
      </div>
    </section>
  );
}

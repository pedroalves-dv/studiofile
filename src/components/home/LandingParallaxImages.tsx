"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

export function LandingParallaxImages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // ── Block A: large portrait, top-right, slow drift ──────────────
  // Anchored near the top, barely moves — acts as a fixed backdrop
  const yA = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [80, -180],
  );

  // ── Block B: tall portrait, far left, rockets from below ────────
  // Starts completely below the fold, shoots up past center
  const yB = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [720, -240],
  );

  // ── Block C: wide landscape, center, descends from above ────────
  // Counter-directional to everything else — comes down, creates tension
  const yC = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [-120, 380],
  );
  const xC = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [-40, 40],
  );

  // ── Block D: narrow portrait, mid-right, fastest ────────────────
  // Extreme speed differential vs block A = most dramatic overlap
  const yD = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [560, -480],
  );

  // ── Floating label, moves horizontally ──────────────────────────
  const xLabel = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [-60, 80],
  );

  return (
    <section className="bg-canvas overflow-hidden">
      {/* ── DESKTOP: dramatic stacking layout ── */}
      <div
        ref={containerRef}
        className="hidden md:block relative"
        style={{ height: "300vh" }}
      >
        {/* Section marker — static, top-left */}
        <div className="absolute top-12 left-6 md:left-12 z-10 flex items-center gap-4">
          <span className="block w-8 h-px bg-ink/20" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
            Totem / System
          </span>
        </div>

        {/* ── Block A: large, top-right, slow ── */}
        <motion.div
          style={{
            position: "absolute",
            top: "6%",
            right: "5%",
            width: "clamp(300px, 42vw, 680px)",
            height: "clamp(380px, 58vh, 780px)",
            y: yA,
            zIndex: 2,
          }}
          className="bg-ink flex flex-col justify-between p-6"
        >
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-canvas/25 self-end">
            01
          </span>
          <div>
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-canvas/30">
              Modular system
            </p>
          </div>
        </motion.div>

        {/* ── Block B: tall portrait, left, rockets up ── */}
        <motion.div
          style={{
            position: "absolute",
            top: "32%",
            left: "4%",
            width: "clamp(220px, 28vw, 420px)",
            height: "clamp(420px, 72vh, 940px)",
            y: yB,
            zIndex: 3,
          }}
          className="bg-accent flex flex-col justify-between p-6"
        >
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-canvas/25 self-end">
            02
          </span>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-canvas/30">
            Made to order
          </p>
        </motion.div>

        {/* ── Block C: wide landscape, center, drifts down ── */}
        <motion.div
          style={{
            position: "absolute",
            top: "52%",
            left: "18%",
            width: "clamp(380px, 56vw, 900px)",
            height: "clamp(240px, 36vh, 520px)",
            y: yC,
            x: xC,
            zIndex: 1,
          }}
          className="bg-stone-100 flex flex-col justify-between p-6"
        >
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink/25 self-end">
            03
          </span>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink/30">
            Ships worldwide
          </p>
        </motion.div>

        {/* ── Block D: narrow, mid-right, fastest ── */}
        <motion.div
          style={{
            position: "absolute",
            top: "44%",
            right: "3%",
            width: "clamp(160px, 18vw, 280px)",
            height: "clamp(300px, 56vh, 700px)",
            y: yD,
            zIndex: 4,
          }}
          className="bg-ink/80 flex flex-col justify-between p-5"
        >
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-canvas/20 self-end">
            04
          </span>
        </motion.div>

        {/* ── Floating horizontal label ── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "22%",
            left: "5%",
            x: xLabel,
            zIndex: 5,
          }}
        >
          <p className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-none text-ink/8 select-none whitespace-nowrap">
            Designed in Paris
          </p>
        </motion.div>
      </div>

      {/* ── MOBILE: offset two-column grid ── */}
      <div className="md:hidden px-4 py-14 flex flex-col gap-3">
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
          <div className="bg-stone-100 mt-0 w-2/5 aspect-[3/4] flex items-end p-3">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-ink/30">
              03
            </span>
          </div>
          <div className="bg-ink/80 flex-1 aspect-[2/3] flex items-end p-4">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-canvas/20">
              04
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

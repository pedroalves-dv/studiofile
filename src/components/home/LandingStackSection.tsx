"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useAnimationControls,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

const LETTERS = ["T", "O", "T", "E", "M"] as const;
const STACK_Y = [44, 32, 21, 10, 0] as const;

const CARDS = [
  { id: "01", bg: "bg-ink" },
  { id: "02", bg: "bg-accent" },
  { id: "03", bg: "bg-stone-200" },
] as const;

const GRID_OVERLAY = {
  backgroundImage:
    "linear-gradient(rgba(255,218,167,0.04) 1px, transparent 1px)," +
    "linear-gradient(90deg, rgba(255,218,167,0.04) 1px, transparent 1px)",
  backgroundSize: "80px 80px",
} as const;

// Total scroll distance = cards + 2 screens of breathing room
const SCREENS = CARDS.length + 2;

interface Layout {
  cardW: number;
  cardH: number;
  restYs: number[];
  startY: number;
  restX: number;
}

function FlyingCard({
  card,
  index,
  scrollYProgress,
  layout,
  reduced,
}: {
  card: (typeof CARDS)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
  layout: Layout;
  reduced: boolean;
}) {
  // Each card occupies a staggered slice of scroll progress
  // Cards arrive one per ~1 screen of scroll
  const slice = 0.22;
  const start = index * 0.2;
  const end = start + slice;

  const y = useTransform(
    scrollYProgress,
    [start, end],
    [reduced ? layout.restYs[index] : layout.startY, layout.restYs[index]],
  );

  const isLight = card.bg.includes("stone");
  const textColor = isLight ? "text-ink/40" : "text-canvas/40";

  return (
    <motion.div
      style={{
        position: "absolute",
        left: layout.restX,
        top: 0,
        y,
        width: layout.cardW,
        height: layout.cardH,
        zIndex: index + 2,
      }}
      className={`${card.bg} flex flex-col justify-between p-5`}
    >
      <span
        className={`font-mono text-[9px] tracking-[0.2em] uppercase self-end ${textColor}`}
      >
        {card.id}
      </span>
    </motion.div>
  );
}

export function LandingStackSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const reduced = useReducedMotion() ?? false;
  const [layout, setLayout] = useState<Layout | null>(null);
  const [mounted, setMounted] = useState(false);

  // TOTEM entry animation — identical to original LandingHero
  useEffect(() => {
    setMounted(true);
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

  // Compute card positions client-side
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const headerH = 52; // matches --header-height: 3.2rem
      const gap = 16;
      const rightMargin = 48;

      // All cards same size, portrait
      const cardW = Math.min(Math.max(160, vw * 0.18), 240);
      const cardH = Math.round(cardW * (4 / 3));

      // Single column, right-aligned, stacked from just below header
      const restX = vw - rightMargin - cardW;
      const topOffset = headerH + 24;
      const restYs = CARDS.map((_, i) => topOffset + i * (cardH + gap));

      // Start point: below the bottom of the sticky pane (clipped until they enter)
      const startY = vh + 100;

      setLayout({ cardW, cardH, restYs, startY, restX });
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    // Outer: creates the scroll travel space
    <div
      ref={containerRef}
      style={{ height: `${SCREENS * 100}vh`, position: "relative" }}
    >
      {/* Sticky viewport — stays pinned for the entire scroll journey */}
      <div
        id="landing-hero"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          // overflow:hidden acts as the floor — cards are invisible
          // below vh and emerge upward as they animate in
          overflow: "hidden",
        }}
        className="w-full bg-black"
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={GRID_OVERLAY}
        />

        {/* TOTEM — left column, vertically centered */}
        <div
          className="absolute inset-y-0 flex flex-col items-center justify-center"
          style={{ left: "8%", width: "28%" }}
        >
          <h1
            className="flex flex-col items-center leading-none text-canvas
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

        {/* Subtitle — bottom left */}
        <div className="absolute bottom-10 left-12 md:left-16">
          <p className="font-body text-canvas/55 text-sm leading-relaxed">
            A modular lighting system built from stackable shapes.
            <br />
            Made to order. Ships worldwide.
          </p>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted/60 mt-2">
            3D printed on demand · Designed in Paris
          </p>
        </div>

        {/* Flying cards — right column, arrive one by one on scroll */}
        {mounted &&
          layout &&
          CARDS.map((card, i) => (
            <FlyingCard
              key={card.id}
              card={card}
              index={i}
              scrollYProgress={scrollYProgress}
              layout={layout}
              reduced={reduced}
            />
          ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import { FadeUp } from "@/components/ui/FadeUp";
import { ArrowTracedButton } from "@/components/ui/ArrowTracedButton";
import { useSectionInView } from "@/hooks/useSectionInView";

function DrawLine({
  delay = 0,
  light = false,
}: {
  delay?: number;
  light?: boolean;
}) {
  const { ref, isInView } = useSectionInView(0.25, false);

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={`h-px w-full my-5 ${light ? "bg-white/25" : "bg-ink/25"}`}
      style={{ transformOrigin: "left" }}
    />
  );
}

function TotemLetters({ delay = 0 }: { delay?: number }) {
  const { ref, isInView } = useSectionInView(0.1, false);
  return (
    <span ref={ref} className="inline-flex" aria-label="TOTEM">
      {["T", "O", "T", "E", "M"].map((l, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 36, rotateX: -20 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, rotateX: 0 }
              : { opacity: 0, y: 36, rotateX: -20 }
          }
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + i * 0.06,
          }}
          style={{ display: "inline-block", perspective: 600 }}
        >
          {l}
        </motion.span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function ProductSpotlight() {
  return (
    <>
      {/* ── Panel 1: Introducing TOTEM ──────────────────────────────────────── */}
      {/* Note: no wrapper div — sections must be direct children of the scroll  */}

      <section
        className="section-height relative w-full overflow-hidden"
        aria-label="Introducing TOTEM"
      >
        {/* Background — swap for next/image */}
        <div className="absolute inset-0 bg-stone-900" aria-hidden />
        <div className="absolute inset-0 bg-black/45" aria-hidden />

        {/* ── MOBILE ── */}
        <div className="sm:hidden relative z-10 h-full flex flex-col px-5 py-80 gap-2">
          <FadeUp delay={0.05}>
            <p
              className="font-medium tracking-[-0.05em] leading-[1] text-white"
              style={{ fontSize: "clamp(3.2rem, 16.5vw, 6rem)" }}
            >
              Introducing
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p
              className="relative font-medium tracking-[-0.06em] leading-[0.9] text-white"
              style={{ fontSize: "clamp(3.2rem, 16.5vw, 6rem)" }}
            >
              <TotemLetters delay={0.2} />
              <span className="text-[0.3em] absolute top-1 ml-2">©</span>
            </p>
          </FadeUp>
          <DrawLine delay={0.5} light />
          <FadeUp delay={0.55}>
            <p
              className="font-medium tracking-[-0.05em] leading-[0.95] text-white/40 pb-12"
              style={{ fontSize: "clamp(3rem, 12.8vw, 4.5rem)" }}
            >
              The <span className="text-white">modular lamp</span> that adapts
              to you.
            </p>
          </FadeUp>
          <FadeUp delay={0.65} once={true}>
            <ArrowTracedButton
              href="/shop/totem"
              label="Explore TOTEM"
              className="w-fit bg-ink btn btn-cta text-white border border-white/20"
            />
          </FadeUp>
        </div>

        {/* ── DESKTOP ── */}
        <div className="hidden sm:flex relative z-10 h-full flex-col justify-start px-5 py-60 max-w-5xl gap-1">
          <FadeUp delay={0.05}>
            <p
              className="font-medium tracking-[-0.06em] leading-[0.92] text-white"
              style={{ fontSize: "clamp(4rem, 9vw, 9rem)" }}
            >
              Introducing
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p
              className="relative font-medium tracking-[-0.06em] leading-[0.88] text-white"
              style={{ fontSize: "clamp(4rem, 9vw, 9rem)" }}
            >
              <TotemLetters delay={0.2} />{" "}
              <span className="text-[0.3em] absolute top-2 ml-2">©</span>
            </p>
          </FadeUp>
          <DrawLine delay={0.52} light />
          <FadeUp delay={0.58}>
            <p
              className="font-medium tracking-[-0.06em] leading-[0.88] text-white/35 pb-12"
              style={{ fontSize: "clamp(3.5rem, 7.5vw, 7.5rem)" }}
            >
              A <span className="text-white">modular lamp</span> that adapts to
              you.
            </p>
          </FadeUp>
          <FadeUp delay={0.7} once={true}>
            <ArrowTracedButton
              href="/shop/totem"
              label="Explore TOTEM"
              className="w-fit bg-ink btn btn-cta text-white border border-white/20"
            />
          </FadeUp>
        </div>
      </section>

      {/* ── Panel 2: Build your own ─────────────────────────────────────────── */}
      <section
        className="section-height relative w-full overflow-hidden flex flex-col"
        aria-label="TOTEM configurator"
      >
        {/* ── MOBILE: stacked, each half breathes ── */}
        <div className="sm:hidden relative z-10 h-full flex flex-col px-5 py-80 gap-2">
          {/* Top: configurator placeholder — flex-1 takes all available space */}
          <div className="flex-1 relative bg-lighter overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center"></div>
          </div>

          {/* Bottom: fixed-height CTA block — doesn't squish */}
          <div className="shrink-0 px-5 pt-8 pb-10 flex flex-col gap-5">
            <FadeUp delay={0.05}>
              <p
                className="font-medium tracking-[-0.05em] leading-[0.9] text-ink"
                style={{ fontSize: "clamp(3.2rem, 16.5vw, 6rem)" }}
              >
                Build your own
              </p>
            </FadeUp>
            <DrawLine delay={0.5} />
            <FadeUp delay={0.2}>
              <p
                className="font-medium tracking-[-0.05em] leading-[0.95] text-ink/40 pb-12"
                style={{ fontSize: "clamp(3rem, 12.8vw, 4.5rem)" }}
              >
                Choose your modules, color, and finish —{" "}
                <span className="text-ink">exactly how you want it.</span>
              </p>
            </FadeUp>
            <FadeUp delay={0.32} once={true}>
              <ArrowTracedButton
                href="/shop"
                label="Try the configurator"
                className="w-fit bg-white btn btn-cta text-ink border border-ink/20"
              />
            </FadeUp>
          </div>
        </div>

        {/* ── DESKTOP: 60/40 split, both anchored top+bottom ── */}
        <div className="hidden sm:grid h-full grid-cols-[3fr_2fr]">
          {/* Left: configurator preview */}
          <motion.div
            className="relative h-full bg-lighter overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* swap for <video autoPlay loop muted playsInline> */}
            <div className="absolute inset-0 flex items-center justify-center"></div>
          </motion.div>

          {/* Right: text + CTA — justify-between pushes label up, CTA down */}
          <div className="flex flex-col justify-between px-8 py-60">
            {/* Bottom anchor: headline + descriptor + CTA */}
            <div className="flex flex-col gap-5">
              <FadeUp delay={0.2}>
                <p
                  className="font-medium tracking-[-0.07em] leading-[0.72] text-ink pb-8"
                  style={{ fontSize: "clamp(4rem, 9vw, 9rem)" }}
                >
                  Build
                  <br />
                  your own
                </p>
              </FadeUp>
              <FadeUp delay={0.32}>
                <p
                  className="text-sm text-light tracking-[-0.04em] leading-[0.92] pb-12"
                  style={{ fontSize: "clamp(2.2rem, 11vw, 3.5rem)" }}
                >
                  Choose your modules, colors, and finish —{" "}
                  <span className="text-ink">exactly how you want it.</span>
                </p>
              </FadeUp>
              <FadeUp delay={0.42} once={true}>
                <ArrowTracedButton
                  href="/shop"
                  label="Try the configurator"
                  className="w-fit bg-white btn btn-cta text-ink border border-ink/20"
                />
              </FadeUp>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

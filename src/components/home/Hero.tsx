"use client";

import { useScroll, useTransform, motion } from "motion/react";
import { HeroContent } from "@/components/home/HeroContent";

function ParallaxBox({
  className,
  inputRange,
  speed = 0.3,
}: {
  className: string;
  inputRange: [number, number];
  speed?: number;
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, inputRange, ["0%", `${-speed * 100}%`]);

  return <motion.div style={{ y }} className={className} />;
}

export function Hero() {
  return (
    <section className="relative w-full md:h-[calc(400dvh-(4*(var(--header-height))))]">
      {/* ── BACK layer — renders behind HeroContent ── */}
      <div
        aria-hidden="true"
        className="hidden md:flex md:absolute md:inset-0 overflow-hidden pointer-events-none"
      >
        {/* Column 1 */}
        <div className="flex-1 flex flex-col">
          {/* Row 1 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 1.1 — move to FRONT layer to appear above text */}
            <ParallaxBox
              inputRange={[-300, 1400]}
              speed={0.3}
              className="absolute h-[450px] w-[300px] bg-red-500 top-52 right-20"
            />
          </div>
          {/* Row 2 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 1.2 (front) */}
          </div>
          {/* Row 3 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 1.3 */}
            <ParallaxBox
              inputRange={[1200, 3200]}
              speed={0.5}
              className="absolute h-[350px] w-[250px] bg-red-500 top-16 left-10"
            />
          </div>
          {/* Row 4 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 1.4 (front)*/}
          </div>
        </div>

        {/* Column 2 */}
        <div className="hidden md:flex flex-1 flex-col">
          {/* Row 1 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 2.1 (front)*/}
            <ParallaxBox
              inputRange={[-300, 1400]}
              speed={0.5}
              className="absolute h-[300px] w-[200px] bg-red-500 bottom-20 left-12"
            />
          </div>
          {/* Row 2 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 2.2 */}
            <ParallaxBox
              inputRange={[400, 2200]}
              speed={0.4}
              className="absolute h-[420px] w-[320px] bg-red-500 bottom-8 left-10"
            />
          </div>
          {/* Row 3 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 2.3 (front) */}
          </div>
          {/* Row 4 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 2.4 */}
            <ParallaxBox
              inputRange={[1800, 3400]}
              speed={0.6}
              className="absolute h-[360px] w-[280px] bg-red-500 bottom-10 right-8"
            />
          </div>
        </div>

        {/* Column 3 */}
        <div className="hidden xl:flex flex-1 flex-col">
          {/* Row 1 — empty: Image 3.1 is in FRONT layer */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 3.1 — above text */}
            <ParallaxBox
              inputRange={[-300, 1400]}
              speed={0.2}
              className="absolute h-[350px] w-[560px] bg-red-500 -bottom-8 right-0"
            />
          </div>
          {/* Row 2 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 3.2 (front) */}
          </div>
          {/* Row 3 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 3.3 */}
            <ParallaxBox
              inputRange={[1200, 3200]}
              speed={0.4}
              className="absolute h-[360px] w-[280px] bg-red-500 bottom-10 right-8"
            />
          </div>
          {/* Row 4 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 3.4 (front) */}
          </div>
        </div>
      </div>

      {/* ── HeroContent — z-10 ── */}
      <div className="sticky top-[var(--header-height)] z-10">
        <HeroContent />
      </div>

      {/* ── MOBILE image column — md:hidden, normal flow, scrolls under sticky type ── */}
      <div
        aria-hidden="true"
        className="md:hidden pointer-events-none section-height"
      >
        {/* Slot 1: fills the initial viewport — visible behind the type on load */}
        <div className="relative w-full section-height bg-red-500" />
        {/* Slot 2 */}
        <div className="relative w-full section-height bg-blue-500" />
        {/* Slot 3 */}
        <div className="relative w-full section-height bg-red-200" />
      </div>

      {/* ── FRONT layer — renders above HeroContent (z-20) ── */}
      <div
        aria-hidden="true"
        className="hidden md:flex md:absolute md:inset-0 overflow-hidden z-20 pointer-events-none"
      >
        {/* Column 1 — empty (add ParallaxBox entries here to appear above text) */}
        <div className="flex-1 flex flex-col">
          {/* Row 1 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full" />
          {/* Row 2 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 1.2 */}
            <ParallaxBox
              inputRange={[400, 2200]}
              speed={0.2}
              className="absolute h-[300px] w-[200px] bg-red-500 bottom-24 right-4"
            />
          </div>
          {/* Row 3 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full" />
          {/* Row 4 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 1.4 */}
            <ParallaxBox
              inputRange={[1800, 3400]}
              speed={0.45}
              className="absolute h-[460px] w-[320px] bg-red-500 top-10 right-8"
            />
          </div>
        </div>

        {/* Column 2 — empty */}
        <div className="hidden md:flex flex-1 flex-col">
          {/* Row 1 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 2.1 */}
            {/* <ParallaxBox
              inputRange={[-300, 1400]}
              speed={0.5}
              className="absolute h-[300px] w-[200px] bg-red-500 bottom-20 left-12"
            /> */}
          </div>
          {/* Row 2 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full" />
          {/* Row 3 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 2.3 */}
            <ParallaxBox
              inputRange={[1200, 3200]}
              speed={0.25}
              className="absolute h-[380px] w-[300px] bg-red-500 bottom-60 -left-20"
            />
          </div>
          {/* Row 4 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full" />
        </div>

        {/* Column 3 */}
        <div className="hidden xl:flex flex-1 flex-col">
          {/* Row 1 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full" />
          {/* Row 2 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 3.2 */}
            <ParallaxBox
              inputRange={[400, 2200]}
              speed={0.55}
              className="absolute h-[380px] w-[280px] bg-red-500 top-24 -left-6"
            />
          </div>
          {/* Row 3 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full" />
          {/* Row 4 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full">
            {/* Image 3.4 */}
            <ParallaxBox
              inputRange={[1800, 3400]}
              speed={0.8}
              className="absolute h-[320px] w-[250px] bg-red-500 top-10 left-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

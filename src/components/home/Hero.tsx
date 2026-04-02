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
    <section className="relative w-full h-[calc(400dvh-(4*(var(--header-height))))]">
      <div aria-hidden="true" className="absolute inset-0 flex overflow-hidden">
        {/* Column 1 */}
        <div className="flex-1 flex flex-col">
          {/* Row 1 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-light">
            {/* Image 1.1 */}
            <ParallaxBox
              inputRange={[-300, 1400]}
              speed={0.3}
              className="absolute h-[600px] w-[400px] bg-red-500 bottom-12 right-0"
            />
          </div>
          {/* Row 2 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-lighter">
            {/* Image 1.2 */}
            <ParallaxBox
              inputRange={[400, 2200]}
              speed={0.2}
              className="absolute h-[300px] w-[200px] bg-red-500 bottom-24 right-4"
            />
          </div>
          {/* Row 3 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-light">
            {/* Image 1.3 */}
            <ParallaxBox
              inputRange={[1200, 3200]}
              speed={0.5}
              className="absolute h-[350px] w-[250px] bg-red-500 top-16 left-10"
            />
          </div>
          {/* Row 4 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-light">
            {/* Image 1.4 */}
            <ParallaxBox
              inputRange={[1800, 3400]}
              speed={0.45}
              className="absolute h-[460px] w-[280px] bg-red-500 top-10 right-8"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="hidden md:flex flex-1 flex-col">
          {/* Row 1 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-lighter">
            {/* Image 2.1 */}
            <ParallaxBox
              inputRange={[-300, 1400]}
              speed={0.5}
              className="absolute h-[300px] w-[200px] bg-red-500 top-12 -right-12"
            />
          </div>
          {/* Row 2 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-light">
            {/* Image 2.2 */}
            <ParallaxBox
              inputRange={[400, 2200]}
              speed={0.4}
              className="absolute h-[420px] w-[320px] bg-red-500 bottom-8 left-10"
            />
          </div>
          {/* Row 3 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-lighter">
            {/* Image 2.3 */}
            <ParallaxBox
              inputRange={[1200, 3200]}
              speed={0.25}
              className="absolute h-[280px] w-[220px] bg-red-500 bottom-60 -left-20"
            />
          </div>
          {/* Row 4 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-stroke">
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
          {/* Row 1 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full ">
            {/* Image 3.1 */}
            <ParallaxBox
              inputRange={[-300, 1400]}
              speed={0.2}
              className="absolute h-[300px] w-[400px] bg-red-500 bottom-44 right-0"
            />
          </div>
          {/* Row 2 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-lighter">
            {/* Image 3.2 */}
            <ParallaxBox
              inputRange={[400, 2200]}
              speed={0.55}
              className="absolute h-[300px] w-[200px] bg-red-500 top-24 left-6"
            />
          </div>
          {/* Row 3 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-light">
            {/* Image 3.3 */}
            <ParallaxBox
              inputRange={[1200, 3200]}
              speed={0.4}
              className="absolute h-[360px] w-[280px] bg-red-500 bottom-10 right-8"
            />
          </div>
          {/* Row 4 */}
          <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full bg-light">
            {/* Image 3.4 */}
            <ParallaxBox
              inputRange={[1800, 3400]}
              speed={0.8}
              className="absolute h-[280px] w-[220px] bg-red-500 top-10 left-8"
            />
          </div>
        </div>
      </div>

      <div className="sticky top-[var(--header-height)] z-10">
        <HeroContent />
      </div>
    </section>
  );
}

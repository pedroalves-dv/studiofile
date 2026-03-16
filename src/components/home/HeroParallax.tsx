"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";

export function HeroParallax() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 60, damping: 20, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const leftX = useTransform(smoothX, [0, 1], [-20, 20]);
  const leftY = useTransform(smoothY, [0, 1], [-20, 20]);
  const rightX = useTransform(smoothX, [0, 1], [20, -20]);
  const rightY = useTransform(smoothY, [0, 1], [20, -20]);

  useEffect(() => {
    let rafId: number;

    function handleMouseMove(e: MouseEvent) {
      // Cancel any pending frame — only process the latest position
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        mouseX.set(e.clientX / window.innerWidth);
        mouseY.set(e.clientY / window.innerHeight);
      });
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  return (
    // pointer-events-none — this is a background, it shouldn't block anything
    <div className="absolute inset-0 flex pointer-events-none">
      <motion.div
        className="relative flex-1 overflow-hidden"
        style={{ x: leftX, y: leftY, scale: 1.1 }}
      >
        <Image
          src="/images/hero/totem-3.png"
          alt="TOTEM"
          sizes="(max-width: 768px) 0vw, 50vw"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
      <motion.div
        className="relative flex-1 overflow-hidden"
        style={{ x: rightX, y: rightY, scale: 1.1 }}
      >
        <Image
          src="/images/hero/totem-2.png"
          alt="TOTEM"
          sizes="(max-width: 768px) 0vw, 50vw"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
    </div>
  );
}

// components/common/RevealText.tsx
"use client";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function RevealText({ children, delay = 0, className }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  // Split into lines by wrapping in a overflow-hidden mask
  return (
    <span ref={ref} className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={isInView ? { y: "0%" } : { y: "110%" }}
        transition={{
          duration: 0.75,
          delay,
          ease: [0.16, 1, 0.3, 1], // expo out — snappy start, smooth land
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

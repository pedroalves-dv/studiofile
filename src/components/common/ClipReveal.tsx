// components/common/ClipReveal.tsx
"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function ClipReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={
        isInView
          ? { clipPath: "inset(0% 0% 0% 0%)" }
          : { clipPath: "inset(100% 0% 0% 0%)" }
      }
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

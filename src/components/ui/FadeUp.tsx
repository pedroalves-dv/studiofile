"use client";

import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number; // How far it moves up (default 28)
  duration?: number; // How fast it moves (default 0.75)
  once?: boolean; // Re-animate or not (default false)
  amount?: number; // How much of the item must be visible (default 0.25)
}

export function FadeUp({
  children,
  delay = 0,
  className,
  y = 28,
  duration = 0.75,
  once = false,
  amount = 0.25,
}: FadeUpProps) {
  // We use our custom hook and pass the 'amount' and 'once' props into it
  const { ref, isInView } = useSectionInView(amount, once);

  return (
    <motion.div
      ref={ref}
      // Use the 'y' variable from props
      initial={{ opacity: 0, y: y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: y }}
      transition={{
        duration: duration,
        ease: [0.16, 1, 0.3, 1],
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

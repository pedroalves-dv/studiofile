"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

export function useSectionInView(amount = 0.25, once = false) {
  const ref = useRef(null);
  // We pass the settings directly into the Framer Motion hook
  const isInView = useInView(ref, { once, amount });

  return { ref, isInView };
}

// src/components/ui/ScrambleButton.tsx
"use client";

import { useScramble } from "@/hooks/useScramble";

interface ScrambleButtonProps {
  label: string;
  type?: "submit" | "button" | "reset";
  onClick?: () => void;
  className?: string;
}

export function ScrambleButton({
  label,
  type = "button",
  onClick,
  className,
}: ScrambleButtonProps) {
  const { elRef, scramble, reset } = useScramble(label);

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={scramble}
      onMouseLeave={reset}
      className={className}
    >
      <span ref={elRef}>{label}</span>
    </button>
  );
}

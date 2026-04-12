"use client";

import { Minus, Plus } from "lucide-react";

const sizes = {
  sm: {
    button: "px-2 py-1",
    span: "px-2 py-1 text-xs min-w-[2rem]",
    icon: 12,
  },
  md: {
    button: "px-4 py-3",
    span: "px-site py-3 text-sm min-w-[3.5rem]",
    icon: 14,
  },
};

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: keyof typeof sizes;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  size = "md",
}: QuantityStepperProps) {
  const { button, span, icon } = sizes[size];

  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center rounded-full border border-stroke w-fit">
      <button
        onClick={decrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${button} hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
      >
        <Minus size={icon} />
      </button>
      <span className={`${span} text-center border-x border-stroke`}>
        {value}
      </span>
      <button
        onClick={increase}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${button} hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
      >
        <Plus size={icon} />
      </button>
    </div>
  );
}

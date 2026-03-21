"use client";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label?: string;
}

export function CustomSelect({
  id,
  value,
  onChange,
  options,
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-lg font-mono uppercase tracking-wider mb-2 text-ink"
        >
          {label}
        </label>
      )}

      <div ref={ref} className="relative">
        {/* Trigger */}
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            "w-full px-4 py-2 flex items-center justify-between",
            "border border-stroke rounded-lg",
            "text-ink bg-transparent cursor-pointer",
            "transition-colors",
            isOpen && "border-accent",
          )}
        >
          <span>{value}</span>
          <ChevronDown
            size={16}
            className={cn(
              "transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <ul
            role="listbox"
            className="absolute z-50 w-full mt-1 border border-stroke rounded-lg bg-canvas overflow-hidden"
          >
            {options.map((option) => (
              <li
                key={option}
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-4 py-2 cursor-pointer text-ink",
                  "hover:bg-accent/10 transition-colors",
                  option === value && "bg-accent/20",
                )}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

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
    <div className="">
      {label && (
        <label
          htmlFor={id}
          className="px-1 block text-sm font-mono mb-1 text-light"
        >
          {label}
        </label>
      )}

      <div ref={ref} className="relative rounded-md bg-white text-sm font-mono">
        {/* Trigger */}
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            "w-full px-4 py-2 flex items-center justify-between",
            "border border-stroke transition-colors text-ink bg-transparent cursor-pointer",
            isOpen ? "rounded-t-lg border-ink" : "rounded-lg",
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
            className="absolute z-50 w-full border border-t-0 border-ink rounded-b-lg bg-canvas overflow-hidden text-sm font-mono"
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
                  "m-1 px-4 py-2 cursor-pointer text-ink rounded-md",
                  "hover:bg-white transition-colors",
                  option === value && "bg-white",
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

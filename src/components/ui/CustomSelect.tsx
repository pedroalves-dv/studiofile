// src/components/ui/CustomSelect.tsx
"use client";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils/cn";

interface CustomSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label?: string;
  disabledOptions?: string[];
}

export function CustomSelect({
  id,
  value,
  onChange,
  options,
  label,
  disabledOptions,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="">
      {label && (
        <label htmlFor={id} className="px-1 block text-base mb-1 text-light">
          {label}
        </label>
      )}

      <div ref={ref} className="relative rounded-md bg-white text-base">
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
            className="absolute z-50 w-full border border-t-0 border-ink rounded-b-lg bg-canvas overflow-hidden text-base"
          >
            {options.map((option) => {
              const isDisabled = disabledOptions?.includes(option) ?? false;
              return (
                <li
                  key={option}
                  role="option"
                  aria-selected={option === value}
                  aria-disabled={isDisabled}
                  onClick={
                    isDisabled
                      ? undefined
                      : () => {
                          onChange(option);
                          setIsOpen(false);
                        }
                  }
                  className={cn(
                    "m-1 px-4 py-2 text-ink rounded-md transition-colors",
                    isDisabled
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "cursor-pointer hover:bg-white",
                    !isDisabled && option === value && "bg-white",
                  )}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

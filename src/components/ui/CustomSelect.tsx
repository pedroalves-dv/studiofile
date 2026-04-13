// src/components/ui/CustomSelect.tsx
"use client";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils/cn";

type SelectOption = string | { value: string; label: string };

interface CustomSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  disabledOptions?: string[];
  rounded?: "lg" | "full";
}

const triggerRounded = {
  lg: "rounded-lg",
  full: "rounded-full",
};

export function CustomSelect({
  id,
  value,
  onChange,
  options,
  label,
  disabledOptions,
  rounded = "lg",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  // Normalize each option to { value, label } so the rest of the component is uniform
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  const displayLabel =
    normalized.find((opt) => opt.value === value)?.label ?? value;

  return (
    <div className="">
      {label && (
        <label htmlFor={id} className="px-1 block text-base mb-1 text-light">
          {label}
        </label>
      )}

      <div ref={ref} className="relative text-base">
        {/* Trigger — keeps its full shape at all times */}
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            "w-full px-4 py-2 flex items-center justify-between gap-3",
            "border transition-colors text-ink bg-white cursor-pointer",
            triggerRounded[rounded],
            isOpen ? "border-ink" : "border-stroke",
          )}
        >
          <span>{displayLabel}</span>
          <ChevronDown
            size={16}
            className={cn(
              "shrink-0 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown — detached floating panel, always rounded-lg */}
        {isOpen && (
          <ul
            role="listbox"
            style={{
              animation: "navSlideDown 0.15s ease-out both",
              transformOrigin: "top",
            }}
            className="absolute z-50 mt-1 min-w-full w-max border border-stroke rounded-lg bg-canvas overflow-hidden text-base"
          >
            {normalized.map((opt) => {
              const isDisabled = disabledOptions?.includes(opt.value) ?? false;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  aria-disabled={isDisabled}
                  onClick={
                    isDisabled
                      ? undefined
                      : () => {
                          onChange(opt.value);
                          setIsOpen(false);
                        }
                  }
                  className={cn(
                    "m-1 px-4 py-2 text-ink rounded-md transition-colors",
                    isDisabled
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "cursor-pointer hover:bg-white",
                    !isDisabled && opt.value === value && "bg-white",
                  )}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

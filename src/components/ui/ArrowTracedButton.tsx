"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ArrowTracedButtonProps = {
  label: ReactNode;
  className?: string;
  onClick?: () => void;
  showArrow?: boolean;
  href?: string;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  /** Border radius of the trace rect in px — match your className's rounded-* value */
  radius?: number;
};

export function ArrowTracedButton({
  label,
  onClick,
  className,
  showArrow,
  href,
  type = "button",
  disabled,
  isLoading = false,
  radius = 6,
}: ArrowTracedButtonProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [perimeter, setPerimeter] = useState(1000);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    setPerimeter(2 * (width + height));
  }, []);

  const inner = (
    <>
      {/* SVG perimeter trace */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <rect
          x="0.75"
          y="0.75"
          width="calc(100% - 1.5px)"
          height="calc(100% - 1.5px)"
          rx={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray={perimeter}
          strokeDashoffset={hovered ? 0 : perimeter}
          style={{
            transition: hovered
              ? "stroke-dashoffset 0.55s cubic-bezier(0.16, 1, 0.3, 1)"
              : "stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>

      {/* Existing ArrowButton inner — untouched */}
      <span className="relative inline-flex items-center">
        {isLoading ? (
          <>
            <Loader size={16} className="absolute animate-spin" />
            <span className="opacity-0">{label}</span>
          </>
        ) : (
          <>
            {showArrow !== false && (
              <span className="absolute -left-6 opacity-0 -translate-x-1 transition duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-x-3">
                →
              </span>
            )}
            <span
              className={cn(
                "transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]",
                showArrow !== false && "group-hover:translate-x-2",
              )}
            >
              {label}
            </span>
          </>
        )}
      </span>
    </>
  );

  const sharedProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    className: cn("group relative block", className),
  };

  if (href) {
    return (
      <Link
        {...sharedProps}
        href={href}
        onClick={onClick}
        ref={containerRef as React.Ref<HTMLAnchorElement>}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      {...sharedProps}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      ref={containerRef as React.Ref<HTMLButtonElement>}
    >
      {inner}
    </button>
  );
}

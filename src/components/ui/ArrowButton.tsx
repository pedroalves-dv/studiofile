"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ArrowButtonProps = {
  label: ReactNode;
  className?: string;
  onClick?: () => void;
  showArrow?: boolean;
  href?: string;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
};

export function ArrowButton({
  label,
  onClick,
  className,

  showArrow,
  href,
  type = "button",
  disabled,
}: ArrowButtonProps) {
  const inner = (
    <span className="relative inline-flex items-center">
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
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn("group relative", className)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn("group relative", className)}
    >
      {inner}
    </button>
  );
}

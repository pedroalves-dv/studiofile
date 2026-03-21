"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ArrowButtonBase = {
  label: ReactNode;
  className?: string;
  onClick?: () => void;
  glowColor?: string;
  showArrow?: boolean;
};

type AsButton = ArrowButtonBase & {
  href?: undefined;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
};

type AsLink = ArrowButtonBase & {
  href: string;
  type?: never;
};

type ArrowButtonProps = AsButton | AsLink;

export function ArrowButton({
  label,
  onClick,
  className,
  glowColor,
  showArrow,
  ...rest
}: ArrowButtonProps) {
  const inner = (
    <span className="relative inline-flex items-center">
      {showArrow !== false && (
        <span
          className="font-body  absolute -left-7 opacity-0 -translate-x-3 transition-all duration-400 
        ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-x-3"
        >
          →
        </span>
      )}
      {/* ✏️ CHANGED — translate only applies when arrow is shown */}
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

  const glow = glowColor ? (
    <span
      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none rounded-[inherit]"
      aria-hidden="true"
      style={{
        willChange: "opacity",
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${glowColor}, transparent)`,
      }}
    />
  ) : null;

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link
        href={rest.href}
        onClick={onClick}
        className={cn("group relative", className)}
      >
        {glow}
        {inner}
      </Link>
    );
  }

  const { type = "button" } = rest as AsButton;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={(rest as AsButton).disabled}
      className={cn("group relative", className)}
    >
      {glow}
      {inner}
    </button>
  );
}

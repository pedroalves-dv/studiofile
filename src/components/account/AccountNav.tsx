"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Settings", href: "/account/settings" },
  { label: "Addresses", href: "/account/addresses" },
];

export function AccountNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const activeIndex = NAV_LINKS.findIndex((link, i) =>
    i === 0 ? pathname === "/account" : pathname.startsWith(link.href),
  );

  useLayoutEffect(() => {
    const navEl = navRef.current;
    const itemEl = itemRefs.current[activeIndex];
    if (!navEl || !itemEl) return;

    const navRect = navEl.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    setIndicator({
      left: itemRect.left - navRect.left + navEl.scrollLeft,
      width: itemRect.width,
    });

    itemEl.scrollIntoView({ block: "nearest", inline: "center" });
  }, [activeIndex]);

  return (
    <nav
      ref={navRef}
      className="relative flex gap-2 mb-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* Sliding filled pill */}
      {indicator && (
        <div
          aria-hidden
          className="absolute inset-y-0 rounded-full bg-ink transition-all duration-300 ease-in-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}

      {NAV_LINKS.map((link, i) => {
        const isActive = i === activeIndex;
        return (
          <Link
            key={link.href}
            href={link.href}
            ref={(el) => { itemRefs.current[i] = el; }}
            className={cn(
              "relative z-10 shrink-0 px-4 py-2 text-base border rounded-full transition-colors duration-300",
              isActive
                ? "text-canvas border-transparent"
                : "border-stroke text-muted hover:border-ink hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

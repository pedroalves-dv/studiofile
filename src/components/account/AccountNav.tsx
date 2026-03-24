"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useLayoutEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Settings", href: "/account/settings" },
  { label: "Addresses", href: "/account/addresses" },
];

export function AccountNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

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
      left: itemRect.left - navRect.left,
      width: itemRect.width,
    });
  }, [activeIndex]);

  return (
    <nav ref={navRef} className="relative flex justify-between  mb-10">
      {NAV_LINKS.map((link, i) => {
        const isActive = i === activeIndex;
        return (
          <Link
            key={link.href}
            href={link.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`text-base font-medium tracking-[-0.04em] font-body pb-3 transition-colors ${
              isActive ? "text-ink" : "text-light hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      {indicator && (
        <div
          aria-hidden
          className="absolute bottom-0 h-[3px] bg-ink transition-all duration-300 ease-in-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
    </nav>
  );
}

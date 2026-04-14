"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const activeIndex = NAV_LINKS.findIndex((link, i) =>
    i === 0 ? pathname === "/account" : pathname.startsWith(link.href),
  );

  const checkScroll = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

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

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  return (
    <div className="relative mb-10">
      {/* Left scroll fade + chevron */}
      <div
        aria-hidden
        className={cn(
          "z-20 pointer-events-none absolute inset-y-0 left-0 w-10",
          "bg-gradient-to-r from-canvas to-transparent",
          "transition-opacity duration-200",
          canScrollLeft ? "opacity-100" : "opacity-0",
        )}
      />
      <ChevronLeft
        size={24}
        className={cn(
          "z-20 pointer-events-none absolute top-1/2 -translate-y-1/2 -left-3",
          "transition-opacity duration-200",
          canScrollLeft ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Right scroll fade + chevron */}
      <div
        aria-hidden
        className={cn(
          "z-20 pointer-events-none absolute inset-y-0 right-0 w-10",
          "bg-gradient-to-l from-canvas to-transparent",
          "transition-opacity duration-200",
          canScrollRight ? "opacity-100" : "opacity-0",
        )}
      />
      <ChevronRight
        size={24}
        className={cn(
          "z-20 pointer-events-none absolute top-1/2 -translate-y-1/2 -right-3",
          "transition-opacity duration-200",
          canScrollRight ? "opacity-100" : "opacity-0",
        )}
      />
      <nav
        ref={navRef}
        className="relative flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
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
    </div>
  );
}

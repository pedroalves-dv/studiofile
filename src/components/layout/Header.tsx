"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Heart, ShoppingCart, Menu, X, ArrowRight } from "lucide-react";
import { useScroll } from "@/hooks/useScroll";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { SearchBar } from "@/components/search/SearchBar";
import { ArrowButton } from "@/components/ui/ArrowButton";
import {
  SparklesIcon,
  type SparklesIconHandle,
} from "@/components/ui/SparklesIcon";
import {
  MagnifyingGlassIcon,
  type MagnifyingGlassIconHandle,
} from "@/components/ui/MagnifyingGlassIcon";
import {
  ShoppingBagIcon,
  type ShoppingBagIconHandle,
} from "@/components/ui/ShoppingBagIcon";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  // { label: 'Collections', href: '/collections' },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  {
    label: "Contact",
    href: "/contact",
  },
];

export function Header() {
  const sparklesRef = useRef<SparklesIconHandle>(null);
  const searchIconRef = useRef<MagnifyingGlassIconHandle>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cartIconRef = useRef<ShoppingBagIconHandle>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      // Clear previous timeout and reset it
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000); // ms after last scroll event to consider scrolling "stopped"
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);
  const { isScrolled } = useScroll(60);
  const { totalQuantity: cartCount, openCart } = useCart();
  const {
    wishlistIconRef,
    openDrawer: openWishlist,
    totalCount: wishlistCount,
  } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  useScrollLock(isSearchOpen);

  // Close both overlays on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {/* Search overlay — full-screen */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] backdrop-blur-md flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <SearchBar
                autoFocus
                onClose={() => setIsSearchOpen(false)}
                placeholder="Search products..."
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className="flex-shrink-0 p-2 hover:text-accent transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        {" "}
        <div
          className={`px-6 sm:px-36 backdrop-blur-xl border-b border-stroke transition-colors duration-300 ${
            isScrolling ? "bg-canvas/80" : "bg-canvas"
          }`}
        >
          <div className="flex items-center justify-between h-16 md:h-16">
            {/* Wordmark */}
            <Link
              href="/"
              className="font-display text-sm md:text-base tracking-wide text-ink hover:text-accent transition-colors"
              aria-label="Studiofile — Home"
            >
              <span className="group cursor-pointer">
                <div
                  className="h-5 bg-ink hover:bg-accent transition-colors"
                  style={{
                    aspectRatio: "22.203955 / 4.0943561",
                    maskImage: "url(/images/logo/logo-small.svg)",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center left",
                  }}
                />
              </span>
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-16"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <ArrowButton
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  className="text-xs tracking-normal text-ink "
                />
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Search toggle */}
              <button
                onClick={() => setIsSearchOpen((v) => !v)}
                className="hidden md:flex p-2"
                aria-label="Open search"
                aria-expanded={isSearchOpen}
                onMouseEnter={() => searchIconRef.current?.startAnimation()}
                onMouseLeave={() => searchIconRef.current?.stopAnimation()}
              >
                {isSearchOpen ? (
                  <X size={2} />
                ) : (
                  <MagnifyingGlassIcon ref={searchIconRef} />
                )}
              </button>

              {/* Wishlist (desktop) */}
              <button
                ref={wishlistIconRef}
                onClick={openWishlist}
                className="hidden sm:flex p-2  relative"
                aria-label={`Open wishlist${wishlistCount > 0 ? ` — ${wishlistCount} items` : ""}`}
                onMouseEnter={() => sparklesRef.current?.startAnimation()}
                onMouseLeave={() => sparklesRef.current?.stopAnimation()}
              >
                <SparklesIcon ref={sparklesRef} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-canvas text-xs flex items-center justify-center rounded-full font-mono leading-none">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                ref={buttonRef}
                onClick={openCart}
                className="p-2 relative"
                aria-label={`Open cart${cartCount > 0 ? ` — ${cartCount} items` : ""}`}
                onMouseEnter={() => cartIconRef.current?.startAnimation()}
                onMouseLeave={() => cartIconRef.current?.stopAnimation()}
              >
                <ShoppingBagIcon ref={cartIconRef} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-canvas text-xs flex items-center justify-center rounded-full font-mono leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="md:hidden p-2 hover:text-accent transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-canvas" aria-label="Mobile navigation">
            <div className="pt-8 space-y-0">
              {/* Mobile search */}
              <div className="px-4 pb-4">
                <SearchBar
                  onClose={() => setIsMobileMenuOpen(false)}
                  hideBorder
                  className="bg-white rounded-2xl border border-ink px-2"
                />
              </div>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="
                  block w-full 
                  text-center py-6
                  text-4xl tracking-normal text-ink 
                  font-display uppercase tracking-[-2px]
                  border-b border-ink
                  active:bg-accent active:text-canvas"
                >
                  {link.label}
                </Link>
              ))}

              <button
                className="
                  gap-2 w-full 
                  text-center py-6
                  text-4xl tracking-normal text-ink 
                  font-display uppercase tracking-[-2px]
                  border-b border-ink
                  active:bg-accent active:text-canvas"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openWishlist();
                }}
                aria-label="Open wishlist"
              >
                {/* <Heart size={18} /> */}
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto font-mono text-xs bg-accent text-canvas px-2 py-0.5">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16 md:h-16" aria-hidden="true" />
    </>
  );
}

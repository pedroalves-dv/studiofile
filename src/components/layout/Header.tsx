"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
  User,
} from "lucide-react";
import { customerLogout } from "@/lib/shopify/auth";
import { useScroll } from "@/hooks/useScroll";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { UserIcon, type UserIconHandle } from "@/components/ui/UserIcon";
import { MenuIcon, type MenuIconHandle } from "@/components/ui/MenuIcon";
import {
  UserRoundCheckIcon,
  type UserRoundCheckIconHandle,
} from "@/components/ui/UserRoundCheckIcon";
import {
  ShoppingBagIcon,
  type ShoppingBagIconHandle,
} from "@/components/ui/ShoppingBagIcon";
// import { SearchBar } from "@/components/search/SearchBar";
// import { HeartIcon, type HeartIconHandle } from "@/components/ui/HeartIcon";
// import {
//   MagnifyingGlassIcon,
//   type MagnifyingGlassIconHandle,
// } from "@/components/ui/MagnifyingGlassIcon";

const NAV_LINKS: {
  label: string;
  node?: React.ReactNode;
  badge?: string;
  href: string;
  linkClassName?: string;
}[] = [
  {
    label: "TOTEM",
    linkClassName: "tracking-tight",
    node: (
      <>
        TOTEM
        <span
          className="
          pl-[2px] 
          text-ink font-serif tracking-tight
          w-0 overflow-hidden
          [clip-path:inset(0_100%_0_0)]
          group-hover:w-auto
          group-hover:animate-revealLTR
          transition-[width] duration-300 ease-out
        "
        >
          / New
        </span>
      </>
    ),
    badge: "/New",
    href: "/products/totem",
  },
  {
    label: "Studio",
    node: (
      <>
        Studio
        <span
          className="
          pl-[2px]
          text-ink font-serif tracking-tight
          w-0 overflow-hidden
          [clip-path:inset(0_100%_0_0)]
          group-hover:w-auto
          group-hover:animate-revealLTR
          transition-[width] duration-300 ease-out
        "
        >
          / 01
        </span>
      </>
    ),
    href: "/about",
  },
  {
    label: "FAQ",
    node: (
      <>
        FAQ
        <span
          className="
          pl-[2px] 
          text-ink font-serif tracking-tight
          w-0 overflow-hidden
          [clip-path:inset(0_100%_0_0)]
          group-hover:w-auto
          group-hover:animate-revealLTR
          transition-[width] duration-300 ease-out
        "
        >
          / 02
        </span>
      </>
    ),
    href: "/faq",
  },
  {
    label: "Contact",
    node: (
      <>
        Contact
        <span
          className="
          pl-[2px] 
          text-ink font-serif tracking-tight
          w-0 overflow-hidden
          [clip-path:inset(0_100%_0_0)]
          group-hover:w-auto
          group-hover:animate-revealLTR
          transition-[width] duration-300 ease-out
        "
        >
          / 03
        </span>
      </>
    ),
    href: "/contact",
  },
];

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  // all existing refs and state

  // const heartRef = useRef<HeartIconHandle>(null);
  // const searchIconRef = useRef<MagnifyingGlassIconHandle>(null);
  const menuIconRef = useRef<MenuIconHandle>(null);
  const userIconRef = useRef<UserIconHandle>(null);
  const userRoundCheckIconRef = useRef<UserRoundCheckIconHandle>(null);
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
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  useClickOutside(accountRef, () => setIsAccountOpen(false));
  useScrollLock(isSearchOpen);

  // Close both overlays on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
        setIsAccountOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      menuIconRef.current?.startAnimation();
    } else {
      menuIconRef.current?.stopAnimation();
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Search overlay — full-screen */}
      {/* {isSearchOpen && (
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
      )} */}

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)]">
        {" "}
        <div
          className={`h-[var(--header-height)] px-6 lg:px-24 xl:px-36 backdrop-blur-xl border-b border-ink transition-colors duration-300 ${
            isScrolling ? "bg-canvas/60" : "bg-canvas"
          }`}
        >
          <div className="h-[var(--header-height)] flex items-center justify-between">
            {/* Wordmark */}
            <Link
              href="/"
              aria-label="Studiofile — Home"
              className="-ml-6 pt-2"
            >
              <span
                className="group relative block"
                style={{
                  aspectRatio: "22.203955 / 4.0943561",
                  height: "2.2rem",
                }}
              >
                {/* Default logo */}
                <div
                  className="absolute inset-0 bg-ink transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                  style={{
                    maskImage: "url(/images/logo/logo-black.svg)",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center top",
                  }}
                />
                {/* Hover logo */}
                <div
                  className="absolute inset-0 bg-ink transition-opacity duration-150 opacity-0 group-hover:opacity-100"
                  style={{
                    maskImage: "url(/images/logo/logo.svg)",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center top",
                  }}
                />
              </span>
            </Link>
            {/* Desktop nav */}
            <nav
              className="hidden md:flex md:gap-6 lg:gap-12 pt-2"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <ArrowButton
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  showArrow={false}
                  label={link.node ?? link.label}
                  className={cn(
                    "font-body tracking-tighter font-[500] text-[18px] text-ink py-2 px-2 hover:text-light transition-colors duration-200",
                    link.linkClassName, // ✏️ ADD — overrides or extends for this link only
                  )}
                />
              ))}
            </nav>
            {/* Right icons */}
            <div className="flex items-center pt-2 gap-2 md:gap-4 lg:gap-6">
              {/* Search toggle */}
              {/* <button
                onClick={() => setIsSearchOpen((v) => !v)}
                className="hidden md:flex p-2 sm:p-0"
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
              </button> */}

              {/* Wishlist (desktop) */}
              {/* <button
                ref={wishlistIconRef}
                onClick={openWishlist}
                className="hidden sm:flex p-2 sm:p-0 relative"
                aria-label={`Open wishlist${wishlistCount > 0 ? ` — ${wishlistCount} items` : ""}`}
                onMouseEnter={() => heartRef.current?.startAnimation()}
                onMouseLeave={() => heartRef.current?.stopAnimation()}
              >
                <HeartIcon ref={heartRef} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 lex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button> */}

              {/* Account */}
              {isLoggedIn ? (
                <div ref={accountRef} className="relative">
                  <button
                    onClick={() => setIsAccountOpen((v) => !v)}
                    className="p-2 sm:p-4 relative flex items-center"
                    aria-label="My account"
                    aria-expanded={isAccountOpen}
                    onMouseEnter={() =>
                      userRoundCheckIconRef.current?.startAnimation()
                    }
                    onMouseLeave={() =>
                      userRoundCheckIconRef.current?.stopAnimation()
                    }
                  >
                    <UserRoundCheckIcon ref={userRoundCheckIconRef} size={28} />
                  </button>
                  {isAccountOpen && (
                    <div className="absolute top-full right-0 mt-1 min-w-[180px] bg-canvas border border-ink z-50">
                      {[
                        { label: "My Account", href: "/account" },
                        { label: "Orders", href: "/account/orders" },
                        { label: "Settings", href: "/account/settings" },
                        { label: "Addresses", href: "/account/addresses" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsAccountOpen(false)}
                          className="block w-full text-left px-4 py-3 font-body tracking-tighter text-sm text-ink hover:bg-accent/30 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <hr className="border-t border-ink" />
                      <form action={customerLogout}>
                        <button
                          type="submit"
                          className="block w-full text-left px-4 py-3 font-body tracking-tighter text-sm text-ink hover:bg-accent/30 transition-colors"
                        >
                          Sign out
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/account/login"
                  className="p-4 relative flex items-center"
                  aria-label="Sign in"
                  onMouseEnter={() => userIconRef.current?.startAnimation()}
                  onMouseLeave={() => userIconRef.current?.stopAnimation()}
                >
                  <UserIcon ref={userIconRef} size={28} />
                </Link>
              )}

              {/* Cart */}
              <button
                ref={buttonRef}
                onClick={openCart}
                className="p-2 sm:p-4 relative"
                aria-label={`Open cart${cartCount > 0 ? ` — ${cartCount} items` : ""}`}
                onMouseEnter={() => cartIconRef.current?.startAnimation()}
                onMouseLeave={() => cartIconRef.current?.stopAnimation()}
              >
                <ShoppingBagIcon ref={cartIconRef} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="md:hidden py-4 pl-2 sm:pl-4"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <MenuIcon ref={menuIconRef} size={28} />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-canvas" aria-label="Mobile navigation">
            <div>
              {/* Mobile search */}
              {/* <div className="px-4 pb-4">
                <SearchBar
                  onClose={() => setIsMobileMenuOpen(false)}
                  hideBorder
                  className="bg-white rounded-2xl border border-ink px-2"
                />
              </div> */}

              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "gap-1 flex w-full text-left pt-6 pb-4 px-8 text-4xl tracking-tighter font-medium text-ink font-body ligatures border-b border-ink",
                    link.linkClassName, // ✏️ ADD — same field, works here too
                  )}
                >
                  {link.label}
                  {/* ✏️ ADD — shows badge word if defined, e.g. "new" or "01" */}
                  {link.badge && (
                    <span
                      className="
                        text-white font-light
                        tracking-tighter font-serif ligatures
                        opacity-0 -translate-x-1
                        animate-[badgeIn_0.3s_ease-out_forwards]
                        "
                      style={{
                        animationDelay: `${index * 60 + 150}ms`,
                        textShadow: "1px 1px 30px rgba(0,0,0,0.1)",
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* <button
                className="
                  gap-2 w-full
                  text-left py-4 px-8
                  text-4xl text-ink
                  font-body tracking-tighter font-medium
                  border-b border-ink ligatures"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openWishlist();
                }}
                aria-label="Open wishlist"
                >
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto font-mono text-xs bg-accent text-canvas px-2 py-0.5">
                    {wishlistCount}
                  </span>
                )}
              </button> */}

              <Link
                href={isLoggedIn ? "/account" : "/account/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full text-left pt-6 pb-4 px-8 text-4xl tracking-tighter font-medium text-ink font-body ligatures border-b border-ink"
              >
                {isLoggedIn ? "Account" : "Sign in"}
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Spacer */}
      <div className="h-[var(--header-height)]" aria-hidden="true" />
    </>
  );
}

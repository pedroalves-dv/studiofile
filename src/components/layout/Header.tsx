"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect, useRef } from "react";
import { customerLogout } from "@/lib/shopify/auth";
import { useScroll } from "@/hooks/useScroll";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
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
  href: string;
  linkClassName?: string;
}[] = [
  { label: "TOTEM", href: "/products/totem", linkClassName: "tracking-tight" },
  { label: "Studio", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
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

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
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
          className={`h-[var(--header-height)] px-6 backdrop-blur-xl border-b border-ink transition-colors duration-300 ${
            isScrolling ? "bg-canvas/60" : "bg-canvas"
          }`}
        >
          <div className="h-[var(--header-height)] grid grid-cols-2 md:grid-cols-3 items-end">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Studiofile — Home"
              className="justify-self-start pb-3"
            >
              <span
                className="group relative block"
                style={{
                  aspectRatio: "22.203955 / 4.0943561",
                  height: "1.8rem",
                }}
              >
                {/* Default logo */}
                <div
                  className="absolute inset-0 bg-ink transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                  style={{
                    maskImage: "url(/images/logo/logo-footer.svg)",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center top",
                  }}
                />
                {/* Hover logo */}
                <div
                  className="absolute inset-0 bg-ink transition-opacity duration-150 opacity-0 group-hover:opacity-100"
                  style={{
                    maskImage: "url(/images/logo/logo-footer-white.svg)",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center top",
                  }}
                />
              </span>
            </Link>
            {/* Desktop Nav */}
            <nav
              className="hidden md:flex md:gap-8 lg:gap-20 items-end justify-self-center pb-2"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-body tracking-tighter font-medium text-lg text-ink hover:text-light transition-colors duration-200",
                    link.linkClassName,
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Right icons */}
            <div className="flex items-end md:gap-4 justify-self-end pb-1">
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
                    className="p-2 relative flex items-center"
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
                  className="p-2 relative flex items-center"
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
                className="p-2 relative"
                aria-label={`Open cart${cartCount > 0 ? ` — ${cartCount} items` : ""}`}
                onMouseEnter={() => cartIconRef.current?.startAnimation()}
                onMouseLeave={() => cartIconRef.current?.stopAnimation()}
              >
                <ShoppingBagIcon ref={cartIconRef} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="md:hidden p-2"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <MenuIcon ref={menuIconRef} size={28} />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Hamburger Dropdown */}
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
                    "gap-1 flex w-full text-left pt-6 pb-4 px-6 text-4xl tracking-tighter font-medium text-ink font-body ligatures border-b border-ink",
                    link.linkClassName,
                  )}
                ></Link>
              ))}

              <Link
                href={isLoggedIn ? "/account" : "/account/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full text-left pt-6 pb-4 px-6 text-4xl tracking-tighter font-medium text-ink font-body ligatures border-b border-ink"
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

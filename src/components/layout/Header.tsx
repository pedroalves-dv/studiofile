"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect, useRef } from "react";
import { LogoHover } from "@/components/ui/LogoHover";
import { customerLogout } from "@/lib/shopify/auth";
import { useScroll } from "@/hooks/useScroll";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCart } from "@/hooks/useCart";

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
  const menuIconRef = useRef<MenuIconHandle>(null);
  const userIconRef = useRef<UserIconHandle>(null);
  const userRoundCheckIconRef = useRef<UserRoundCheckIconHandle>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cartIconRef = useRef<ShoppingBagIconHandle>(null);

  const { isScrolled } = useScroll(60);
  const { totalQuantity: cartCount, openCart, closeCart, isOpen } = useCart();
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
      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] bg-canvas">
        <div className="h-[var(--header-height)] mx-5 border-b border-ink">
          {/* 2-column grid: logo left, nav+icons right */}
          <div className="h-[var(--header-height)] grid grid-cols-2 items-end">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Studiofile — Home"
              className="group justify-self-start pb-4"
            >
              <LogoHover className="h-6 w-auto" />
            </Link>

            {/* _________ Nav + Icons _________ */}
            <div className="flex items-end justify-self-end gap-0">
              {/* Desktop Nav */}
              <nav
                className="hidden md:flex md:gap-8 lg:gap-16 items-end mr-8 lg:mr-36 pb-2"
                aria-label="Main navigation"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "font-body tracking-[-0.04em] font-medium text-lg text-ink hover:text-light transition-colors duration-200",
                      link.linkClassName,
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {/* _________ Icons _________ */}
              <div className="flex items-end justify-self-end gap-4 pb-1">
                {/* Account Icon */}
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
                      <UserRoundCheckIcon
                        ref={userRoundCheckIconRef}
                        size={28}
                      />
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
                            className="block w-full text-left px-4 py-3 font-body tracking-tight text-sm text-ink hover:bg-accent/30 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                        <hr className="border-t border-ink" />
                        <form action={customerLogout}>
                          <button
                            type="submit"
                            className="block w-full text-left px-4 py-3 font-body tracking-tight text-sm text-ink hover:bg-accent/30 transition-colors"
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

                {/* Cart Icon */}
                <button
                  ref={buttonRef}
                  onClick={isOpen ? closeCart : openCart}
                  className="p-2 pr-0 relative"
                  aria-label={isOpen ? "Close cart" : `Open cart${cartCount > 0 ? ` — ${cartCount} items` : ""}`}
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
        </div>

        {/* Mobile Hamburger Dropdown */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-canvas" aria-label="Mobile navigation">
            <div>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "gap-1 flex w-full text-left pt-6 pb-4 px-6 text-4xl tracking-tight font-medium text-ink font-body ligatures border-b border-ink",
                    link.linkClassName,
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href={isLoggedIn ? "/account" : "/account/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full text-left pt-6 pb-4 px-6 text-4xl tracking-tight font-medium text-ink font-body ligatures border-b border-ink"
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

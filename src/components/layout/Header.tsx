"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect, useRef, useCallback } from "react";
import { LogoHover } from "@/components/ui/LogoHover";
import { customerLogout } from "@/lib/shopify/auth";
import { useScroll } from "@/hooks/useScroll";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Logo from "public/images/logo/newlogov2.svg";

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
  { label: "TOTEM", href: "/products/totem" },
  { label: "Studio", href: "/about" },

  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
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

  const pathname = usePathname();
  const { isScrolled } = useScroll(60);
  const { totalQuantity: cartCount, openCart, closeCart, isOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosingMenu, setIsClosingMenu] = useState(false);

  const closeMenu = useCallback(() => {
    setIsClosingMenu(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosingMenu(false);
    }, 250);
  }, []);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  useClickOutside(accountRef, () => setIsAccountOpen(false));
  useScrollLock(isSearchOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        setIsSearchOpen(false);
        setIsAccountOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeMenu]);

  useEffect(() => {
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);
    setIsClosingMenu(false);
  }, [pathname]);

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
      {(isMobileMenuOpen || isClosingMenu) && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-40 md:hidden"
          onClick={() => {
            if (!isClosingMenu) closeMenu();
          }}
        />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] sm:h-[var(--header-height)] bg-canvas">
        <div className="h-full pl-5 border-b border-ink">
          {/* 2-column grid: logo left, nav+icons right */}
          <div className="h-full grid grid-cols-2 items-end ">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Studiofile — Home"
              className="group justify-self-start pb-2.5"
            >
              <Logo className="h-7 w-30 fill-current text-ink group-hover:text-accent transition-colors" />
              {/* <LogoHover className="h-7 w-auto" /> */}
            </Link>

            {/* _________ Nav + Icons _________ */}
            <div className="h-full flex justify-self-end">
              {/* Desktop Nav */}
              <nav
                className="h-full hidden md:flex md:gap-8 lg:gap-16 items-end mr-8 lg:mr-36 pb-1"
                aria-label="Main navigation"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "font-body font-semibold tracking-[-0.04em] text-lg hover:text-light transition-colors duration-200",
                      pathname === link.href ? "text-light" : "text-ink",
                      link.linkClassName,
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {/* _________ Icons _________ */}
              <div className="flex items-center jsutify-center border-x border-ink">
                {/* Account Icon */}
                {isLoggedIn ? (
                  <div ref={accountRef} className="relative">
                    <button
                      onClick={() => setIsAccountOpen((v) => !v)}
                      className="relative h-full flex w-18 justify-center items-center py-3 px-5 relative"
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
                        size={27}
                      />
                    </button>
                    {isAccountOpen && (
                      <div className="absolute top-[53px] right-[-1px] min-w-[200px] bg-white border border-ink z-50 flex flex-col">
                        <div className="p-1">
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
                              className="block w-full text-left px-4 py-3 rounded-md font-body tracking-[-0.04em] text-lg text-ink hover:bg-lighter transition-colors font-semibold"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-ink p-1 bg-lighter">
                          <form action={customerLogout}>
                            <button
                              type="submit"
                              className="block w-full text-left px-4 py-3 rounded-md font-body tracking-[-0.04em] text-lg text-ink hover:bg-error hover:text-canvas transition-colors font-semibold"
                            >
                              Sign out
                            </button>
                          </form>
                        </div>
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
                    <UserIcon ref={userIconRef} size={27} />
                  </Link>
                )}

                {/* Cart Icon */}
                <button
                  ref={buttonRef}
                  onClick={() => {
                    if (isOpen) {
                      closeCart();
                    } else {
                      openCart();
                      if (isMobileMenuOpen) closeMenu();
                    }
                  }}
                  className="h-full flex w-18 justify-center items-center py-3 px-5 border-l border-ink relative"
                  aria-label={
                    isOpen
                      ? "Close cart"
                      : `Open cart${cartCount > 0 ? ` — ${cartCount} items` : ""}`
                  }
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
                  onClick={() => {
                    if (isMobileMenuOpen && !isClosingMenu) {
                      closeMenu();
                    } else if (!isMobileMenuOpen) {
                      setIsMobileMenuOpen(true);
                      closeCart();
                    }
                  }}
                  className="md:hidden h-full flex w-18 justify-center items-center py-3 px-5 border-l border-ink relative"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  <MenuIcon ref={menuIconRef} size={28} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Hamburger Dropdown */}
      {(isMobileMenuOpen || isClosingMenu) && (
        <nav
          style={{
            animation: `${isClosingMenu ? "navSlideUp" : "navSlideDown"} 250ms ease-in-out forwards`,
          }}
          className="fixed top-[var(--header-height)] left-0 right-0 z-[45] md:hidden px-5 pt-20 section-height bg-white flex flex-col justify-between "
          aria-label="Mobile navigation"
        >
          <div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex w-full font-body text-left text-7xl tracking-[-0.07em] leading-[4rem] font-medium ligatures",
                  pathname === link.href ? "text-light" : "text-ink",
                  link.linkClassName,
                )}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={isLoggedIn ? "/account" : "/account/login"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex pt-4 border-t border-ink mt-4 w-full font-body text-left text-7xl tracking-[-0.07em] leading-[4rem] font-medium text-ink  ligatures"
            >
              {isLoggedIn ? "Account" : "Sign in"}
            </Link>
          </div>
          <div className="text-lg font-medium text-light tracking-[-0.04em] pb-12 pt-4 border-t border-light">
            <p>© {new Date().getFullYear()} STUDIO filé</p>
          </div>
        </nav>
      )}

      {/* Spacer */}
      <div className="h-[var(--header-height)]" aria-hidden="true" />
    </>
  );
}

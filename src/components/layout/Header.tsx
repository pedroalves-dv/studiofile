"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { LogoHover } from "@/components/ui/LogoHover";
import { customerLogout } from "@/lib/shopify/auth";
import { useScroll } from "@/hooks/useScroll";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/context/ToastContext";
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
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();
  const [isPendingLogout, startLogoutTransition] = useTransition();
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
  const [isClosingAccount, setIsClosingAccount] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const mobileAccountOverlayRef = useRef<HTMLElement>(null);

  const closeAccount = useCallback(() => {
    setIsClosingAccount(true);
    setTimeout(() => {
      setIsAccountOpen(false);
      setIsClosingAccount(false);
    }, 250);
  }, []);

  useClickOutside([accountRef, mobileAccountOverlayRef], closeAccount);
  useScrollLock(isSearchOpen || isAccountOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        closeAccount();
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeMenu]);

  useEffect(() => {
    setIsAccountOpen(false);
    setIsClosingAccount(false);
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

  const hasActiveLink = NAV_LINKS.some((l) => pathname === l.href);
  const someIconActive =
    isOpen || isAccountOpen || isClosingAccount || isMobileMenuOpen || isClosingMenu;

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
      <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] bg-canvas">
        <div className="h-full px-5 border-b sm:border-r border-stroke">
          {/* 2-column grid: logo left, nav+icons right */}
          <div className="h-full grid grid-cols-2 items-end pb-3">
            {/* Logo */}
            <Link
              href="/"
              aria-label="Studiofile — Home"
              className="group w-fit"
            >
              <Logo className="h-6 w-30 fill-current text-ink group-hover:text-light transition-colors mb-0.5" />
              {/* <LogoHover className="h-7 w-auto" /> */}
            </Link>

            {/* _________ Nav + Icons _________ */}
            <div className="h-full flex justify-self-end items-end">
              {/* Desktop Nav */}
              <nav
                className="hidden md:flex md:gap-8 lg:gap-20 items-end h-full mr-16 lg:mr-36 group"
                aria-label="Main navigation"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-end text-ink",
                      "font-medium tracking-[-0.04em] text-lg leading-none",
                      "transition-opacity duration-1000",
                      "group-hover:opacity-35 hover:!opacity-100 group-hover:duration-200",
                      hasActiveLink && pathname !== link.href && "opacity-35",
                      link.linkClassName,
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {/* _________ Icons _________ */}
              <div
                className={cn(
                  "flex gap-10 sm:gap-8",
                  !someIconActive && "group",
                )}
              >
                {/* Account Icon */}
                {isLoggedIn ? (
                  <div ref={accountRef} className="relative">
                    <button
                      onClick={() => {
                        if (isAccountOpen || isClosingAccount) {
                          closeAccount();
                        } else {
                          setIsAccountOpen(true);
                          closeCart();
                          if (isMobileMenuOpen) closeMenu();
                        }
                      }}
                      className={cn(
                        "relative h-full flex items-end transition-opacity duration-1000",
                        !someIconActive &&
                          "group-hover:opacity-35 hover:!opacity-100 group-hover:duration-200",
                        someIconActive && !(isAccountOpen || isClosingAccount) && "opacity-35",
                      )}
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
                    {/* Account Dropdown — desktop only */}
                    {isAccountOpen && (
                      <div className="hidden md:flex absolute top-[calc(var(--header-height)-10px)] -right-4 min-w-[200px] bg-canvas border border-stroke rounded-lg z-50 flex-col">
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
                              onClick={closeAccount}
                              className="block w-full text-left px-4 py-3 tracking-[-0.04em] text-lg text-ink hover:bg-lighter transition-colors font-medium rounded-md"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-stroke p-1 bg-lighter">
                          <button
                            type="button"
                            disabled={isPendingLogout}
                            onClick={() => {
                              closeAccount();
                              startLogoutTransition(async () => {
                                try {
                                  await customerLogout();
                                  toastSuccess("You've been signed out");
                                  router.push("/");
                                } catch {
                                  toastError(
                                    "Sign out failed. Please try again.",
                                  );
                                }
                              });
                            }}
                            className="block w-full text-left px-4 py-3 tracking-[-0.04em] text-lg text-ink hover:bg-accent hover:text-canvas rounded-md transition-colors font-medium disabled:opacity-35 disabled:pointer-events-none"
                          >
                            {isPendingLogout ? "Signing out..." : "Sign out"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/account/login"
                    className={cn(
                      "relative h-full flex transition-opacity duration-1000",
                      !someIconActive &&
                        "group-hover:opacity-35 hover:!opacity-100 group-hover:duration-200",
                      someIconActive && "opacity-35",
                    )}
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
                  onClick={() => {
                    if (isOpen) {
                      closeCart();
                    } else {
                      openCart();
                      if (isMobileMenuOpen) closeMenu();
                      setIsAccountOpen(false);
                    }
                  }}
                  className={cn(
                    "h-full flex relative transition-opacity duration-1000",
                    !someIconActive &&
                      "group-hover:opacity-35 hover:!opacity-100 group-hover:duration-200",
                    someIconActive && !isOpen && "opacity-35",
                  )}
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
                    <span className="absolute -top-3 -right-3 w-4 h-4 text-sm font-medium">
                      ({cartCount})
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
                      setIsAccountOpen(false);
                    }
                  }}
                  className={cn(
                    "md:hidden h-full flex relative -mr-1 transition-opacity duration-1000",
                    !someIconActive &&
                      "group-hover:opacity-35 hover:!opacity-100 group-hover:duration-200",
                    someIconActive &&
                      !(isMobileMenuOpen || isClosingMenu) &&
                      "opacity-35",
                  )}
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
          className="fixed top-[var(--header-height)] left-0 right-0 z-[45] md:hidden px-5 pt-20 section-height bg-white flex flex-col justify-between group"
          aria-label="Mobile navigation"
        >
          <div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex w-full text-left text-7xl tracking-[-0.07em] leading-[4rem] font-medium ligatures text-ink",
                  "transition-opacity duration-1000",
                  "group-hover:opacity-35 hover:!opacity-100 group-hover:duration-200",
                  hasActiveLink && pathname !== link.href && "opacity-35",
                  link.linkClassName,
                )}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={isLoggedIn ? "/account" : "/account/login"}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex pt-4 border-t border-ink mt-4 w-full text-left text-7xl tracking-[-0.07em] leading-[4rem] font-medium text-ink ligatures",
                "transition-opacity duration-200 group-hover:opacity-35 hover:!opacity-100",
                hasActiveLink && "opacity-35",
              )}
            >
              {isLoggedIn ? "Account" : "Sign in"}
            </Link>
          </div>
          <div className="text-lg font-medium text-light tracking-[-0.04em] pb-12 pt-4 border-t border-light">
            <p>© {new Date().getFullYear()} STUDIO filé</p>
          </div>
        </nav>
      )}

      {/* Mobile Account Overlay */}
      {(isAccountOpen || isClosingAccount) && (
        <nav
          ref={mobileAccountOverlayRef}
          style={{
            animation: `${isClosingAccount ? "navSlideUp" : "navSlideDown"} 250ms ease-in-out forwards`,
          }}
          className="fixed top-[var(--header-height)] left-0 right-0 z-[48] md:hidden px-5 pt-20 section-height bg-canvas flex flex-col justify-between group"
          aria-label="Account navigation"
        >
          <div>
            {[
              { label: "My Account", href: "/account" },
              { label: "Orders", href: "/account/orders" },
              { label: "Settings", href: "/account/settings" },
              { label: "Addresses", href: "/account/addresses" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeAccount}
                className={cn(
                  "flex w-full text-left text-6xl tracking-[-0.05em] leading-[3.5rem] font-medium text-ink",
                  "transition-opacity duration-1000",
                  "group-hover:opacity-35 hover:!opacity-100 group-hover:duration-200",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-stroke pb-12 pt-4">
            <button
              type="button"
              disabled={isPendingLogout}
              onClick={() => {
                closeAccount();
                startLogoutTransition(async () => {
                  try {
                    await customerLogout();
                    toastSuccess("You've been signed out");
                    router.push("/");
                  } catch {
                    toastError("Sign out failed. Please try again.");
                  }
                });
              }}
              className="text-6xl tracking-[-0.05em] font-medium text-ink disabled:opacity-35 disabled:pointer-events-none"
            >
              {isPendingLogout ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </nav>
      )}

      {/* Spacer */}
      <div className="h-[var(--header-height)]" aria-hidden="true" />
    </>
  );
}
